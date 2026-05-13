# AGENTS.md

## Mission

This repo is an Expo Router productivity app with Firebase-backed auth, task, habit, calendar, profile, and leaderboard flows. Preserve working app behavior while improving release safety, verification evidence, and handoff quality.

## Operating Guardrails

- Work on a branch and use a PR for normal code, config, workflow, and release changes.
- Keep app-runtime changes separate from repo-operating-system hardening unless the task explicitly asks for both.
- Do not commit secrets, `.env*` files, service account files, or Firebase private keys.
- Treat `package-lock.json` as the canonical install lockfile for CI. The repo also currently tracks `yarn.lock` and `yarn copy.lock`; do not rewrite package management without an explicit migration plan.
- Avoid `npm run clean` unless the user explicitly requests it. It removes `node_modules`, `.expo`, and `yarn.lock`.
- Before claiming completion, report exact commands run and whether each passed, failed, or was blocked.

## Verification Contract

Start with `.jarvis/verification_contract.json`.

Required gates for PR/release-impacting changes:

```bash
npm ci --no-audit --fund=false
npm run build:web
```

Release bundle gate after a successful build:

```bash
tar -czf release-bundle-web.tgz dist
```

Advisory gates that should become blocking after their current blockers are fixed:

```bash
npx tsc --noEmit
npm run lint
npm test
```

Current known blockers:

- `npx tsc --noEmit` fails on existing calendar and habit data-shape casts.
- `npm run lint` is not deterministic because Expo CLI tries to install missing ESLint packages through `yarnpkg`.
- No `test` script exists yet.
- `/health` is the canonical deploy healthcheck, but local static export smoke currently verifies `/` until the deploy target maps or implements `/health`.

## Deployment And Rollback

The deploy contract lives at `.jarvis/deploy_contract.json`.

- Build artifact: `dist`
- Release bundle: `release-bundle-web.tgz`
- Runtime target: `cynik`
- Environment source: default process env only
- Rollback target: previous successful release

Do not mutate live services from an AI session unless the user explicitly authorizes that deploy operation and the rollback target has been confirmed.

## Product Planning

Before major feature work, update:

- `docs/product/prfaq-template.md`
- `docs/product/critical-user-journeys.md`

Feature work should name the target user, expected product outcome, first critical user journey, rollout/smoke evidence, and rollback or fallback path.
