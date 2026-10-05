---
name: geo
description: Generative Engine Optimization for AI search surfaces (ChatGPT, Perplexity, Google AI Overviews, Claude, Gemini, Copilot). Use when the user wants AI visibility, AI citations, GEO/AEO work, llms.txt, AI crawler access, citability, or brand-mention strategy.
metadata:
  origin: ECC
---

# GEO — Generative Engine Optimization

Optimize a site to be **retrieved, parsed, quoted, and cited** by AI answer engines, without breaking classic search. GEO is not SEO with new vocabulary: AI engines retrieve passages, not rankings, and they cite sources they can extract cleanly and verify against other sources.

## When to Activate

- the user asks about AI search, AI Overviews, ChatGPT/Perplexity/Claude/Gemini visibility, or "GEO"/"AEO"/"LLM SEO"
- a site is invisible or misrepresented in AI answers
- the user wants an `llms.txt`, a citability score, or an AI crawler audit
- content is being written or rewritten for AI answer surfaces
- the user wants to measure AI citation share before/after a change

If the request is a classic crawl/index/performance audit, use `seo-technical-audit` instead. If it is a live-site scored audit, use `aeo-audit`.

## Core Model

Classic search ranks URLs; AI engines assemble answers. Five consequences drive every recommendation in this skill:

1. **Retrieval is passage-level.** An engine extracts chunks, so a page's value is the sum of its extractable passages, not its overall "quality".
2. **Access comes first.** A blocked crawler makes every content improvement irrelevant.
3. **Extractability beats persuasion.** Self-contained, fact-dense, answer-first passages are quotable; narrative build-ups are not.
4. **Authority is entity-level.** Corpus-wide brand signals (mentions, references, consistent entity data) correlate with citation more strongly than link authority alone.
5. **Platforms differ.** The same query produces different sources on different engines, so measure per engine rather than assuming one "AI ranking".

## Workflow

Run the phases in order. Each phase produces evidence you can cite back to the user; do not skip to content advice before access and extractability are verified.

### Phase 1 — Access and indexability

Answer: *can AI systems reach and ingest this content at all?*

- Fetch `robots.txt` and map every AI-relevant user-agent to allow/block. Use `references/ai-crawlers.md`.
- Flag `nosnippet`, `noai`, `noimageai`, and `X-Robots-Tag` variants — these silently suppress AI usage even when crawling is allowed.
- Check whether primary content is server-rendered. Most AI fetchers do not execute JavaScript; client-only content is invisible.
- Confirm an XML sitemap exists, is referenced from `robots.txt`, and carries accurate `lastmod` values.

Output: an access table (bot → verdict → impact) plus the minimum set of `robots.txt` changes.

### Phase 2 — Structural parseability

Answer: *does the HTML decompose into clean, typed content blocks?*

- Verify one `H1`, a monotonic `H1 → H2 → H3` outline, and headings that read as questions where the page answers questions.
- Prefer semantic elements (`<article>`, `<section>`, `<table>`, `<ol>`) over styled `<div>` stacks.
- Ensure every chart or embedded visual has a text equivalent (summary + data table); images alone are invisible to extraction.
- Confirm structured data matches visible content — mismatched schema causes misrepresentation, not citation.

Output: a per-template fix list (head, layout, content component).

### Phase 3 — Citability

Answer: *which passages would an engine actually quote?*

Run `geo-citability` for the full rubric and scoring. At minimum:

- Locate the passage that answers the page's primary question. It should appear in the first 40–60 words of the section, in definition or direct-answer form.
- Check self-containment: each passage should name its subject explicitly and survive extraction without surrounding context.
- Check fact density: named entities, numbers, dates, and attributed claims per section.
- Rewrite the two or three weakest passages as proof-of-concept rather than describing them abstractly.

Output: before/after passages plus a citability score with the sub-scores that produced it.

### Phase 4 — Entity and brand signals

Answer: *is the entity consistent and corroborated across the corpus?*

- Define the entity once (legal name, short name, domain, founding data, key people) and check it is used identically across the site, schema, and profiles.
- Look for third-party corroboration: encyclopedic entries, review platforms, developer/community surfaces, video, professional profiles, press.
- Prioritize mention quality over volume: an unlinked, accurate mention on a surface AI systems already retrieve from is worth more than a link on an unrelated directory.
- Check competitor citation sets to find surfaces where the category is cited but the brand is absent.

Output: a prioritized mention-acquisition list tied to specific surfaces, not a generic "get more backlinks" list.

