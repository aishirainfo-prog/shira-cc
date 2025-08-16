#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
SHIRA_HOME="${SHIRA_HOME:-$HOME/projects/shira-cc}"
LEDGER="$SHIRA_HOME/db/ledger.ndjson"
TELEM="$SHIRA_HOME/db/telemetry.ndjson"

sig(){ # SHIRA.TIME.SIGNATURE™
  local ts_local ts_utc seed
  ts_local="$(date +%FT%T.%3N%z)"; ts_utc="$(date -u +%FT%T.%3NZ)"
  seed="$(printf '%s|%s' "$ts_local" "$ts_utc" | md5sum | cut -d' ' -f1)"
  printf '{"ts_local":"%s","ts_utc":"%s","signature":"SHIRA.TIME.SIGNATURE™:%s"}\n' "$ts_local" "$ts_utc" "$seed"
}
append_ndjson(){ # $1=file  $2=json_string
  printf '%s\n' "$2" >> "$1"
}
telemetry(){ # module stage event_type error_code source source_tier latency freshness action result
  local ts_local ts_utc sigj
  ts_local="$(date +%FT%T.%3N%z)"; ts_utc="$(date -u +%FT%T.%3NZ)"
  sigj="$(sig | jq -c .)"
  jq -nc --arg ts_local "$ts_local" --arg ts_utc "$ts_utc" \
         --arg module "$1" --arg stage "$2" --arg event_type "$3" \
         --arg error_code "$4" --arg source "$5" --arg source_tier "$6" \
         --argjson latency_ms "${7:-0}" --argjson freshness_s "${8:-0}" \
         --arg action_taken "$9" --arg result "${10:-ok}" --arg sig "$sigj" '
      ($sig | fromjson) as $S |
      {ts_local:$ts_local,ts_utc:$ts_utc,module:$module,stage:$stage,event_type:$event_type,
       error_code:$error_code,source:$source,source_tier:$source_tier,latency_ms:$latency_ms,
       freshness_s:$freshness_s,action_taken:$action_taken,result:$result} + $S' \
  | tee -a "$TELEM" >/dev/null
}
status_write(){ # scrive status/latest.json
  local ts_local ts_utc
  ts_local="$(date +%FT%T.%3N%z)"; ts_utc="$(date -u +%FT%T.%3NZ)"
  jq -nc --arg ts_local "$ts_local" --arg ts_utc "$ts_utc" \
         --arg mode "REAL-ONLY" --arg stage "${1:-RUN}" --arg sig "$(sig | jq -r '.signature')" \
         '{ts_local:$ts_local, ts_utc:$ts_utc, mode:$mode, stage:$stage, signature:$sig}' \
  > "$SHIRA_HOME/status/latest.json"
}
ledger_note(){ # $1=msg compatto
  local s; s="$(sig | jq -r '.signature')"
  jq -nc --arg msg "$1" --arg sig "$s" \
    '{ts_local:(now|todate), msg:$msg, signature:$sig}' \
  | tee -a "$LEDGER" >/dev/null
}
