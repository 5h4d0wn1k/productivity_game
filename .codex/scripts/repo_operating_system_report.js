#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');

const checkOnly = process.argv.includes('--check');

const requiredFiles = [
  'AGENTS.md',
  '.codex/config.json',
  '.codex/hooks/preflight.sh',
  '.codex/rules/release-readiness.md',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml',
  '.jarvis/production_grade_profile.json',
  '.jarvis/verification_contract.json',
  '.jarvis/agile_work_item.json',
  '.jarvis/deploy_contract.json',
  'docs/ops/release-readiness-report.md',
  'docs/deployment/deploy-and-rollback.md',
  'docs/product/prfaq-template.md',
  'docs/product/critical-user-journeys.md',
];

const jsonFiles = [
  '.codex/config.json',
  '.jarvis/production_grade_profile.json',
  '.jarvis/verification_contract.json',
  '.jarvis/agile_work_item.json',
  '.jarvis/deploy_contract.json',
  'package.json',
  'package-lock.json',
];

const requiredPackageScripts = ['build:web', 'lint', 'typecheck'];
const ciRequiredTokens = [
  'npm ci --no-audit --fund=false',
  'npm run lint',
  'npm run typecheck',
  'npm run build:web',
  'tar -czf release-bundle-web.tgz dist',
  'actions/upload-artifact',
];
const releaseRequiredTokens = [
  'workflow_dispatch',
  'npm ci --no-audit --fund=false',
  'npm run lint',
  'npm run typecheck',
  'npm run build:web',
  'tar -czf release-bundle-web.tgz dist',
  'Release bundle built for review; live deploy is intentionally not performed',
];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function parseJson(file, errors) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`);
    return null;
  }
}

function gitOutput(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return '';
  }
}

const errors = [];
const warnings = [];

const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));
for (const file of missingFiles) {
  errors.push(`${file}: missing required operating artifact`);
}

const parsed = {};
for (const file of jsonFiles) {
  if (fs.existsSync(file)) {
    parsed[file] = parseJson(file, errors);
  }
}

const packageJson = parsed['package.json'];
if (packageJson) {
  for (const script of requiredPackageScripts) {
    if (!packageJson.scripts || typeof packageJson.scripts[script] !== 'string') {
      errors.push(`package.json: missing required script "${script}"`);
    }
  }
  if (!packageJson.scripts || typeof packageJson.scripts.test !== 'string') {
    warnings.push('package.json: no test script is defined; automated regression coverage remains advisory');
  }
}

const profile = parsed['.jarvis/production_grade_profile.json'];
if (profile) {
  for (const section of ['product', 'agile', 'verification', 'release', 'reliability', 'ownership', 'continuous_improvement']) {
    if (!(section in profile)) {
      errors.push(`.jarvis/production_grade_profile.json: missing "${section}" section`);
    }
  }
  if (!profile.release || !profile.release.rollback_action) {
    errors.push('.jarvis/production_grade_profile.json: release.rollback_action is required');
  }
}

const config = parsed['.codex/config.json'];
if (config) {
  const configEnvFileSource = config.environment && config.environment.env_file_source;
  if (typeof configEnvFileSource !== 'string' || configEnvFileSource.length === 0) {
    errors.push('.codex/config.json: missing "environment.env_file_source"');
  }
}

const agile = parsed['.jarvis/agile_work_item.json'];
if (agile) {
  for (const section of ['work_item_required_fields', 'definition_of_ready', 'definition_of_done', 'change_classes']) {
    if (!Array.isArray(agile[section]) || agile[section].length === 0) {
      errors.push(`.jarvis/agile_work_item.json: "${section}" must be a non-empty array`);
    }
  }
}

const deploy = parsed['.jarvis/deploy_contract.json'];
if (deploy) {
  const deployFields = [
    ['runtime_target', deploy.runtime_target],
    ['artifact.build_command', deploy.artifact && deploy.artifact.build_command],
    ['artifact.output_directory', deploy.artifact && deploy.artifact.output_directory],
    ['artifact.release_bundle', deploy.artifact && deploy.artifact.release_bundle],
    ['environment.env_file_source', deploy.environment && deploy.environment.env_file_source],
    ['health.canonical_path', deploy.health && deploy.health.canonical_path],
    ['rollback.target', deploy.rollback && deploy.rollback.target],
  ];
  for (const [name, value] of deployFields) {
    if (typeof value !== 'string' || value.length === 0) {
      errors.push(`.jarvis/deploy_contract.json: missing "${name}"`);
    }
  }
}

const verification = parsed['.jarvis/verification_contract.json'];
const configEnvFileSource = config && config.environment && config.environment.env_file_source;
const deployEnvFileSource = deploy && deploy.environment && deploy.environment.env_file_source;
const verificationEnvFileSource = verification && verification.environment && verification.environment.env_file_source;
const profileEnvFileSource = profile && profile.deploy && profile.deploy.env_file_source;
const envSources = [
  ['.codex/config.json environment.env_file_source', configEnvFileSource],
  ['.jarvis/deploy_contract.json environment.env_file_source', deployEnvFileSource],
  ['.jarvis/verification_contract.json environment.env_file_source', verificationEnvFileSource],
  ['.jarvis/production_grade_profile.json deploy.env_file_source', profileEnvFileSource],
].filter(([, value]) => typeof value === 'string' && value.length > 0);
const uniqueEnvSources = Array.from(new Set(envSources.map(([, value]) => value)));
if (envSources.length > 1 && uniqueEnvSources.length > 1) {
  errors.push(`env_file_source mismatch across operating contracts: ${envSources.map(([name, value]) => `${name}="${value}"`).join('; ')}`);
}

if (fs.existsSync('.github/workflows/ci.yml')) {
  const ci = read('.github/workflows/ci.yml');
  for (const token of ciRequiredTokens) {
    if (!ci.includes(token)) {
      errors.push(`.github/workflows/ci.yml: missing expected release gate token "${token}"`);
    }
  }
}

if (fs.existsSync('.github/workflows/release.yml')) {
  const release = read('.github/workflows/release.yml');
  for (const token of releaseRequiredTokens) {
    if (!release.includes(token)) {
      errors.push(`.github/workflows/release.yml: missing expected release gate token "${token}"`);
    }
  }
}

const statusShort = gitOutput('git status --short');
const dirtyLines = statusShort ? statusShort.split('\n').length : 0;
if (dirtyLines > 0) {
  warnings.push(`git: working tree has ${dirtyLines} dirty path(s); package through a reviewed PR before release`);
}

const branch = gitOutput('git branch --show-current') || 'unknown';
const upstream = gitOutput('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
if (!upstream) {
  warnings.push(`git: branch "${branch}" has no upstream configured`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`error: ${error}`);
  }
  process.exit(1);
}

if (checkOnly) {
  console.log(`repo operating system check ok (${requiredFiles.length} artifacts, ${jsonFiles.length} JSON files)`);
  for (const warning of warnings) {
    console.warn(`warning: ${warning}`);
  }
  process.exit(0);
}

const maturity = profile && profile.maturity
  ? `${profile.maturity.current || 'unknown'} (${profile.maturity.estimated_percent || 'unknown'}%) -> ${profile.maturity.target || 'unknown'}`
  : 'unknown';

console.log('# Repo Operating System Report');
console.log('');
console.log(`Workspace: ${profile && profile.workspace ? profile.workspace : 'unknown'}`);
console.log(`Branch: ${branch}`);
console.log(`Maturity: ${maturity}`);
console.log('');
console.log('## Required Artifacts');
for (const file of requiredFiles) {
  console.log(`- ${fs.existsSync(file) ? 'ok' : 'missing'}: ${file}`);
}
console.log('');
console.log('## Verification Surface');
console.log(`- package scripts: ${requiredPackageScripts.join(', ')}`);
console.log('- CI gates: install, lint, typecheck, web build, release bundle, artifact upload');
console.log('- Release workflow: reviewable bundle only; live deploy intentionally not configured');
console.log('');
console.log('## Environment Source');
console.log(`- env_file_source: ${configEnvFileSource || deployEnvFileSource || 'unknown'}`);
console.log(`- workspace config: ${configEnvFileSource || 'missing'}`);
console.log(`- deploy contract: ${deployEnvFileSource || 'missing'}`);
console.log('');
console.log('## Git Hygiene');
console.log(`- branch: ${branch}`);
console.log(`- upstream: ${upstream || 'not configured'}`);
console.log(`- dirty paths: ${dirtyLines}`);
console.log('');
console.log('## Warnings');
if (warnings.length === 0) {
  console.log('- none');
} else {
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}
