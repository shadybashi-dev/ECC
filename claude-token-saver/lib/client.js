'use strict';

/**
 * Secure Anthropic Messages API client.
 *
 * Security rules (non-negotiable):
 *   - API key comes ONLY from the ANTHROPIC_API_KEY environment variable.
 *     It is never accepted as a CLI arg, never printed, never logged.
 *   - ANTHROPIC_BASE_URL from the environment is IGNORED by default
 *     (CVE-2026-21852 class: malicious projects redirecting API traffic
 *     to steal keys). A custom base URL requires BOTH:
 *       CTS_ALLOW_BASE_URL=1  +  explicit --base-url flag,
 *     and the hostname must be allowlisted via CTS_ALLOWED_HOSTS.
 *   - https only (http allowed solely for loopback dev proxies).
 *   - Model ids are validated against a conservative pattern + allowlist.
 *   - Prompt size is capped (CTS_MAX_PROMPT_BYTES, default 1 MiB).
 *   - If the prompt looks like it contains secrets, we warn on stderr
 *     (and can abort with CTS_ABORT_ON_SECRET=1).
 *
 * Token-saving rules:
 *   - Anthropic prompt caching via cache_control breakpoints (system + messages).
 *   - Local content-hash cache: identical requests cost 0 tokens.
 *   - Usage/cost recorded to a private JSONL log (no prompt content).
 */

const { CtsCache, keyFor } = require('./cache');
const { loadPrices, priceFor } = require('./prices');
const { scanText } = require('./secrets');
const { stripInvisibleUnicode } = require('./optimizer');
const { sleep } = require('./utils');

const DEFAULT_BASE_URL = 'https://api.anthropic.com';
const DEFAULT_MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL_ID_RE = /^claude-[A-Za-z0-9][A-Za-z0-9._-]{0,60}$/;
const MAX_MAX_TOKENS = 64000;
const DEFAULT_TIMEOUT_MS = 120000;

function defaultAllowedHosts() {
  const extra = (process.env.CTS_ALLOWED_HOSTS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return ['api.anthropic.com', ...extra];
}

function loadApiKey() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.trim() === '') {
    throw new Error('Missing ANTHROPIC_API_KEY. Export it in your shell; never pass keys as CLI arguments.');
  }
  return key;
}

/**
 * Resolve the API base URL with SSRF/redirect protections.
 * `explicitBaseUrl` may only come from an explicit CLI flag.
 */
function resolveBaseUrl(explicitBaseUrl) {
  if (!explicitBaseUrl) return DEFAULT_BASE_URL;
  if (process.env.CTS_ALLOW_BASE_URL !== '1') {
    throw new Error(
      'Refusing custom --base-url: set CTS_ALLOW_BASE_URL=1 to acknowledge you trust this endpoint. ' +
      '(This guard blocks malicious ANTHROPIC_BASE_URL redirects.)'
    );
  }
  assertUrlAllowed(explicitBaseUrl, defaultAllowedHosts());
  return explicitBaseUrl.replace(/\/+$/, '');
}

