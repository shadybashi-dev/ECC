'use strict';

/**
 * Claude API price table (USD per 1M tokens).
 *
 * Defaults below reflect public pricing observed around 2026-09-10.
 * Prices change — override at runtime without editing code:
 *
 *   CTS_PRICES_JSON='{"my-model":{"input":2,"output":10}}' cts estimate file
 *   cts estimate file --prices ./my-prices.json
 *
 * Any model not listed falls back to `default`.
 */

const DEFAULT_PRICES = {
  asOf: '2026-09-10',
  currency: 'USD',
  unit: 'per-1M-tokens',
  // Cache reads cost ~10% of input unless a model overrides cacheRead.
  cacheReadRatio: 0.1,
  cacheWriteRatio: 1.25,
  models: {
    'claude-haiku-4-5': { input: 1, output: 5, cacheRead: 0.1 },
    'claude-sonnet-5': { input: 2, output: 10, cacheRead: 0.2 },
    'claude-sonnet-4-6': { input: 3, output: 15, cacheRead: 0.3 },
    'claude-opus-5': { input: 5, output: 25, cacheRead: 0.5 },
    'claude-opus-4-8': { input: 5, output: 25, cacheRead: 0.5 },
    'claude-opus-4-6': { input: 5, output: 25, cacheRead: 0.5 },
    'claude-fable-5-1': { input: 10, output: 50, cacheRead: 0.25 },
    default: { input: 3, output: 15, cacheRead: 0.3 },
  },
};

function loadPrices() {
  // Deep clone so callers can mutate safely.
  const table = JSON.parse(JSON.stringify(DEFAULT_PRICES));
  const raw = process.env.CTS_PRICES_JSON;
  if (raw) {
    let extra;
    try {
      extra = JSON.parse(raw);
    } catch {
      throw new Error('CTS_PRICES_JSON is not valid JSON.');
    }
    if (extra && typeof extra === 'object') {
      for (const [k, v] of Object.entries(extra)) {
        if (v && typeof v.input === 'number' && typeof v.output === 'number') {
          table.models[k] = {
            input: v.input,
            output: v.output,
            cacheRead: typeof v.cacheRead === 'number' ? v.cacheRead : v.input * table.cacheReadRatio,
          };
        }
      }
    }
  }
  return table;
}

/** Find a price row for a model id (exact match, then prefix/case-insensitive). */
function priceFor(table, model) {
  const models = table.models;
  if (models[model]) return { id: model, ...models[model] };
  const lower = String(model).toLowerCase();
  for (const [id, row] of Object.entries(models)) {
    if (id === 'default') continue;
    const lid = id.toLowerCase();
    if (lid === lower || lower.startsWith(lid) || lid.startsWith(lower)) {
      return { id, ...row };
    }
  }
  return { id: 'default', ...models.default };
}

/** Cost of input+output tokens in USD. */
function costOf(price, inputTokens, outputTokens) {
  return (inputTokens / 1e6) * price.input + (outputTokens / 1e6) * price.output;
}

/** Cost when `cachedTokens` of the input are cache reads. */
function costWithCache(price, inputTokens, cachedTokens, outputTokens) {
  const fresh = Math.max(0, inputTokens - cachedTokens);
  return ((fresh / 1e6) * price.input)
    + ((cachedTokens / 1e6) * price.cacheRead)
    + ((outputTokens / 1e6) * price.output);
}

module.exports = {
  DEFAULT_PRICES,
  loadPrices,
  priceFor,
  costOf,
  costWithCache,
};
