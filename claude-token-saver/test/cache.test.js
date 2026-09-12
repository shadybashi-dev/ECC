'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { CtsCache, keyFor } = require('../lib/cache');

function tmpCache() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-cache-'));
  return { dir, cache: new CtsCache(dir) };
}

const REQ = { model: 'm', system: 's', messages: [{ role: 'user', content: 'hi' }], maxTokens: 5, temperature: 0 };

test('keyFor is stable and content-addressed', () => {
  assert.equal(keyFor(REQ), keyFor(JSON.parse(JSON.stringify(REQ))));
  assert.match(keyFor(REQ), /^[0-9a-f]{64}$/);
  assert.notEqual(keyFor(REQ), keyFor({ ...REQ, messages: [{ role: 'user', content: 'bye' }] }));
});

test('set/get roundtrip', () => {
  const { dir, cache } = tmpCache();
  try {
    const k = keyFor(REQ);
    assert.equal(cache.get(k), null);
    cache.set(k, { hello: 'world' });
    assert.deepEqual(cache.get(k), { hello: 'world' });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('expired entries return null', async () => {
  const { dir, cache } = tmpCache();
  try {
    const k = keyFor(REQ);
    cache.set(k, { a: 1 }, -1);
    assert.equal(cache.get(k), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('rejects invalid keys (traversal guard)', () => {
  const { dir, cache } = tmpCache();
  try {
    assert.throws(() => cache.entryPath('../evil'), /Invalid cache key/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('usage log tracks totals without prompt content', () => {
  const { dir, cache } = tmpCache();
  try {
    cache.logUsage({ model: 'm', inputTokens: 10, outputTokens: 5, costUsd: 0.001, cacheHit: false });
    cache.logUsage({ model: 'm', inputTokens: 10, outputTokens: 0, costUsd: 0, cacheHit: true });
    const s = cache.usageSummary();
    assert.equal(s.calls, 2);
    assert.equal(s.cacheHits, 1);
    assert.equal(s.inputTokens, 20);
    assert.equal(s.outputTokens, 5);
    const raw = fs.readFileSync(path.join(dir, 'usage.jsonl'), 'utf8');
    assert.ok(!raw.includes('prompt'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('stats and clear', () => {
  const { dir, cache } = tmpCache();
  try {
    cache.set(keyFor(REQ), { a: 1 });
    assert.equal(cache.stats().entries, 1);
    assert.equal(cache.clear(), 1);
    assert.equal(cache.stats().entries, 0);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
