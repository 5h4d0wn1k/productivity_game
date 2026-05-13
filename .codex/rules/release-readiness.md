# Release Readiness Rules

1. Prefer inspect, validate, act, verify, report.
2. Keep release hardening additive unless the task explicitly approves behavior change.
3. Use branch-to-PR delivery for workflow, dependency, app, deploy, and verification changes.
4. Treat `npm ci --no-audit --fund=false` and `npm run build:web` as the current blocking gates.
5. Treat typecheck, lint, tests, healthcheck smoke, and authenticated journey smoke as advisory until their documented blockers are resolved.
6. Record rollback notes for every release-impacting change.
7. Do not claim a deploy, smoke, restart, or rollback was validated without command output or service evidence.
8. Update `.jarvis/verification_contract.json` when a gate is promoted, retired, or materially changes.
