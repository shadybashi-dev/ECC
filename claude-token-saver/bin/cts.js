#!/usr/bin/env node
'use strict';

/**
 * cts — claude-token-saver CLI.
 *
 *   cts estimate <file|->        estimate tokens + cost + depth options
 *   cts optimize <file|->        compress a prompt, show savings
 *   cts audit [dir]              context-budget audit (agents/skills/rules/MCP)
 *   cts secrets [dir]            scan for secrets (GitHub-safety)
 *   cts hook install|uninstall   git pre-commit secret guard
 *   cts chat "prompt"            secure cached Claude call (prompt caching on)
 *   cts cache stats|clear        local response-cache management
 *   cts prices                   show the price table used for estimates
 */

const fs = require('fs');
const path = require('path');
const {
  readInputText, formatInt, formatUsd, formatPct,
  parseArgs, flagOn, flagValue, printStderr,
} = require('../lib/utils');
const { estimateTokens, classifyComplexity, depthOptions } = require('../lib/estimator');
const { loadPrices, priceFor, costOf, costWithCache } = require('../lib/prices');
const { optimize } = require('../lib/optimizer');
const { scanText, redactText, scanDir } = require('../lib/secrets');
const { CtsCache, defaultCacheDir } = require('../lib/cache');
const { audit } = require('../lib/budget');
const { chat } = require('../lib/client');
const { installHook, uninstallHook, stagedFiles, stagedBlob } = require('../lib/hook');

const VERSION = require('../package.json').version;

function loadPricesFile(flags) {
  const p = flagValue(flags, 'prices');
  if (!p) return loadPrices();
  const raw = fs.readFileSync(path.resolve(p), 'utf8');
  const prev = process.env.CTS_PRICES_JSON;
  process.env.CTS_PRICES_JSON = raw;
  try {
    return loadPrices();
  } finally {
    if (prev === undefined) delete process.env.CTS_PRICES_JSON;
    else process.env.CTS_PRICES_JSON = prev;
  }
}

function help() {
  return `cts v${VERSION} — Claude token saver + GitHub-safety toolkit (zero dependencies)

USAGE
  cts <command> [args] [options]

COMMANDS
  estimate <file|->        Estimate tokens, cost, and response-depth options.
                           Options: --model <id>, --prices <json>, --json
  optimize <file|-> [-o]   Compress a prompt; print optimized text + savings.
                           Options: --strip-comments, --no-redact,
                                    --max-code-lines <n>, --json, -o/--out <file>
  audit [dir]              Context-budget audit: agents/skills/rules/MCP/CLAUDE.md.
                           Options: --verbose, --json
  secrets [dir]            Scan for secrets. Exit 1 when findings exist (CI-ready).
                           Options: --staged (scan git staged blobs), --quiet, --json
  redact <file|->          Redact secrets from text and print the result.
  hook install             Install git pre-commit hook that blocks secret leaks.
  hook uninstall           Remove the cts block from the pre-commit hook.
  chat "prompt"            Secure Claude call with prompt caching + local cache.
                           Options: --model <id>, --system <text>, --max-tokens <n>,
                                    --temp <0..2>, --no-cache, --stats, --json
                           Key ONLY from ANTHROPIC_API_KEY env (never as an arg).
  cache stats              Show cache entries, bytes, and lifetime usage/cost.
  cache clear              Delete cached responses (keeps usage log).
  prices                   Show the price table used for cost estimates.

GLOBAL
  -h, --help               Show this help.   -v, --version   Print version.

EXAMPLES
  cts estimate prompt.txt --model claude-haiku-4-5
  cat prompt.txt | cts optimize --strip-comments -o prompt.small.txt
  cts audit --verbose
  cts secrets . && echo "safe to push"
  cts hook install
  export ANTHROPIC_API_KEY="..." && cts chat "Explain prompt caching briefly" --stats

DOCS
  https://github.com/shadybashi-dev/ECC/tree/arena/01a09496-ecc/claude-token-saver`;
}

