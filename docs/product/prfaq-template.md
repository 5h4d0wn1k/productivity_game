# PRFAQ / Problem Framing Template

Status: template
Owner: TBD
Last updated: 2026-05-24

## Product Summary

Productivity Game helps people turn tasks and habits into a lightweight progression loop with points, character stats, calendar context, and social comparison.

Working hypothesis: the first useful v1 is not a broad game system; it is a dependable loop where a user signs in, captures intended work, completes it, and sees persisted progress feedback.

## Target User

- Primary user:
- Painful job to be done:
- Current workaround:
- Why now:

## Internal Press Release

Today we are launching:

For:

Who struggle with:

The product helps by:

The first proof point will be:

## FAQ

### What customer problem are we solving?

TBD. Start from the problem that people know what they need to do but lose momentum when tasks, habits, and calendar commitments are split across tools with weak feedback loops.

### What is the first critical user journey this must win?

TBD. The current candidate is: sign in, create a task, complete it, and see progress reflected in dashboard, points, rank, or character stats. Start from `docs/product/critical-user-journeys.md`.

### What metric proves this is working?

TBD. Prefer activation, retention, completed tasks per active user, habit streak continuation, or calendar-connected task completion.

### What is in v1?

- Authentication and profile creation:
- Task or habit creation:
- Completion and points:
- Calendar context:
- Leaderboard or progress feedback:

### What is explicitly out of scope?

- TBD.

### What are the main risks?

- Firebase auth or data permission errors:
- Low repeat use after first task:
- Calendar permissions friction:
- Point or leaderboard logic that users do not trust:
- Missing regression coverage for core flows:

### What evidence is required before build-out?

- Named target user and value proposition:
- First critical user journey with failure modes:
- Smoke test plan:
- Rollback or feature-disable path:
- Release verification gates from `.jarvis/verification_contract.json`:
