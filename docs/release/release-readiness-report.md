# Release Readiness Report

Date: 2026-06-07

Workspace: `productivity-game`

Branch: `harden/release-readiness-os-node-445759234b7c`

## Scope

This pass hardens release readiness without changing runtime app behavior. The
change is limited to CI, repo operating contracts, AI guardrails, product
planning templates, release documentation, and deterministic lint tooling.

## Findings

Blockers:

- TypeScript baseline is not clean. `npm run typecheck` fails in
  `app/(tabs)/calendar.tsx` and `app/(tabs)/habitCreator.tsx`.
- No real automated test suite is configured in `package.json`.
- `npm audit` reported 75 dependency vulnerabilities: 3 low, 39 moderate, 30
  high, and 3 critical. No automated dependency fix was applied in this pass.
- No shadow deployment target URL, deploy command, or credentials are documented.
- The deploy contract declares `/health`, but the repo does not implement a
  route for it. The hosting layer must provide it or the app must add it later.
- Branch protection and required GitHub checks cannot be confirmed from local
  repository state.

Warnings:

- The repo has mixed lockfiles: `package-lock.json`, `yarn.lock`, and
  `yarn copy.lock`. CI now treats npm and `package-lock.json` as canonical.
- The repo-local `npm run verify` hook uses `.npm` as a local cache to keep
  install evidence scoped to the workspace, and it passed in advisory mode.
- `clean` still uses Yarn and deletes `yarn.lock`; that script should be
  revisited in a separate dependency-management cleanup.
- Firebase and Google public configuration are required at build/runtime and
  must be supplied through process environment or platform configuration.
- Local verification ran on Node 18.19.1 with npm engine warnings. CI is pinned
  to Node 22.13.0 to satisfy the current lint dependency graph while staying
  above Expo SDK 52's minimum Node 20.18.x requirement.
- ESLint passes but reports 23 warnings, mostly unused imports and React hook
  dependency warnings.

## Hardening Added

- GitHub Actions CI for deterministic install, lint, advisory typecheck,
  optional real tests, web export, artifact upload, and a release-readiness
  summary.
- Production-grade profile under `.jarvis/production_grade_profile.json`.
- Verification contract under `.jarvis/verification_contract.json` plus a root
  `verification_contract.json` scanner marker.
- Deploy contract under `.jarvis/deploy_contract.json`.
- Repo-local AI operating guidance through `AGENTS.md` and `.codex/`.
- Product brief and critical user journey templates under `docs/product/`.
- Deterministic ESLint config and devDependencies.

## Verification Evidence

Observed local verification:

```bash
npm ci
npm ci --cache .npm --prefer-offline
npm run lint
npm run typecheck
npm run build:web
npm run verify
find . -path ./node_modules -prune -o -path ./.git -prune -o -name '*.py' -print0 | xargs -0 -r python3 -m py_compile
if node -e "process.exit(require('./package.json').scripts?.test ? 0 : 1)"; then echo test_script=present; else echo test_script=missing; fi
test -n "${SHADOW_BASE_URL:-}" && echo shadow_url_configured || echo shadow_url_missing
node -e "const c=require('./.jarvis/deploy_contract.json'); console.log('runtime_target='+c.runtime_target); console.log('healthcheck='+c.healthcheck.path); console.log('rollback='+c.rollback.target); console.log('service_restart_validation=not_applicable_client_static_artifact');"
mkdir -p release-bundles; tar --sort=name --mtime='UTC 2026-06-07' --owner=0 --group=0 --numeric-owner -cf - dist | gzip -n > release-bundles/productivity-game-web-20260607-release-readiness.tgz; sha256sum release-bundles/productivity-game-web-20260607-release-readiness.tgz
gh pr view --json number,url,state,headRefName,baseRefName,statusCheckRollup
gh pr checks 2 --watch --interval 10
```

Outcomes:

- `npm ci` passed with local Node 18 engine warnings; `npm audit --json`
  reported dependency vulnerabilities.
- `npm ci --cache .npm --prefer-offline` passed with local Node 18 engine
  warnings.
- `npm run lint` passed with 23 warnings and 0 errors.
- `npm run typecheck` failed on the two known baseline errors listed above.
- `npm run build:web` passed and exported `dist`.
- `npm run verify` passed as an advisory gate: required install, lint, and web
  export passed; typecheck failed as an advisory known blocker; no test script
  was configured.
- Python syntax gate passed; no repo-owned Python files required compilation.
- Shadow deploy and shadow smoke were blocked because `SHADOW_BASE_URL`, deploy
  command, and credentials are not configured.
- Rollback target is declared as `previous_release`.
- PR #2 is open from `harden/release-readiness-os-node-445759234b7c` to `main`.
- PR checks passed after push: `Verify Expo app`, `GitGuardian Security Checks`,
  `Vercel`, and `Vercel Preview Comments`.
- Release bundle created:
  `release-bundles/productivity-game-web-20260607-release-readiness.tgz`.
- Release bundle SHA-256:
  `f9a53fbf4a3d3568ec204c13813730826fec20ab6e944d210cab6dd73f07371a`.

## Deploy Safety

Risk class for this change: medium. CI/docs/contracts are low runtime risk, and
GitHub CI passed on the PR branch. Production-promotion risk remains elevated
until the TypeScript baseline, missing test suite, dependency vulnerabilities,
healthcheck implementation, and shadow deploy path are resolved.

Rollout strategy:

1. Open PR from the hardening branch.
2. Require CI install, lint, build, and artifact upload to pass.
3. Treat typecheck and missing tests as advisory blockers until remediated.
4. Review generated contracts and docs.
5. Merge only after acknowledging the production-promotion blockers.

Abort conditions:

- Required CI install, lint, build, or artifact upload fails.
- Review finds a contract mismatch with the actual hosting platform.
- A future shadow deploy fails healthcheck or primary journey smoke checks.

## Rollback

This change is config/docs/workflow/lint-tooling only. Rollback is a normal Git
revert of the PR. No data migration, runtime service restart, or production
artifact promotion is required by this hardening pass.
