#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
SH="${SHIRA_HOME:-$HOME/projects/shira-cc}"
TZ_ROMA="Europe/Rome"

ts_local="$(TZ=$TZ_ROMA date +%Y-%m-%dT%H:%M:%S%z)"
ts_utc="$(date -u +%Y-%m-%dT%H:%M:%S%z)"
t0_ms="$(date +%s%3N)"

# firma SHIRA.TIME.SIGNATURE™
seed="$ts_local|$ts_utc|CORE"
signature="$(printf '%s' "$seed" | sha256sum | awk '{print $1}')"

latency_ms="$(( $(date +%s%3N) - t0_ms ))"
freshness_s=0

json='{"ts_local":"'"$ts_local"'","ts_utc":"'"$ts_utc"'","module":"CORE","stage":"cron","event_type":"telemetry","error_code":null,"source":"termux","source_tier":"local","latency_ms":'"$latency_ms"',"freshness_s":'"$freshness_s"',"action_taken":"heartbeat","result":"OK","signature":"'"$signature"'"}'

# append NDJSON
printf '%s\n' "$json" >> "$SH/db/telemetry.ndjson"
printf '%s\n' "$json" >> "$SH/db/ledger.ndjson"

# status corrente (sovrascrive)
printf '%s\n' "$json" > "$SH/status/latest.json"
exit 0
