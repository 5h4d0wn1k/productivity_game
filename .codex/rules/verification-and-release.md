# Verification And Release Rule

Verification should match the risk and affected surface. Start narrow, then broaden until the remaining risk is explicit.

## Default Ladder

- Docs, guidance, or metadata only:
  - `npm run typecheck`
  - `npm run build:web`
- App code, workflow, dependency, or release-sensitive changes:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build:web`
- Security advisory:
  - `npm audit --audit-level=critical`
- Credentialed smoke, when credentials and target environment are intentionally available:
  - Firebase sign-in.
  - Create and complete a task.
  - Create a habit.
  - Create a calendar event.
  - Check `/health` on the deployed target.

## Release Notes

- Do not claim production readiness from green checks alone. State which risks the checks cover.
- Rollback for runtime releases follows `docs/deployment/deploy-and-rollback.md`.
- Rollback for guidance-only changes is a PR revert of `AGENTS.md`, `.codex`, `.jarvis`, `.github/workflows`, and docs changes.
- `.github/workflows/release.yml` creates reviewable release artifacts only; live deploy evidence must come from an explicitly approved target workflow or runbook execution.
