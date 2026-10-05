#!/usr/bin/env node
/**
 * Validate the SEO/GEO skill suite surface:
 *   - every skill ships a SKILL.md with inline frontmatter
 *   - the seo-geo install module references each new skill exactly once
 *   - the bundled audit script has no third-party imports
 *   - the skill directories referenced by the module all exist
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..', '..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');
const AUDIT_SCRIPT = path.join(SKILLS_DIR, 'aeo-audit', 'scripts', 'aeo-audit.mjs');

const SUITE_SKILLS = [
  'aeo-audit',
  'geo',
  'geo-citability',
  'schema-markup',
  'seo-technical-audit',
  'topical-authority-map',
];
const SUITE_SKILLS_WITH_BASELINE = ['seo', ...SUITE_SKILLS];

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

function readFrontmatter(skillName) {
  const content = fs.readFileSync(path.join(SKILLS_DIR, skillName, 'SKILL.md'), 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${skillName}/SKILL.md is missing frontmatter`);
  const values = {};
  for (const line of match[1].split(/\r?\n/)) {
    const key = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (key) values[key[1]] = key[2].trim();
  }
  return values;
}

const results = [];

results.push(test('every suite skill ships a SKILL.md', () => {
  for (const skill of SUITE_SKILLS_WITH_BASELINE) {
    const file = path.join(SKILLS_DIR, skill, 'SKILL.md');
    assert.ok(fs.existsSync(file), `missing ${file}`);
    assert.ok(fs.statSync(file).size > 0, `${skill}/SKILL.md is empty`);
  }
}));

results.push(test('frontmatter name matches the directory and description is inline', () => {
  for (const skill of SUITE_SKILLS_WITH_BASELINE) {
    const frontmatter = readFrontmatter(skill);
    assert.strictEqual(frontmatter.name, skill, `${skill}: name mismatch`);
    assert.ok(frontmatter.description, `${skill}: missing description`);
    assert.ok(!/^[|>]/.test(frontmatter.description), `${skill}: description must be an inline scalar`);
    assert.ok(frontmatter.description.length > 40, `${skill}: description too short to trigger`);
  }
}));

results.push(test('seo-geo install module lists each new skill once', () => {
  const modules = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'manifests', 'install-modules.json'), 'utf8'));
  const module = modules.modules.find(entry => entry.id === 'seo-geo');
  assert.ok(module, 'seo-geo module is missing');
  assert.strictEqual(module.kind, 'skills');
  const paths = module.paths;
  assert.strictEqual(new Set(paths).size, paths.length, 'duplicate paths in seo-geo module');
  for (const skill of SUITE_SKILLS) {
    assert.ok(paths.includes(`skills/${skill}`), `seo-geo module does not reference skills/${skill}`);
  }
  assert.ok(module.dependencies.includes('business-content'), 'seo-geo should depend on business-content');
}));

results.push(test('no other module claims the new skill paths', () => {
  const modules = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'manifests', 'install-modules.json'), 'utf8'));
  const claims = new Map();
  for (const module of modules.modules) {
    for (const relativePath of module.paths) {
      if (!relativePath.startsWith('skills/')) continue;
      if (claims.has(relativePath)) {
        assert.fail(`skills/${relativePath} claimed by ${claims.get(relativePath)} and ${module.id}`);
      }
      claims.set(relativePath, module.id);
    }
  }
}));

results.push(test('audit script imports only node builtins', () => {
  const source = fs.readFileSync(AUDIT_SCRIPT, 'utf8');
  const imports = [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(match => match[1]);
  assert.ok(imports.length > 0, 'expected at least one import');
  for (const specifier of imports) {
    assert.ok(specifier.startsWith('node:') || specifier.startsWith('./') || specifier.startsWith('../'),
      `third-party import found: ${specifier}`);
  }
}));

results.push(test('audit script runs offline and refuses to fabricate a score', () => {
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'seo-geo-surface-'));
  const file = path.join(dir, 'page.html');
  fs.writeFileSync(file, '<html><head><title>A reasonably long page title for tests</title></head><body><h1>Hi</h1></body></html>');
  try {
    const ok = spawnSync(process.execPath, [AUDIT_SCRIPT, 'https://example.invalid', `--html-file=${file}`, '--json'], {
      encoding: 'utf8',
      timeout: 30000,
    });
    assert.strictEqual(ok.status, 0, ok.stderr);
    const report = JSON.parse(ok.stdout);
    assert.ok(report.scoring.foundationalScore >= 0 && report.scoring.foundationalScore <= 100);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  const noArgs = spawnSync(process.execPath, [AUDIT_SCRIPT], { encoding: 'utf8', timeout: 30000 });
  assert.notStrictEqual(noArgs.status, 0, 'expected non-zero exit without a URL');
}));

const failed = results.filter(result => !result).length;
console.log(`\n${results.length - failed}/${results.length} seo-geo surface tests passed`);
if (failed > 0) process.exit(1);
