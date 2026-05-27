# Release Readiness Report

Workspace: productivity-game
Date: 2026-05-27
Branch: harden/release-readiness-node-0255b3ca01be

## Snapshot

- Git hygiene: work moved off `main` to branch `harden/release-readiness-node-0255b3ca01be`, was committed, pushed with upstream tracking, and opened as draft PR #1: https://github.com/5h4d0wn1k/productivity_game/pull/1.
- Working tree: clean after committing and pushing the hardening diff. Prior node `node-075359a7d791` added `docs/ops/wip-quarantine-node-075359a7d791.md`, and retry node `node-19a00efabc63` added `docs/ops/wip-quarantine-node-19a00efabc63.md` as non-destructive evidence bundles.
- CI/CD: `.github/workflows/ci.yml` now runs deterministic npm install, lint, typecheck, web export, release bundle creation, artifact upload, advisory test detection, and advisory dependency audit.
- Verification contract: `.jarvis/verification_contract.json` records required, advisory, blocked, deploy, and rollback gates.
- Production profile: `.jarvis/production_grade_profile.json` records maturity target, runtime, delivery path, agile operating posture, deploy assumptions, product docs, and risk register; maturity is now tracked as a self-checking baseline at 45%.
- Agile work item contract: `.jarvis/agile_work_item.json` defines required work item fields, definition of ready, definition of done, verification expectations, and rollback expectations for PR-sized changes.
- Deploy safety: `.jarvis/deploy_contract.json` records runtime target, env source, artifact, health, rollout, abort, and rollback posture; `env_file_source` is now also documented in `.codex/config.json` and checked for consistency across operating contracts.
- Current env source warning: resolved in the repository artifacts. `env_file_source` is documented as `default process env only` in `.codex/config.json`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, and `.jarvis/production_grade_profile.json`; preflight and the repo operating-system report fail on missing or mismatched values.
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
8. This node opened a PR and hosted CI passed, but it did not deploy to the contracted `cynik` target, restart services, or run credentialed Firebase/Google smoke checks.

## Safe Hardening Changes

- Preserved the existing release bundle workflow shape and promoted lint/typecheck from advisory to blocking after fixing their local blockers.
- Added exact ESLint dev dependencies, `.eslintrc.js`, and `.eslintignore` so lint runs through npm without Expo attempting missing yarn setup.
- Added `npm run typecheck` and fixed two compile-time-only assertions in calendar and habit screens.
- Added advisory security audit to CI without making known dependency findings block unrelated hardening.
- Added deploy/rollback runbook under `docs/deployment`.
- Added `environment.env_file_source` to `.codex/config.json` and enforce matching values across `.codex/config.json`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, and `.jarvis/production_grade_profile.json` in preflight and the repo operating-system report.
- Added Markdown advisory hooks and durable `.codex/rules` for scope, evidence, non-destructive operations, verification, and release.
- Added the missing `agile` section to the production-grade profile and preflight validation for required profile sections.
- Added `.jarvis/agile_work_item.json` and wired it into AGENTS, preflight, PR review, and production profile guidance.
- Added `.codex/scripts/repo_operating_system_report.js` and wired it into preflight as a repo-local self-check for operating artifacts, JSON validity, workflow gates, package scripts, and git hygiene.
- Updated product journey guidance around auth, first task completion, habits, calendar events, and progress feedback.
- Added `docs/ops/wip-quarantine-node-075359a7d791.md` and `docs/ops/wip-quarantine-node-19a00efabc63.md` so existing dirty WIP remains visible before unrelated growth or PR packaging.

## Verification Evidence

Node `node-29a3ff39c370` evidence refreshed on 2026-05-27:

- `git status --short --branch` before editing: branch `harden/release-readiness-node-0255b3ca01be` tracking `origin/harden/release-readiness-node-0255b3ca01be` with no dirty paths.
- Read-only inventory confirmed existing operating artifacts: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/*`, `.codex/rules/*`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, `.jarvis/production_grade_profile.json`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `docs/deployment/deploy-and-rollback.md`, `docs/product/prfaq-template.md`, `docs/product/critical-user-journeys.md`, and this release-readiness report.
- `git diff --check`: passed.
- `node --check .codex/scripts/repo_operating_system_report.js`: passed.
- `bash -n .codex/hooks/preflight.sh`: passed.
- JSON parse check for `package.json`, `package-lock.json`, `.codex/config.json`, `.jarvis/production_grade_profile.json`, `.jarvis/verification_contract.json`, `.jarvis/agile_work_item.json`, and `.jarvis/deploy_contract.json`: passed.
- YAML parse check for `.github/workflows/ci.yml` and `.github/workflows/release.yml` using Node `js-yaml`: passed.
- Python syntax gate with `py_files=$(git ls-files '*.py'); if [ -n "$py_files" ]; then python3 -m py_compile $py_files; else echo 'python syntax gate: no python files'; fi`: passed as not applicable; no Python files are tracked.
- `bash .codex/hooks/preflight.sh`: passed; it validates required operating artifacts and `env_file_source` consistency across workspace config, deploy contract, verification contract, and production profile.
- `node .codex/scripts/repo_operating_system_report.js --check`: passed; the only warning remains the missing test script.
- `node .codex/scripts/repo_operating_system_report.js`: passed and reported all 14 required operating artifacts present, `env_file_source: default process env only` for both workspace config and deploy contract, clean git hygiene, upstream tracking, and maturity `self_checking_baseline (45%) -> self_improving`.
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
