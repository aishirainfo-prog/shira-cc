#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
. "$(cd "$(dirname "$0")" && pwd)/lib.sh"
module="${1:-core}"; stage="${2:-run}"; event_type="${3:-telemetry}"
sig=$(signature)
jq -c --arg tl "$(ts_local)" --arg tu "$(ts_utc)" \
      --arg module "$module" --arg stage "$stage" \
      --arg event_type "$event_type" --arg source "termux" \
      --arg mode "REAL_ONLY" --arg signature "$sig" \
'{
  ts_local:$tl, ts_utc:$tu, module:$module, stage:$stage,
  event_type:$event_type, error_code:null, source:$source,
  source_tier:"local", latency_ms:null, freshness_s:null,
  action_taken:null, result:null, signature:$signature, mode:$mode
}'
