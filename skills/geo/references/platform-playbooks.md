# Platform Playbooks

Each AI surface retrieves and cites differently. Work the engine the user actually cares about, and say which engine a recommendation targets.

## How to Use

1. Identify the engines that matter (traffic, category, or the user's stated goal).
2. Read only those playbooks.
3. Measure each engine with its own query panel; never generalize one engine's result to "AI search".

Cross-engine constant: retrieval favors pages that are crawlable, server-rendered, passage-structured, and fact-dense. Everything below is the delta on top of that.

---

## ChatGPT (search + browsing)

**Retrieval:** `OAI-SearchBot` for the search index, `ChatGPT-User` for live fetches. Both must be allowed.

**What tends to get cited:**

- Pages with a direct answer in the opening lines, followed by supporting specifics.
- Reference-shaped pages: documentation, pricing, comparisons, "what is" explainers, changelogs.
- Content that survives a text-only parse — tables, ordered steps, and clean lists extract well.

**Optimization:**

- Put the answer to the page's core question in the first 40–60 words.
- Convert marketing prose into named facts: numbers, dates, limits, versions, prices.
- Keep one idea per section with a question-form heading that mirrors how a user would ask.
- Publish an `llms.txt` and keep the sitemap current — they help discovery, not ranking.

**Watch for:** pages where the primary content requires JavaScript. If a text-only fetch returns navigation and no substance, the page is not citable regardless of quality.

---

## Perplexity

**Retrieval:** `PerplexityBot` maintains the index; user-initiated fetches may also occur.

**What tends to get cited:**

- Freshness matters more here than on other engines; recent updates resurface quickly.
- Source-dense pages that themselves cite primary references.
- Comparison and "best/top" style pages where the engine needs itemized options.

**Optimization:**

- Keep visible publish and update dates, and refresh substantive facts on a schedule.
- Cite primary sources inline; Perplexity frequently surfaces sources that surface their own sources.
- Structure comparisons as real tables with consistent columns, not as prose lists.
- Always displays source links — treat it as a referral channel and make landing pages worth the click.

**Watch for:** treating a stale page as evergreen. A page that was citable two years ago can silently drop out after an engine refresh.

---

## Google AI Overviews

**Retrieval:** draws on the standard Google index. `Googlebot` access and normal indexability rules apply. `Google-Extended` does not control eligibility.

**What tends to get cited:**

- Pages already ranking for the query, with a bias toward strong classic search signals.
- Content with clear entity grounding and corroborated facts.
- Structured, snippet-friendly answer blocks.

**Optimization:**

- Fix classic SEO first: indexability, canonical correctness, internal linking, Core Web Vitals.
- Answer the query directly in a heading-plus-paragraph block near the top.
- Align structured data with visible content so entity extraction is unambiguous.
- Use `Article`/`BlogPosting`, `FAQPage` (only with real Q&A content), `Product`, `LocalBusiness` where the page type genuinely matches.

**Watch for:** assuming AI Overview eligibility is a separate channel that can be optimized independently. It is largely a function of classic ranking plus extractability.

---

## Claude

**Retrieval:** `ClaudeBot` for crawl-and-cite, `Claude-User` for user-initiated fetches. Anthropic publishes which surfaces map to which token; verify before advising a block.

**What tends to get cited:**

- Long-form, well-structured documents with explicit sections and definitions.
- Documentation and reference material with stable URLs.
- Content where claims are attributed rather than asserted.

**Optimization:**

- Write self-contained sections with explicit subject naming (avoid "it", "this", "as mentioned above").
- Keep long documents navigable with a real heading outline.
- Provide canonical, quotable definitions for the entity and its key concepts.

**Watch for:** prose that reads well to a human but collapses when a section is extracted alone.

---

## Gemini

**Retrieval:** Google search infrastructure plus `Google-Extended` for model improvement. Search eligibility still tracks the normal index.

**Optimization:**

- Same foundation as Google AI Overviews: indexability, structure, entity consistency.
- Multimodal pages help: image and video content with descriptive alt text and text equivalents.
- Keep entity data consistent across site, schema, and Google Business Profile where relevant.

---

## Copilot and Bing-derived surfaces

**Retrieval:** Bing index, plus vendor-specific crawlers.

**Optimization:**

- Ensure Bing indexation (`Bingbot` allowed, sitemap submitted).
- Apply the same answer-first structure; Bing-derived surfaces favor clearly structured Q&A blocks.

---

## Measurement Template

Run the identical prompt set on each target engine before and after changes.

| Field | Example |
| --- | --- |
| Engine | Perplexity |
| Query | "best invoicing tool for freelancers in Germany" |
| Mentioned | yes |
| Cited | yes |
| Citation position | 3 |
| Cited URL | /pricing |
| Competitors cited | A, B |
| Date | 2026-10-05 |

Aggregate to a per-engine mention rate and citation share. Report the panel size and date with every number. A single spot check is an anecdote, not a measurement.
