# Scope And Evidence Rule

AI-assisted work must be bounded by the user's request and backed by observed repository evidence.

## Before Editing

- Inspect the real repository state rather than relying on memory.
- Identify the affected surface: app screens, services, Firebase config, CI, deploy policy, docs, `.jarvis`, or `.codex`.
- Name the success condition and the smallest safe verification plan.
- Ask before expanding beyond the user's approved mutable scope.

## During Editing

- Prefer local conventions and existing scripts.
- Avoid broad refactors when a targeted hardening change satisfies the request.
- Keep generated output out of source-of-truth tests and audits.
- Document meaningful operating-policy changes in the same PR.

## Handoff

- Summarize changed files, operational impact, exact verification, residual risk, and rollback path.
- If a gate is blocked or credentials are missing, say so directly and identify the next safe check.
