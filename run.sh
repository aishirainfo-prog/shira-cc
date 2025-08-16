#!/usr/bin/env bash
set -euo pipefail
export TZ="Europe/Rome"

ROOT="$(cd "$(dirname "$0")" && pwd)"
DB="${ROOT}/db"; FEEDS="${ROOT}/feeds"; CACHE="${ROOT}/cache"; INBOX="${ROOT}/inbox"
mkdir -p "$DB" "$FEEDS" "$CACHE" "$INBOX"

LEDGER="$DB/ledger.ndjson"; TELEM="$DB/telemetry.ndjson"
TICKETS="$DB/tickets.ndjson"; MATCHES="$DB/matches.ndjson"; OFFICIAL="$DB/official_draws.ndjson"

sign(){ # SHIRA.TIME.SIGNATURE™
  local ts_local ts_utc seed sha
  ts_local="$(date +%FT%T.%3N%z)"; ts_utc="$(date -u +%FT%T.%3NZ)"
cat > "$HOME/projects/shira-cc/run.sh" <<'BASH'
#!/usr/bin/env bash
set -euo pipefail
export TZ="Europe/Rome"

ROOT="$(cd "$(dirname "$0")" && pwd)"
DB="${ROOT}/db"; FEEDS="${ROOT}/feeds"; CACHE="${ROOT}/cache"; INBOX="${ROOT}/inbox"
mkdir -p "$DB" "$FEEDS" "$CACHE" "$INBOX"

LEDGER="$DB/ledger.ndjson"; TELEM="$DB/telemetry.ndjson"
TICKETS="$DB/tickets.ndjson"; MATCHES="$DB/matches.ndjson"; OFFICIAL="$DB/official_draws.ndjson"

sign(){ # SHIRA.TIME.SIGNATURE™
  local ts_local ts_utc seed sha
  ts_local="$(date +%FT%T.%3N%z)"; ts_utc="$(date -u +%FT%T.%3NZ)"
  seed="${ts_utc}|${HOSTNAME:-termux}|$RANDOM|$$"
  sha="$(printf '%s' "$seed" | sha256sum | cut -d' ' -f1)"
  printf '%s|%s|%s' "$ts_local" "$ts_utc" "${sha:0:16}"
}

telemetry(){ # module stage event_type err src tier latency freshness action result
  local module="${1:-CORE}" stage="${2:-stage}" event_type="${3:-note}" error_code="${4:-0}"
  local source="${5:-local}" source_tier="${6:-local}"
  local latency_ms="${7:-0}" freshness_s="${8:-0}" action_taken="${9:-none}" result="${10:-ok}"
  IFS='|' read -r ts_local ts_utc sig <<<"$(sign)"
  # usa valori di default sicuri, niente null
  jq -n -c \
    --arg ts_local "$ts_local" --arg ts_utc "$ts_utc" \
    --arg module "$module" --arg stage "$stage" \
    --arg event_type "$event_type" --arg error_code "$error_code" \
    --arg source "$source" --arg source_tier "$source_tier" \
    --argjson latency_ms "${latency_ms:-0}" --argjson freshness_s "${freshness_s:-0}" \
    --arg action_taken "$action_taken" --arg result "$result" --arg signature "$sig" \
    '{ts_local,ts_utc,module,stage,event_type,error_code,source,source_tier,latency_ms,freshness_s,action_taken,result,signature}' \
    >> "$TELEM"
}

ledger_note(){ # type msg [mode]
  local type="${1:-NOTE}" msg="${2:-""}" mode="${3:-REAL-ONLY}"
  IFS='|' read -r ts_local ts_utc sig <<<"$(sign)"
  jq -n -c --arg ts_local "$ts_local" --arg ts_utc "$ts_utc" \
     --arg type "$type" --arg msg "$msg" --arg mode "$mode" --arg signature "$sig" \
     '{ts_local,ts_utc,type,msg,mode,signature}' >> "$LEDGER"
}

drift_check(){
  local start end remote local_now drift abs
  start=$(date +%s%3N)
  remote=$(curl -s --max-time 5 https://worldtimeapi.org/api/timezone/Europe/Rome | jq -r '.unixtime' 2>/dev/null || echo "")
  end=$(date +%s%3N)
  if [[ "$remote" =~ ^[0-9]+$ ]]; then
    local_now=$(date +%s); drift=$(( local_now - remote )); abs=${drift#-}
    telemetry "CORE" "time-drift" "check" "0" "worldtimeapi" "public" "$((end-start))" 0 "measured" "drift_s=${drift}"
    (( abs > 1 )) && ledger_note "TIME-DRIFT" "drift ${drift}s (>1s)" "REAL-ONLY"
  else
    telemetry "CORE" "time-drift" "check" "E_NO_REMOTE" "worldtimeapi" "public" 0 0 "skipped" "no-remote"
  fi
}

feed_check(){ # module maxAgeMin markerFile
  local mod="$1" maxm="$2" marker="$3" now freshness age
  now=$(date +%s)
  if [[ -f "$marker" ]]; then
    freshness=$(( now - $(stat -c %Y "$marker") )); age=$(( freshness/60 ))
    if (( age <= maxm )); then
      telemetry "$mod" "feed" "ok" "0" "$marker" "local" 0 "$freshness" "none" "age_min=${age}"; return 0
    fi
  fi
  telemetry "$mod" "feed" "warn" "STALE" "$marker" "local" 0 0 "tag-simulazione" "stale_or_missing"
  ledger_note "FEED-CHECK" "${mod} non verificato (SIMULAZIONE: observe-only)" "SIMULAZIONE"
  return 1
}

pre_draw_numeric(){ telemetry "NUMERIC" "pre-draw" "noop" "REAL_ONLY" "official" "tier1" 0 0 "observe" "waiting_official"; }
post_draw_numeric(){ telemetry "NUMERIC" "post-draw" "noop" "REAL_ONLY" "official" "tier1" 0 0 "observe" "waiting_official"; }
sports_daily(){ telemetry "SPORTS" "daily" "noop" "REAL_ONLY" "official" "tier1" 0 0 "observe" "waiting_official"; }

core_loop(){
  drift_check
  feed_check "FOOT" 10 "$FEEDS/FOOT/last.json"   || true
  feed_check "QUIZ"  5 "$FEEDS/QUIZ/last.json"   || true
  feed_check "TENNIS" 7 "$FEEDS/TENNIS/last.json"|| true
  feed_check "10L"   3 "$FEEDS/10L/draws.ndjson" || true
  feed_check "WFL"  60 "$FEEDS/WFL/last.json"    || true
  feed_check "SUP"  60 "$FEEDS/SUP/last.json"    || true
  feed_check "EJP"  60 "$FEEDS/EJP/last.json"    || true

  telemetry "10L" "block-ingest" "observe" "REAL_ONLY" "official" "tier1" 0 0 "cache-update" "pending"
  pre_draw_numeric
  post_draw_numeric
  telemetry "CORE" "run" "heartbeat" "0" "SHIRA" "local" 0 0 "none" "ok"
}

# git sync
if git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git -C "$ROOT" pull --rebase --autostash >/dev/null 2>&1 || true
fi

core_loop

if git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git -C "$ROOT" add db/*.ndjson cache/*.json 2>/dev/null || true
  git -C "$ROOT" commit -m "SHIRA run: $(date -u +%FT%TZ)" >/dev/null 2>&1 || true
  git -C "$ROOT" push >/dev/null 2>&1 || true
fi
