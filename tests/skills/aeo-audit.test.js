#!/usr/bin/env node
/**
 * Tests for skills/aeo-audit/scripts/aeo-audit.mjs
 *
 * Covers robots.txt parsing, llms.txt validation, per-page checks, scoring,
 * and the CLI's offline (--html-file) path. No network access is used.
 */

'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..', '..');
const SCRIPT = path.join(REPO_ROOT, 'skills', 'aeo-audit', 'scripts', 'aeo-audit.mjs');

const {
  countWords,
  extractHeadings,
  extractImages,
  extractJsonLd,
  findBlockedBots,
  findFeedLink,
  isPathBlocked,
  parseRobotsGroups,
  runPageChecks,
  runSiteChecks,
  scoreReport,
  gradeFor,
  validateLlmsTxt,
  validateSitemap,
} = require(SCRIPT);

function test(name, fn) {
  try {
    fn();
    console.log(`  \u2713 ${name}`);
    return true;
  } catch (error) {
    console.log(`  \u2717 ${name}`);
    console.log(`    Error: ${error.message}`);
    return false;
  }
}

const GOOD_HTML = `<!doctype html><html lang="en"><head>
<title>Invoice Automation for Freelancers — Acme</title>
<meta name="description" content="Acme automates invoicing for freelancers: create, send, and reconcile invoices in one place with bank-level security.">
<link rel="canonical" href="https://example.com/">
<meta property="og:title" content="Invoice Automation for Freelancers">
<meta property="og:description" content="Automate invoicing end to end.">
<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Acme"},{"@type":"WebPage","name":"Home"}]}</script>
</head><body>
<nav><a href="/x">skip</a></nav>
<h1>Invoice automation for freelancers</h1>
<h2>What is Acme?</h2>
<p>Acme is an invoicing platform that creates and reconciles invoices automatically.</p>
<a href="/pricing">Pricing</a><a href="/docs">Docs</a><a href="/about">About</a><a href="/blog">Blog</a><a href="/contact">Contact</a>
<img src="/a.png" alt="Invoice flow"><img src="/b.png" alt="Dashboard">
</body></html>`;

const BAD_HTML = `<!doctype html><html><head><title>Home</title>
<meta name="robots" content="noindex">
<meta name="robots" content="noai">
</head><body><div>Welcome to our website.</div>
<img src="/a.png"><img src="/b.png">
</body></html>`;

function cleanPage(html, url = 'https://example.com/') {
  return runPageChecks({ url, html, robotsText: '', llmsTxt: '', sitemapXml: '' });
}

const results = [];

results.push(test('parseRobotsGroups keeps comments out of rules', () => {
  const groups = parseRobotsGroups('# note\nUser-agent: GPTBot # inline\nDisallow: /private');
  assert.strictEqual(groups.length, 1);
  assert.deepStrictEqual(groups[0].agents, ['gptbot']);
  assert.deepStrictEqual(groups[0].rules, [{ type: 'disallow', path: '/private' }]);
}));

results.push(test('isPathBlocked respects specific groups over wildcard', () => {
  const robots = [
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: *',
    'Allow: /',
  ].join('\n');
  const groups = parseRobotsGroups(robots);
  assert.strictEqual(isPathBlocked(groups, 'GPTBot'), true);
  assert.strictEqual(isPathBlocked(groups, 'PerplexityBot'), false);
}));

results.push(test('isPathBlocked honours an Allow that outranks Disallow', () => {
  const robots = [
    'User-agent: *',
    'Disallow: /private/',
    'Allow: /private/public/',
  ].join('\n');
  const groups = parseRobotsGroups(robots);
  assert.strictEqual(isPathBlocked(groups, 'ClaudeBot', '/private/public/page'), false);
  assert.strictEqual(isPathBlocked(groups, 'ClaudeBot', '/private/other'), true);
}));

results.push(test('findBlockedBots reports only blocked citation bots', () => {
  const robots = [
    'User-agent: GPTBot',
    'Disallow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Disallow: /',
  ].join('\n');
  const blocked = findBlockedBots(robots);
  assert.deepStrictEqual(blocked, ['OAI-SearchBot']);
}));

results.push(test('validateLlmsTxt requires heading and link', () => {
  assert.strictEqual(validateLlmsTxt('').valid, false);
  assert.strictEqual(validateLlmsTxt('# Site\n\n> Desc\n').valid, false);
  assert.strictEqual(validateLlmsTxt('# Site\n\n> Desc\n\n- [A](https://a.com)\n').valid, true);
}));

results.push(test('validateSitemap counts urls and lastmod', () => {
  const xml = '<urlset><url><loc>https://a.com</loc><lastmod>2026-01-01</lastmod></url></urlset>';
  const result = validateSitemap(xml);
  assert.strictEqual(result.isUrlset, true);
  assert.strictEqual(result.locCount, 1);
  assert.strictEqual(result.lastmodCount, 1);
}));

results.push(test('findFeedLink finds a rel=alternate feed', () => {
  const html = '<link rel="alternate" type="application/rss+xml" href="/feed.xml">';
  assert.strictEqual(findFeedLink(html, 'https://example.com'), '/feed.xml');
  assert.strictEqual(findFeedLink('<html></html>', 'https://example.com'), null);
}));

