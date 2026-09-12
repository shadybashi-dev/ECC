'use strict';

/**
 * Secret scanner + redactor. Keeps repos safe to push to GitHub.
 *
 * - scanText(): find likely secrets in a string
 * - redactText(): replace them with [REDACTED:NAME]
 * - scanDir(): recursive repo scan with traversal guards and binary skip
 *
 * Patterns favor precision over recall to avoid false positives, but any
 * match should be treated as guilty until reviewed.
 */

const fs = require('fs');
const path = require('path');
const { resolveInside } = require('./utils');

const PATTERNS = [
  { name: 'ANTHROPIC_KEY', severity: 'critical', re: /sk-ant-[A-Za-z0-9_\-]{8,}[A-Za-z0-9_\-]{8,}/g },
  { name: 'OPENAI_KEY', severity: 'critical', re: /sk-(?!ant-)(proj-)?[A-Za-z0-9_\-]{20,}/g },
  { name: 'GITHUB_TOKEN', severity: 'critical', re: /(ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|ghu_[A-Za-z0-9]{20,}|ghs_[A-Za-z0-9]{20,}|ghr_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/g },
  { name: 'AWS_ACCESS_KEY', severity: 'critical', re: /AKIA[0-9A-Z]{16}/g },
  { name: 'AWS_SECRET', severity: 'critical', re: /aws_secret_access_key["'\s:=]+[A-Za-z0-9/+=]{30,}/gi },
  { name: 'PRIVATE_KEY', severity: 'critical', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
  { name: 'SLACK_TOKEN', severity: 'high', re: /xox[baprs]-[A-Za-z0-9\-]{10,}/g },
  { name: 'STRIPE_KEY', severity: 'high', re: /(sk_live|rk_live|whsec_)[A-Za-z0-9_]{10,}/g },
  { name: 'DISCORD_WEBHOOK', severity: 'high', re: /discord(?:app)?\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_\-]+/g },
  { name: 'GENERIC_API_KEY', severity: 'medium', re: /(api[_-]?key|apikey|api_secret|secret_key|access_token|auth_token)["'\s:=]+[A-Za-z0-9_\-./+=]{16,}/gi },
  { name: 'PASSWORD_ASSIGN', severity: 'medium', re: /(password|passwd|pwd)["'\s:=]+[^\s"']{6,}/gi },
  { name: 'BEARER_TOKEN', severity: 'medium', re: /Bearer\s+[A-Za-z0-9_\-.=+/]{20,}/g },
  { name: 'JWT', severity: 'medium', re: /eyJ[A-Za-z0-9_\-]{10,}\.eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}/g },
  { name: 'URL_CREDENTIALS', severity: 'high', re: /https?:\/\/[^\s/@:]+:[^\s/@]+@[^\s/]+/g },
  { name: 'NPM_TOKEN', severity: 'high', re: /npm_[A-Za-z0-9]{20,}/g },
  { name: 'HF_TOKEN', severity: 'high', re: /hf_[A-Za-z0-9]{20,}/g },
];

const ENV_FILE_RE = /(^|\/)\.env(\..*)?$/;
const ENV_TEMPLATE_RE = /\.env\.(example|sample|template)(\..*)?$/;
const PRIVATE_NAME_RE = /\.(pem|key|p12|pfx|jks|keystore)$/i;

/** True for real dotenv files; templates like .env.example are meant to be committed. */
function isFlaggableEnvFile(rel) {
  return ENV_FILE_RE.test('/' + rel) && !ENV_TEMPLATE_RE.test('/' + rel);
}

const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.venv', 'venv', 'coverage', '.next', '.turbo',
  'dist', 'build', '.cache', '__pycache__', '.pytest_cache', '.cts-cache',
]);

const MAX_SCAN_BYTES = 512 * 1024; // 512 KiB per file

function lineCol(text, index) {
  let line = 1;
  let col = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') { line++; col = 1; } else { col++; }
  }
  return { line, col };
}

function excerptAt(text, index, len = 24) {
  const start = Math.max(0, index - 8);
  const raw = text.slice(start, start + len).replace(/\n/g, ' ');
  return raw.length > 20 ? raw.slice(0, 20) + '...' : raw;
}

/** Scan a string. Returns array of findings (no secret values included). */
function scanText(text, filename = '<input>') {
  const findings = [];
  for (const p of PATTERNS) {
    p.re.lastIndex = 0;
    let m;
    let guard = 0;
    while ((m = p.re.exec(text)) !== null && guard++ < 500) {
      const { line, col } = lineCol(text, m.index);
      findings.push({
        file: filename,
        pattern: p.name,
        severity: p.severity,
        line,
        col,
        matchLength: m[0].length,
        excerpt: excerptAt(text, m.index),
      });
      if (m[0].length === 0) p.re.lastIndex++;
    }
  }
  return findings;
}

/** Redact secrets in a string. Returns { text, count, patterns }. */
function redactText(text) {
  let out = text;
  let count = 0;
  const patterns = [];
  for (const p of PATTERNS) {
    p.re.lastIndex = 0;
    let hits = 0;
    out = out.replace(p.re, () => {
      hits++;
      count++;
      return `[REDACTED:${p.name}]`;
    });
    if (hits > 0) patterns.push({ pattern: p.name, count: hits });
  }
  return { text: out, count, patterns };
}

function looksBinary(buffer) {
  const slice = buffer.subarray(0, Math.min(buffer.length, 8000));
  for (let i = 0; i < slice.length; i++) {
    if (slice[i] === 0) return true;
  }
  return false;
}

function listFilesRecursive(root, out = []) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(root, entry.name);
    if (entry.isSymbolicLink()) continue; // never follow symlinks
    if (entry.isDirectory()) {
      listFilesRecursive(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Scan a directory tree for secrets.
 * Options: { maxBytes, includeEnvFiles: true }
 */
function scanDir(dir, options = {}) {
  const root = path.resolve(dir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Not a directory: ${dir}`);
  }
  const maxBytes = options.maxBytes || MAX_SCAN_BYTES;
  const findings = [];
  const scanned = { files: 0, skippedLarge: 0, skippedBinary: 0 };
  for (const full of listFilesRecursive(root)) {
    const rel = path.relative(root, full).split(path.sep).join('/');
    resolveInside(root, rel); // traversal guard (paranoia: re-validate)
    const stat = fs.statSync(full);
    if (stat.size > maxBytes) { scanned.skippedLarge++; continue; }
    if (stat.size === 0) continue;
    const buf = fs.readFileSync(full);
    if (looksBinary(buf)) { scanned.skippedBinary++; continue; }
    scanned.files++;
    const text = buf.toString('utf8');
    findings.push(...scanText(text, rel));
    if (isFlaggableEnvFile(rel)) {
      findings.push({
        file: rel, pattern: 'ENV_FILE', severity: 'high',
        line: 1, col: 1, matchLength: rel.length,
        excerpt: 'dotenv file present in repo',
      });
    }
    if (PRIVATE_NAME_RE.test(rel)) {
      findings.push({
        file: rel, pattern: 'PRIVATE_KEY_FILE', severity: 'critical',
        line: 1, col: 1, matchLength: rel.length,
        excerpt: 'private key filename in repo',
      });
    }
  }
  return { root, scanned, findings };
}

module.exports = {
  PATTERNS: PATTERNS.map((p) => ({ name: p.name, severity: p.severity })),
  scanText,
  redactText,
  scanDir,
  MAX_SCAN_BYTES,
};
