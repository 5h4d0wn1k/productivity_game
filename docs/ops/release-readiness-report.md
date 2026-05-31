# Release Readiness Report

Workspace: productivity-game
Date: 2026-05-31
Branch: harden/release-readiness-node-0255b3ca01be

## Snapshot

- Current retry node `node-cf81f8cec093`: resolved the remaining external `env_file_source` warning by adding top-level `env_file_source` aliases to the workspace config and deploy contract while preserving the existing nested `environment.env_file_source` values; preflight and the repo operating-system report now require root and nested values to stay aligned.
- Current retry node `node-a83347f89a7c`: revalidated the release-readiness baseline, confirmed the external `env_file_source` warning is resolved in repo-local contracts, refreshed build/bundle/smoke/deploy-blockage evidence, and kept this pass to report-only documentation with no runtime behavior change.
- Current retry node `node-b01413c3ad7e`: revalidated the release-readiness baseline, confirmed the stale `env_file_source` warning remains resolved in repo-local contracts, refreshed deploy/smoke evidence, and kept this pass to report-only documentation with no runtime behavior change.
- Prior retry node `node-c0fa602351f7`: revalidated the release-readiness baseline and added the environment-source rule directly to `AGENTS.md` so future AI sessions inherit it before consulting advisory `.codex` and `.jarvis` guidance.
- Git hygiene: work moved off `main` to branch `harden/release-readiness-node-0255b3ca01be`, was committed, pushed with upstream tracking, and opened as draft PR #1: https://github.com/5h4d0wn1k/productivity_game/pull/1.
- Working tree: clean after committing and pushing the hardening diff. Prior node `node-075359a7d791` added `docs/ops/wip-quarantine-node-075359a7d791.md`, and retry node `node-19a00efabc63` added `docs/ops/wip-quarantine-node-19a00efabc63.md` as non-destructive evidence bundles.
- CI/CD: `.github/workflows/ci.yml` now runs deterministic npm install, lint, typecheck, web export, release bundle creation, artifact upload, advisory test detection, and advisory dependency audit.
- Verification contract: `.jarvis/verification_contract.json` records required, advisory, blocked, deploy, and rollback gates.
- Production profile: `.jarvis/production_grade_profile.json` records maturity target, runtime, delivery path, agile operating posture, deploy assumptions, product docs, and risk register; maturity is now tracked as a self-checking baseline at 45%.
- Agile work item contract: `.jarvis/agile_work_item.json` defines required work item fields, definition of ready, definition of done, verification expectations, and rollback expectations for PR-sized changes.
- Deploy safety: `.jarvis/deploy_contract.json` records runtime target, env source, artifact, health, rollout, abort, and rollback posture; `env_file_source` is now documented at the top level and nested environment level in both `.codex/config.json` and `.jarvis/deploy_contract.json`, then checked for consistency across operating contracts.
- Current env source warning: resolved in the repository artifacts. `env_file_source` is documented as `default process env only` in workspace root, workspace environment, deploy root, deploy environment, verification contract, and production profile; preflight and the repo operating-system report fail on missing or mismatched values.
- AI operating guidance: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/preflight.sh`, advisory checklist hooks, and `.codex/rules/*` provide repo-local guardrails, including an explicit workspace environment-source contract.
- Product planning: PRFAQ/problem framing and critical user journey templates exist under `docs/product`.
- Dirty-worktree quarantine: `docs/ops/wip-quarantine-node-075359a7d791.md` and `docs/ops/wip-quarantine-node-19a00efabc63.md` record pre-edit dirty WIP inventories for the retry path.
- Repo operating-system report: `.codex/scripts/repo_operating_system_report.js` now performs a dependency-free local artifact, JSON, workflow-token, package-script, git-hygiene, and maturity check; preflight invokes it in `--check` mode.

## Delivery Blockers

1. No real automated test suite is configured.
2. `npm audit --audit-level=critical` reports 55 known vulnerabilities, including 3 critical; dependency remediation needs a separate compatibility-safe plan.
3. The canonical `/health` deploy path is documented but not implemented or locally verified in the static web export.
4. Authenticated Firebase and Google Calendar journey smoke checks require credentials and target environment access.
5. Service restart validation is not applicable until a concrete target service and restart command are documented.
6. `yarn.lock` is modified in this hardening PR while `package-lock.json` remains canonical; review this lockfile diff before merge and avoid turning it into an implicit package-manager migration.
7. The repo-local operating-system report exists and runs in preflight, but it is not wired into hosted CI yet.
8. Draft PR #1 remains open with hosted checks passing, but this repository still has no contracted `cynik` deploy execution, product-specific service restart target, or credentialed Firebase/Google smoke evidence.

## Safe Hardening Changes

- Preserved the existing release bundle workflow shape and promoted lint/typecheck from advisory to blocking after fixing their local blockers.
- Added exact ESLint dev dependencies, `.eslintrc.js`, and `.eslintignore` so lint runs through npm without Expo attempting missing yarn setup.
- Added `npm run typecheck` and fixed two compile-time-only assertions in calendar and habit screens.
- Added advisory security audit to CI without making known dependency findings block unrelated hardening.
- Added deploy/rollback runbook under `docs/deployment`.
- Added `environment.env_file_source` to `.codex/config.json` and enforce matching values across `.codex/config.json`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, and `.jarvis/production_grade_profile.json` in preflight and the repo operating-system report.
- Added top-level `env_file_source` aliases to `.codex/config.json` and `.jarvis/deploy_contract.json`, then hardened preflight and the repo operating-system report to validate root and nested values together.
- Added the same `env_file_source` alignment rule to `AGENTS.md` so the primary repo-local AI operating contract names the deploy environment source before any mutable work.
- Tightened the `env_file_source` self-check so missing values in any of the four operating contracts now fail preflight and `repo_operating_system_report.js --check`; the report output also prints workspace, deploy, verification, and production-profile sources separately.
- Added Markdown advisory hooks and durable `.codex/rules` for scope, evidence, non-destructive operations, verification, and release.
- Added the missing `agile` section to the production-grade profile and preflight validation for required profile sections.
- Added `.jarvis/agile_work_item.json` and wired it into AGENTS, preflight, PR review, and production profile guidance.
- Added `.codex/scripts/repo_operating_system_report.js` and wired it into preflight as a repo-local self-check for operating artifacts, JSON validity, workflow gates, package scripts, and git hygiene.
- Updated product journey guidance around auth, first task completion, habits, calendar events, and progress feedback.
- Added `docs/ops/wip-quarantine-node-075359a7d791.md` and `docs/ops/wip-quarantine-node-19a00efabc63.md` so existing dirty WIP remains visible before unrelated growth or PR packaging.
- Refreshed this release-readiness report for `node-a83347f89a7c` with current local verification, deploy blockage, static smoke, service-restart, PR-check, environment-source, and rollback evidence.
- Refreshed this release-readiness report for `node-b01413c3ad7e` with current local verification, deploy blockage, smoke, service-restart, PR-check, and rollback evidence.

## Verification Evidence

Node `node-a83347f89a7c` evidence refreshed on 2026-05-31:

- Start inventory `git status --short --branch`: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with a clean worktree.
- Read-only inventory confirmed existing operating artifacts: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/*`, `.codex/rules/*`, `.codex/scripts/repo_operating_system_report.js`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, `.jarvis/production_grade_profile.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/deployment/deploy-and-rollback.md`, `docs/product/prfaq-template.md`, `docs/product/critical-user-journeys.md`, and this release-readiness report.
- Hardening delta: documentation-only refresh to this report; no app code, workflow, dependency, deploy target, service, or environment behavior was changed.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- `git diff --check`: passed before editing.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- Python syntax gate with `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed with the known warning that `package.json` has no test script.
- `bash .codex/hooks/preflight.sh`: passed with the known warning that `package.json` has no test script.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported all 14 required operating artifacts present, `env_file_source: default process env only` for workspace config, deploy contract, verification contract, and production profile, upstream tracking on `origin/harden/release-readiness-node-0255b3ca01be`, zero dirty paths, and maturity `self_checking_baseline (45%) -> self_improving`.
- `npm ci --no-audit --fund=false`: passed on local Node v18.19.1/npm 9.2.0 with the known `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`; CI remains configured for Node 20.
- `npm run lint`: passed with 0 errors and the existing 23 warnings.
- `npm run typecheck`: passed.
- `npm pkg get scripts.test`: returned `{}`, confirming no automated test script exists.
- `npm test`: failed because `package.json` has no `test` script.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist`, `tar -tzf release-bundle-web.tgz | wc -l`, `ls -lh release-bundle-web.tgz`, `test -f dist/index.html`, and `test -f dist/metadata.json`: passed; the bundle has 47 entries and is 2.1 MB.
- `npm audit --audit-level=critical`: failed with 55 vulnerabilities, including 3 critical; remediation remains a separate dependency-hardening work item because some fixes imply compatibility-sensitive Expo/Firebase changes.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo-local bridge self-test command is documented.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent; no secret values were read or printed.
- Shadow deploy attempt: blocked because the `cynik` CLI and `CYNIK_DEPLOY_TOKEN` are unavailable.
- Static shadow smoke with `python3 -m http.server 18773 --directory dist`: `GET /` returned 200 with a 1231-byte web shell and `GET /health` returned 404.
- Product-specific systemd inventory: no `productivity-game`, `productivity-app`, or `productivity` service unit was found, so no service was restarted.
- Rollback target check from `.jarvis/deploy_contract.json` and `.jarvis/production_grade_profile.json`: confirmed `rollback.target=previous_release`, rollback mechanism `re-promote previous successful artifact or revert the release PR`, deploy `env_file_source=default process env only`, deploy `environment.env_file_source=default process env only`, production-profile `deploy.env_file_source=default process env only`, and production-profile rollback action to re-promote the previous web artifact or revert the release PR before checking `/health` and available auth/task smoke.
- PR delivery check with `gh pr view 1` and `gh pr checks 1`: draft PR #1 remains open from `harden/release-readiness-node-0255b3ca01be` to `main`; hosted checks from the current remote branch head reported success for `Web build and release bundle`, `Advisory regression probes`, `GitGuardian Security Checks`, `Vercel`, and `Vercel Preview Comments`. Vercel preview remains outside the contracted `cynik` deploy target.

Node `node-cf81f8cec093` evidence refreshed on 2026-05-30:

- Start inventory `git status --short --branch`: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with a clean worktree.
- Read-only inventory confirmed existing operating artifacts: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/*`, `.codex/rules/*`, `.codex/scripts/repo_operating_system_report.js`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, `.jarvis/production_grade_profile.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/deployment/deploy-and-rollback.md`, `docs/product/prfaq-template.md`, `docs/product/critical-user-journeys.md`, and this release-readiness report.
- Hardening delta: added top-level `env_file_source` aliases to `.codex/config.json` and `.jarvis/deploy_contract.json`; updated `AGENTS.md`, `docs/deployment/deploy-and-rollback.md`, `.codex/hooks/preflight.sh`, and `.codex/scripts/repo_operating_system_report.js` so root and nested environment-source values are documented and validated together.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- `git diff --check`: passed.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- Python syntax gate with `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `bash .codex/hooks/preflight.sh`: passed; it validates required operating artifacts plus `env_file_source` presence and consistency across workspace root, workspace environment, deploy root, deploy environment, verification contract, and production profile.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed with expected warnings for the missing test script and intentional dirty paths from this node.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported all 14 required operating artifacts present, `env_file_source: default process env only`, workspace config root and environment set, deploy contract root and environment set, verification and production profile set, upstream tracking on `origin/harden/release-readiness-node-0255b3ca01be`, and maturity `self_checking_baseline (45%) -> self_improving`.
- `npm ci --no-audit --fund=false`: passed on local Node v18.19.1/npm 9.2.0 with the known `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`; CI remains configured for Node 20.
- `npm run lint`: passed with 0 errors and the existing 23 warnings.
- `npm run typecheck`: passed.
- `npm pkg get scripts.test`: returned `{}`, confirming no automated test script exists.
- `npm test`: failed because `package.json` has no `test` script.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist`, `tar -tzf release-bundle-web.tgz | wc -l`, `ls -lh release-bundle-web.tgz`, `test -f dist/index.html`, and `test -f dist/metadata.json`: passed; the bundle has 47 entries and is 2.1 MB.
- `npm audit --audit-level=critical`: failed with 55 vulnerabilities, including 3 critical; remediation remains a separate dependency-hardening work item because some fixes imply compatibility-sensitive Expo/Firebase changes.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo-local bridge self-test command is documented.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent; no secret values were read or printed.
- Shadow deploy attempt: blocked because the `cynik` CLI and `CYNIK_DEPLOY_TOKEN` are unavailable.
- Static shadow smoke with `python3 -m http.server 18772 --directory dist`: `GET /` returned 200 with a 1231-byte web shell and `GET /health` returned 404.
- Product-specific systemd inventory: no `productivity-game`, `productivity-app`, or `productivity` service unit was found, so no service was restarted.
- Rollback target check from `.jarvis/deploy_contract.json` and `.jarvis/production_grade_profile.json`: confirmed `rollback.target=previous_release`, rollback mechanism `re-promote previous successful artifact or revert the release PR`, `workspace env_file_source=default process env only`, and `deploy env_file_source=default process env only`.
- PR delivery check before packaging this node with `gh pr view 1`: draft PR #1 remained open from `harden/release-readiness-node-0255b3ca01be` to `main`; hosted checks from the previous branch head reported success for `Web build and release bundle`, `Advisory regression probes`, `GitGuardian Security Checks`, `Vercel`, and `Vercel Preview Comments`. Current hosted PR evidence should be refreshed after pushing the packaged node.

Node `node-b01413c3ad7e` evidence refreshed on 2026-05-29:

- Resume inventory `git status --short --branch`: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with one staged path, `docs/ops/release-readiness-report.md`, left from the lost callback retry. No app code, workflow, dependency, deploy target, service, or environment behavior was dirty.
- `git diff --cached --stat`: one staged documentation change in `docs/ops/release-readiness-report.md`.
- Read-only inventory confirmed existing operating artifacts: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/*`, `.codex/rules/*`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, `.jarvis/production_grade_profile.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/deployment/deploy-and-rollback.md`, `docs/product/prfaq-template.md`, `docs/product/critical-user-journeys.md`, and this release-readiness report.
- Hardening delta: documentation-only refresh to this report; no app code, workflow, dependency, deploy target, service, or environment behavior was changed.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- `git diff --check` and `git diff --cached --check`: passed.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- Python syntax gate with `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `bash .codex/hooks/preflight.sh`: passed; it validates required operating artifacts plus `env_file_source` presence and consistency across workspace config, deploy contract, verification contract, and production profile.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed with the known warning that `package.json` has no test script.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported all 14 required operating artifacts present, `env_file_source: default process env only` for workspace config, deploy contract, verification contract, and production profile, upstream tracking on `origin/harden/release-readiness-node-0255b3ca01be`, one dirty path from this report refresh, and maturity `self_checking_baseline (45%) -> self_improving`.
- `npm ci --no-audit --fund=false`: passed on local Node v18.19.1/npm 9.2.0 with the known `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`; CI remains configured for Node 20.
- `npm run lint`: passed with 0 errors and the existing 23 warnings.
- `npm run typecheck`: passed.
- `npm pkg get scripts.test`: returned `{}`, confirming no automated test script exists.
- `npm test`: failed because `package.json` has no `test` script.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist`: passed.
- `tar -tzf release-bundle-web.tgz | wc -l`: passed and reported 47 bundle entries.
- `ls -lh release-bundle-web.tgz`: passed and reported a 2.1 MB bundle.
- `test -f dist/index.html` and `test -f dist/metadata.json`: passed.
- `npm audit --audit-level=critical`: failed with 55 vulnerabilities, including 3 critical. Several fixes are available only through compatibility-sensitive updates such as an Expo major upgrade, so remediation remains a separate dependency hardening item.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo-local bridge self-test command is documented.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent; no secret values were read or printed.
- Shadow deploy attempt: blocked because the `cynik` CLI and deploy credentials are unavailable.
- Static shadow smoke with `python3 -m http.server 18771 --directory dist`: `GET /` returned 200 and `GET /health` returned 404.
- Product-specific systemd inventory with `systemctl list-units --all --type=service --no-legend | rg -i 'productivity-game|productivity-app|productivity'`: no matching service unit was found, so no service was restarted.
- Rollback target check from `.jarvis/deploy_contract.json` and `.jarvis/production_grade_profile.json`: confirmed `rollback.target=previous_release`, rollback mechanism `re-promote previous successful artifact or revert the release PR`, and `environment.env_file_source=default process env only`.
- PR delivery check with `gh pr view 1`: draft PR #1 remains open from `harden/release-readiness-node-0255b3ca01be` to `main`; hosted checks reported success for `Web build and release bundle`, `Advisory regression probes`, `GitGuardian Security Checks`, `Vercel`, and `Vercel Preview Comments`. Vercel preview remains outside the contracted `cynik` deploy target.
- Final post-report `bash .codex/hooks/preflight.sh`: passed with expected warnings for missing `test` script and the single intentional dirty path `docs/ops/release-readiness-report.md`.
- Final post-report `node .codex/scripts/repo_operating_system_report.js --check`: passed with the same expected warnings for missing `test` script and the single intentional dirty path.
- Final `git status --short --branch`: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with only `docs/ops/release-readiness-report.md` modified.

Node `node-c0fa602351f7` evidence refreshed on 2026-05-28:

- `git status --short --branch` before editing: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with no dirty paths.
- Read-only inventory confirmed existing operating artifacts: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/*`, `.codex/rules/*`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, `.jarvis/production_grade_profile.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/deployment/deploy-and-rollback.md`, `docs/product/prfaq-template.md`, `docs/product/critical-user-journeys.md`, and this release-readiness report.
- Hardening delta: `AGENTS.md` now names `env_file_source` as `default process env only` and requires alignment across workspace config, deploy contract, verification contract, and production profile.
- `git diff --check`: passed.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- Python syntax gate with `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `bash .codex/hooks/preflight.sh`: passed; it validates required operating artifacts plus `env_file_source` presence and consistency across workspace config, deploy contract, verification contract, and production profile. During the initial edit phase it warned that the working tree had 1 dirty path, which was the intended `AGENTS.md` edit.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed; warnings were the missing test script and the intended temporary dirty path.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported all 14 required operating artifacts present, `env_file_source: default process env only` for workspace config, deploy contract, verification contract, and production profile; upstream tracking on `origin/harden/release-readiness-node-0255b3ca01be`; and maturity `self_checking_baseline (45%) -> self_improving`.
- Final post-report `bash .codex/hooks/preflight.sh`: passed; warnings were the missing test script and the 2 intentional dirty paths (`AGENTS.md` and `docs/ops/release-readiness-report.md`).
- Final post-report `node .codex/scripts/repo_operating_system_report.js --check`: passed with the same missing-test and intentional-dirty-path warnings.
- `npm ci --no-audit --fund=false`: passed on local Node v18.19.1/npm 9.2.0 with the known `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`; CI remains configured for Node 20.
- `npm run lint`: passed with 0 errors and the existing 23 warnings.
- `npm run typecheck`: passed.
- `npm pkg get scripts.test`: returned `{}`, confirming no automated test script exists.
- `npm test`: failed because `package.json` has no `test` script.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist && tar -tzf release-bundle-web.tgz | wc -l && ls -lh release-bundle-web.tgz`: passed; bundle has 47 entries and is 2.1 MB.
- `test -f dist/index.html && test -f dist/metadata.json`: passed.
- `npm audit --audit-level=critical`: failed with 55 vulnerabilities, including 3 critical.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo-local bridge self-test command is documented.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent; no secret values were read or printed.
- Shadow deploy attempt: blocked because the `cynik` CLI is unavailable.
- Static shadow smoke with `python3 -m http.server 18769 --directory dist`: `GET /` returned 200 and `GET /health` returned 404.
- Product-specific systemd inventory: no `productivity-game`, `productivity-app`, or `productivity` service unit was found, so no service was restarted.
- Rollback target check from `.jarvis/deploy_contract.json`: confirmed `rollback.target=previous_release`, rollback mechanism `re-promote previous successful artifact or revert the release PR`, and `environment.env_file_source=default process env only`.
- PR delivery check with `gh pr view 1`: draft PR #1 remains open from `harden/release-readiness-node-0255b3ca01be` to `main`; current hosted checks reported success for `Web build and release bundle`, `Advisory regression probes`, `GitGuardian Security Checks`, and `Vercel Preview Comments`. Vercel preview remains outside the contracted `cynik` deploy target.

Node `node-29a3ff39c370` evidence refreshed on 2026-05-27:

- `git status --short --branch` before editing: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with no dirty paths.
- Read-only inventory confirmed existing operating artifacts: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/*`, `.codex/rules/*`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, `.jarvis/production_grade_profile.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/deployment/deploy-and-rollback.md`, `docs/product/prfaq-template.md`, `docs/product/critical-user-journeys.md`, and this release-readiness report.
- Hardening delta: `.codex/hooks/preflight.sh` and `.codex/scripts/repo_operating_system_report.js` now require `env_file_source` to be present in `.codex/config.json`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, and `.jarvis/production_grade_profile.json`, not only aligned when present.
- `git diff --check`: passed.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- Python syntax gate with `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `bash .codex/hooks/preflight.sh`: passed; it validates required operating artifacts plus `env_file_source` presence and consistency across workspace config, deploy contract, verification contract, and production profile. During the uncommitted edit phase it warned that the working tree had 2 dirty paths, which were the intended script edits.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed; warnings were the missing test script and the intended temporary dirty paths.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported all 14 required operating artifacts present, `env_file_source: default process env only` for workspace config, deploy contract, verification contract, and production profile; upstream tracking on `origin/harden/release-readiness-node-0255b3ca01be`; and maturity `self_checking_baseline (45%) -> self_improving`.
- `npm ci --no-audit --fund=false`: passed on local Node v18.19.1/npm 9.2.0 with the known `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`; CI remains configured for Node 20.
- `npm run lint`: passed with 0 errors and the existing 23 warnings.
- `npm run typecheck`: passed.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist && tar -tzf release-bundle-web.tgz | wc -l && ls -lh release-bundle-web.tgz`: passed; bundle has 47 entries and is 2.1 MB.
- `test -f dist/index.html && test -f dist/metadata.json`: passed.
- `npm test`: failed because `package.json` has no `test` script.
- `npm audit --audit-level=critical`: failed with 55 vulnerabilities, including 3 critical.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo-local bridge self-test command is documented.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent; no secret values were read or printed.
- Shadow deploy attempt: blocked because the `cynik` CLI and `CYNIK_DEPLOY_TOKEN` are unavailable.
- Static shadow smoke with `python3 -m http.server 18768 --directory dist`: `GET /` returned 200 and `GET /health` returned 404.
- Product-specific systemd inventory: no `productivity-game`, `productivity-app`, or `productivity` service unit was found, so no service was restarted.
- Rollback target check from `.jarvis/deploy_contract.json`: confirmed `rollback.target=previous_release`, rollback mechanism `re-promote previous successful artifact or revert the release PR`, and `environment.env_file_source=default process env only`.

Node `node-8e43f09a7505` evidence refreshed on 2026-05-26:

- `git status --short --branch` before editing: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with no dirty paths.
- Read-only inventory confirmed existing operating artifacts: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/*`, `.codex/rules/*`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, `.jarvis/production_grade_profile.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/product/prfaq-template.md`, `docs/product/critical-user-journeys.md`, and this release-readiness report.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed; the only warning remains the missing test script.
- `bash .codex/hooks/preflight.sh`: passed; it validates `env_file_source` consistency across workspace config, deploy contract, verification contract, and production profile.
- `env_file_source` warning status: resolved for repo-local contracts; remaining deploy risk is runtime-side configuration and credentialed smoke, not missing contract documentation.
- `git diff --check`: passed.
- Python syntax gate with `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `npm ci --no-audit --fund=false`: passed on local Node v18.19.1/npm 9.2.0 with the existing `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`; CI remains configured for Node 20.
- `npm run lint`: passed with 0 errors and the existing 23 warnings.
- `npm run typecheck`: passed.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist && tar -tzf release-bundle-web.tgz | wc -l && ls -lh release-bundle-web.tgz`: passed; bundle has 47 entries and is 2.1 MB.
- `test -f dist/index.html && test -f dist/metadata.json`: passed.
- `npm test`: failed because `package.json` has no `test` script.
- `npm audit --audit-level=critical`: failed with 55 vulnerabilities, including 3 critical.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo-local bridge self-test command is documented.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent; no secret values were read or printed.
- Shadow deploy attempt: blocked because the `cynik` CLI and/or `CYNIK_DEPLOY_TOKEN` are unavailable.
- Static shadow smoke with `python3 -m http.server 18767 --directory dist`: `GET /` returned 200 and `GET /health` returned 404.
- Product-specific systemd inventory: no `productivity-game` or `productivity-app` service unit was found, so no service was restarted.
- Rollback target check from `.jarvis/deploy_contract.json`: confirmed `rollback.target=previous_release` and mechanism `re-promote previous successful artifact or revert the release PR`.

Node `node-88a2eddb09d0` evidence refreshed on 2026-05-25:

- `git status --short --branch` before editing: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with no dirty paths.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- `git diff --check`: passed.
- `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `bash .codex/hooks/preflight.sh`: passed; it now validates `env_file_source` consistency across workspace config, deploy contract, verification contract, and production profile.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported `env_file_source: default process env only` for both workspace config and deploy contract.
- `npm run lint`: passed with 0 errors and the existing 23 warnings.
- `npm run typecheck`: passed.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist && tar -tzf release-bundle-web.tgz | wc -l && ls -lh release-bundle-web.tgz`: passed; bundle has 47 entries and is 2.1 MB.
- `npm test`: failed because `package.json` has no `test` script.
- `npm audit --audit-level=critical`: failed with 55 vulnerabilities, including 3 critical.
- `test -f dist/index.html && test -f dist/metadata.json`: passed.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo-local bridge self-test command is documented.
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent; no secret values were read or printed.
- Shadow deploy attempt: blocked because the `cynik` CLI and/or `CYNIK_DEPLOY_TOKEN` are unavailable.
- Static shadow smoke with `python3 -m http.server 18766 --directory dist`: `GET /` returned 200 and `GET /health` returned 404.
- Product-specific systemd inventory: no `productivity-game` or `productivity-app` service unit was found, so no service was restarted.
- Rollback target check from `.jarvis/deploy_contract.json`: confirmed `rollback.target=previous_release` and mechanism `re-promote previous successful artifact or revert the release PR`.

Previous branch and PR evidence from 2026-05-24:

- `git ls-remote --tags https://github.com/actions/checkout.git refs/tags/v6`: confirmed `v6` exists.
- `git ls-remote --tags https://github.com/actions/setup-node.git refs/tags/v6`: confirmed `v6` exists.
- `git ls-remote --tags https://github.com/actions/upload-artifact.git refs/tags/v7`: confirmed `v7` exists.
- `docs/ops/wip-quarantine-node-075359a7d791.md`: present as a non-destructive evidence bundle for the prior retry's pre-edit dirty tree.
- `docs/ops/wip-quarantine-node-19a00efabc63.md`: added as a non-destructive evidence bundle for this retry's pre-edit dirty tree.
- `git diff --check`: passed.
- `npm ci --no-audit --fund=false`: passed; local Node 18 reported one `EBADENGINE` warning for `eslint-visitor-keys@5.0.1`, while CI is configured for Node 20.
- `bash -n .codex/hooks/preflight.sh && bash .codex/hooks/preflight.sh`: passed, including required profile, agile work item, and deploy contract field validation.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed; after branch publication the only remaining warning is the missing test script.
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
- Deploy tooling check for `cynik`, `operatorctl`, `firebase`, and `eas`: all missing in this environment; `gh` is present and was used only for branch/PR delivery.
- Deploy credential marker check for `CYNIK_DEPLOY_TOKEN`, `FIREBASE_TOKEN`, and `EXPO_TOKEN`: absent.
- Bridge self-test discovery: `bridge -V` identified `/usr/sbin/bridge` as Linux bridge utility 6.1.0; no repo bridge self-test command is documented.
- Product-specific systemd inventory: no `productivity-game` or `productivity-app` service unit was found, so no service was restarted.
- `git commit -m "chore: harden release readiness gates"`: created commit `a25aeea54b9a1bff72afe0932d79655a7f18ad74`.
- `git push -u origin harden/release-readiness-node-0255b3ca01be`: passed and configured upstream tracking.
- `gh pr create --draft --base main --head harden/release-readiness-node-0255b3ca01be --title "Harden release readiness baseline" --body-file docs/ops/release-readiness-report.md`: opened draft PR #1 at https://github.com/5h4d0wn1k/productivity_game/pull/1.
- `gh run watch 26349062007 --exit-status`: passed. Hosted CI run 26349062007 completed successfully with `Web build and release bundle` and `Advisory regression probes` jobs green.
- `gh pr view 1 --json ...`: showed GitGuardian Security Checks, Vercel status, and Vercel Preview Comments green; the Vercel preview status is not treated as the contracted `cynik` deploy target.
- `git rev-parse --abbrev-ref --symbolic-full-name @{u}`: returned `origin/harden/release-readiness-node-0255b3ca01be`.
- `git status --short --branch`: clean after commit and push.
- Remote delivery: draft PR #1 is open for review and hosted checks passed.
- `git diff --numstat -- package-lock.json yarn.lock package.json`: showed package/lock churn from deterministic lint setup, including a tracked `yarn.lock` diff that needs reviewer attention.
- Repo operating-system report: `.codex/scripts/repo_operating_system_report.js` exists and passes locally; CI wiring remains a follow-up.
- Rollback target check from `.jarvis/deploy_contract.json` and `.jarvis/production_grade_profile.json`: confirmed `previous_release`.

Blocked or partial verification:

- Automated test suite: blocked by missing `test` script.
- Bridge self-test: blocked because no repo-local bridge self-test exists; the available `bridge` command is the OS network utility.
- Shadow deploy attempt: blocked by missing deploy CLI and deploy credentials for the contracted `cynik` target. A Vercel preview status succeeded automatically on the PR, but it was not used as deployment proof for the documented deploy contract.
- Shadow smoke: static web shell smoke passed for `/`; canonical `/health` returned 404 locally, and authenticated Firebase/Google journeys remain blocked until the target runtime and credentials are configured.
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