// ---------------------------------------------------------------- estimate
async function cmdEstimate(positionals, flags) {
  const text = await readInputText(positionals[0]);
  const model = flagValue(flags, 'model') || process.env.CTS_MODEL || 'claude-sonnet-4-6';
  const table = loadPricesFile(flags);
  const price = priceFor(table, model);
  const est = estimateTokens(text);
  const complexity = classifyComplexity(text);
  const levels = depthOptions(est.tokens, complexity);
  const fullOut = levels[3].tokens;
  const costFull = costOf(price, est.tokens, fullOut);
  const result = {
    model: price.id,
    inputTokens: est.tokens,
    mode: est.mode,
    complexity: complexity.level,
    levels: levels.map((l) => ({
      level: l.level, name: l.name, pct: l.pct,
      outputTokens: l.tokens, costUsd: +costOf(price, est.tokens, l.tokens).toFixed(6),
    })),
    fullCostUsd: +costFull.toFixed(6),
    cachedCostUsd: +costWithCache(price, est.tokens, est.tokens, fullOut).toFixed(6),
    accuracy: 'heuristic ~85-90% (+/-15%)',
  };
  if (flagOn(flags, 'json')) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`Input: ~${formatInt(est.tokens)} tokens | Mode: ${est.mode} | Complexity: ${complexity.level} | Model: ${price.id}`);
  console.log('');
  console.log('Choose your depth level:');
  console.log('');
  for (const l of result.levels) {
    console.log(`  [${l.level}] ${l.name.padEnd(10)} (${String(l.pct).padStart(3)}%) -> ~${formatInt(l.outputTokens).padStart(7)} out tokens  ~${formatUsd(l.costUsd)}`);
  }
  console.log('');
  console.log(`Full answer cost: ~${formatUsd(costFull)}  |  With 100% cache hits: ~${formatUsd(result.cachedCostUsd)}`);
  console.log('Precision: heuristic estimate ~85-90% accuracy (+/-15%). Prices as of ' + table.asOf + '.');
}

// ---------------------------------------------------------------- optimize
async function cmdOptimize(positionals, flags) {
  const text = await readInputText(positionals[0]);
  const maxCodeLines = parseInt(flagValue(flags, 'max-code-lines') || '120', 10) || 120;
  const result = optimize(text, {
    stripComments: flagOn(flags, 'strip-comments'),
    redact: !flagOn(flags, 'no-redact'),
    maxCodeLines,
  });
  const outFile = flagValue(flags, 'o', 'out');
  if (flagOn(flags, 'json')) {
    console.log(JSON.stringify({
      before: result.before, after: result.after,
      saved: result.saved, savedPct: +result.savedPct.toFixed(4),
      steps: result.steps,
      ...(outFile ? {} : { text: result.text }),
    }, null, 2));
  } else {
    printStderr(`Before: ~${formatInt(result.before)} tokens -> After: ~${formatInt(result.after)} tokens | Saved: ~${formatInt(result.saved)} (${formatPct(result.savedPct)})`);
    for (const s of result.steps) {
      if (s.saved !== 0) printStderr(`  ${s.step}: ${formatInt(s.before)} -> ${formatInt(s.after)} (${s.saved >= 0 ? '-' : '+'}${formatInt(Math.abs(s.saved))})`);
    }
  }
  if (outFile) {
    fs.writeFileSync(path.resolve(outFile), result.text);
    if (!flagOn(flags, 'json')) printStderr(`Wrote ${outFile}`);
  } else if (!flagOn(flags, 'json')) {
    process.stdout.write(result.text);
  }
}

