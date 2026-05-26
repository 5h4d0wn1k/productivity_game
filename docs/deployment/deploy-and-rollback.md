# Deploy And Rollback Runbook

This runbook is advisory until a concrete deployment integration is wired into CI.

## Current deploy contract

- Runtime target: `cynik`
- Health check: `/health`
- Rollback target: `previous_release`
- Environment source: `default process env only`
- Workspace environment source: `.codex/config.json` -> `environment.env_file_source`
- Deploy contract environment source: `.jarvis/deploy_contract.json` -> `environment.env_file_source`
- Contract consistency gate: `bash .codex/hooks/preflight.sh` and `node .codex/scripts/repo_operating_system_report.js --check` validate that `env_file_source` is present and aligned across workspace, deploy, verification, and production-profile contracts.
- Build command: `npm run build:web`
- Web artifact: `dist`
- Reviewable release workflow: `.github/workflows/release.yml`
- Live deploy automation: not configured in this repository

## Release risk classification

- Docs, `.codex`, `.jarvis`, and workflow-only changes: low runtime risk, medium release-process risk.
- App code changes: medium user-visible risk.
- Auth, Firebase, Google Calendar, environment, dependency, or deployment target changes: high release risk.

## Pre-release checklist

1. Work on a branch and open a PR.
2. Confirm required CI gates pass: install, lint, typecheck, and web build.
3. For release candidates, run `.github/workflows/release.yml` or create `release-bundle-web.tgz` from the reviewed commit.
4. Review advisory dependency audit output and decide whether findings block the release.
5. Confirm no secrets or environment values were printed or committed.
6. For runtime changes, attach release artifact evidence and the intended rollback target.

## Shadow or staging deploy

Run only when credentials and a target environment are intentionally available.

1. Deploy the `dist` artifact to a staging or shadow target.
2. Check `/health`.
3. Run smoke checks:
   - sign in with a staging Firebase user;
   - create and complete a task;
   - create a habit;
   - create a calendar event.
4. Capture target URL, commit SHA, build artifact, smoke timestamp, and failures.

## Abort rules

Abort or roll back if any of these occur:

- `/health` fails or is unavailable.
- Auth fails for a known-good staging user.
- Task creation or completion fails.
- Firebase writes produce inconsistent user-visible state.
- Error rate or console errors exceed the release owner's tolerance.
- The deployed artifact cannot be tied back to the reviewed commit.

## Rollback

### Guidance-only changes

Revert the PR that changed docs, `.codex`, `.jarvis`, AGENTS.md, or workflow files.

### Runtime changes

1. Stop promotion.
2. Redeploy `previous_release` or revert the merge commit.
3. Check `/health`.
4. Rerun the auth and first-task smoke check.
5. Record the root cause and update CI, tests, or this runbook if the incident exposed a reusable gap.

## Remaining gaps

- No automated test suite is present.
- No credentialed staging or shadow smoke target is configured in this repository.
- Dependency audit has known findings that need separate triage before audit can become a blocking gate.
