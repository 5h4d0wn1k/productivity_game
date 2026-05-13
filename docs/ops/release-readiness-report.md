# Release Readiness Report

Workspace: productivity-game
Date: 2026-05-13
Branch: chore/release-readiness-baseline

## Snapshot

- Git hygiene: clean `main` at mission start, new PR-ready branch created for this work.
- CI/CD: no workflow existed at mission start; `.github/workflows/ci.yml` now defines a blocking web build and release bundle gate plus advisory regression probes.
- Verification contract: no repo-local contract existed at mission start; `.jarvis/verification_contract.json` now records required, advisory, and blocked gates.
- Production profile: `.jarvis/production_grade_profile.json` now makes the repo maturity, runtime, delivery path, deploy assumptions, and risk register explicit.
- Deploy safety: `.jarvis/deploy_contract.json` now records runtime target, env source, artifact, health, rollout, abort, and rollback posture.
- AI operating guidance: `AGENTS.md`, `.codex/config.json`, `.codex/hooks/preflight.sh`, and `.codex/rules/release-readiness.md` now provide repo-local guardrails.
- Product planning: PRFAQ/problem framing and critical user journey templates now exist under `docs/product`.

## Delivery Blockers

1. No real automated test suite is configured.
2. `npx tsc --noEmit` fails on existing CalendarEvent and Habit data-shape casts.
3. `npm run lint` is not deterministic because Expo CLI tries to install missing ESLint dependencies through `yarnpkg`, which is not present in the current environment.
4. The canonical `/health` deploy path is documented but not implemented or locally verified in the static web export.
5. Authenticated Firebase and Google Calendar journey smoke checks require credentials and target environment access.

## Safe Hardening Changes

- Added a GitHub Actions workflow with least-privilege `contents: read`, concurrency cancellation, npm lockfile install, web export build, release bundle creation, and artifact upload.
- Kept typecheck, lint, and test execution advisory so this baseline can surface current issues without pretending they already pass.
- Added explicit verification, production-grade, and deploy contracts under `.jarvis`.
- Added AI-session guardrails and a local preflight hook under `.codex`.
- Added product planning templates that require customer problem, critical user journey, metrics, scope, risks, smoke, and rollback thinking before major work.

## Verification Evidence

Baseline evidence observed before these artifacts were added:

- `npm ci --no-audit --prefer-offline`: passed.
- `npm run build:web`: passed and exported `dist`.
- `npx tsc --noEmit`: failed on existing calendar and habit data-shape errors.
- `npm run lint`: failed before linting because Expo attempted to install missing ESLint packages using `yarnpkg`, which is unavailable.

Post-change evidence:

- `node -e "JSON.parse(...)"`: passed for `.codex/config.json` and all `.jarvis/*.json` contracts.
- `bash -n .codex/hooks/preflight.sh && bash .codex/hooks/preflight.sh`: passed.
- `git diff --check`: passed.
- `python3` repo syntax probe: passed with `python files: 0`.
- `npx --no-install prettier --check ...`: passed for workflow and markdown artifacts.
- Workflow static content check: passed for required checkout, setup-node, upload-artifact, install, build, and bundle steps.
- `npm ci --no-audit --fund=false`: passed.
- `npm run build:web`: passed and exported `dist`.
- `tar -czf release-bundle-web.tgz dist`: passed, produced a 2.1 MB local release bundle.
- Shadow static smoke: local `python3 -m http.server` served `dist`; `GET /` returned 200; `GET /health` returned 404.
- `tar -tzf release-bundle-web.tgz`: passed with 47 bundle entries.

Blocked or partial verification:

- `npx --yes actionlint@latest`: blocked because npm could not determine an executable for that package name in this environment.
- `go version`: blocked because Go is not installed, so `go run github.com/rhysd/actionlint/...` was not available as a fallback.
- Service restart validation: not applicable in this repo-local baseline because no persistent service was deployed or restarted.

Source notes:

- GitHub Actions workflow location, permissions, and concurrency were checked against GitHub workflow syntax docs.
- `actions/checkout`, `actions/setup-node`, and `actions/upload-artifact` usage was checked against the current official action READMEs before choosing the major versions in CI.

## Deploy And Rollback Notes

Release risk class: config/docs/CI hardening only; no app runtime behavior changed.

Rollout strategy: branch, PR, CI evidence, then merge. Do not deploy from this node.

Rollback path: revert this branch/PR or remove the added repo-operating-system files. For an app release, re-promote the previous successful web artifact or revert the release PR.

Abort conditions for future deploys:

- CI cannot build the web export.
- Release bundle is missing or cannot be unpacked.
- Required public Firebase/Google environment variables are absent.
- Target runtime cannot serve `/` or the canonical `/health` once mapped.
- Critical user journey smoke checks fail.
