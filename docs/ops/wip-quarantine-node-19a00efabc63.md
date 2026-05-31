# Dirty Worktree Quarantine - node-19a00efabc63

Workspace: productivity-game
Branch observed: `harden/release-readiness-node-0255b3ca01be`
Inventory date: 2026-05-24
Mode: non-destructive evidence bundle

## Purpose

This file records the dirty worktree inventory observed before continuing release-readiness hardening in mission node `node-19a00efabc63`. It preserves visibility into existing WIP and avoids discarding, overwriting, or hiding user, Ayushman, senior-dev, or prior-node changes.

The current branch is already off `main`, but it has no upstream tracking branch yet. Until the diff is reviewed, committed, pushed, and opened as a PR, this evidence bundle is the local quarantine record for this retry.

## Observed Git State

`git status --short --branch` showed:

```text
## harden/release-readiness-node-0255b3ca01be
 M .codex/config.json
 M .codex/hooks/preflight.sh
 M .codex/rules/release-readiness.md
 M .github/pull_request_template.md
 M .github/workflows/ci.yml
 M .jarvis/deploy_contract.json
 M .jarvis/production_grade_profile.json
 M .jarvis/verification_contract.json
 M AGENTS.md
 M app/(tabs)/calendar.tsx
 M app/(tabs)/habitCreator.tsx
 M docs/ops/release-readiness-report.md
 M docs/product/critical-user-journeys.md
 M docs/product/prfaq-template.md
 M package-lock.json
 M package.json
 M yarn.lock
?? .codex/hooks/README.md
?? .codex/hooks/pre-handoff.md
?? .codex/hooks/preflight.md
?? .codex/rules/non-destructive-operations.md
?? .codex/rules/scope-and-evidence.md
?? .codex/rules/verification-and-release.md
?? .eslintignore
?? .eslintrc.js
?? .github/workflows/release.yml
?? .jarvis/agile_work_item.json
?? docs/deployment/
?? docs/ops/wip-quarantine-node-075359a7d791.md
```

`git diff --stat` showed 17 tracked file modifications with 7,232 insertions and 1,767 deletions before this file was added. The largest churn is in `package-lock.json` and `yarn.lock`; `package-lock.json` remains the canonical CI lockfile, and the `yarn.lock` diff needs reviewer attention before merge.

## Protected Or Sensitive Surfaces In WIP

- `app/(tabs)/calendar.tsx`: compile-time-only assertion change from `CalendarEvent[]` to `unknown as CalendarEvent[]`.
- `app/(tabs)/habitCreator.tsx`: compile-time-only assertion change from `Habit[]` to `unknown as Habit[]`.
- `.github/workflows/*`: CI and release-bundle workflow changes.
- `.jarvis/*`, `.codex/*`, `AGENTS.md`, and `docs/*`: operating contracts, verification policy, rollback policy, and product planning guidance.
- `package.json`, `package-lock.json`, and `yarn.lock`: script and lint dependency changes; lockfile impact must be reviewed before PR merge.

## Quarantine Rules For Follow-up Work

- Do not revert or rewrite the existing dirty files unless the reviewer explicitly approves that scope.
- Keep new hardening changes additive and evidence-oriented.
- Before merge, package this branch through the normal PR path: commit intentionally, push the branch, open a PR, and let hosted checks run.
- If the WIP is rejected, rollback is a PR revert or branch abandonment; no live deploy or service restart has been performed by this node.