function assertUrlAllowed(rawUrl, allowedHosts) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid base URL: ${rawUrl}`);
  }
  if (url.username || url.password) {
    throw new Error('Base URL must not contain credentials.');
  }
  const host = url.hostname.toLowerCase();
  const isLoopback = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  if (url.protocol === 'http:' && !isLoopback) {
    throw new Error('Base URL must use https (http is only allowed for loopback).');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Base URL must use https.');
  }
  const allowed = allowedHosts.map((h) => h.toLowerCase());
  if (!isLoopback && !allowed.includes(host)) {
    throw new Error(`Host not allowlisted: ${host}. Add it to CTS_ALLOWED_HOSTS to proceed.`);
  }
  return url.toString().replace(/\/+$/, '');
}

function assertValidModel(model) {
  if (!MODEL_ID_RE.test(model)) {
    throw new Error(`Refusing suspicious model id: ${model}`);
  }
  const allow = (process.env.CTS_ALLOWED_MODELS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  if (allow.length > 0 && !allow.includes(model)) {
    throw new Error(`Model not in CTS_ALLOWED_MODELS: ${model}`);
  }
}

function maxPromptBytes() {
  const raw = parseInt(process.env.CTS_MAX_PROMPT_BYTES || '', 10);
  if (Number.isFinite(raw) && raw > 1024 && raw <= 8 * 1024 * 1024) return raw;
  return 1024 * 1024;
}

function warnIfSecrets(prompt) {
  const findings = scanText(prompt, '<prompt>');
  if (findings.length === 0) return;
  const names = [...new Set(findings.map((f) => f.pattern))].join(', ');
  const msg = `WARNING: your prompt looks like it contains secrets (${names}). It will be sent to the API.`;
  if (process.env.CTS_ABORT_ON_SECRET === '1') {
    throw new Error(msg + ' Aborted (CTS_ABORT_ON_SECRET=1).');
  }
  process.stderr.write(msg + '\n');
}

function buildRequest({ system, prompt, model, maxTokens, temperature, useCache, betas }) {
  const sysBlock = system
    ? [{ type: 'text', text: system, ...(useCache ? { cache_control: { type: 'ephemeral' } } : {}) }]
    : undefined;
  const userBlock = { type: 'text', text: prompt };
  if (useCache) userBlock.cache_control = { type: 'ephemeral' };
  const body = {
    model,
    max_tokens: maxTokens,
    system: sysBlock,
    messages: [{ role: 'user', content: [userBlock] }],
  };
  if (temperature !== undefined) body.temperature = temperature;
  const headers = {
    'content-type': 'application/json',
    'anthropic-version': ANTHROPIC_VERSION,
  };
  if (betas) headers['anthropic-beta'] = betas;
  return { body, headers };
}

function extractText(data) {
  if (!data || !Array.isArray(data.content)) return '';
  return data.content.filter((b) => b.type === 'text').map((b) => b.text || '').join('');
}

async function fetchWithRetry(url, { headers, body, apiKey, timeoutMs, maxRetries = 3 }) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { ...headers, 'x-api-key': apiKey },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.status === 429 || (res.status >= 500 && res.status <= 599)) {
        lastError = new Error(`API request failed with status ${res.status}.`);
        if (attempt < maxRetries) {
          await sleep(500 * Math.pow(2, attempt));
          continue;
        }
        throw lastError;
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API request failed with status ${res.status}: ${text.slice(0, 300)}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      const retryable = err && (err.name === 'AbortError' || /status 429/.test(err.message) || /status 5\d\d/.test(err.message));
      if (retryable && attempt < maxRetries) {
        await sleep(500 * Math.pow(2, attempt));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

/**
 * Send one chat completion. Options:
 *   { prompt, system, model, maxTokens, temperature, useCache, betas,
 *     baseUrl (explicit flag only), timeoutMs, cacheTtlMs, noCache,
 *     cacheDir, prices }
 */
async function chat(options = {}) {
  const prompt = String(options.prompt || '');
  if (prompt.trim() === '') throw new Error('Empty prompt.');
  if (Buffer.byteLength(prompt, 'utf8') > maxPromptBytes()) {
    throw new Error(`Prompt exceeds ${maxPromptBytes()} bytes. Shrink it or raise CTS_MAX_PROMPT_BYTES.`);
  }
  const model = options.model || process.env.CTS_MODEL || DEFAULT_MODEL;
  assertValidModel(model);
  const maxTokens = options.maxTokens ?? 1024;
  if (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > MAX_MAX_TOKENS) {
    throw new Error(`maxTokens must be an integer 1..${MAX_MAX_TOKENS}.`);
  }
  if (options.temperature !== undefined && (typeof options.temperature !== 'number' || options.temperature < 0 || options.temperature > 2)) {
    throw new Error('temperature must be a number 0..2.');
  }

  const safePrompt = stripInvisibleUnicode(prompt);
  warnIfSecrets(safePrompt);

  const useCache = options.useCache !== false;
  const betas = options.betas || process.env.CTS_ANTHROPIC_BETAS || undefined;
  const { body, headers } = buildRequest({
    system: options.system ? stripInvisibleUnicode(String(options.system)) : undefined,
    prompt: safePrompt,
    model,
    maxTokens,
    temperature: options.temperature,
    useCache,
    betas,
  });

  const cache = new CtsCache(options.cacheDir);
  const cacheKey = keyFor({
    model, system: options.system || '', messages: body.messages,
    maxTokens, temperature: options.temperature,
  });

  const started = Date.now();
  if (!options.noCache) {
    const hit = cache.get(cacheKey);
    if (hit) {
      cache.logUsage({ ...hit.usageLog, cacheHit: true, latencyMs: Date.now() - started });
      return { ...hit.result, cacheHit: true, latencyMs: Date.now() - started };
    }
  }

  const apiKey = loadApiKey();
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const timeoutMs = options.timeoutMs || parseInt(process.env.CTS_TIMEOUT_MS || '', 10) || DEFAULT_TIMEOUT_MS;

  const data = await fetchWithRetry(baseUrl + '/v1/messages', {
    headers, body, apiKey, timeoutMs,
  });

  const usage = data.usage || {};
  const table = options.prices || loadPrices();
  const price = priceFor(table, model);
  const inTok = usage.input_tokens || 0;
  const outTok = usage.output_tokens || 0;
  const cacheRead = usage.cache_read_input_tokens || 0;
  const cacheCreate = usage.cache_creation_input_tokens || 0;
  // Cache reads billed at cacheRead rate; creation at write ratio x input.
  const costUsd = ((Math.max(0, inTok - cacheRead - cacheCreate) / 1e6) * price.input)
    + ((cacheRead / 1e6) * price.cacheRead)
    + ((cacheCreate / 1e6) * price.input * table.cacheWriteRatio)
    + ((outTok / 1e6) * price.output);

  const result = {
    text: extractText(data),
    model: data.model || model,
    stopReason: data.stop_reason || null,
    usage: {
      inputTokens: inTok, outputTokens: outTok,
      cacheReadTokens: cacheRead, cacheCreationTokens: cacheCreate,
    },
    priceId: price.id,
    costUsd,
    cacheHit: false,
    latencyMs: Date.now() - started,
  };

  if (!options.noCache) {
    cache.set(cacheKey, {
      result: { ...result, latencyMs: 0 },
      usageLog: {
        model, inputTokens: inTok, outputTokens: outTok,
        cacheReadTokens: cacheRead, cacheCreationTokens: cacheCreate, costUsd,
      },
    }, options.cacheTtlMs);
  }
  cache.logUsage({
    model, inputTokens: inTok, outputTokens: outTok,
    cacheReadTokens: cacheRead, cacheCreationTokens: cacheCreate,
    costUsd, cacheHit: false, latencyMs: result.latencyMs,
  });

  return result;
}

module.exports = {
  DEFAULT_BASE_URL,
  DEFAULT_MODEL,
  ANTHROPIC_VERSION,
  loadApiKey,
  resolveBaseUrl,
  assertUrlAllowed,
  assertValidModel,
  warnIfSecrets,
  buildRequest,
  chat,
};
