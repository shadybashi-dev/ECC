'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { scanText, redactText, scanDir } = require('../lib/secrets');

// NOTE: fake secrets below are intentionally built by concatenation so this
// repo never contains a contiguous secret-looking string (self-scan clean,
// GitHub secret scanning and gitleaks stay quiet).
const ANT = (s) => 'sk-ant-' + s;
const GHP = (s) => 'ghp_' + s;
const OAI = (s) => 'sk-' + s;
const FAKE_ANT_A = ANT('a'.repeat(32));
const FAKE_ANT_B = ANT('b'.repeat(32));
const FAKE_GHP = GHP('abcdefghijklmnopqrstuvwxyz123456');
const FAKE_JWT = ['eyJhbGciOiJIUzI1NiJ9', 'eyJzdWIiOiIxMjM0NTY3ODkwIn0', 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'].join('.');
const FAKE_URL = 'https://' + 'user:hunter2@example.com/x';
const FAKE_PRIVKEY = '-----BEGIN ' + 'RSA PRIVATE KEY-----';

test('detects anthropic and github keys', () => {
  const findings = scanText('a ' + ANT('abcDEF1234567890xyz') + ' b\n' + FAKE_GHP + '\n');
  const names = findings.map((f) => f.pattern);
  assert.ok(names.includes('ANTHROPIC_KEY'));
  assert.ok(names.includes('GITHUB_TOKEN'));
  assert.equal(findings[0].line, 1);
  // sk-ant- must NOT be double-reported as an OpenAI key
  assert.ok(!names.includes('OPENAI_KEY'));
});

test('detects openai keys', () => {
  const names = scanText(OAI('abcdefghijklmnopqrstuvwxyz123456')).map((f) => f.pattern);
  assert.ok(names.includes('OPENAI_KEY'));
});

test('detects private keys, jwt, urls with creds', () => {
  const text = [FAKE_PRIVKEY, FAKE_JWT, FAKE_URL].join('\n');
  const names = scanText(text).map((f) => f.pattern);
  assert.ok(names.includes('PRIVATE_KEY'));
  assert.ok(names.includes('JWT'));
  assert.ok(names.includes('URL_CREDENTIALS'));
});

test('findings never include the secret value', () => {
  const secret = ANT('Q'.repeat(40));
  const findings = scanText(secret);
  assert.ok(findings.length > 0);
  for (const f of findings) {
    assert.ok(!JSON.stringify(f).includes(secret));
  }
});

test('redactText replaces all matches', () => {
  const { text, count } = redactText('k1=' + FAKE_ANT_A + ' k2=' + FAKE_GHP);
  assert.equal(count, 2);
  assert.ok(!text.includes('sk-ant-aaa'));
  assert.ok(!text.includes('ghp_'));
  assert.ok(text.includes('[REDACTED:ANTHROPIC_KEY]'));
  assert.ok(text.includes('[REDACTED:GITHUB_TOKEN]'));
});

test('scanDir finds env files and skips node_modules', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-sec-'));
  try {
    fs.writeFileSync(path.join(root, '.env'), 'ANTHROPIC_API_' + 'KEY=' + FAKE_ANT_A + '\n');
    fs.writeFileSync(path.join(root, 'clean.txt'), 'hello world\n');
    fs.mkdirSync(path.join(root, 'node_modules'));
    fs.writeFileSync(path.join(root, 'node_modules', 'evil.js'), 'x="' + FAKE_ANT_B + '"\n');
    const res = scanDir(root);
    const patterns = res.findings.map((f) => f.pattern);
    assert.ok(patterns.includes('ENV_FILE'));
    assert.ok(patterns.includes('ANTHROPIC_KEY'));
    assert.ok(!res.findings.some((f) => f.file.includes('node_modules')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('scanDir does not flag .env.example templates', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-sec-'));
  try {
    fs.writeFileSync(path.join(root, '.env.example'), 'ANTHROPIC_API_KEY=\n');
    const res = scanDir(root);
    assert.ok(!res.findings.some((f) => f.pattern === 'ENV_FILE'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('scanDir skips binaries and rejects non-dirs', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-sec-'));
  try {
    fs.writeFileSync(path.join(root, 'bin.dat'), Buffer.from([0, 1, 2, 0, 3]));
    const res = scanDir(root);
    assert.equal(res.scanned.skippedBinary, 1);
    assert.throws(() => scanDir(path.join(root, 'nope')), /Not a directory/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
