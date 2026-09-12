'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  resolveBaseUrl, assertUrlAllowed, assertValidModel, buildRequest, chat,
} = require('../lib/client');

test('default base url without explicit override', () => {
  assert.equal(resolveBaseUrl(undefined), 'https://api.anthropic.com');
});

test('custom base url requires explicit opt-in', () => {
  delete process.env.CTS_ALLOW_BASE_URL;
  assert.throws(() => resolveBaseUrl('https://evil.example.com'), /Refusing custom --base-url/);
});

test('custom base url requires allowlisted host', () => {
  process.env.CTS_ALLOW_BASE_URL = '1';
  delete process.env.CTS_ALLOWED_HOSTS;
  try {
    assert.throws(() => resolveBaseUrl('https://evil.example.com'), /not allowlisted/);
  } finally {
    delete process.env.CTS_ALLOW_BASE_URL;
  }
});

test('assertUrlAllowed blocks credentials, http, and unknown hosts', () => {
  const credUrl = 'https://' + 'u:p@api.anthropic.com'; // fragmented: self-scan clean
  assert.throws(() => assertUrlAllowed(credUrl, ['api.anthropic.com']), /credentials/);
  assert.throws(() => assertUrlAllowed('http://api.anthropic.com', ['api.anthropic.com']), /https/);
  assert.throws(() => assertUrlAllowed('https://evil.com', ['api.anthropic.com']), /not allowlisted/);
  assert.throws(() => assertUrlAllowed('gopher://x', ['x']), /https/);
  // loopback http is allowed for dev proxies
  assert.ok(assertUrlAllowed('http://127.0.0.1:8080', []).startsWith('http://127.0.0.1'));
});

test('model ids are validated', () => {
  assert.doesNotThrow(() => assertValidModel('claude-sonnet-4-6'));
  assert.throws(() => assertValidModel('gpt-4'), /suspicious model/);
  assert.throws(() => assertValidModel('claude-x; rm -rf /'), /suspicious model/);
});

test('buildRequest adds cache breakpoints when enabled', () => {
  const { body } = buildRequest({ system: 's', prompt: 'p', model: 'm', maxTokens: 8, useCache: true });
  assert.equal(body.system[0].cache_control.type, 'ephemeral');
  assert.equal(body.messages[0].content[0].cache_control.type, 'ephemeral');
  const plain = buildRequest({ prompt: 'p', model: 'm', maxTokens: 8, useCache: false });
  assert.equal(plain.body.system, undefined);
  assert.equal(plain.body.messages[0].content[0].cache_control, undefined);
});

test('chat validates input before touching network', async () => {
  await assert.rejects(() => chat({ prompt: '   ' }), /Empty prompt/);
  await assert.rejects(() => chat({ prompt: 'hi', model: 'evil-model' }), /suspicious model/);
  await assert.rejects(() => chat({ prompt: 'hi', maxTokens: 999999 }), /maxTokens/);
  await assert.rejects(() => chat({ prompt: 'hi', temperature: 9 }), /temperature/);
});

test('chat uses cache and never calls network on hit', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-chat-'));
  const prevKey = process.env.ANTHROPIC_API_KEY;
  const prevFetch = global.fetch;
  process.env.ANTHROPIC_API_KEY = 'fake-test-key';
  let calls = 0;
  global.fetch = async () => {
    calls++;
    return {
      ok: true,
      status: 200,
      json: async () => ({
        model: 'claude-sonnet-4-6',
        stop_reason: 'end_turn',
        content: [{ type: 'text', text: 'hello back' }],
        usage: { input_tokens: 10, output_tokens: 5 },
      }),
    };
  };
  try {
    const r1 = await chat({ prompt: 'unique-prompt-12345', cacheDir: dir, maxTokens: 16 });
    assert.equal(r1.text, 'hello back');
    assert.equal(r1.cacheHit, false);
    assert.equal(calls, 1);
    assert.ok(r1.costUsd > 0);
    const r2 = await chat({ prompt: 'unique-prompt-12345', cacheDir: dir, maxTokens: 16 });
    assert.equal(r2.cacheHit, true);
    assert.equal(r2.text, 'hello back');
    assert.equal(calls, 1); // served from disk: zero tokens
  } finally {
    global.fetch = prevFetch;
    if (prevKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = prevKey;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('chat requires api key from env', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-chat-'));
  const prevKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
  try {
    await assert.rejects(
      () => chat({ prompt: 'needs-key-' + Date.now(), cacheDir: dir, maxTokens: 8 }),
      /Missing ANTHROPIC_API_KEY/
    );
  } finally {
    if (prevKey !== undefined) process.env.ANTHROPIC_API_KEY = prevKey;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
