# Preflight Checklist

Use before editing. This checklist is advisory and non-executable.

1. Confirm the current branch and working tree state with `git status --short --branch`.
2. Identify the user's explicit mutable scope and avoid writes outside it.
3. Inventory existing policy files before creating or replacing guidance.
4. Read affected package scripts, `.jarvis/agile_work_item.json`, readiness gates, and rollback docs before choosing verification.
5. Classify protected surfaces: auth, Firebase persistence, Google Calendar, task completion, habits, leaderboard, CI, deploy policy, and secrets.
6. Choose the narrowest safe validation command first, then broaden when risk remains.
7. Stop and ask before destructive git operations, dependency upgrades, deployment target changes, service restarts, or secret handling.
