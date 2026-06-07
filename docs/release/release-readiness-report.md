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

- Typecheck is still advisory. The clean branch baseline has known TypeScript
  errors in `app/(tabs)/calendar.tsx` and `app/(tabs)/habitCreator.tsx`;
  current local app-file edits outside this DevOps scope must be reviewed in a
  separate lane before promoting typecheck to a required gate.
- No real automated test suite is configured in `package.json`.
- Node 22.13.0 / npm 10.9.2 `npm audit` reported 56 dependency
  vulnerabilities: 4 low, 29 moderate, 20 high, and 3 critical. No automated
  dependency fix was applied in this pass.
- No shadow deployment target URL, deploy command, or credentials are documented.
- The deploy contract declares `/health`, but the repo does not implement a
  route for it. The hosting layer must provide it or the app must add it later.
- Branch protection and required GitHub checks cannot be confirmed from local
  repository state.

Warnings:

- Package-manager policy is now explicit: npm `10.9.2` with
  `package-lock.json` as the only committed lockfile. CI fails if
  `yarn.lock` or `yarn copy.lock` is reintroduced.
- The repo-local `npm run verify` hook uses `.npm` as a local cache to keep
  install evidence scoped to the workspace, and it passed in advisory mode.
- `clean` now uses `npm ci` and no longer deletes a tracked lockfile.
- Firebase and Google public configuration are required at build/runtime and
  must be supplied through process environment or platform configuration.
- Local Node 22.13.0 verification uses npm 10.9.2 and `npm ci` completed
  without tar ENOENT failures. Local Node 18.19.1 remains below the CI target
  and is not authoritative for release evidence.
- ESLint passes but reports 23 warnings, mostly unused imports and React hook
  dependency warnings.
- A PR CI run annotated that Node.js 20 JavaScript actions are being
  deprecated on GitHub Actions runners. The workflow now uses Node 24-capable
  action majors for checkout, Node setup, and artifact upload.

## Hardening Added

- GitHub Actions CI for deterministic install, lint, advisory typecheck,
  optional real tests, web export, artifact upload, and a release-readiness
  summary.
- Node 24-capable GitHub Actions majors for checkout, Node setup, and artifact
  upload.
- Explicit npm `packageManager` pin, npm-based `clean` script, and CI
  package-manager policy check.
- Removal of stale Yarn lockfiles so `package-lock.json` is the sole lockfile
  of record.
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
npm_config_cache=.npm npx -y -p node@22.13.0 -p npm@10.9.2 sh -lc 'node --version && npm --version && which node && which npm'
npm_config_cache=.npm npx -y -p node@22.13.0 -p npm@10.9.2 npm ci
npm_config_cache=.npm npx -y -p node@22.13.0 -p npm@10.9.2 node - <<'NODE'
const fs = require('fs');
const pkg = require('./package.json');
const expectedPackageManager = 'npm@10.9.2';
const staleLockfiles = ['yarn.lock', 'yarn copy.lock'].filter((file) => fs.existsSync(file));
if (pkg.packageManager !== expectedPackageManager) throw new Error(`package.json packageManager must be ${expectedPackageManager}`);
if (!fs.existsSync('package-lock.json')) throw new Error('package-lock.json is required as the lockfile of record');
if (staleLockfiles.length > 0) throw new Error(`Remove non-canonical Yarn lockfiles: ${staleLockfiles.join(', ')}`);
console.log('package_manager_policy=pass');
NODE
npm_config_cache=.npm npx -y -p node@22.13.0 -p npm@10.9.2 npm run lint
npm_config_cache=.npm npx -y -p node@22.13.0 -p npm@10.9.2 npm run build:web
npm_config_cache=.npm npx -y -p node@22.13.0 -p npm@10.9.2 npm run verify
npm_config_cache=.npm npx -y -p node@22.13.0 -p npm@10.9.2 sh -lc 'npm audit --audit-level=low --json > /tmp/productivity-game-npm-audit-node22.json; node -e "const fs=require(\"fs\"); const j=JSON.parse(fs.readFileSync(\"/tmp/productivity-game-npm-audit-node22.json\",\"utf8\")); console.log(JSON.stringify({vulnerabilities:j.metadata.vulnerabilities, dependencies:j.metadata.dependencies}, null, 2));"'
find dist -maxdepth 3 -type f | sort | sed -n '1,80p' && du -sh dist
find . -path ./node_modules -prune -o -path ./.git -prune -o -name '*.py' -print0 | xargs -0 -r python3 -m py_compile
if node -e "process.exit(require('./package.json').scripts?.test ? 0 : 1)"; then echo test_script=present; else echo test_script=missing; fi
test -n "${SHADOW_BASE_URL:-}" && echo shadow_url_configured || echo shadow_url_missing
node -e "const c=require('./.jarvis/deploy_contract.json'); console.log('runtime_target='+c.runtime_target); console.log('healthcheck='+c.healthcheck.path); console.log('rollback='+c.rollback.target); console.log('service_restart_validation=not_applicable_client_static_artifact');"
mkdir -p release-bundles; tar --sort=name --mtime='UTC 2026-06-07' --owner=0 --group=0 --numeric-owner -cf - dist | gzip -n > release-bundles/productivity-game-web-20260607-release-readiness.tgz; sha256sum release-bundles/productivity-game-web-20260607-release-readiness.tgz
gh pr view --json number,url,state,headRefName,baseRefName,statusCheckRollup
gh pr checks 2 --watch --interval 10
```

Outcomes:

- Temporary local runtime was Node `v22.13.0` with npm `10.9.2`.
- Package-manager policy check passed: `packageManager` is `npm@10.9.2`,
  `package-lock.json` exists, and `yarn.lock` / `yarn copy.lock` are absent.
- Node 22.13.0 `npm ci` passed and did not produce tar ENOENT failures; npm
  audited 1352 installed packages during the clean install.
- Node 22.13.0 / npm 10.9.2 `npm audit --audit-level=low --json` reported 56
  vulnerabilities: 4 low, 29 moderate, 20 high, and 3 critical.
- `npm run lint` passed with 23 warnings and 0 errors under Node 22.13.0.
- `npm run build:web` passed under Node 22.13.0 and exported `dist`; local
  `dist` size was 6.5M.
- `npm run verify` passed as an advisory gate under Node 22.13.0: required
  install, lint, and web export passed; no test script was configured.
- The `npm run verify` typecheck substep ran against a dirty local worktree
  that includes app-file edits outside this node's scope, so it is not used as
  clean-branch promotion evidence.
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
