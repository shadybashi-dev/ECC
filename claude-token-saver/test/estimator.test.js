'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { estimateTokens, isCodeHeavy, classifyComplexity, depthOptions } = require('../lib/estimator');

test('prose uses words x 1.3', () => {
  const text = 'hello world foo bar'; // 4 words
  const r = estimateTokens(text);
  assert.equal(r.mode, 'prose');
  assert.equal(r.tokens, Math.ceil(4 * 1.3));
});

test('code uses chars / 4', () => {
  const code = 'const x = 1;\nfunction f() { return x; }\n'.repeat(10);
  assert.equal(isCodeHeavy(code), true);
  const r = estimateTokens(code);
  assert.equal(r.mode, 'code');
  assert.equal(r.tokens, Math.ceil(code.length / 4));
});

test('fenced blocks force code mode', () => {
  assert.equal(isCodeHeavy('hello\n```js\ncode\n```'), true);
});

test('empty input is zero', () => {
  assert.deepEqual(estimateTokens(''), { tokens: 0, mode: 'prose', words: 0, chars: 0 });
});

test('complexity classification', () => {
  assert.equal(classifyComplexity('What is X?').level, 'Simple');
  assert.equal(classifyComplexity('Write me a bedtime story about the sea').level, 'Creative');
  assert.equal(classifyComplexity('Compare architectures with trade-offs across multi-region design').level, 'Complex');
});

test('depth options are ordered and capped', () => {
  const levels = depthOptions(100, { level: 'Medium', min: 8, max: 20 }, 8192);
  assert.equal(levels.length, 4);
  assert.deepEqual(levels.map((l) => l.pct), [25, 50, 75, 100]);
  assert.ok(levels[0].tokens <= levels[3].tokens);
  assert.ok(levels[3].tokens <= 8192);
});
