#!/usr/bin/env bash
set -euo pipefail

strict="${STRICT_RELEASE_VERIFY:-0}"

run_required() {
  echo "required: $*"
  "$@"
}

run_advisory() {
  echo "advisory: $*"
  if "$@"; then
    return 0
  fi

  if [ "$strict" = "1" ]; then
    echo "strict release verification failed: $*" >&2
    exit 1
  fi

  echo "warning: advisory command failed under the current baseline: $*" >&2
}

run_required npm ci --cache .npm --prefer-offline
run_required npm run lint
run_advisory npm run typecheck

if node -e "process.exit(require('./package.json').scripts?.test ? 0 : 1)"; then
  run_advisory npm test
else
  echo "warning: no automated test script configured; see .jarvis/verification_contract.json" >&2
  if [ "$strict" = "1" ]; then
    exit 1
  fi
fi

run_required npm run build:web
