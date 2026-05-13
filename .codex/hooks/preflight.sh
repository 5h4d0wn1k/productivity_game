#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

required_files=(
  "AGENTS.md"
  ".github/workflows/ci.yml"
  ".jarvis/production_grade_profile.json"
  ".jarvis/verification_contract.json"
  ".jarvis/deploy_contract.json"
  "docs/ops/release-readiness-report.md"
  "docs/product/prfaq-template.md"
  "docs/product/critical-user-journeys.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing required operating artifact: $file" >&2
    exit 1
  fi
done

node -e "for (const file of ['.codex/config.json','.jarvis/production_grade_profile.json','.jarvis/verification_contract.json','.jarvis/deploy_contract.json']) { JSON.parse(require('fs').readFileSync(file, 'utf8')); }"

if [[ "$(git branch --show-current)" == "main" ]]; then
  echo "warning: currently on main; normal mutable work should happen on a branch" >&2
fi

echo "preflight ok"
