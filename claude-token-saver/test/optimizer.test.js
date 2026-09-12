'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  stripInvisibleUnicode, normalizeWhitespace, dedupeBlocks,
  minifyJsonBlocks, truncateCodeBlocks, stripFullLineComments, optimize,
} = require('../lib/optimizer');

test('strips zero-width and bidi controls', () => {
  const dirty = 'a\u200bb\u202ac\u2066d\te\ufeff';
  assert.equal(stripInvisibleUnicode(dirty), 'abcd\te');
});

test('normalizes whitespace', () => {
  const out = normalizeWhitespace('a  \r\n\r\n\r\n\r\nb\t \n');
  assert.equal(out, 'a\n\n\nb\n');
});

test('dedupes repeated blocks', () => {
  const block = 'x'.repeat(150);
  const { text, removed } = dedupeBlocks([block, 'short', block, block].join('\n\n'));
  assert.equal(removed, 2);
  assert.match(text, /Deduped 2 repeated blocks/);
});

test('keeps short blocks untouched', () => {
  const { removed } = dedupeBlocks('a\n\nb\n\na');
  assert.equal(removed, 0);
});

test('minifies valid json fences only', () => {
  const src = '```json\n{ "a": 1 }\n```\n\n```json\nnot json\n```';
  const { text, count } = minifyJsonBlocks(src);
  assert.equal(count, 1);
  assert.ok(text.includes('{"a":1}'));
  assert.ok(text.includes('not json'));
});

test('truncates long code blocks with marker', () => {
  const body = Array.from({ length: 200 }, (_, i) => `line${i}`).join('\n');
  const { text, count, dropped } = truncateCodeBlocks('```js\n' + body + '\n```', 100);
  assert.equal(count, 1);
  assert.ok(dropped > 0);
  assert.match(text, /truncated .* lines by cts optimize/);
  assert.ok(text.includes('line0'));
  assert.ok(text.includes('line199'));
});

test('strips full-line comments but keeps shebang and code', () => {
  const src = '#!/bin/sh\n# comment\n// other\necho "hi # not comment"\n  x = 1 # trailing stays';
  const { text, removed } = stripFullLineComments(src);
  assert.equal(removed, 2);
  assert.ok(text.includes('#!/bin/sh'));
  assert.ok(text.includes('echo "hi # not comment"'));
  assert.ok(text.includes('x = 1 # trailing stays'));
});

// Fake secrets are concatenated so the repo stays self-scan clean.
const FAKE_ANT = 'sk-ant-' + 'a'.repeat(32);
const FAKE_GHP = 'ghp_' + 'abcdefghijklmnopqrstuvwxyz123456';

test('optimize pipeline reports savings', () => {
  const block = 'word '.repeat(100);
  const input = block + '\n\n' + block + '\n\n\n\n   \n' + 'key = "' + FAKE_ANT + '"';
  const r = optimize(input);
  assert.ok(r.saved > 0);
  assert.ok(r.after < r.before);
  assert.ok(r.text.includes('[REDACTED:'));
  assert.ok(Array.isArray(r.steps) && r.steps.length > 0);
});

test('optimize can disable redaction', () => {
  const r = optimize('token ' + FAKE_GHP, { redact: false });
  assert.ok(r.text.includes('ghp_'));
});
