#!/usr/bin/env bash
set -euo pipefail

echo "workspace=$(basename "$(pwd)")"
git status --short --branch

test -f package.json
test -f package-lock.json
test -f AGENTS.md
test -f .jarvis/production_grade_profile.json
test -f .jarvis/verification_contract.json
test -f .jarvis/deploy_contract.json
test -f verification_contract.json

node -e "const p=require('./package.json'); if (!p.scripts?.lint || !p.scripts?.['build:web']) process.exit(1);"
node -e "for (const f of ['verification_contract.json', '.jarvis/verification_contract.json', '.jarvis/production_grade_profile.json', '.jarvis/deploy_contract.json', '.codex/config.json']) JSON.parse(require('fs').readFileSync(f, 'utf8'));"

if node -e "process.exit(require('./package.json').scripts?.test ? 0 : 1)"; then
  echo "test_script=present"
else
  echo "test_script=missing"
fi
