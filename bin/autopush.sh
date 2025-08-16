#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
cd "${SHIRA_HOME:-$HOME/projects/shira-cc}"

# config git minima
git config --global user.name  "${GIT_AUTHOR_NAME:-shira-bot}"
git config --global user.email "${GIT_AUTHOR_EMAIL:-shira-bot@local}"

# collega il remoto se manca
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/aishirainfo-prog/shira-cc.git
fi

git add -A || true
git commit -m "auto: $(date -u +%Y-%m-%dT%H:%M:%SZ)" || true
git pull --rebase origin main || true
git push origin main || true