results.push(test('countWords and extractHeadings handle real markup', () => {
  assert.strictEqual(countWords('one two three'), 3);
  const headings = extractHeadings('<h1>A</h1><h2>B</h2><h3>C</h3>');
  assert.deepStrictEqual(headings.map(heading => heading.level), [1, 2, 3]);
}));

results.push(test('extractImages and extractJsonLd parse structured blocks', () => {
  const images = extractImages('<img src="a.png" alt="x"><img src="b.png">');
  assert.strictEqual(images[0].hasAltAttribute, true);
  assert.strictEqual(images[1].hasAltAttribute, false);
  const blocks = extractJsonLd('<script type="application/ld+json">{"@type":"Article"}</script>');
  assert.strictEqual(blocks.length, 1);
  assert.strictEqual(blocks[0].parsed['@type'], 'Article');
}));

results.push(test('a well-formed page passes the high-value checks', () => {
  const page = cleanPage(GOOD_HTML);
  const byId = Object.fromEntries(page.checks.map(check => [check.id, check]));
  for (const id of ['title', 'meta-description', 'canonical', 'h1', 'schema', 'og', 'internal-links']) {
    assert.strictEqual(byId[id].passed, true, `${id} should pass`);
  }
  assert.strictEqual(page.h1Count, 1);
  assert.ok(page.schemaTypes.includes('Organization'));
}));

results.push(test('a broken page fails indexability and AI meta checks', () => {
  const page = cleanPage(BAD_HTML);
  const byId = Object.fromEntries(page.checks.map(check => [check.id, check]));
  assert.strictEqual(byId.indexability.passed, false);
  assert.strictEqual(byId['ai-meta-tags'].passed, false);
  assert.strictEqual(byId.canonical.passed, false);
  assert.strictEqual(byId['heading-hierarchy'].passed, false);
}));

results.push(test('scoreReport stays between 0 and 100 and grades correctly', () => {
  const good = cleanPage(GOOD_HTML);
  const bad = cleanPage(BAD_HTML);
  const siteChecks = runSiteChecks({ html: GOOD_HTML, url: 'https://example.com' }).checks;
  const goodScore = scoreReport([good], siteChecks);
  const badScore = scoreReport([bad], siteChecks);
  assert.ok(goodScore.foundationalScore >= 0 && goodScore.foundationalScore <= 100);
  assert.ok(badScore.foundationalScore < goodScore.foundationalScore);
  assert.strictEqual(gradeFor(96), 'A+');
  assert.strictEqual(gradeFor(39), 'F');
}));

results.push(test('site checks flag a blocked citation bot and missing llms.txt', () => {
  const robots = 'User-agent: PerplexityBot\nDisallow: /\n';
  const site = runSiteChecks({ html: GOOD_HTML, robotsText: robots, url: 'https://example.com' });
  const byId = Object.fromEntries(site.checks.map(check => [check.id, check]));
  assert.strictEqual(byId['ai-bot-access'].passed, false);
  assert.strictEqual(byId['llms-txt'].passed, false);
  assert.deepStrictEqual(site.blockedBots, ['PerplexityBot']);
}));

results.push(test('CLI audits a local HTML file without network access', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aeo-audit-test-'));
  const file = path.join(dir, 'page.html');
  fs.writeFileSync(file, GOOD_HTML);
  try {
    const result = spawnSync(process.execPath, [
      SCRIPT,
      'https://example.com',
      `--html-file=${file}`,
      '--json',
    ], { encoding: 'utf8' });
    assert.strictEqual(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.strictEqual(report.pagesCrawled.length, 1);
    assert.ok(report.scoring.foundationalScore > 0);
    assert.ok(Array.isArray(report.prioritizedFixes));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}));

results.push(test('CLI exits non-zero without a URL', () => {
  const result = spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
  assert.notStrictEqual(result.status, 0);
}));

results.push(test('multi-page scoring does not inflate the denominator', () => {
  const pages = [cleanPage(GOOD_HTML, 'https://example.com/'), cleanPage(GOOD_HTML, 'https://example.com/about')];
  const siteChecks = runSiteChecks({ html: GOOD_HTML }).checks;
  const score = scoreReport(pages, siteChecks);
  // Two identical pages must score the same as one; only site checks add points.
  const single = scoreReport([cleanPage(GOOD_HTML)], siteChecks);
  assert.strictEqual(score.foundationalScore, single.foundationalScore);
  assert.strictEqual(score.totalPoints, single.totalPoints);
  assert.strictEqual(score.totalPoints, 142, 'per-page checks (112) plus site checks (30) once, regardless of page count');
}));

results.push(test('a page failing a check reduces the score proportionally', () => {
  const siteChecks = runSiteChecks({ html: GOOD_HTML }).checks;
  const allGood = scoreReport([cleanPage(GOOD_HTML)], siteChecks).foundationalScore;
  const mixed = scoreReport([cleanPage(GOOD_HTML), cleanPage(BAD_HTML, 'https://example.com/bad')], siteChecks)
    .foundationalScore;
  assert.ok(mixed < allGood, 'adding a broken page must lower the aggregate score');
}));

const failed = results.filter(result => !result).length;
console.log(`\n${results.length - failed}/${results.length} aeo-audit tests passed`);
if (failed > 0) process.exit(1);
