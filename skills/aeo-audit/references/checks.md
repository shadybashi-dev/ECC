# AEO Audit — Check Definitions and Rubric

## Part 1 — The 16 Deterministic Checks

Run by `scripts/aeo-audit.mjs`. Point values sum to 100 per page for the per-page checks; site checks are scored separately and aggregated.

### Per-page checks (13)

| ID | Points | Passes when | Why it matters for AI citation |
| --- | --- | --- | --- |
| `title` | 10 | `<title>` present, 10–70 characters | Primary entity/topic label for the page |
| `meta-description` | 10 | `<meta name="description">` ≥ 50 characters | Often used as the summary an engine sees before extraction |
| `canonical` | 8 | Absolute `<link rel="canonical">` | Prevents duplicate-URL dilution of the cited source |
| `h1` | 8 | Exactly one `<h1>` | Establishes the page's single subject |
| `schema` | 8 | At least one JSON-LD block | Machine-readable page type |
| `schema-types` | 8 | At least one recognized `@type` | Entity extraction and rich-result eligibility |
| `og` | 8 | `og:title` and `og:description` present | Consistent metadata across surfaces |
| `internal-links` | 10 | ≥ 5 internal links | Corroboration and crawl paths to the page |
| `image-alt` | 8 | ≥ 80% of `<img>` carry `alt` | Text equivalent for non-text content |
| `text-depth` | 12 | ≥ 250 words of body text | Enough substance to answer a question |
| `indexability` | 10 | No `noindex` in robots meta | A noindex page cannot be cited |
| `ai-meta-tags` | 6 | No `noai`, `noimageai`, `nosnippet` | These directives suppress AI usage directly |
| `heading-hierarchy` | 6 | ≥ 2 heading levels, no level skips, one H1 | Parseable outline for chunking |

### Site checks (3)

| ID | Points | Passes when | Why it matters |
| --- | --- | --- | --- |
| `llms-txt` | 10 | `/llms.txt` exists with an H1 and ≥ 1 link | Explicit guidance on what the site covers |
| `ai-bot-access` | 12 | No citation-critical bot blocked in `robots.txt` | Hard gate on being retrievable at all |
| `rss-feed` | 8 | Discoverable `rel="alternate"` feed or `/feed.xml` | Freshness signal and re-crawl path |

Citation-critical bots checked: `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Claude-User`, `Google-Extended`.

### Aggregation

Per-page checks are aggregated across crawled pages: a check earns full points when ≥ 80% of pages pass, and scales proportionally below that. Site checks are pass/fail. The foundational score is `earned / possible × 100`.

Informational only (not scored): sitemap presence, `lastmod` coverage, robots.txt reachability. These are reported in `coverage` so a user can see what the score did not include.

---

## Part 2 — The Six Intelligence Dimensions

Scored 0–5 by the agent, from observed content. Write the rationale first, then the number.

### 1. Answer readiness

| Score | Anchor |
| --- | --- |
| 0 | No answers; purely promotional or navigational |
| 1 | Vague content that circles topics without answering |
| 2 | Answers exist but are buried deep in the page |
| 3 | Several questions answerable; some definition-first or FAQ content |
| 4 | Most common questions answerable; answers lead their sections |
| 5 | Exceptional: dedicated Q&A blocks, definition-first paragraphs throughout |

### 2. Quotability

| Score | Anchor |
| --- | --- |
| 0 | Nothing extractable (interactive-only, one dense block) |
| 1 | Requires full-page context; no passage stands alone |
| 2 | A few extractable passages; most need surrounding context |
| 3 | Several self-contained paragraphs; some lists or structured blocks |
| 4 | Good: tables, lists, FAQ sections, clear answer blocks |
| 5 | Highly quotable: comparison tables, step-by-step blocks, definitions throughout |

### 3. Evidence density

| Score | Anchor |
| --- | --- |
| 0 | No evidence; marketing copy only |
| 1 | Vague claims ("best in class", "industry leading") |
| 2 | Mostly generalities; rare specifics |
| 3 | Some statistics and named sources |
| 4 | High density: numbers, dates, named sources, references |
| 5 | Exceptional: specifics throughout, in-text citations, verifiable metrics |

### 4. Content depth

| Score | Anchor |
| --- | --- |
| 0 | Empty or placeholder content |
| 1 | Minimal; a few sentences, no substance |
| 2 | Thin; surface level, missing what a user needs |
| 3 | Adequate; main points covered, few sub-topics or examples |
| 4 | Rich; comprehensive coverage with examples and data |
| 5 | Exceptional; authoritative, multi-faceted, reference-grade |

### 5. Freshness

| Score | Anchor |
| --- | --- |
| 0 | No date signals; appears abandoned |
| 1 | Dates present but clearly outdated |
| 2 | Moderately dated; no "last updated" |
| 3 | Reasonably current, or an explicit update date is visible |
| 4 | Recent content with update timestamps and current references |
| 5 | Clearly current; active maintenance evident |

### 6. Structural clarity

| Score | Anchor |
| --- | --- |
| 0 | Unreadable: no text, blocked, non-semantic markup |
| 1 | Very poor: walls of text, no headings, unclear topic |
| 2 | Weak: some structure, confusing or inconsistent headings |
| 3 | Adequate: clear headings and paragraphs, topic identifiable |
| 4 | Good: clean H1–H2–H3 hierarchy, scannable, purpose obvious |
| 5 | Excellent: perfect outline, semantic HTML, no noise |

---

## Grade Bands

| Grade | Range | Grade | Range | Grade | Range |
| --- | --- | --- | --- | --- | --- |
| A+ | 95–100 | B+ | 80–84 | C | 60–64 |
| A | 90–94 | B | 75–79 | C- | 55–59 |
| A- | 85–89 | B- | 70–74 | D | 40–54 |
| | | | | F | below 40 |

## Reporting a Check Failure

Use the same shape as the rest of the GEO surface:

```text
[HIGH] ai-bot-access — OAI-SearchBot blocked (12 pts)
Evidence: GET /robots.txt -> "User-agent: OAI-SearchBot / Disallow: /"
Impact: content excluded from ChatGPT search results
Confidence: verified
Fix: remove the Disallow; keep training-only crawlers blocked if policy requires
```
