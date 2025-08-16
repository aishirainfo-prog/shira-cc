#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "$HOME/projects/shira-cc"
git fetch --all
git reset --hard origin/main
