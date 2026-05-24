# Release Readiness Report

Workspace: productivity-game
Date: 2026-05-24
Branch: harden/release-readiness-node-0255b3ca01be

## Snapshot

- Git hygiene: work moved off `main` to a local hardening branch, but the branch has no upstream yet and no PR/check evidence exists.
- Working tree: intentionally dirty with this release-readiness hardening diff; prior node `node-075359a7d791` added `docs/ops/wip-quarantine-node-075359a7d791.md`, and retry node `node-19a00efabc63` added `docs/ops/wip-quarantine-node-19a00efabc63.md` as non-destructive evidence bundles. After verification the tree remains dirty with 17 tracked modifications and 13 untracked paths, so the next safe step is to review lockfile/runtime-surface churn, then commit, push, and open a PR for hosted checks.
- CI/CD: `.github/workflows/ci.yml` now runs deterministic npm install, lint, typecheck, web export, release bundle creation, artifact upload, advisory test detection, and advisory dependency audit.
- Verification contract: `.jarvis/verification_contract.json` records required, advisory, blocked, deploy, and rollback gates.
- Production profile: `.jarvis/production_grade_profile.json` records maturity target, runtime, delivery path, agile operating posture, deploy assumptions, product docs, and risk register; maturity is now tracked as a self-checking baseline at 45%.
- Agile work item contract: `.jarvis/agile_work_item.json` defines required work item fields, definition of ready, definition of done, verification expectations, and rollback expectations for PR-sized changes.
- Deploy safety: `.jarvis/deploy_contract.json` records runtime target, env source, artifact, health, rollout, abort, and rollback posture.
- AI operating guidance: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/preflight.sh`, advisory checklist hooks, and `.codex/rules/*` provide repo-local guardrails.
- Product planning: PRFAQ/problem framing and critical user journey templates exist under `docs/product`.
- Dirty-worktree quarantine: `docs/ops/wip-quarantine-node-075359a7d791.md` and `docs/ops/wip-quarantine-node-19a00efabc63.md` record pre-edit dirty WIP inventories for the retry path.
- Repo operating-system report: `.codex/scripts/repo_operating_system_report.js` now performs a dependency-free local artifact, JSON, workflow-token, package-script, git-hygiene, and maturity check; preflight invokes it in `--check` mode.

## Delivery Blockers

1. No real automated test suite is configured.
2. `npm audit --audit-level=critical` reports 55 known vulnerabilities, including 3 critical; dependency remediation needs a separate compatibility-safe plan.
3. The canonical `/health` deploy path is documented but not implemented or locally verified in the static web export.
4. Authenticated Firebase and Google Calendar journey smoke checks require credentials and target environment access.
5. Service restart validation is not applicable until a concrete target service and restart command are documented.
6. Branch `harden/release-readiness-node-0255b3ca01be` does not track an upstream remote, and hosted GitHub PR/check evidence is not present yet.
7. `yarn.lock` is modified in this dirty tree while `package-lock.json` remains canonical; review this lockfile diff before PR merge and avoid turning it into an implicit package-manager migration.
8. The repo-local operating-system report exists and runs in preflight, but it is not wired into hosted CI yet.
9. This node did not push, open a PR, deploy, restart services, or mutate any live target; release evidence remains local until the branch is promoted through PR checks.

## Safe Hardening Changes

- Preserved the existing release bundle workflow shape and promoted lint/typecheck from advisory to blocking after fixing their local blockers.
- Added exact ESLint dev dependencies, `.eslintrc.js`, and `.eslintignore` so lint runs through npm without Expo attempting missing yarn setup.
- Added `npm run typecheck` and fixed two compile-time-only assertions in calendar and habit screens.
- Added advisory security audit to CI without making known dependency findings block unrelated hardening.
- Added deploy/rollback runbook under `docs/deployment`.
- Added Markdown advisory hooks and durable `.codex/rules` for scope, evidence, non-destructive operations, verification, and release.
- Added the missing `agile` section to the production-grade profile and preflight validation for required profile sections.
- Added `.jarvis/agile_work_item.json` and wired it into AGENTS, preflight, PR review, and production profile guidance.
- Added `.codex/scripts/repo_operating_system_report.js` and wired it into preflight as a repo-local self-check for operating artifacts, JSON validity, workflow gates, package scripts, and git hygiene.
- Updated product journey guidance around auth, first task completion, habits, calendar events, and progress feedback.
- Added `docs/ops/wip-quarantine-node-075359a7d791.md` and `docs/ops/wip-quarantine-node-19a00efabc63.md` so existing dirty WIP remains visible before unrelated growth or PR packaging.

## Verification Evidence

Current node evidence refreshed on 2026-05-24:

- `git ls-remote --tags https://github.com/actions/checkout.git refs/tags/v6`: confirmed `v6` exists.
- `git ls-remote --tags https://github.com/actions/setup-node.git refs/tags/v6`: confirmed `v6` exists.
- `git ls-remote --tags https://github.com/actions/upload-artifact.git refs/tags/v7`: confirmed `v7` exists.
- `docs/ops/wip-quarantine-node-075359a7d791.md`: present as a non-destructive evidence bundle for the prior retry's pre-edit dirty tree.
- `docs/ops/wip-quarantine-node-19a00efabc63.md`: added as a non-destructive evidence bundle for this retry's pre-edit dirty tree.
- `git diff --check`: passed.
- `npm ci --no-audit --fund=false`: passed; local Node 18 reported one `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`, while CI is configured for Node 20.
- `bash -n .codex/hooks/preflight.sh && bash .codex/hooks/preflight.sh`: passed, including required profile, agile work item, and deploy contract field validation.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed, warning only about the missing test script, dirty tree, and missing upstream.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported all 14 required operating artifacts present with maturity `self_checking_baseline (45%) -> self_improving`.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml`: passed using Node `js-yaml`.
- `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `npm pkg get scripts.test`: returned `{}`, confirming no automated test script exists.
- `npm run lint`: passed with 0 errors and 23 warnings.
- `npm run typecheck`: passed.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist && tar -tzf release-bundle-web.tgz | wc -l && ls -lh release-bundle-web.tgz`: passed; bundle has 47 entries and is 2.1 MB.
- `npm test`: failed with `Missing script: "test"`.
- `npm audit --audit-level=critical`: failed as advisory evidence with 55 vulnerabilities, including 3 critical.
- `test -f dist/index.html && test -f dist/metadata.json`: passed, confirming local release files exist.
- Static shadow smoke with `python3 -m http.server 18765 --directory dist`: `GET /` returned 200 and `GET /health` returned 404.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present but no push or PR was attempted by this node.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo bridge self-test command is documented.
- Product-specific systemd inventory: no `productivity-game` or `productivity-app` service unit was found, so no service was restarted.
- `git rev-parse --abbrev-ref --symbolic-full-name @{u}`: failed because the current branch has no upstream configured.
- `git status --short --branch`: remained intentionally dirty with 17 tracked modifications and 13 untracked paths after verification.
- Remote delivery: no commit, push, or PR was created from this node; use the existing hardening branch for the reviewed PR path after the dirty diff is accepted.
- `git diff --numstat -- package-lock.json yarn.lock package.json`: showed package/lock churn from deterministic lint setup, including a tracked `yarn.lock` diff that needs reviewer attention.
- Repo operating-system audit script discovery checked `.codex/scripts`, `/home/ubuntu/.codex/scripts/repo_operating_system_audit.py`, and `/home/ubuntu/.codex/scripts/repo_operating_system_report.py`; no runnable audit script was present in this environment.
- Rollback target check from `.jarvis/deploy_contract.json` and `.jarvis/production_grade_profile.json`: confirmed `previous_release`.

Blocked or partial verification:

- Automated test suite: blocked by missing `test` script.
- Bridge self-test: blocked because no repo-local bridge self-test exists; the available `bridge` command is the OS network utility.
- Shadow deploy attempt: blocked by missing deploy CLI and deploy credentials.
- Shadow smoke: static web shell smoke passed for `/`; canonical `/health` and authenticated Firebase/Google journeys remain blocked or failing until the target runtime and credentials are configured.
- Service restart validation: blocked/not applicable because no repo-specific service unit exists for this app.

## Deploy And Rollback Notes

Release risk class: CI/docs/config hardening plus compile-time-only TypeScript assertion changes; no intentional runtime behavior change.

Rollout strategy: branch, PR, CI evidence, review, then merge. Do not deploy from this node.

Rollback path: revert this branch/PR for guidance, CI, lint, and TypeScript assertion changes. For a future app release, re-promote the previous successful web artifact or revert the release PR, then check `/health` and rerun available auth/task smoke checks.

Abort conditions for future deploys:

- CI cannot install, lint, typecheck, build, or create the release bundle.
- Release bundle is missing or cannot be unpacked.
- Required public Firebase/Google environment variables are absent.
- Target runtime cannot serve `/` or the canonical `/health` once mapped.
- Critical user journey smoke checks fail.