// ---------------------------------------------------------------- audit
async function cmdAudit(positionals, flags) {
  const report = audit(positionals[0] || '.', { verbose: flagOn(flags, 'verbose') });
  if (flagOn(flags, 'json')) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  const t = report.totals;
  console.log('Context Budget Report');
  console.log('=======================================');
  console.log('');
  console.log(`Total estimated overhead: ~${formatInt(t.all)} tokens`);
  console.log('');
  console.log('Component Breakdown:');
  console.log(`  Agents     ${String(t.agents.count).padStart(4)}  ~${formatInt(t.agents.tokens)} tokens`);
  console.log(`  Skills     ${String(t.skills.count).padStart(4)}  ~${formatInt(t.skills.tokens)} tokens`);
  console.log(`  Rules      ${String(t.rules.count).padStart(4)}  ~${formatInt(t.rules.tokens)} tokens`);
  console.log(`  MCP tools  ${String(t.mcp.tools).padStart(4)}  ~${formatInt(t.mcp.tokens)} tokens (${t.mcp.servers} servers${t.mcp.configFile ? ', ' + t.mcp.configFile : ''})`);
  console.log(`  CLAUDE.md  ${String(t.claudeMd.count).padStart(4)}  ~${formatInt(t.claudeMd.tokens)} tokens`);
  console.log('');
  if (report.issues.length === 0) {
    console.log('No issues found. Context overhead looks healthy.');
    return;
  }
  console.log(`Issues found (${report.issues.length}), ranked by savings:`);
  for (const [i, is] of report.issues.slice(0, 10).entries()) {
    console.log(`  ${i + 1}. [${is.severity}] ${is.title} -> save ~${formatInt(is.savings)} tokens`);
    console.log(`     ${is.detail}`);
  }
  if (report.issues.length > 10) console.log(`  ... and ${report.issues.length - 10} more (see --json)`);
  console.log('');
  console.log(`Potential savings: ~${formatInt(report.potentialSavings)} tokens (${formatPct(t.all ? report.potentialSavings / t.all : 0)} of overhead)`);
}

// ---------------------------------------------------------------- secrets
async function cmdSecrets(positionals, flags) {
  const quiet = flagOn(flags, 'quiet');
  let findings;
  let where;
  if (flagOn(flags, 'staged')) {
    const cwd = process.cwd();
    const files = stagedFiles(cwd);
    findings = [];
    for (const f of files) {
      const blob = stagedBlob(cwd, f);
      if (blob === null) continue;
      findings.push(...scanText(blob, f + ' (staged)'));
    }
    where = `staged files (${files.length})`;
  } else {
    const target = positionals[0] || '.';
    if (fs.existsSync(path.resolve(target)) && fs.statSync(path.resolve(target)).isFile()) {
      findings = scanText(fs.readFileSync(path.resolve(target), 'utf8'), target);
      where = target;
    } else {
      const res = scanDir(target);
      findings = res.findings;
      where = `${target} (${res.scanned.files} files scanned)`;
    }
  }
  if (flagOn(flags, 'json')) {
    console.log(JSON.stringify({ where, count: findings.length, findings }, null, 2));
  } else if (!quiet) {
    if (findings.length === 0) {
      console.log(`cts secrets: clean — no findings in ${where}. Safe to push.`);
    } else {
      console.log(`cts secrets: ${findings.length} finding(s) in ${where}:`);
      for (const f of findings.slice(0, 50)) {
        console.log(`  [${f.severity}] ${f.pattern} ${f.file}:${f.line}:${f.col} (${f.excerpt})`);
      }
      if (findings.length > 50) console.log(`  ... and ${findings.length - 50} more (see --json)`);
    }
  }
  if (findings.length > 0) process.exitCode = 1;
}

// ---------------------------------------------------------------- redact
async function cmdRedact(positionals, flags) {
  const text = await readInputText(positionals[0]);
  const { text: out, count } = redactText(text);
  if (!flagOn(flags, 'quiet')) printStderr(`Redacted ${count} secret(s).`);
  process.stdout.write(out);
}

// ---------------------------------------------------------------- hook
async function cmdHook(positionals) {
  const sub = positionals[0];
  if (sub === 'install') {
    const r = installHook();
    console.log(`cts hook: ${r.status} -> ${r.hookPath}`);
  } else if (sub === 'uninstall') {
    const r = uninstallHook();
    console.log(`cts hook: ${r.status} -> ${r.hookPath}`);
  } else {
    throw new Error('Usage: cts hook <install|uninstall>');
  }
}

