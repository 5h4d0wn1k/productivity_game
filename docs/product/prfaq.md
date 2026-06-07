# Productivity Game PRFAQ

Status: working product brief for future planning. This is not a launch claim.

## Internal Press Release Draft

Productivity Game helps people turn everyday tasks, habits, and calendar work
into visible character progress. Instead of managing work in a flat checklist,
users sign in, create tasks or habits, complete them, earn points, and see their
rank, character stats, and leaderboard position improve over time.

The first version should prove that gamified feedback increases repeat task
completion without making planning slower than a simple to-do list.

## Customer Problem

Target user: individuals who want lightweight structure and motivation for
personal productivity.

Painful job to be done: keep track of tasks and habits, decide what to do next,
and feel enough progress to return tomorrow.

Why now: the app already has auth, Firebase-backed task/profile data, habits,
calendar hooks, rank, and leaderboard surfaces. Future work needs a clearer
product contract so engineering effort is tied to user-visible outcomes.

## Critical User Journey

The first journey to win is:

1. Sign in.
2. Create a task with a clear reward.
3. See it on the dashboard or task list.
4. Complete it.
5. See progress reflected in points, stats, rank, or challenge progress.

## Business Outcome

Primary metric: weekly active users who complete at least three tasks.

Secondary metrics:

- Task creation success rate.
- Task completion rate.
- Day-7 retained users.
- Calendar-connected users who create or complete a scheduled item.

Likely packaging direction remains open. Do not design monetization until the
activation and retention loops are measurable.

## V1 Essentials

- Reliable email and Google sign-in.
- Task creation, listing, filtering, and completion.
- Clear points and progress feedback after completion.
- Basic profile/rank display.
- Firebase read/write errors surfaced without trapping users in loading states.
- Observability for auth success, task creation, task completion, and dashboard
  load outcomes.

## Non-Goals For Immediate Hardening

- New game economy.
- Paid plans.
- Social graph expansion.
- Major visual redesign.
- Native app store release automation.

## FAQ

### What makes this different from a normal to-do app?

The value is not the checklist alone. The app connects completed work to visible
progress loops such as points, stats, rank, and challenges.

### What must be true before calling the app production-ready?

CI must pass, a real automated test suite must cover the main user journeys, a
deploy target and rollback path must be verified, and the `/health` contract
must be implemented by the app or hosting layer.

### What is the biggest product risk?

The game layer may add friction without improving retention. Measure whether
users complete more tasks and return more often before expanding game systems.

### What is the biggest technical risk?

The app depends on Firebase and Google Calendar integrations. Failures in auth,
database reads/writes, or public environment configuration can break core user
journeys.
