'use strict';

/**
 * Token estimation heuristics (no tokenizer dependency).
 *
 * Calibrated to the ECC context-budget conventions:
 *   - prose:  words x 1.3
 *   - code-heavy or mixed/code blocks: chars / 4
 *
 * Accuracy is roughly 85-90% (+/-15%). Always an estimate, never a bill.
 */

const CODE_LINE_RE = /^(\s{2,}|\s*[{}\]()};]*\s*$|\s*(import|export|const|let|var|function|class|def|return|if|for|while|include|using|package|func|fn|pub|private|public|async|await)\b)/;
const CODE_SYMBOL_RE = /[{};]|=>|->|::|&&|\|\||#include/;

/** Decide whether text is code-heavy. */
function isCodeHeavy(text) {
  if (!text) return false;
  if (text.includes('```')) return true;
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length === 0) return false;
  let codeLines = 0;
  for (const line of lines) {
    if (CODE_LINE_RE.test(line) || CODE_SYMBOL_RE.test(line)) codeLines++;
  }
  return codeLines / lines.length >= 0.3;
}

function countWords(text) {
  const m = text.match(/[^\s]+/g);
  return m ? m.length : 0;
}

/**
 * Estimate tokens for a string.
 * Returns { tokens, mode, words, chars } where mode is 'prose' | 'code'.
 */
function estimateTokens(text) {
  const input = text || '';
  const chars = input.length;
  const words = countWords(input);
  if (chars === 0) return { tokens: 0, mode: 'prose', words: 0, chars: 0 };
  if (isCodeHeavy(input)) {
    return { tokens: Math.ceil(chars / 4), mode: 'code', words, chars };
  }
  return { tokens: Math.ceil(words * 1.3), mode: 'prose', words, chars };
}

// Complexity classification (mirrors the token-budget-advisor skill).
const COMPLEXITY_TABLE = [
  { level: 'Simple', min: 3, max: 8 },
  { level: 'Medium', min: 8, max: 20 },
  { level: 'Medium-High', min: 10, max: 25 },
  { level: 'Complex', min: 15, max: 40 },
  { level: 'Creative', min: 10, max: 30 },
];

const CREATIVE_RE = /(story|stories|poem|essay|novel|lyrics|قص[ةه]|شعر|رواي[ةه]|مقال[ةه]|سيناريو)/i;
const COMPLEX_RE = /(architect|compare|comparison|trade-?off|multi|design system|migrat|تحليل شامل|معماري[ةه]|مقارن[ةه])/i;
const CODE_REQUEST_RE = /(```|refactor|implement|debug|endpoint|function|class |اكتب كود|دال[ةه]|كود|برمج)/i;
const SIMPLE_RE = /^(what is|who is|yes or no|is |are |define |ما هو|ما هي|نعم أم لا|عرف|هل )\S.{0,80}$/i;

/** Classify prompt complexity for response-size projection. */
function classifyComplexity(prompt) {
  const text = (prompt || '').trim();
  if (CREATIVE_RE.test(text)) return COMPLEXITY_TABLE[4];
  if (COMPLEX_RE.test(text) || text.length > 4000) return COMPLEXITY_TABLE[3];
  if (CODE_REQUEST_RE.test(text) || text.length > 1200) return COMPLEXITY_TABLE[2];
  if (SIMPLE_RE.test(text) || text.length < 160) return COMPLEXITY_TABLE[0];
  return COMPLEXITY_TABLE[1];
}

/**
 * Build the 4 depth levels (25/50/75/100%) for a given input size.
 * maxOutput caps the projection to the model's output limit.
 */
function depthOptions(inputTokens, complexity, maxOutput = 8192) {
  const min = inputTokens * complexity.min;
  const max = Math.min(inputTokens * complexity.max, maxOutput);
  const span = Math.max(0, max - min);
  const at = (p) => Math.round(min + span * p);
  return [
    { level: 1, name: 'Essential', pct: 25, tokens: at(0.25), includes: 'Direct answer only' },
    { level: 2, name: 'Moderate', pct: 50, tokens: at(0.5), includes: 'Answer + context + 1 example' },
    { level: 3, name: 'Detailed', pct: 75, tokens: at(0.75), includes: 'Full answer with alternatives' },
    { level: 4, name: 'Exhaustive', pct: 100, tokens: at(1), includes: 'Everything, no limits' },
  ];
}

module.exports = {
  isCodeHeavy,
  countWords,
  estimateTokens,
  classifyComplexity,
  depthOptions,
  COMPLEXITY_TABLE,
};
