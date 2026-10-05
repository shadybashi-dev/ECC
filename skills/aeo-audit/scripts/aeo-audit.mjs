#!/usr/bin/env node
/**
 * aeo-audit — deterministic AEO/GEO audit for a live site or a local HTML file.
 *
 * Zero dependencies. Node 18+ (uses global fetch).
 *
 * Usage:
 *   node aeo-audit.mjs <url> [--max-pages=10] [--out=report.json] [--json]
 *   node aeo-audit.mjs --html-file=./page.html --url=https://example.com --json
 *
 * The script only reports what it observes. It never guesses a score for a page
 * it could not fetch, and it exits non-zero when nothing could be crawled.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_UA = 'ECC-AEO-Audit/1.0 (+https://github.com/affaan-m/ECC)';
const FETCH_TIMEOUT_MS = 15000;
const PER_PAGE_CHECK_IDS = new Set([
  'title', 'meta-description', 'canonical', 'h1', 'schema', 'schema-types', 'og',
  'internal-links', 'image-alt', 'text-depth', 'indexability', 'ai-meta-tags',
  'heading-hierarchy',
]);
const CITATION_CRITICAL_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-User', 'Google-Extended',
];
const AI_META_DIRECTIVES = ['noai', 'noimageai', 'nosnippet', 'max-snippet:0', 'max-snippet: 0'];
const RECOGNIZED_SCHEMA_TYPES = [
  'Organization', 'WebSite', 'WebPage', 'Article', 'BlogPosting', 'Product', 'Offer',
  'FAQPage', 'Question', 'BreadcrumbList', 'LocalBusiness', 'Person', 'Event', 'HowTo',
  'Recipe', 'VideoObject', 'SoftwareApplication', 'WebApplication', 'Dataset', 'Service',
];

/* ------------------------------------------------------------------ *
 * Small HTML helpers (regex-based on purpose: no parser dependency, and
 * the checks only need head metadata, headings, links, and images).
 * ------------------------------------------------------------------ */

export function stripScriptsAndStyles(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');
}

export function stripTags(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractText(html) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const scoped = body ? body[1] : html;
  const withoutChrome = scoped
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ');
  return stripTags(stripScriptsAndStyles(withoutChrome));
}

export function countWords(text) {
  const matches = text.match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu);
  return matches ? matches.length : 0;
}

export function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!match) return '';
  return (match[2] ?? match[3] ?? match[4] ?? '').trim();
}

export function extractMetaTags(html) {
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  const scoped = head ? head[1] : html;
  const tags = [];
  const re = /<meta\b[^>]*>/gi;
  let match;
  while ((match = re.exec(scoped)) !== null) {
    const tag = match[0];
    tags.push({
      name: (attr(tag, 'name') || '').toLowerCase(),
      property: (attr(tag, 'property') || '').toLowerCase(),
      content: attr(tag, 'content'),
    });
  }
  return tags;
}

export function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]) : '';
}

export function extractCanonical(html) {
  const link = html.match(/<link\b[^>]*rel\s*=\s*["']?canonical["']?[^>]*>/i);
  return link ? attr(link[0], 'href') : '';
}

export function extractHeadings(html) {
  const headings = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    headings.push({ level: Number(match[1]), text: stripTags(match[2]) });
  }
  return headings;
}

export function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const raw = match[1].trim();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    blocks.push({ raw, parsed });
  }
  return blocks;
}

export function collectSchemaTypes(blocks) {
  const types = new Set();
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const type = node['@type'];
    if (typeof type === 'string') types.add(type);
    if (Array.isArray(type)) type.forEach(value => typeof value === 'string' && types.add(value));
    if (node['@graph']) visit(node['@graph']);
    for (const value of Object.values(node)) visit(value);
  };
  blocks.forEach(block => visit(block.parsed));
  return [...types];
}

