'use strict';

/**
 * Git pre-commit hook installer: blocks commits that contain secrets.
 *
 * The hook calls back into this package's CLI (`cts secrets --staged`),
 * so repos stay safe to push to GitHub with zero CI configuration.
 * Uses execFileSync (no shell) everywhere.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MARKER = '# >>> claude-token-saver pre-commit (cts) >>>';
const MARKER_END = '# <<< claude-token-saver pre-commit (cts) <<<';

function gitTopLevel(cwd) {
  const out = execFileSync('git', ['rev-parse', '--show-toplevel'], {
    cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  });
  return out.trim();
}

function hookScript(cliPath) {
  // POSIX sh, no bashisms. `--staged` scans blob content, not worktree files.
  return `${MARKER}
# Blocks commits containing likely secrets. Installed by: cts hook install
if command -v node >/dev/null 2>&1; then
  node "${cliPath}" secrets --staged --quiet
  _cts_status=$?
  if [ $_cts_status -eq 1 ]; then
    echo "cts: commit blocked — possible secrets in staged files." >&2
    echo "cts: review with: node \\"${cliPath}\\" secrets --staged" >&2
    exit 1
  fi
fi
${MARKER_END}
`;
}

function installHook(cwd = process.cwd()) {
  const top = gitTopLevel(cwd);
  const hooksDir = path.join(top, '.git', 'hooks');
  if (!fs.existsSync(hooksDir)) {
    throw new Error('No .git/hooks directory. Is this a git repository?');
  }
  const hookPath = path.join(hooksDir, 'pre-commit');
  const cliPath = path.resolve(__dirname, '..', 'bin', 'cts.js');
  const block = hookScript(cliPath);
  if (fs.existsSync(hookPath)) {
    const current = fs.readFileSync(hookPath, 'utf8');
    if (current.includes(MARKER)) {
      return { hookPath, status: 'already-installed' };
    }
    fs.appendFileSync(hookPath, '\n' + block, { mode: 0o755 });
    try { fs.chmodSync(hookPath, 0o755); } catch { /* ignore */ }
    return { hookPath, status: 'appended' };
  }
  fs.writeFileSync(hookPath, '#!/bin/sh\n' + block, { mode: 0o755 });
  try { fs.chmodSync(hookPath, 0o755); } catch { /* ignore */ }
  return { hookPath, status: 'installed' };
}

function uninstallHook(cwd = process.cwd()) {
  const top = gitTopLevel(cwd);
  const hookPath = path.join(top, '.git', 'hooks', 'pre-commit');
  if (!fs.existsSync(hookPath)) return { hookPath, status: 'not-installed' };
  const current = fs.readFileSync(hookPath, 'utf8');
  if (!current.includes(MARKER)) return { hookPath, status: 'not-installed' };
  const start = current.indexOf(MARKER);
  const end = current.indexOf(MARKER_END);
  const next = (current.slice(0, start) + current.slice(end + MARKER_END.length)).trim();
  if (next === '' || next === '#!/bin/sh') {
    fs.unlinkSync(hookPath);
    return { hookPath, status: 'removed' };
  }
  fs.writeFileSync(hookPath, current.slice(0, start).trimEnd() + '\n');
  return { hookPath, status: 'removed-block' };
}

/** List staged files (NUL-separated, no shell). */
function stagedFiles(cwd = process.cwd()) {
  const out = execFileSync('git', ['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR'], {
    cwd, encoding: 'buffer', maxBuffer: 8 * 1024 * 1024,
  });
  return out.toString('utf8').split('\0').map((s) => s.trim()).filter(Boolean)
    .filter((p) => !p.includes('..') && !path.isAbsolute(p));
}

/** Read staged blob content for a path (size-capped). */
function stagedBlob(cwd, relPath, maxBytes = 512 * 1024) {
  const out = execFileSync('git', ['show', ':' + relPath], {
    cwd, encoding: 'buffer', maxBuffer: maxBytes + 1024,
  });
  if (out.length > maxBytes) return null;
  if (out.subarray(0, Math.min(out.length, 8000)).includes(0)) return null; // binary
  return out.toString('utf8');
}

module.exports = {
  installHook,
  uninstallHook,
  stagedFiles,
  stagedBlob,
};
