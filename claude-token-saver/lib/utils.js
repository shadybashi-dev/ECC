'use strict';

/**
 * Shared helpers for claude-token-saver.
 * Zero dependencies. Only Node.js built-ins.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_MAX_BYTES = 1024 * 1024; // 1 MiB prompt/file guard

/**
 * Read text from a file path, "-" (stdin marker), or undefined (stdin when piped).
 * Never reads more than `maxBytes` (+1 to detect overflow).
 */
async function readInputText(source, maxBytes = DEFAULT_MAX_BYTES) {
  if (source && source !== '-') {
    const resolved = path.resolve(source);
    const stat = fs.statSync(resolved);
    if (!stat.isFile()) {
      throw new Error(`Not a file: ${source}`);
    }
    if (stat.size > maxBytes) {
      throw new Error(`File too large (${stat.size} bytes, limit ${maxBytes}). Pass a smaller file.`);
    }
    return fs.readFileSync(resolved, 'utf8');
  }
  if (process.stdin.isTTY) {
    throw new Error('No input. Provide a file path or pipe text via stdin.');
  }
  return await readStdin(maxBytes);
}

function readStdin(maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      total += Buffer.byteLength(chunk, 'utf8');
      if (total > maxBytes + 1024) {
        reject(new Error(`Stdin too large (limit ${maxBytes} bytes).`));
        process.stdin.destroy();
        return;
      }
      chunks.push(chunk);
    });
    process.stdin.on('end', () => resolve(chunks.join('')));
    process.stdin.on('error', reject);
  });
}

/**
 * Resolve `target` and ensure it stays inside `root` (path traversal guard).
 * Returns the resolved absolute path.
 */
function resolveInside(root, target) {
  const rootResolved = path.resolve(root);
  const targetResolved = path.resolve(rootResolved, target);
  if (targetResolved !== rootResolved && !targetResolved.startsWith(rootResolved + path.sep)) {
    throw new Error(`Path escapes root directory: ${target}`);
  }
  return targetResolved;
}

/** Format an integer with thousands separators (locale-independent). */
function formatInt(n) {
  const s = String(Math.max(0, Math.round(n)));
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Format USD money with up to 4 decimals, trimming trailing zeros. */
function formatUsd(n) {
  if (!Number.isFinite(n)) return '$0';
  if (n === 0) return '$0';
  if (n < 0.0001) return '<$0.0001';
  return '$' + n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '.0');
}

/** Format a percentage with 1 decimal. */
function formatPct(ratio) {
  return (ratio * 100).toFixed(1) + '%';
}

/** Sleep helper for retry backoff. */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Minimal CLI arg parser: returns { positionals, flags }. */
function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--') {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq !== -1) {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
      } else {
        const name = arg.slice(2);
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('-')) {
          flags[name] = next;
          i++;
        } else {
          flags[name] = true;
        }
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      const name = arg.slice(1);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        flags[name] = next;
        i++;
      } else {
        flags[name] = true;
      }
    } else {
      positionals.push(arg);
    }
  }
  return { positionals, flags };
}

function flagOn(flags, ...names) {
  return names.some((n) => flags[n] === true || flags[n] === '1' || flags[n] === 'true' || flags[n] === 'yes');
}

function flagValue(flags, ...names) {
  for (const n of names) {
    if (flags[n] !== undefined && flags[n] !== true) return String(flags[n]);
  }
  return undefined;
}

function printStderr(msg) {
  process.stderr.write(String(msg) + '\n');
}

module.exports = {
  DEFAULT_MAX_BYTES,
  readInputText,
  resolveInside,
  formatInt,
  formatUsd,
  formatPct,
  sleep,
  parseArgs,
  flagOn,
  flagValue,
  printStderr,
};