export function extractLinks(html, baseUrl) {
  const links = [];
  const re = /<a\b[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const href = attr(match[0], 'href');
    if (!href || href.startsWith('#') || /^(mailto|tel|javascript):/i.test(href)) continue;
    let resolved;
    try {
      resolved = new URL(href, baseUrl);
    } catch {
      continue;
    }
    links.push({ href, resolved: resolved.href, text: stripTags(match[1]) });
  }
  return links;
}

export function extractImages(html) {
  const images = [];
  const re = /<img\b[^>]*>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const tag = match[0];
    images.push({ alt: attr(tag, 'alt'), hasAltAttribute: /\balt\s*=/i.test(tag) });
  }
  return images;
}

export function countQuestionHeadings(headings) {
  return headings.filter(heading =>
    /\?|\b(what|why|how|when|where|which|who|can|does|is|are|should)\b/i.test(heading.text)
  ).length;
}

export function countNumberTokens(text) {
  return (text.match(/\b\d[\d,.]*\s?(%|x|k|m|b|bn|ms|s|kb|mb|gb|usd|\$|€|£)?\b/gi) || []).length;
}

/* ------------------------------------------------------------------ *
 * robots.txt
 * ------------------------------------------------------------------ */

export function parseRobotsGroups(text) {
  const groups = [];
  let current = null;
  let lastWasUserAgent = false;

  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === 'user-agent') {
      if (!current || !lastWasUserAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasUserAgent = true;
      continue;
    }

    lastWasUserAgent = false;
    if (!current) continue;
    if (field === 'allow' || field === 'disallow') {
      current.rules.push({ type: field, path: value });
    }
  }

  return groups;
}

export function isPathBlocked(groups, botToken, path = '/') {
  const token = botToken.toLowerCase();
  const specific = groups.filter(group => group.agents.some(agent => agent !== '*' && token.startsWith(agent)));
  const wildcard = groups.filter(group => group.agents.some(agent => agent === '*'));
  const applicable = specific.length > 0 ? specific : wildcard;
  if (applicable.length === 0) return false;

  let best = null;
  for (const group of applicable) {
    for (const rule of group.rules) {
      if (!rule.path) continue;
      const pattern = rule.path.replace(/\*$/, '');
      if (!path.startsWith(pattern)) continue;
      const length = pattern.length;
      if (!best || length > best.length || (length === best.length && rule.type === 'allow')) {
        best = { length, type: rule.type };
      }
    }
  }
  return best ? best.type === 'disallow' : false;
}

export function findBlockedBots(robotsText, bots = CITATION_CRITICAL_BOTS) {
  const groups = parseRobotsGroups(robotsText);
  return bots.filter(bot => isPathBlocked(groups, bot, '/'));
}

/* ------------------------------------------------------------------ *
 * llms.txt / sitemap / feed
 * ------------------------------------------------------------------ */

export function validateLlmsTxt(text) {
  const content = String(text || '');
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  const hasHeading = /^#\s+\S/m.test(content);
  const hasBlockquote = /^>\s+\S/m.test(content);
  const linkCount = (content.match(/\[[^\]]+\]\([^)]+\)/g) || []).length;
  const underLineBudget = lines.length < 200;
  return {
    present: content.trim().length > 0,
    hasHeading,
    hasBlockquote,
    linkCount,
    underLineBudget,
    valid: content.trim().length > 0 && hasHeading && linkCount >= 1,
  };
}

export function validateSitemap(xml) {
  const content = String(xml || '');
  const isUrlset = /<urlset[\s>]/i.test(content) || /<sitemapindex[\s>]/i.test(content);
  const locCount = (content.match(/<loc>/gi) || []).length;
  const lastmodCount = (content.match(/<lastmod>/gi) || []).length;
  return { present: content.trim().length > 0, isUrlset, locCount, lastmodCount };
}

