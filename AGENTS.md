# Repository Operating Guidance

This file is the repo-local operating contract for AI and human contributors.
It applies to the entire repository unless a more specific `AGENTS.md` exists
in a subdirectory.

## Product And Stack

- Product: productivity game app with auth, tasks, habits, calendar, profile,
  leaderboard, and gamified character progress.
- Stack: Expo Router, React Native, TypeScript, Firebase Auth, Firestore,
  Firebase Realtime Database, Firebase Storage, and Google Calendar integration.
- Canonical install path: `npm ci` using `package-lock.json`.
- CI Node.js version: `22.13.0`. Expo SDK 52 requires at least Node
  `20.18.x`, and the current lint dependency graph warns on local Node 18.
- Web release artifact: `dist` from `npm run build:web`.

## Guardrails

- Preserve working behavior unless the task explicitly asks for behavior change.
- Work on a branch and use the PR path for normal code, config, and workflow
  changes. Do not directly push to `main` for routine work.
- Do not run destructive Git commands such as `git reset --hard`,
  `git clean -fd`, or `git checkout -- <path>` unless the user explicitly
  approves that action.
- Do not commit `.env` files or secrets. `EXPO_PUBLIC_*` values are shipped to
  clients and must not contain server-only secrets.
- Keep generated build outputs out of source control unless a release process
  explicitly requests an artifact.
- Avoid broad rewrites. Prefer the smallest safe diff with verification.

## Verification

Run the narrowest meaningful check first, then broaden before handoff.

Required local checks for normal changes:

```bash
npm ci
npm run lint
npm run typecheck
npm run build:web
```

Shortcut:

```bash
npm run verify
```

`npm run verify` is advisory-first and records known baseline gaps. Use
`npm run verify:strict` only when the TypeScript baseline is green and a real
test script exists.

The repo currently has no real automated test suite. Do not add a fake passing
test script. Treat missing tests as a release-readiness blocker for production
promotion and add focused tests around changed behavior when practical.

## CI And Release

- CI workflow: `.github/workflows/ci.yml`.
- Verification contract: `.jarvis/verification_contract.json`.
- Production-grade profile: `.jarvis/production_grade_profile.json`.
- Deploy contract: `.jarvis/deploy_contract.json`.
- Runtime target: `cynik`.
- Healthcheck contract: `/health`.
- Rollback target: previous successful release.

For production promotion, require CI success, a release bundle, rollback target
confirmation, and smoke evidence from the deployed target. Shadow deploy and
shadow smoke are blocked until the target URL and credentials are configured.

## AI Session Rules

- Inspect repository state before making claims about behavior.
- Prefer `rg` and repo-local scripts for discovery.
- Explain blast radius before editing files.
- Keep app source changes separate from governance/config changes when possible.
- Report verification commands exactly, including failures and blockers.
