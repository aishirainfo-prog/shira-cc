#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "$HOME/projects/shira-cc"

# limita il commit a db/status/telemetry/ledger e simili
git add status/*.json db/*.ndjson db/*.json 2>/dev/null || true
git diff --cached --quiet && exit 0

ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
git commit -m "telemetry: auto-update $ts"
git push origin main