### Phase 5 — Platform fit and measurement

Answer: *does the change move citations, per engine?*

- Apply the platform playbooks in `references/platform-playbooks.md` where the target engines are known.
- Establish a baseline before changing anything: a fixed query panel run per engine with the same prompt set.
- Record per query: mentioned (yes/no), cited (yes/no), citation position, cited URL, and competitor sources.
- Re-run the identical panel after the change window. Report deltas with the panel and date, never a single spot check.

Output: a baseline table, the intervention list, and the re-measurement plan.

## Scoring Model

Score each dimension 0–100 and report the sub-scores, never only the composite.

| Dimension | Weight | What earns points |
| --- | --- | --- |
| AI crawler access | 25% | Citation-critical bots allowed, AI meta tags absent, SSR content |
| Citability | 25% | Answer-first sections, self-contained passages, fact density |
| Structural parseability | 15% | Clean outline, semantic HTML, text equivalents for media |
| Entity and authority signals | 20% | Consistent entity data, corroborating mentions, attributed claims |
| Platform fit | 15% | Engine-specific surfaces handled deliberately |

Weights are defaults. If the user's traffic is concentrated on one engine, say so and re-weight explicitly rather than silently.

## Evidence Discipline

GEO has a short, noisy evidence base. Keep three habits:

- **Label confidence.** Mark each finding as `verified` (observed in fetched output), `inferred` (derived from observed signals), or `unverified` (vendor-reported or assumed). Never present `unverified` claims as measurements.
- **Verify before recommending.** Before telling a user to add something (schema type, Open Graph tag, canonical, `llms.txt`), confirm it is actually absent. Recommending an already-present fix is the most common failure mode in AI audits and it destroys trust faster than a missed finding.
- **Do not claim causation from correlation.** A citation change after a change window is not proof the change caused it. Report the delta and the confounders (algorithm updates, crawl lag, seasonality, news cycles).

Treat vendor statistics as directional. Prefer peer-reviewed or reproducible sources when quoting numbers, and cite the source and year inline whenever you do.

## Anti-Patterns

| Anti-pattern | Why it fails | Instead |
| --- | --- | --- |
| Keyword stuffing for AI | No measurable citation gain; degrades readability | Answer-first passages with specifics |
| Blocking all AI crawlers reflexively | Removes the site from AI answers entirely | Separate citation bots from training-only bots |
| Chasing an `llms.txt` with no other work | Not a ranking or citation lever on its own | Treat it as a clarifier for an already-crawlable site |
| Inventing statistics to look "data-rich" | Fabrication is the fastest way to lose entity trust | Attribute real sources, or state the gap |
| Reporting one engine's result as "AI visibility" | Engines cite different source sets | Measure per engine, report per engine |
| Recommending fixes without checking the live page | Hallucinated findings poison the whole audit | Verify each item against fetched output |

## Output Contract

Every GEO engagement returns:

1. **Access table** — bot, verdict, impact, exact change needed.
2. **Scored findings** — dimension, score, evidence, confidence label.
3. **Prioritized actions** — ordered by impact on citation likelihood, each tied to a file, URL, or asset.
4. **Before/after examples** — at least one rewritten passage.
5. **Measurement plan** — query panel, engines, cadence, baseline date.

Use this finding shape:

```text
[HIGH] GPTBot blocked in robots.txt
Evidence: GET /robots.txt (2026-10-05) -> "User-agent: GPTBot / Disallow: /"
Impact: Content cannot be surfaced in ChatGPT search results.
Confidence: verified
Fix: Remove the GPTBot disallow; keep training-only bots blocked if desired.
```

## Related Skills

- `geo-citability` — passage-level scoring and rewriting
- `aeo-audit` — live-site scored audit with deterministic checks
- `seo-technical-audit` — crawl, index, performance, and rendering
- `schema-markup` — structured data that matches visible content
- `seo` — classic on-page and content-side SEO
- `topical-authority-map` — content architecture that supports entity authority

## Provenance

Adapted and rewritten for ECC from MIT-licensed community work: `geo-seo-claude` (Zubair Trabzada), `gtm-engineer-skills` (OnVoyage AI), `Agentic-SEO-Skill` (Bhanunamikaze), and `geo-optimizer-skill` (Auriti Labs). Concepts were re-derived and restructured; see `research/seo-geo-skills-landscape-2026-10.md` for the full survey, licenses, and benchmark evidence.
