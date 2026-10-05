---
name: seo
description: Improve classic search visibility through technical correctness, on-page work, structured data, and content relevance. Use for SEO audits, title/meta/heading fixes, keyword mapping, internal linking, and sitemap or robots work.
metadata:
  origin: ECC
---

# SEO

Improve search visibility through correctness, relevance, and quality — not gimmicks. This is the routing skill for search work: it handles on-page and content-side SEO and hands off to the specialist skills when the problem is technical, structural, or AI-facing.

## When to Activate

- auditing crawlability, indexability, canonicals, or redirects
- improving title tags, meta descriptions, and heading structure
- keyword research and mapping keywords to URLs
- planning internal linking, sitemap, or robots changes
- diagnosing cannibalization, thin content, or intent mismatch
- the user says "SEO" without narrowing further

## Route First

Identify which layer the problem lives in before doing the work.

| Symptom | Skill |
| --- | --- |
| Pages not indexed, crawl errors, redirects, Core Web Vitals, rendering | `seo-technical-audit` |
| Site invisible in ChatGPT/Perplexity/AI Overviews | `geo` |
| Content exists but is never quoted by AI engines | `geo-citability` |
| Needs a scored AI-visibility baseline | `aeo-audit` |
| Rich results, entity data, or Search misrepresentation | `schema-markup` |
| No coherent content structure; cannibalization at scale | `topical-authority-map` |
| Titles, metas, headings, keywords, internal links, content quality | this skill |

## How It Works

### Principles

1. Fix technical blockers before content optimization — a page that cannot be crawled cannot be optimized.
2. One page, one primary search intent. Two pages competing for one query means merging or re-targeting one.
3. Prefer durable quality signals over manipulative patterns. Short-term tactics that need maintenance to avoid penalties are a liability.
4. Mobile-first indexing is fully in effect: the mobile rendering is what gets indexed.
5. Every recommendation must name the page, file, or asset it applies to.

### On-page rules

#### Title tags

- roughly 50–60 characters so the title survives truncation
- primary concept near the front, brand at the end if it fits
- written for a human scanning a result list, not for a keyword counter
- unique per page; a template that collapses to one title is a defect

#### Meta descriptions

- roughly 120–160 characters
- describe the page honestly and include the main topic naturally
- they do not rank pages directly, but they shape click-through and are often what an AI engine reads first

#### Heading structure

- one clear `H1` per page
- `H2`/`H3` reflect the real information hierarchy, not visual font sizes
- question-form headings where the section actually answers a question
- never skip levels to achieve a look

#### Content quality

- satisfy the query in the first screen; do not make the reader scroll for the answer
- cover the sub-questions the main query implies
- include specifics: numbers, dates, named entities, examples
- keep one idea per section

### Keyword mapping

1. Define the search intent (informational, navigational, commercial, transactional).
2. Gather realistic variants — how people actually phrase the query, including the long tail.
3. Prioritize by intent match, likely value, and realistic competition.
4. Map one primary query to one URL; list secondary variants that belong on the same page.
5. Check the existing site for cannibalization before creating a new URL.

### Internal linking

- link from strong pages to the pages that need to rank
- descriptive anchor text that names the destination
- avoid generic anchors ("click here", "read more") when a specific one is possible
- backfill links from new pages to relevant existing pages
- every important page needs a path from the homepage within about three clicks

### Technical hygiene (light pass)

For the full treatment use `seo-technical-audit`. Check quickly:

- `robots.txt` allows important sections and blocks low-value ones
- no important page carries an accidental `noindex` (check both meta and `X-Robots-Tag`)
- canonicals are self-consistent and point at 200-status URLs
- redirects resolve in a single hop
- the sitemap lists only canonical, indexable URLs
- `hreflang` is reciprocal and correct on multilingual sites

## Verification Discipline

Two habits separate a useful SEO audit from a harmful one:

1. **Read the actual page before recommending a change.** Every finding must be reproducible: URL, timestamp, observed output. Recommending a fix for something already present destroys trust in the correct findings.
2. **Label confidence.** Mark findings `verified` (observed), `inferred` (derived), or `unverified` (assumed). Never present an assumption as a measurement.

## Examples

### Title formula

```text
Primary Topic - Specific Modifier | Brand
```

### Meta description formula

```text
Action + topic + value proposition + one supporting detail
```

### Audit output shape

```text
[HIGH] Duplicate title tags on product pages
Location: src/routes/products/[slug].tsx
Evidence: 3 URLs fetched, all return "Products | Brand"
Issue: dynamic titles collapse to the same string, weakening relevance and creating duplicate signals
Confidence: verified
Fix: generate a unique title per product from name and primary category
```

### JSON-LD (single entity)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Page Title Here",
  "author": { "@type": "Person", "name": "Author Name" },
  "publisher": { "@type": "Organization", "name": "Brand Name" }
}
```

For multi-entity pages, `@graph`, and per-type required properties, use `schema-markup`.

## Anti-Patterns

| Anti-pattern | Fix |
| --- | --- |
| Keyword stuffing | Write for the reader; use the term where it belongs |
| Thin near-duplicate pages | Consolidate or genuinely differentiate |
| Schema for content that is not on the page | Match markup to reality |
| Advising without reading the live page | Fetch and verify first |
| Generic "improve SEO" output | Tie every recommendation to a page or asset |
| Chasing each new tactic | Invest in durable correctness and quality |
| Migrating URLs without a mapping | Keep a one-to-one old→new map and 301s |

## Related Skills

- `seo-technical-audit` — crawl, index, rendering, Core Web Vitals
- `geo` — AI search surfaces
- `geo-citability` — passage-level extractability
- `aeo-audit` — scored AI-visibility audit
- `schema-markup` — structured data
- `topical-authority-map` — content architecture
- `market-research` — category and competitor input
- `brand-voice` — keeping content in a consistent voice
