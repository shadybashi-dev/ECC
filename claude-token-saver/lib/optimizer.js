'use strict';

/**
 * Prompt optimizer: deterministic, lossless-ish compression for LLM prompts.
 *
 * Pipeline (each step optional):
 *   1. strip invisible/unsafe unicode (security + tokens)
 *   2. normalize line endings, strip trailing spaces, collapse blank lines
 *   3. dedupe identical blocks
 *   4. minify fenced ```json blocks
 *   5. truncate oversized fenced code blocks (head + tail + marker)
 *   6. strip full-line code comments (opt-in, conservative)
 *   7. redact secrets (on by default)
 *
 * Every step reports before/after token counts so savings are visible.
 */

const { estimateTokens } = require('./estimator');
const { redactText } = require('./secrets');

// Same dangerous set ECC scans for: zero-width, bidi, tags, variation selectors.
function isDangerousCodePoint(cp) {
  return (
    (cp >= 0x200b && cp <= 0x200d) ||
    cp === 0x2060 || cp === 0xfeff ||
    (cp >= 0x202a && cp <= 0x202e) ||
    (cp >= 0x2066 && cp <= 0x2069) ||
    (cp >= 0xfe00 && cp <= 0xfe0f) ||
    (cp >= 0xe0000 && cp <= 0xe007f) ||
    (cp >= 0xe0100 && cp <= 0xe01ef) ||
    cp === 0x180e || cp === 0x115f || cp === 0x1160 ||
    (cp >= 0x2061 && cp <= 0x2064) ||
    cp === 0x3164
  );
}

function stripInvisibleUnicode(text) {
  let out = '';
  for (const ch of text) {
    if (!isDangerousCodePoint(ch.codePointAt(0))) out += ch;
  }
  return out;
}

function normalizeWhitespace(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/^[ \t]+$/gm, '')
    .trim() + '\n';
}

/**
 * Drop identical repeated blocks (paragraphs >= minChars). Keeps first
 * occurrence, inserts a short marker where later copies were removed.
 */
function dedupeBlocks(text, minChars = 120) {
  const seen = new Set();
  const parts = text.split(/\n{2,}/);
  let removed = 0;
  const kept = [];
  for (const part of parts) {
    const key = part.trim();
    if (key.length >= minChars) {
      if (seen.has(key)) {
        removed++;
        continue;
      }
      seen.add(key);
    }
    kept.push(part);
  }
  let out = kept.join('\n\n');
  if (removed > 0) {
    out += `\n\n[Deduped ${removed} repeated block${removed === 1 ? '' : 's'}]\n`;
  }
  return { text: out, removed };
}

/** Minify fenced ```json blocks (only when valid JSON). */
function minifyJsonBlocks(text) {
  let count = 0;
  const out = text.replace(/```json\s*\n([\s\S]*?)```/g, (m, body) => {
    try {
      const min = JSON.stringify(JSON.parse(body));
      count++;
      return '```json\n' + min + '\n```';
    } catch {
      return m;
    }
  });
  return { text: out, count };
}

/**
 * Truncate fenced code blocks longer than maxLines.
 * Keeps head + tail with a visible marker (never silent).
 */
function truncateCodeBlocks(text, maxLines = 120) {
  let count = 0;
  let dropped = 0;
  const out = text.replace(/```([^\n]*)\n([\s\S]*?)```/g, (m, lang, body) => {
    const lines = body.split('\n');
    if (lines.length <= maxLines) return m;
    const head = Math.ceil(maxLines * 0.7);
    const tail = Math.floor(maxLines * 0.3);
    dropped += lines.length - maxLines;
    count++;
    const marker = `... [truncated ${lines.length - maxLines} lines by cts optimize] ...`;
    return '```' + lang + '\n' + [...lines.slice(0, head), marker, ...lines.slice(lines.length - tail)].join('\n') + '```';
  });
  return { text: out, count, dropped };
}

// Conservative full-line comment stripper. Keeps shebang, URLs, and
// anything indented inside strings is out of scope by design (line-based).
const FULL_LINE_COMMENT_RE = /^\s*(\/\/[^:]|#[^!]|--[^-])/;

function stripFullLineComments(text) {
  const lines = text.split('\n');
  let inFence = false;
  let removed = 0;
  const kept = [];
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && FULL_LINE_COMMENT_RE.test(line)) {
      removed++;
      continue;
    }
    kept.push(line);
  }
  return { text: kept.join('\n'), removed };
}

const DEFAULT_OPTIONS = {
  invisible: true,
  whitespace: true,
  dedupe: true,
  minifyJson: true,
  truncateCode: true,
  maxCodeLines: 120,
  stripComments: false,
  redact: true,
};

/**
 * Run the optimization pipeline.
 * Returns { text, before, after, saved, savedPct, steps }.
 */
function optimize(input, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const before = estimateTokens(input).tokens;
  const steps = [];
  let text = input;

  const apply = (name, fn) => {
    const t0 = estimateTokens(text).tokens;
    text = fn();
    const t1 = estimateTokens(text).tokens;
    steps.push({ step: name, before: t0, after: t1, saved: t0 - t1 });
  };

  if (opts.invisible) apply('strip-invisible-unicode', () => stripInvisibleUnicode(text));
  if (opts.whitespace) apply('normalize-whitespace', () => normalizeWhitespace(text));
  if (opts.dedupe) {
    apply('dedupe-blocks', () => dedupeBlocks(text).text);
  }
  if (opts.minifyJson) apply('minify-json', () => minifyJsonBlocks(text).text);
  if (opts.truncateCode) apply('truncate-code', () => truncateCodeBlocks(text, opts.maxCodeLines).text);
  if (opts.stripComments) apply('strip-comments', () => stripFullLineComments(text).text);
  if (opts.redact) apply('redact-secrets', () => redactText(text).text);

  const after = estimateTokens(text).tokens;
  const saved = Math.max(0, before - after);
  return {
    text,
    before,
    after,
    saved,
    savedPct: before === 0 ? 0 : saved / before,
    steps,
  };
}

module.exports = {
  DEFAULT_OPTIONS,
  stripInvisibleUnicode,
  normalizeWhitespace,
  dedupeBlocks,
  minifyJsonBlocks,
  truncateCodeBlocks,
  stripFullLineComments,
  optimize,
};
