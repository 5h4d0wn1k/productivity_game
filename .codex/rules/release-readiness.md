# Release Readiness Rules

1. Prefer inspect, validate, act, verify, report.
2. Keep release hardening additive unless the task explicitly approves behavior change.
3. Use branch-to-PR delivery for workflow, dependency, app, deploy, and verification changes.
4. Treat `npm ci --no-audit --fund=false`, `npm run lint`, `npm run typecheck`, `npm run build:web`, and `tar -czf release-bundle-web.tgz dist` as the current blocking PR/release gates.
5. Treat tests, dependency audit, healthcheck smoke, and authenticated journey smoke as advisory until their documented blockers are resolved.
6. Record rollback notes for every release-impacting change.
7. Do not claim a deploy, smoke, restart, or rollback was validated without command output or service evidence.
8. Update `.jarvis/verification_contract.json` when a gate is promoted, retired, or materially changes.
9. Keep `.github/workflows/release.yml` as a bundle-producing workflow only until deploy credentials, target health checks, and rollback automation are reviewed.
10. Use `node .codex/scripts/repo_operating_system_report.js` to refresh repo-local operating-system evidence before major handoffs.
