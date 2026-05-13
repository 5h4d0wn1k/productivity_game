# Critical User Journeys

Status: baseline template
Owner: TBD
Last updated: 2026-05-13

## Journey Inventory

1. Create an account or sign in.
2. Create a task or habit that represents an intended behavior.
3. Complete work and receive progress feedback through points, stats, or streaks.
4. View calendar context and connect productivity work to scheduled time.
5. Compare progress through profile and leaderboard views.

## Primary Journey: Turn An Intention Into Progress

User-visible steps:

1. User signs in or creates an account.
2. User opens the task or habit surface.
3. User creates a task or habit with enough detail to act on it later.
4. User returns and marks the work complete.
5. App updates points, completion counts, streaks, character stats, or leaderboard position.
6. User can see that progress persisted after refresh/reopen.

Completion condition:

The user can create a meaningful task or habit, complete it, and see persisted progress feedback without manual recovery.

## Failure-Sensitive Points

- Auth provider returns an error or missing profile record.
- Firebase public environment variables are absent or mismatched.
- Realtime Database records do not match UI TypeScript assumptions.
- Calendar permission or Google sign-in scope fails.
- Completion writes partially succeed across Firestore and Realtime Database.
- Leaderboard or profile data becomes stale after completion.

## Metrics And SLO Candidates

- Activation: percentage of signed-up users who create and complete one task or habit within 24 hours.
- Retention: percentage of activated users who return and complete work on day 2 and day 7.
- Reliability: successful task or habit completion writes divided by attempted completions.
- Latency: p95 time from completion tap to visible progress update under 1 second for already-loaded views.
- Data correctness: zero known cases where completed work is lost or double-counted.

## Rollout And Fallback Considerations

- Keep auth and local navigation smoke tests separate from authenticated Firebase write smoke.
- Release task/habit changes behind the smallest practical surface area and verify persistence before promoting.
- If leaderboard or calendar integrations regress, preserve core task/habit completion as the fallback journey.
- For any data-shape migration, define read compatibility and rollback before writing new records.
