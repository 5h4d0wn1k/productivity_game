# Productivity Game Repo Instructions

These instructions override broader defaults for this repository.

## Product and operating posture

- Treat this repository as a production-intended Expo/React Native app for gamified productivity.
- Preserve existing auth, Firebase persistence, task, habit, calendar, profile, rank, and leaderboard behavior unless a request explicitly changes it.
- Prefer small, reviewable hardening changes over broad rewrites.
- Do not introduce production dependencies, rotate secrets, or change deployment targets without explicit approval.
- Treat `package-lock.json` as the canonical CI lockfile. `yarn.lock` and `yarn copy.lock` are still tracked; do not rewrite them without an explicit package-manager migration plan.

## Repo-local AI operating contract

- Load this file first for every AI-assisted session, then apply the advisory `.codex` and `.jarvis` guidance.
- Treat `.codex/config.json`, `.codex/rules/*.md`, `.codex/hooks/*.md`, `.jarvis/production_grade_profile.json`, `.jarvis/agile_work_item.json`, and `.jarvis/verification_contract.json` as repo-local operating guidance, not autonomous permission to change behavior.
- Treat `env_file_source` as `default process env only`; keep that value aligned across `.codex/config.json`, `.jarvis/deploy_contract.json`, `.jarvis/verification_contract.json`, and `.jarvis/production_grade_profile.json`. When workspace or deploy contracts include both top-level `env_file_source` and nested `environment.env_file_source`, both values must match.
- Keep `.codex/hooks` advisory or validation-oriented. Do not add auto-executing hooks without explicit approval.
- Start mutable work from read-only inventory: inspect branch state, existing policy files, package scripts, and affected docs/code before editing.
- Keep writes inside the user's explicit scope. If the requested fix requires files outside scope, stop and ask for scope expansion.
- Use branch -> PR -> checks as the default delivery path for code, config, workflow, or release-policy changes. Do not push directly to `main`.
- Never run destructive commands such as `git reset --hard`, force-pushes, broad deletes, secret rotation, deploys, or service restarts unless the user explicitly requests that exact operation.
- Do not read, print, rewrite, or commit secrets from `.env*`, Firebase, Google OAuth, Expo, or deployment configuration.

## Protected surfaces

- `app/(auth)`: login, signup, and auth routing.
- `app/contexts/AuthContext.tsx`: Firebase auth session state and profile hydration.
- `app/config/firebase.ts`: environment-variable based Firebase and Google OAuth configuration.
- `app/services`: Firebase, Realtime Database, and Google Calendar integration helpers.
- `app/(tabs)/tasks.tsx`: task creation, filtering, completion, and points flow.
- `app/(tabs)/habitCreator.tsx`: habit creation, frequency, and streak display.
- `app/(tabs)/calendar.tsx`: event creation, date selection, and Google Calendar sync boundary.
- `.github/workflows`: merge gates and release evidence.
- `.jarvis`, `.codex`, and `docs`: operating contracts, planning templates, release readiness, and rollback policy.

## Agile work item contract

- Use `.jarvis/agile_work_item.json` to define ready/done expectations for PR-sized product, app, CI, deploy, and operating-system changes.
- A work item is ready when the problem, critical journey, affected surfaces, acceptance criteria, verification plan, and rollback path are explicit.
- A work item is done when the scoped diff is implemented, required gates are run or blocked with evidence, release impact is documented, rollback remains available, and handoff notes name residual risk.
- For major product work, update or reference `docs/product/prfaq-template.md` and `docs/product/critical-user-journeys.md` before implementation.

## High-signal commands

- Install: `npm ci`
- Develop: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Web build: `npm run build:web`
- Release bundle: `tar -czf release-bundle-web.tgz dist`
- Repo operating-system report: `node .codex/scripts/repo_operating_system_report.js`
- Reviewable release workflow: `.github/workflows/release.yml`
- Dependency audit advisory: `npm audit --audit-level=critical`

## Verification policy

- Follow `.jarvis/verification_contract.json` before claiming release readiness.
- For docs or guidance-only changes, verify JSON/YAML/Markdown syntax where possible and run at least `npm run typecheck` and `npm run build:web` when app code or workflow confidence matters.
- For app behavior changes, run `npm run lint`, `npm run typecheck`, and `npm run build:web`; add or update focused tests when a test harness exists.
- For auth, Firebase, Google Calendar, deployment, workflow, or environment changes, treat the change as release-sensitive and document smoke coverage or why it is blocked.
- If credentials are unavailable, say which smoke checks were blocked and which local gates still passed.

## Release and rollback

- CI must stay deterministic: install with `npm ci`, cache npm dependencies, and publish the Expo web release bundle for review.
- `.github/workflows/release.yml` builds and uploads a release bundle only; it must not deploy live services without a reviewed deploy integration.
- Rollback for guidance-only changes is a PR revert of the changed files.
- Rollback for runtime changes is redeploying the previous known-good release, checking `/health`, and rerunning auth/task smoke checks when credentials permit.
- Keep release-readiness notes in `docs/ops/release-readiness-report.md` current when changing CI, deploy, rollback, or verification policy.
