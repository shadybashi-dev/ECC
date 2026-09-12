'use strict';

/**
 * Content-hash response cache + private usage log.
 *
 * - Identical requests are served from disk: 100% token + cost saving.
 * - Cache dir is created with mode 0700, entries written 0600.
 * - usage.jsonl records token counts and cost only — never prompt content.
 */

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_TTL_MS = 7 * 24 * 3600 * 1000; // 7 days

function defaultCacheDir() {
  if (process.env.CTS_CACHE_DIR) return path.resolve(process.env.CTS_CACHE_DIR);
  const xdg = process.env.XDG_CACHE_HOME;
  if (xdg) return path.join(xdg, 'cts');
  return path.join(os.homedir(), '.cache', 'cts');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  try {
    fs.chmodSync(dir, 0o700);
  } catch {
    // Best effort on platforms without POSIX modes (Windows).
  }
}

function canonicalRequest(req) {
  return JSON.stringify({
    v: 1,
    model: req.model,
    system: req.system || '',
    messages: req.messages,
    maxTokens: req.maxTokens,
    temperature: req.temperature ?? 1,
    topP: req.topP ?? null,
  });
}

function keyFor(req) {
  return crypto.createHash('sha256').update(canonicalRequest(req)).digest('hex');
}

class CtsCache {
  constructor(dir = defaultCacheDir()) {
    this.dir = dir;
    ensureDir(dir);
    this.usagePath = path.join(dir, 'usage.jsonl');
  }

  entryPath(key) {
    if (!/^[0-9a-f]{64}$/.test(key)) throw new Error('Invalid cache key.');
    return path.join(this.dir, key + '.json');
  }

  get(key) {
    const p = this.entryPath(key);
    if (!fs.existsSync(p)) return null;
    let entry;
    try {
      entry = JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
      return null;
    }
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      try { fs.unlinkSync(p); } catch { /* ignore */ }
      return null;
    }
    return entry.value || null;
  }

  set(key, value, ttlMs = DEFAULT_TTL_MS) {
    const p = this.entryPath(key);
    const tmp = p + '.' + process.pid + '.tmp';
    const payload = JSON.stringify({ expiresAt: Date.now() + ttlMs, value });
    fs.writeFileSync(tmp, payload, { mode: 0o600 });
    fs.renameSync(tmp, p); // atomic replace
  }

  logUsage(record) {
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      model: record.model,
      inputTokens: record.inputTokens || 0,
      outputTokens: record.outputTokens || 0,
      cacheReadTokens: record.cacheReadTokens || 0,
      cacheCreationTokens: record.cacheCreationTokens || 0,
      costUsd: record.costUsd || 0,
      cacheHit: !!record.cacheHit,
      latencyMs: record.latencyMs || 0,
    }) + '\n';
    fs.appendFileSync(this.usagePath, line, { mode: 0o600 });
    try {
      fs.chmodSync(this.usagePath, 0o600);
    } catch { /* ignore */ }
  }

  usageSummary() {
    const summary = {
      calls: 0, cacheHits: 0,
      inputTokens: 0, outputTokens: 0,
      cacheReadTokens: 0, cacheCreationTokens: 0,
      costUsd: 0,
    };
    if (!fs.existsSync(this.usagePath)) return summary;
    for (const line of fs.readFileSync(this.usagePath, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try {
        const r = JSON.parse(line);
        summary.calls++;
        if (r.cacheHit) summary.cacheHits++;
        summary.inputTokens += r.inputTokens || 0;
        summary.outputTokens += r.outputTokens || 0;
        summary.cacheReadTokens += r.cacheReadTokens || 0;
        summary.cacheCreationTokens += r.cacheCreationTokens || 0;
        summary.costUsd += r.costUsd || 0;
      } catch { /* skip corrupt lines */ }
    }
    return summary;
  }

  stats() {
    let entries = 0;
    let bytes = 0;
    for (const f of fs.readdirSync(this.dir)) {
      if (!f.endsWith('.json')) continue;
      entries++;
      try {
        bytes += fs.statSync(path.join(this.dir, f)).size;
      } catch { /* ignore */ }
    }
    return { dir: this.dir, entries, bytes, usage: this.usageSummary() };
  }

  clear() {
    let removed = 0;
    for (const f of fs.readdirSync(this.dir)) {
      if (!f.endsWith('.json')) continue;
      try {
        fs.unlinkSync(path.join(this.dir, f));
        removed++;
      } catch { /* ignore */ }
    }
    return removed;
  }
}

module.exports = {
  DEFAULT_TTL_MS,
  defaultCacheDir,
  canonicalRequest,
  keyFor,
  CtsCache,
};
