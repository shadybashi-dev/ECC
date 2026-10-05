---
name: seo-technical-audit
description: Audit technical SEO across crawlability, indexability, rendering, Core Web Vitals, canonicalization, hreflang, redirects, and security. Use for crawl/index problems, ranking drops, migrations, or a technical SEO review.
metadata:
  origin: ECC
---

# Technical SEO Audit

Find and prioritize the technical defects that cap organic performance. Technical SEO is not a checklist to complete — it is the removal of reasons a crawler cannot reach, understand, or trust a page.

## When to Activate

- traffic or rankings dropped and the cause is unknown
- a migration, re-platform, or URL change is planned or just shipped
- pages are not being indexed, or the wrong URLs are indexed
- the user asks about robots.txt, sitemaps, canonicals, redirects, hreflang, or Core Web Vitals
- large sites exhibiting crawl-budget or index-bloat symptoms
- AI crawler access questions — those route to `geo`, but the mechanics overlap

## Workflow

### 1. Establish baselines and scope

Collect before judging:

- site size and template count
- CMS/framework and rendering mode (SSR, SSG, ISR, CSR)
- the domain variants in play (`www`, non-`www`, trailing slash, `http`, locale prefixes)
- recent changes: migrations, template deploys, robots edits, CDN changes

Never audit a 100,000-URL site the same way as a 50-page site. Crawl-budget issues only exist at scale.

### 2. Deterministic pass

For a live site, run the shared engine for the machine-checkable subset:

```bash
node <skill-dir>/../aeo-audit/scripts/aeo-audit.mjs https://example.com --max-pages=20 --out=technical.json
```

It covers canonical presence, `noindex`, AI-blocking meta directives, heading structure, internal linking, image alt coverage, text depth, robots, sitemap, and `llms.txt`. Treat its output as the floor, not the audit.

### 3. Manual verification per category

Each category below defines what to check and what "broken" looks like. Report the observed evidence, not an assumption.

#### Crawlability

- `robots.txt` is reachable (200, `text/plain`), not a soft 404, and not blocked by a WAF rule that also hits crawlers.
- Important templates are not blocked; CSS/JS needed for rendering are not blocked.
- The XML sitemap is referenced from `robots.txt`, returns valid XML, and contains only canonical, indexable, 200-status URLs.
- Sitemap `lastmod` values reflect real changes — fabricated `lastmod` teaches crawlers to distrust the file.
- Important pages sit within ~3 clicks of the homepage; orphan pages have no internal path at all.

#### Indexability

- No unintended `noindex` — check both `<meta name="robots">` and the `X-Robots-Tag` header, including CDN/edge rules.
- Canonicals are self-referencing on canonical pages, absolute, and never point at a redirect, 404, or blocked URL.
- No canonical/`noindex` conflict: a page that is both canonicalised elsewhere and `noindex` sends contradictory instructions.
- Parameter, session, and filter URLs are controlled (canonical, `robots.txt`, or `noindex, follow`) rather than left to compete.
- Pagination is crawlable; never `noindex` paginated pages that lead to deep content.
- Thin and near-duplicate pages are consolidated, differentiated, or removed — not left to compete.
- Hreflang is reciprocal, self-referencing, uses valid language-region codes, and returns 200s. `x-default` exists when relevant.
- Index bloat: compare indexed-URL counts by template against the real inventory.

#### Rendering

- Fetch a representative URL with JavaScript disabled (or via the raw HTML response) and confirm primary content and links are present.
- Confirm the rendered DOM and the raw HTML agree on the main content, canonical, and title. Mismatches indicate hydration bugs that crawlers see differently.
- Lazy-loaded content must still expose real `src`/`href` in the DOM, not only an `onclick` handler.
- Infinite scroll needs a paginated fallback for crawlers.

#### Core Web Vitals

Field data (CrUX, 75th percentile) beats lab data. Targets:

| Metric | Target | Notes |
| --- | --- | --- |
| LCP | < 2.5s | Usually the hero image/video or a blocking font |
| INP | < 200ms | Replaced FID in March 2024; FID was fully removed from tooling in September 2024 — do not reference it |
| CLS | < 0.1 | Reserve space for media, ads, and late-injected banners |

Fix order that usually works: reduce main-thread work and long tasks, defer non-critical third parties, serve correctly sized modern images, preload the LCP element, reserve layout dimensions, and self-host/preload critical fonts.

#### URL structure and redirects

- Descriptive, lowercase, hyphenated paths; no content served from query strings.
- One canonical host and one trailing-slash convention, enforced with 301s — not both variants returning 200.
- No redirect chains (more than one hop) and no loops.
- 302s are not used for permanent moves.
- Changing URLs is a migration, not a cleanup: map every old URL to a single new one and keep the map.

#### Security and trust

- HTTPS enforced sitewide; no mixed content; certificate valid including on alternate hostnames.
- `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, and `Content-Security-Policy` present and appropriate.
- No indexable staging, admin, or internal-search surfaces.
- Spam/parasite content and hacked-page injections cleared — these suppress sitewide quality signals.

#### Mobile

- Mobile-first indexing is fully in effect: the mobile Googlebot is the primary crawler.
- Responsive layout, viewport meta present, tap targets ≥ 48px with spacing, base font ≥ 16px, no horizontal scroll.
- Content parity: nothing important exists only in the desktop DOM.

#### Structured data

- Valid JSON-LD, matching visible content, no contradictions between page and markup.
- Use `schema-markup` for the generation and validation workflow.

### 4. Reproduce findings before reporting them

For every defect: record the URL, the timestamp, the exact request or rendered output, and the observed result. A finding you cannot reproduce is a false positive waiting to embarrass the audit.

### 5. Prioritize and hand off

Order fixes by (a) whether they block indexing entirely, (b) how many URLs they affect, (c) effort. A sitewide `noindex` outranks a missing meta description every time.

## Output Contract

```text
[HIGH] Sitewide noindex on the /blog/ template
Evidence: GET https://example.com/blog/post-1 (2026-10-05) ->
  <meta name="robots" content="noindex">; reproduced on 3 posts
Impact: ~740 URLs excluded from the index
Confidence: verified
Fix: remove the template-level noindex; keep it only for /blog/preview/*
Re-verify: request 3 URLs after deploy and confirm "index, follow"
```

Every audit closes with:

1. a reproducible evidence block per finding
2. a fix ordered by blocking severity, then scope, then effort
3. a verification step per fix
4. a re-crawl plan (same depth, same URLs) so the next audit is comparable

## Anti-Patterns

| Anti-pattern | Why it fails |
| --- | --- |
| Auditing with a single tool crawl and no live verification | Tools misreport; always confirm against the response |
| Recommending a canonical fix before checking the current one | Already-correct canonicals get "fixed" into breakage |
| Chasing Core Web Vitals before indexability | A blocked page has no ranking to improve |
| Reporting every issue at equal weight | Users fix the easy ones and miss the blocking one |
| Changing many URL patterns at once | Destroys attribution of any later recovery |
| Referencing FID | Removed from tooling in 2024; dates the audit instantly |

## Related Skills

- `geo` — AI crawler policy and AI-surface visibility
- `aeo-audit` — scored audit including the deterministic subset
- `schema-markup` — structured data generation and validation
- `seo` — on-page and content-side SEO
- `deployment-patterns` — safe rollout of site-wide changes

## Provenance

Consolidates the technical-audit checklists from MIT-licensed community skills (`Agentic-SEO-Skill`, `claude-seo-skills`) with ECC's own `seo` baseline. See `research/seo-geo-skills-landscape-2026-10.md`.
