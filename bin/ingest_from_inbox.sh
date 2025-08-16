#!/usr/bin/env bash
set -euo pipefail
export TZ="Europe/Rome"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INBOX="$ROOT/inbox"; DB="$ROOT/db"; LEDGER="$DB/ledger.ndjson"
mkdir -p "$INBOX" "$DB"

route(){ # decide il DB dal campo "type"
  local f="$1" t
  t=$(head -n1 "$f" | jq -r '.type|tostring' 2>/dev/null || echo "")
  case "$t" in
    OFFICIAL-DRAW-APPEND) echo "$DB/official_draws.ndjson" ;;
    MATCH-APPEND)         echo "$DB/matches.ndjson" ;;
    DB-APPEND)            echo "$DB/tickets.ndjson" ;;
    TELEMETRY-APPEND)     echo "$DB/telemetry.ndjson" ;;
    *)                    echo "" ;;
  esac
}

for f in "$INBOX"/*.ndjson; do
  [[ -e "$f" ]] || exit 0
  tgt="$(route "$f")"
  if [[ -n "$tgt" ]]; then
    cat "$f" >> "$tgt"
    IFS='|' read -r ts_local ts_utc sig <<<"$(date +%FT%T.%3N%z)|$(date -u +%FT%T.%3NZ)|$(printf bridge-%s "$RANDOM" | sha256sum | cut -c1-16)"
    jq -cn --arg ts_local "$ts_local" --arg ts_utc "$ts_utc" --arg file "$(basename "$f")" --arg target "$tgt" --arg signature "$sig" \
      '{ts_local,ts_utc,type:"CHAT-BRIDGE-INGEST",file:$file,target:$target,signature}' >> "$LEDGER"
    rm -f "$f"
  fi
done