// ---------------------------------------------------------------- chat
async function cmdChat(positionals, flags) {
  const prompt = positionals.length > 0 ? positionals.join(' ') : await readInputText('-');
  const maxTokensRaw = flagValue(flags, 'max-tokens');
  const tempRaw = flagValue(flags, 'temp', 'temperature');
  const result = await chat({
    prompt,
    system: flagValue(flags, 'system'),
    model: flagValue(flags, 'model'),
    maxTokens: maxTokensRaw !== undefined ? parseInt(maxTokensRaw, 10) : undefined,
    temperature: tempRaw !== undefined ? parseFloat(tempRaw) : undefined,
    useCache: !flagOn(flags, 'no-cache'),
    noCache: flagOn(flags, 'no-cache'),
    baseUrl: flagValue(flags, 'base-url'),
  });
  if (flagOn(flags, 'json')) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  process.stdout.write(result.text + (result.text.endsWith('\n') ? '' : '\n'));
  if (flagOn(flags, 'stats')) {
    const u = result.usage;
    printStderr(`--- model=${result.model} in=${formatInt(u.inputTokens)} out=${formatInt(u.outputTokens)} cache_read=${formatInt(u.cacheReadTokens)} cost=${formatUsd(result.costUsd)} cache_hit=${result.cacheHit} latency=${result.latencyMs}ms`);
  }
}

// ---------------------------------------------------------------- cache
async function cmdCache(positionals) {
  const sub = positionals[0] || 'stats';
  const cache = new CtsCache();
  if (sub === 'stats') {
    const s = cache.stats();
    const u = s.usage;
    console.log(`Cache dir: ${s.dir}`);
    console.log(`Entries: ${s.entries}  Bytes: ${formatInt(s.bytes)}`);
    console.log(`Lifetime: ${u.calls} calls, ${u.cacheHits} cache hits (${u.calls ? formatPct(u.cacheHits / u.calls) : 'n/a'})`);
    console.log(`Tokens: in=${formatInt(u.inputTokens)} out=${formatInt(u.outputTokens)} cache_read=${formatInt(u.cacheReadTokens)}`);
    console.log(`Total cost: ${formatUsd(u.costUsd)}`);
  } else if (sub === 'clear') {
    console.log(`Removed ${cache.clear()} cached response(s) from ${cache.dir}`);
  } else {
    throw new Error('Usage: cts cache <stats|clear>');
  }
}

// ---------------------------------------------------------------- prices
async function cmdPrices(positionals, flags) {
  void positionals;
  const table = loadPricesFile(flags);
  if (flagOn(flags, 'json')) {
    console.log(JSON.stringify(table, null, 2));
    return;
  }
  console.log(`Claude API prices (USD per 1M tokens, as of ${table.asOf}; override with CTS_PRICES_JSON):`);
  for (const [id, row] of Object.entries(table.models)) {
    console.log(`  ${id.padEnd(20)} in=$${row.input} out=$${row.output} cache_read=$${row.cacheRead}`);
  }
}

async function main(argv) {
  const { positionals, flags } = parseArgs(argv);
  if (flagOn(flags, 'h', 'help') || positionals.length === 0) {
    console.log(help());
    return;
  }
  if (flagOn(flags, 'v', 'version')) {
    console.log(VERSION);
    return;
  }
  const [cmd, ...rest] = positionals;
  switch (cmd) {
    case 'estimate': return await cmdEstimate(rest, flags);
    case 'optimize': return await cmdOptimize(rest, flags);
    case 'audit': return await cmdAudit(rest, flags);
    case 'secrets': return await cmdSecrets(rest, flags);
    case 'redact': return await cmdRedact(rest, flags);
    case 'hook': return await cmdHook(rest, flags);
    case 'chat':
    case 'ask': return await cmdChat(rest, flags);
    case 'cache': return await cmdCache(rest, flags);
    case 'prices': return await cmdPrices(rest, flags);
    case 'help': console.log(help()); return;
    default:
      printStderr(`Unknown command: ${cmd}\n`);
      console.log(help());
      process.exitCode = 2;
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err) => {
    printStderr('cts error: ' + (err && err.message ? err.message : String(err)));
    process.exitCode = 1;
  });
}

module.exports = { main, defaultCacheDir };
