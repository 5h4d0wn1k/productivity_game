# Non-Destructive Operations Rule

Default to inspection before mutation and treat destructive operations as approval-gated.

## Forbidden Without Explicit Human Request

- `git reset --hard`, force pushes, or history rewrites.
- Broad delete operations such as `rm -rf` outside a clearly understood generated directory.
- Secret reads, prints, rewrites, rotations, or commits.
- Deployment target changes, production deploys, service restarts, or credentialed smoke tests.
- Dependency upgrades that are not directly required by the approved task.

## Expected Safe Path

- Work on a branch.
- Keep diffs small and reversible.
- Use PR checks for code, config, workflow, and release-policy changes.
- Revert guidance-only changes by reverting the PR.
- For runtime releases, redeploy the previous known-good release before attempting deeper repair.
