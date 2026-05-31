# Pre-Handoff Checklist

Use before reporting completion. This checklist is advisory and non-executable.

1. Run the verification commands named in `.jarvis/verification_contract.json` that match the changed surface.
2. Record exact commands, outcomes, and whether failures are new or pre-existing.
3. Confirm `git status --short` only contains intentional files.
4. Confirm rollback path:
   - guidance-only change: PR revert;
   - runtime change: redeploy previous known-good release and run smoke checks.
5. Identify any blocked smoke, deploy, service restart, or audit gates.
6. Update `docs/ops/release-readiness-report.md` when CI, deploy, rollback, or verification posture changes.
