# Critical User Journeys

Status: initial journey map for release readiness and future regression tests.

## Journey Inventory

1. New or returning user signs in.
2. User creates a task and sees it in the task list.
3. User completes a task and receives progress feedback.
4. User creates or reviews a habit.
5. User views dashboard progress, rank, and character stats.
6. User connects calendar context and manages events.
7. User views leaderboard/profile status.

## Primary Journey: Create And Complete A Task

Completion condition from the user's point of view: a signed-in user can create
a task, find it in the correct task view, mark it complete, and see progress or
reward state update without reloading the app.

Steps:

1. User signs in through email or Google.
2. App loads authenticated tab navigation.
3. User opens Tasks.
4. User opens the new task form.
5. User enters title, optional description, time, due date, and points.
6. User submits the task.
7. App writes the task to Firebase.
8. Task appears in the active list.
9. User marks the task complete.
10. App persists completion and updates visible task state.
11. Dashboard/profile progress reflects the completed work.

## Failure-Sensitive Points

- Firebase public env variables are missing or wrong.
- Auth succeeds but user profile reads fail.
- Firestore write succeeds but local state or realtime listener does not update.
- Date handling puts a task in the wrong tab.
- Completion updates the task but not points, stats, rank, or challenge state.
- Offline or slow network states leave the user stuck without retry guidance.
- Google sign-in or calendar scopes fail on one platform but not another.

## Metrics And SLO Candidates

- Auth success rate: 99% for configured providers.
- Task creation success rate: 99% for authenticated users.
- Task completion write success rate: 99%.
- Dashboard data load p95: under 2 seconds after auth state is known.
- User-visible unrecovered error rate: under 1% for primary journey attempts.
- Day-7 retention for users who complete at least one task: track and improve
  before expanding game systems.

## Regression Test Candidates

- Auth wrapper routes unauthenticated users to sign-in surfaces.
- Task form validates required title and authenticated user state.
- Task creation maps fields into the Firebase payload consistently.
- Task completion toggles persisted state and local UI state.
- Dashboard handles empty tasks, missing profile data, and Firebase errors.

## Rollout And Fallback

- Keep task creation/completion changes behind small PRs with focused tests.
- If Firebase writes regress, roll back the app release to the previous artifact.
- If a third-party provider fails, preserve email sign-in and avoid blocking
  already-authenticated users from viewing local app surfaces.