export function findFeedLink(html) {
  const link = html.match(/<link\b[^>]*type\s*=\s*["']application\/(rss|atom)\+xml["'][^>]*>/i);
  if (link) return attr(link[0], 'href') || true;
  for (const candidate of ['/feed.xml', '/rss.xml', '/atom.xml', '/feed']) {
    try {
      if (new RegExp(candidate.replace('.', '\\.'), 'i').test(html)) return candidate;
    } catch {
      /* ignore malformed candidate */
    }
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Checks
 * ------------------------------------------------------------------ */

export function runPageChecks(page, context = {}) {
  const { url, html } = page;
  const checks = [];
  const meta = extractMetaTags(html);
  const title = extractTitle(html);
  const canonical = extractCanonical(html);
  const headings = extractHeadings(html);
  const jsonLd = extractJsonLd(html);
  const schemaTypes = collectSchemaTypes(jsonLd);
  const links = extractLinks(html, url);
  const images = extractImages(html);
  const text = extractText(html);
  const words = countWords(text);
  const h1Count = headings.filter(heading => heading.level === 1).length;
  const altCovered = images.length === 0
    ? 1
    : images.filter(image => image.hasAltAttribute).length / images.length;
  const internalLinks = links.filter(link => {
    try {
      return new URL(link.resolved).host === new URL(url).host;
    } catch {
      return false;
    }
  });

  const metaContent = (name) => (meta.find(tag => tag.name === name) || {}).content || '';
  const ogTitle = (meta.find(tag => tag.property === 'og:title') || {}).content || '';
  const ogDescription = (meta.find(tag => tag.property === 'og:description') || {}).content || '';
  const robotsMeta = metaContent('robots') || metaContent('googlebot');
  const aiDirectiveHit = meta.some(tag => AI_META_DIRECTIVES.some(directive =>
    `${tag.name} ${tag.property} ${tag.content}`.toLowerCase().includes(directive)
  )) || aiDirectiveHitInHeaders(context.xRobotsTag || '');

  const isRedirectStub = /<meta[^>]+http-equiv\s*=\s*["']?refresh["']?/i.test(html);

  const levels = headings.map(heading => heading.level);
  const hasMultipleLevels = new Set(levels).size >= 2;
  let skipsHierarchy = false;
  for (let index = 1; index < levels.length; index += 1) {
    if (levels[index] - levels[index - 1] > 1) skipsHierarchy = true;
  }

  const push = (id, label, passed, points, detail) =>
    checks.push({ id, label, passed: Boolean(passed), points, detail });

  push('title', 'Clear page title', title.length >= 10 && title.length <= 70, 10,
    title ? `${title.length} chars: "${title.slice(0, 70)}"` : 'missing <title>');
  const description = metaContent('description');
  push('meta-description', 'Meta description', description.length >= 50, 10,
    description ? `${description.length} chars` : 'missing meta description');
  push('canonical', 'Canonical URL', /^https?:\/\//i.test(canonical), 8,
    canonical || 'missing or relative canonical');
  push('h1', 'Single H1 heading', h1Count === 1, 8, `${h1Count} H1 element(s)`);
  push('schema', 'Structured data present', jsonLd.length > 0, 8,
    jsonLd.length > 0 ? `${jsonLd.length} JSON-LD block(s)` : 'no JSON-LD found');
  const recognizedTypes = schemaTypes.filter(type => RECOGNIZED_SCHEMA_TYPES.includes(type));
  push('schema-types', 'Recognized schema types', recognizedTypes.length > 0, 8,
    schemaTypes.length > 0 ? `types: ${schemaTypes.join(', ')}` : 'no @type values');
  push('og', 'Open Graph basics', Boolean(ogTitle && ogDescription), 8,
    ogTitle || ogDescription ? `og:title=${Boolean(ogTitle)} og:description=${Boolean(ogDescription)}` : 'no OG tags');
  push('internal-links', 'Internal linking', internalLinks.length >= 5, 10,
    `${internalLinks.length} internal link(s)`);
  push('image-alt', 'Image alt coverage', altCovered >= 0.8, 8,
    images.length === 0 ? 'no images' : `${Math.round(altCovered * 100)}% of ${images.length} images`);
  push('text-depth', 'Readable content depth', words >= 250, 12, `${words} words of body text`);
  push('indexability', 'Indexable for discovery', !/noindex/i.test(robotsMeta), 10,
    robotsMeta ? `robots meta: ${robotsMeta}` : 'no robots meta (default indexable)');
  push('ai-meta-tags', 'AI-accessible meta tags', !aiDirectiveHit, 6,
    aiDirectiveHit ? 'noai/noimageai/nosnippet directive found' : 'no AI-blocking directives');
  push('heading-hierarchy', 'Content structure', hasMultipleLevels && !skipsHierarchy && h1Count === 1, 6,
    `${headings.length} headings, ${new Set(levels).size} level(s)${skipsHierarchy ? ', level skipped' : ''}`);

  return {
    url,
    isRedirectStub,
    title,
    metaDescription: description,
    canonical,
    h1Count,
    headings,
    headingsCount: headings.length,
    questionHeadings: countQuestionHeadings(headings),
    schemaTypes,
    wordCount: words,
    internalLinkCount: internalLinks.length,
    imageCount: images.length,
    altCoverage: altCovered,
    numberTokens: countNumberTokens(text),
    checks,
  };
}

export function runSiteChecks({ html = '', robotsText = '', llmsTxt = '', sitemapXml = '', feedPresent = false }) {
  const checks = [];
  const llms = validateLlmsTxt(llmsTxt);
  const sitemap = validateSitemap(sitemapXml);
  const blocked = findBlockedBots(robotsText);
  const feedLink = findFeedLink(html);

  checks.push({
    id: 'llms-txt',
    label: 'llms.txt present and valid',
    passed: llms.valid,
    points: 10,
    detail: llms.present
      ? `heading=${llms.hasHeading} links=${llms.linkCount}`
      : 'no llms.txt found',
  });
  checks.push({
    id: 'ai-bot-access',
    label: 'AI citation bots allowed',
    passed: blocked.length === 0,
    points: 12,
    detail: blocked.length === 0 ? 'no citation-critical bot blocked' : `blocked: ${blocked.join(', ')}`,
  });
  checks.push({
    id: 'rss-feed',
    label: 'RSS/Atom feed discoverable',
    passed: Boolean(feedLink || feedPresent),
    points: 8,
    detail: feedLink ? `discovered: ${feedLink}` : 'no feed link found',
  });

  return { checks, llms, sitemap, blockedBots: blocked };
}

export function heuristicSignals(page) {
  const { wordCount, questionHeadings, headingsCount, numberTokens, internalLinkCount } = page;
  const answerReadiness = Math.min(5,
    Math.round((wordCount >= 500 ? 2 : wordCount >= 250 ? 1 : 0)
      + (headingsCount >= 4 ? 1 : 0)
      + (questionHeadings >= 1 ? 1 : 0)
      + (numberTokens >= 5 ? 1 : 0)));
  const quotability = Math.min(5,
    Math.round((internalLinkCount >= 5 ? 1 : 0)
      + (questionHeadings >= 2 ? 1 : 0)
      + (wordCount >= 300 ? 1 : 0)
      + (numberTokens >= 3 ? 1 : 0)
      + (headingsCount >= 5 ? 1 : 0)));
  const evidenceDensity = Math.min(5, Math.floor(numberTokens / 4));
  return {
    answerReadiness,
    quotability,
    evidenceDensity,
    note: 'Deterministic prior only. Score the real dimensions by reading the content.',
  };
}

export function scoreReport(pages, siteChecks) {
  // Each per-page check is scored once against the share of pages that pass it,
  // so the possible-points denominator must not grow with the page count.
  let possible = 0;
  let earned = 0;

  for (const id of PER_PAGE_CHECK_IDS) {
    const relevant = pages.map(page => page.checks.find(check => check.id === id)).filter(Boolean);
    if (relevant.length === 0) continue;
    const points = relevant[0].points;
    possible += points;
    const passRate = relevant.filter(check => check.passed).length / relevant.length;
    earned += points * Math.min(1, passRate / 0.8);
  }

  for (const check of siteChecks) {
    possible += check.points;
    if (check.passed) earned += check.points;
  }

  const score = possible === 0 ? 0 : Math.round((earned / possible) * 100);
  return {
    foundationalScore: score,
    grade: gradeFor(score),
    totalPoints: possible,
    earnedPoints: Math.round(earned),
  };
}

export function gradeFor(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 40) return 'D';
  return 'F';
}

export function prioritizedFixes(pages, siteChecks) {
  const fixes = [];
  for (const check of siteChecks) {
    if (!check.passed) fixes.push({ priority: check.points, check: check.id, detail: check.detail });
  }
  const failing = new Map();
  for (const page of pages) {
    for (const check of page.checks) {
      if (check.passed) continue;
      const entry = failing.get(check.id) || { points: check.points, pages: [], detail: check.detail };
      entry.pages.push(page.url);
      failing.set(check.id, entry);
    }
  }
  for (const [id, entry] of failing) {
    fixes.push({ priority: entry.points, check: id, detail: entry.detail, affectedPages: entry.pages.length });
  }
  return fixes.sort((left, right) => right.priority - left.priority);
}

function aiDirectiveHitInHeaders(value) {
  const lower = String(value || '').toLowerCase();
  return AI_META_DIRECTIVES.some(directive => lower.includes(directive));
}

/* ------------------------------------------------------------------ *
 * Fetching / crawling
 * ------------------------------------------------------------------ */

async function fetchText(url, { timeout = FETCH_TIMEOUT_MS, ua = DEFAULT_UA } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': ua, accept: 'text/html,application/xhtml+xml,application/xml,text/plain,*/*' },
    });
    const body = await response.text();
    return { ok: response.ok, status: response.status, body, finalUrl: response.url };
  } catch (error) {
    return { ok: false, status: 0, body: '', error: error.message };
  } finally {
    clearTimeout(timer);
  }
}

export function discoverPageUrls(homeHtml, baseUrl, sitemapXml, maxPages) {
  const found = new Set();
  const add = (value) => {
    try {
      const resolved = new URL(value, baseUrl);
      resolved.hash = '';
      if (resolved.host !== new URL(baseUrl).host) return;
      if (!/^https?:$/.test(resolved.protocol)) return;
      found.add(resolved.href);
    } catch {
      /* ignore */
    }
  };
  add(baseUrl);
  for (const loc of String(sitemapXml || '').match(/<loc>([^<]+)<\/loc>/gi) || []) {
    add(loc.replace(/<\/?loc>/gi, '').trim());
  }
  for (const link of extractLinks(homeHtml, baseUrl)) add(link.resolved);
  return [...found].slice(0, Math.max(1, maxPages));
}

/**
 * Read site-level files from disk when auditing a local build directory.
 * Returns null for any file that is not present so the caller can fall back
 * to a network fetch.
 */
export function readLocalSiteFiles(root) {
  const readIfPresent = (name) => {
    const candidate = join(root, name);
    return existsSync(candidate) ? readFileSync(candidate, 'utf8') : null;
  };
  return {
    root,
    robots: readIfPresent('robots.txt'),
    sitemap: readIfPresent('sitemap.xml'),
    llms: readIfPresent('llms.txt'),
    feed: readIfPresent('feed.xml'),
  };
}

/**
 * Map a built file path onto the route it serves, so `menu.html` and
 * `menu/index.html` are recognised as the same route.
 */
export function routeKeyForPath(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return `/${relativePath.slice(0, -'index.html'.length)}`;
  return `/${relativePath.replace(/\.html$/, '')}`;
}

/**
 * List the pages of a built static site, one entry per route.
 *
 * Static hosts commonly ship both `page.html` and a `page/index.html`
 * meta-refresh stub that resolves the trailing-slash URL. Both serve the same
 * route, so the stub must not be audited as a separate (and apparently empty)
 * page. Stubs are detected by content and deprioritised.
 */
export function discoverLocalPages(root, { skip = new Set(['404.html']) } = {}) {
  const found = [];
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.html') || skip.has(entry.name)) continue;
      const relativePath = full.slice(root.length + 1).split('\\').join('/');
      found.push({ file: full, relativePath, routeKey: routeKeyForPath(relativePath) });
    }
  };
  walk(root);

  const byRoute = new Map();
  for (const page of found) {
    const html = readFileSync(page.file, 'utf8');
    const isStub = /<meta[^>]+http-equiv\s*=\s*["']?refresh["']?/i.test(html);
    const existing = byRoute.get(page.routeKey);
    if (!existing || (existing.isStub && !isStub)) {
      byRoute.set(page.routeKey, { ...page, isStub });
    }
  }

  return [...byRoute.values()]
    .sort((left, right) => left.relativePath.localeCompare(right.relativePath));
}

export function urlForLocalPage(origin, relativePath) {
  const base = origin.replace(/\/$/, '');
  if (relativePath === 'index.html') return `${base}/`;
  if (relativePath.endsWith('/index.html')) {
    return `${base}/${relativePath.slice(0, -'index.html'.length)}`;
  }
  return `${base}/${relativePath}`;
}

export async function audit({ url, htmlFile = null, dir = null, maxPages = 10, localSiteFiles = true } = {}) {
  const localRoot = dir || (htmlFile ? dirname(htmlFile) : null);
  const local = localRoot && localSiteFiles ? readLocalSiteFiles(localRoot) : null;
  const siteUrl = url || (local?.sitemap ? (local.sitemap.match(/<loc>([^<]+)<\/loc>/i) || [])[1] : null) || 'https://example.invalid/';
  const origin = new URL(siteUrl).origin;

  if (!url) url = siteUrl;

  const fromDisk = (value, fallbackUrl) => {
    if (value !== null && value !== undefined) {
      return { ok: true, status: 200, body: value, finalUrl: fallbackUrl, source: 'file' };
    }
    return fetchText(fallbackUrl);
  };

  const robots = await fromDisk(local?.robots, `${origin}/robots.txt`);
  const sitemap = await fromDisk(local?.sitemap, `${origin}/sitemap.xml`);
  const llms = await fromDisk(local?.llms, `${origin}/llms.txt`);
  const feed = await fromDisk(local?.feed, `${origin}/feed.xml`);

  let homeHtml;
  let pageTargets;
  if (dir) {
    const localPages = discoverLocalPages(dir).slice(0, Math.max(1, maxPages));
    if (localPages.length === 0) {
      throw new Error(`No .html files found under ${dir}`);
    }
    pageTargets = localPages.map(page => ({
      url: urlForLocalPage(origin, page.relativePath),
      html: readFileSync(page.file, 'utf8'),
    }));
    homeHtml = pageTargets[0].html;
  } else if (htmlFile) {
    homeHtml = readFileSync(htmlFile, 'utf8');
    pageTargets = [{ url, html: homeHtml }];
  } else {
    const home = await fetchText(url);
    if (!home.ok) {
      const hint = home.status === 0
        ? ' — verify outbound HTTPS access from this environment, or audit a saved page with --html-file=<path>'
        : '';
      throw new Error(`Could not fetch ${url} (status ${home.status}${home.error ? `: ${home.error}` : ''})${hint}`);
    }
    homeHtml = home.body;
    pageTargets = discoverPageUrls(homeHtml, url, sitemap.body, maxPages)
      .map(pageUrl => ({ url: pageUrl, html: null }));
  }

  const redirectStubs = [];
  const pages = [];
  for (const target of pageTargets) {
    let html = target.html;
    if (html === null) {
      const page = await fetchText(target.url);
      if (!page.ok) continue;
      html = page.body;
    }
    const page = runPageChecks({ url: target.url, html }, {});
    // A meta-refresh stub is an intentional redirect surface, not content.
    // Scoring it as thin content is a false positive, so it is reported
    // separately and excluded from the page-level score.
    if (page.isRedirectStub) {
      redirectStubs.push({ url: page.url, target: page.canonical || null });
      continue;
    }
    pages.push(page);
  }

  if (pages.length === 0 && redirectStubs.length === 0) {
    throw new Error('No pages could be fetched; refusing to fabricate a score.');
  }
  if (pages.length === 0) {
    throw new Error('Only redirect stubs were found; audit a page with real content.');
  }

  const site = runSiteChecks({
    html: homeHtml,
    robotsText: robots.body,
    llmsTxt: llms.body,
    sitemapXml: sitemap.body,
    feedPresent: feed.ok && /<(rss|feed|urlset)\b/i.test(feed.body),
  });

  const scoring = scoreReport(pages, site.checks);
  const report = {
    generatedAt: new Date().toISOString(),
    url: siteUrl,
    source: dir ? `dir:${dir}` : htmlFile ? `file:${htmlFile}` : 'network',
    pagesCrawled: pages.map(page => page.url),
    redirectStubs,
    coverage: {
      robotsTxt: robots.ok,
      sitemap: site.sitemap.present,
      llmsTxt: site.llms.valid,
    },
    scoring,
    siteChecks: site.checks,
    blockedBots: site.blockedBots,
    pages,
    heuristicSignals: pages.map(page => ({ url: page.url, ...heuristicSignals(page) })),
    prioritizedFixes: prioritizedFixes(pages, site.checks),
  };

  return report;
}

export function formatSummary(report) {
  const lines = [];
  lines.push(`AEO audit — ${report.url} (${report.source})`);
  lines.push(`Foundational score: ${report.scoring.foundationalScore}/100 (${report.scoring.grade})`);
  lines.push(`Pages audited: ${report.pagesCrawled.length}`);
  lines.push('');
  lines.push('Site checks:');
  for (const check of report.siteChecks) {
    lines.push(`  [${check.passed ? 'PASS' : 'FAIL'}] ${check.label} (${check.points} pts) — ${check.detail}`);
  }
  lines.push('');
  lines.push('Top fixes:');
  for (const fix of report.prioritizedFixes.slice(0, 8)) {
    lines.push(`  ${fix.priority} pts — ${fix.check}: ${fix.detail}${fix.affectedPages ? ` (${fix.affectedPages} page(s))` : ''}`);
  }
  return lines.join('\n');
}

function parseArgs(argv) {
  const args = { url: null, htmlFile: null, dir: null, maxPages: 10, out: null, json: false };
  for (const arg of argv) {
    if (arg.startsWith('--html-file=')) args.htmlFile = arg.slice('--html-file='.length);
    else if (arg.startsWith('--dir=')) args.dir = arg.slice('--dir='.length);
    else if (arg.startsWith('--max-pages=')) args.maxPages = Number(arg.slice('--max-pages='.length)) || 10;
    else if (arg.startsWith('--out=')) args.out = arg.slice('--out='.length);
    else if (arg === '--json') args.json = true;
    else if (!arg.startsWith('--') && !args.url) args.url = arg;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url && !args.htmlFile && !args.dir) {
    console.error([
      'Usage:',
      '  node aeo-audit.mjs <url> [--max-pages=10] [--out=report.json] [--json]',
      '  node aeo-audit.mjs --dir=./dist [--url=https://example.com] [--max-pages=10]',
      '  node aeo-audit.mjs --html-file=./dist/index.html [--url=https://example.com]',
      '',
      'Offline modes read robots.txt, sitemap.xml, llms.txt, and feed.xml from the',
      'same directory when present, so a pre-deploy build scores the same way a',
      'live site does.',
    ].join('\n'));
    process.exit(2);
  }
  try {
    const report = await audit({
      url: args.url,
      htmlFile: args.htmlFile,
      dir: args.dir,
      maxPages: args.maxPages,
    });
    if (args.out) writeFileSync(args.out, JSON.stringify(report, null, 2));
    console.log(args.json ? JSON.stringify(report, null, 2) : formatSummary(report));
  } catch (error) {
    console.error(`Audit failed: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
