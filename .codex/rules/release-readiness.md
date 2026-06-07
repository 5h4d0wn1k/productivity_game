# Release Readiness Rules

- Normal delivery path is branch -> PR -> CI -> review -> merge.
- Current local gate for routine changes is `npm run verify`; it is advisory for
  the known TypeScript and missing-test baseline gaps.
- Strict production promotion uses `npm run verify:strict` after the baseline is
  remediated.
- CI must use `npm ci` and `package-lock.json` unless the package manager
  contract is intentionally changed.
- A production release requires a build artifact, rollback target confirmation,
  and post-deploy smoke evidence.
- The current deploy contract declares `/health`; a release cannot be called
  fully production-ready until that path is implemented by the app or hosting
  layer and verified after deploy.
- Missing automated tests are an explicit blocker for production promotion, not
  a reason to add a placeholder passing test.
- Rollback for this client artifact is previous successful release. Data
  migrations require a separate migration safety plan before implementation.
