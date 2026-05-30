#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

required_files=(
  "AGENTS.md"
  ".codex/scripts/repo_operating_system_report.js"
  ".github/workflows/ci.yml"
  ".github/workflows/release.yml"
  ".jarvis/production_grade_profile.json"
  ".jarvis/verification_contract.json"
  ".jarvis/agile_work_item.json"
  ".jarvis/deploy_contract.json"
  "docs/ops/release-readiness-report.md"
  "docs/product/prfaq-template.md"
  "docs/product/critical-user-journeys.md"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "missing required operating artifact: $file" >&2
    exit 1
  fi
done

node <<'NODE'
const fs = require('fs');

for (const file of ['.codex/config.json', '.jarvis/production_grade_profile.json', '.jarvis/verification_contract.json', '.jarvis/agile_work_item.json', '.jarvis/deploy_contract.json']) {
  JSON.parse(fs.readFileSync(file, 'utf8'));
}

const config = JSON.parse(fs.readFileSync('.codex/config.json', 'utf8'));
const configRootEnvFileSource = config.env_file_source;
const configEnvFileSource = config.environment && config.environment.env_file_source;
if (typeof configRootEnvFileSource !== 'string' || configRootEnvFileSource.length === 0) {
  throw new Error('config missing top-level env_file_source');
}
if (typeof configEnvFileSource !== 'string' || configEnvFileSource.length === 0) {
  throw new Error('config missing environment.env_file_source');
}

const profile = JSON.parse(fs.readFileSync('.jarvis/production_grade_profile.json', 'utf8'));
const requiredProfileSections = [
  'workspace',
  'product',
  'agile',
  'architecture',
  'verification',
  'release',
  'reliability',
  'ownership',
  'continuous_improvement',
];
const missing = requiredProfileSections.filter((section) => !(section in profile));
if (missing.length > 0) {
  throw new Error(`production_grade_profile missing required section(s): ${missing.join(', ')}`);
}
if (!profile.release || !profile.release.rollback_action) {
  throw new Error('production_grade_profile release.rollback_action is required');
}

const agile = JSON.parse(fs.readFileSync('.jarvis/agile_work_item.json', 'utf8'));
for (const section of ['work_item_required_fields', 'definition_of_ready', 'definition_of_done', 'change_classes']) {
  if (!Array.isArray(agile[section]) || agile[section].length === 0) {
    throw new Error(`agile_work_item missing required non-empty array: ${section}`);
  }
}

const deploy = JSON.parse(fs.readFileSync('.jarvis/deploy_contract.json', 'utf8'));
const requiredDeployFields = [
  ['env_file_source', deploy.env_file_source],
  ['runtime_target', deploy.runtime_target],
  ['artifact.build_command', deploy.artifact && deploy.artifact.build_command],
  ['artifact.output_directory', deploy.artifact && deploy.artifact.output_directory],
  ['artifact.release_bundle', deploy.artifact && deploy.artifact.release_bundle],
  ['environment.env_file_source', deploy.environment && deploy.environment.env_file_source],
  ['health.canonical_path', deploy.health && deploy.health.canonical_path],
  ['rollback.target', deploy.rollback && deploy.rollback.target],
];
const missingDeployFields = requiredDeployFields
  .filter(([, value]) => typeof value !== 'string' || value.length === 0)
  .map(([name]) => name);
if (missingDeployFields.length > 0) {
  throw new Error(`deploy_contract missing required field(s): ${missingDeployFields.join(', ')}`);
}

const verification = JSON.parse(fs.readFileSync('.jarvis/verification_contract.json', 'utf8'));
const envSources = [
  ['.codex/config.json env_file_source', configRootEnvFileSource],
  ['.codex/config.json environment.env_file_source', configEnvFileSource],
  ['.jarvis/deploy_contract.json env_file_source', deploy.env_file_source],
  ['.jarvis/deploy_contract.json environment.env_file_source', deploy.environment && deploy.environment.env_file_source],
  ['.jarvis/verification_contract.json environment.env_file_source', verification.environment && verification.environment.env_file_source],
  ['.jarvis/production_grade_profile.json deploy.env_file_source', profile.deploy && profile.deploy.env_file_source],
];
const missingEnvSources = envSources
  .filter(([, value]) => typeof value !== 'string' || value.length === 0)
  .map(([name]) => name);
if (missingEnvSources.length > 0) {
  throw new Error(`missing env_file_source in operating contract(s): ${missingEnvSources.join(', ')}`);
}
const uniqueEnvSources = Array.from(new Set(envSources.map(([, value]) => value)));
if (uniqueEnvSources.length > 1) {
  throw new Error(`env_file_source mismatch across operating contracts: ${envSources.map(([name, value]) => `${name}="${value}"`).join('; ')}`);
}
NODE

node .codex/scripts/repo_operating_system_report.js --check

if [[ "$(git branch --show-current)" == "main" ]]; then
  echo "warning: currently on main; normal mutable work should happen on a branch" >&2
fi

echo "preflight ok"
