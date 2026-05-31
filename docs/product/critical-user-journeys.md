# Critical User Journeys

Status: template
Owner: TBD
Last updated: 2026-05-24

Use this file to keep product, engineering, release, and smoke tests aligned.

## Journey inventory

1. New user signs up or signs in and reaches the authenticated dashboard.
2. Authenticated user creates a task.
3. Authenticated user completes a task and sees progress reflected.
4. Authenticated user creates a habit and sees it listed with frequency and streak state.
5. Authenticated user creates a calendar event and sees it on the selected day.
6. Authenticated user views rank, points, character stats, and leaderboard state.

## Primary journey: complete first task

### User-visible steps

1. User opens the app.
2. User signs in with email/password or Google.
3. User lands on the dashboard.
4. User opens Tasks.
5. User creates a task with title, optional description, time, points, and due date.
6. User marks the task complete.
7. User returns to the dashboard and sees progress reflected through task state, points, rank, or stats.

### Completion condition

The user can tell that the completed task was saved and that their progress changed.

### Failure-sensitive points

- Firebase auth session is missing, stale, or not hydrated into `AuthContext`.
- Firebase environment variables are missing or point to the wrong project.
- Firestore and Realtime Database writes diverge.
- Task date filtering hides the task unexpectedly.
- Points, completed task count, rank, or character stats do not update consistently.
- UI shows success before persistence succeeds.

### Metrics and SLO candidates

- Activation: new users who complete one task in the first session.
- Task creation success rate: target 99% for authenticated users in healthy dependency conditions.
- Task completion success rate: target 99% for authenticated users in healthy dependency conditions.
- Dashboard load time after auth: target p95 under 2 seconds on broadband for web.
- Error budget signal: auth, task create, task update, and dashboard load errors.

### Smoke checks

- Sign in with a staging Firebase user.
- Create a uniquely named task.
- Complete the task.
- Confirm the task is no longer shown as active and progress state changed.
- Confirm no unhandled errors appear in console logs.

## Secondary journeys

### Create a habit

- Create a daily, weekly, or monthly habit.
- Confirm the habit appears in the list with frequency and streak state.
- Failure modes: unauthenticated user, write failure, stale list, incomplete complete-habit implementation.

### Create a calendar event

- Select a date.
- Create an event with title, start, and end.
- Confirm the event appears on the selected day.
- Failure modes: missing title, invalid date conversion, Firestore index/query failure, Google Calendar scope confusion.

### View leaderboard and rank

- Load profile, rank, points, stats, and leaderboard.
- Confirm empty states are clear when data is missing.
- Failure modes: Firestore/Realtime Database divergence, rank defaults masking data failure, slow queries.

## Rollout and fallback considerations

- Release UI and docs changes through PR checks before deployment.
- Use a staging or shadow Firebase project for credentialed smoke checks when available.
- If task completion, auth, or persistence regress after release, roll back to the previous known-good release and rerun the primary journey smoke check before promotion.
