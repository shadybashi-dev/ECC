---
name: geo-citability
description: Score and rewrite content so AI answer engines can extract and quote it. Use when the user wants a citability score, passage-level rewrite, answer-first content, or content that ChatGPT/Perplexity/AI Overviews will quote.
metadata:
  origin: ECC
---

# GEO Citability

Citability is the probability that an AI answer engine extracts a passage from a page and presents it as (or inside) an answer. It is a property of individual passages, not of a page. Optimizing a page means optimizing its weakest quotable units.

Use this skill whenever content is being written for AI-surfaced queries, or when a page exists but never appears in AI answers.

## When to Activate

- the user wants content to be cited by AI engines
- a page ranks in classic search but never appears in AI answers
- the user asks for answer-first, extractable, or quotable writing
- a content brief or draft needs a citability review before publishing
- an AEO audit surfaced low citability and the passages now need rewriting

## The Five Properties of a Citable Passage

1. **Answer-first.** The direct answer appears in the first sentence or two of the block, not after the context.
2. **Self-contained.** The passage names its subject explicitly and makes sense with no surrounding text.
3. **Fact-dense.** It contains concrete specifics — numbers, dates, named entities, units, attributed claims.
4. **Right-sized.** It sits in the extractable range (roughly 50–200 words; the most-cited band in the literature is 134–167 words) rather than in a wall of text.
5. **Typed.** It follows a recognisable shape — definition, comparison, procedure, or quantified answer — that an engine can label.

## Scoring Rubric

Score each dimension 0–100, then weight. Always report sub-scores so the user can see what to fix.

| Dimension | Weight | Good looks like |
| --- | --- | --- |
| Answer block quality | 30% | Sections open with a 1–2 sentence direct answer; definition patterns ("X is…"); quantified answers |
| Self-containment | 25% | Passages name their subject; no context-dependent pronouns or "as mentioned above" |
| Structural parseability | 20% | Question-form headings, 2–4 sentence paragraphs, tables for comparison, lists for sequences |
| Fact density | 15% | Specific statistics, dates, and attributed claims at a useful rate per section |
| Passage sizing | 10% | Majority of blocks fall in the extractable range rather than in 400-word paragraphs |

Full anchors for every level: `references/citability-rubric.md`.

## Workflow

### 1. Extract, do not skim

Fetch or read the actual content. Split it into candidate passages at heading boundaries, then into paragraph blocks. Do not score from memory or from a summary.

### 2. Identify the page's primary question

Every page answers one main question. Find the passage that answers it. If no passage does, that is the first finding, and no amount of micro-editing fixes it.

### 3. Score the five dimensions

Use the anchors in `references/citability-rubric.md`. Cite the specific passage for each score. A score without a quoted example is unfalsifiable and therefore useless.

### 4. Rewrite the weakest passages

Pick the two or three highest-leverage passages — typically the primary answer, the main comparison, and the section that gets the most retrieval traffic. Rewrite them visibly. A worked rewrite is more useful than a list of principles.

Rewrite moves that reliably raise citability:

- Move the conclusion to the front of the section (BLUF).
- Replace pronouns with the entity name.
- Replace vague quantifiers with numbers sourced from the page or a cited reference.
- Split a long paragraph at its natural seam into 2–4 sentence blocks.
- Convert prose comparisons into a real table.
- Convert a process description into an ordered list with imperative steps.
- Add an explicit definition sentence for each core concept on first use.

### 5. Re-score and show the delta

Report before/after per dimension. Note which improvements are verified changes and which are estimates.

## Answer Block Patterns

```text
Definition:     X is a [category] that [function]. It [differentiator] and is used for [use case].
Quantified:     The average [thing] is [number] [unit], based on [source, year].
Comparison:     X differs from Y in three ways: [dimension], [dimension], and [dimension].
Process:        1. Do [step]. 2. Do [step]. 3. Verify [condition].
Conditional:    If [condition], then [outcome]; otherwise [alternative].
```

Each pattern is extractable because it carries its own subject and its own predicate. Use them as shapes, not templates to fill mechanically — a page of identical patterns reads as generated and loses credibility.

## Worked Example

**Before (low citability):**

> If you have ever wondered why some websites load faster than others, the answer might surprise you. There is a technology that has been around for a while and it has changed how teams think about performance. In this article we will look at it and explain why it matters for your business.

*Problems: no subject named, no facts, answer deferred, no extractable claim, first sentence adds nothing.*

**After:**

> A content delivery network (CDN) is a distributed set of servers that caches and serves content from locations near the end user. A CDN typically reduces latency by 50–70% compared with serving every request from a single origin. The largest providers are Cloudflare, Amazon CloudFront, and Akamai.

*Fixes: definition pattern, subject named, quantified claim, named entities, 47 words, self-contained.*

## Anti-Patterns

| Anti-pattern | Why it hurts |
| --- | --- |
| Scoring from a summary instead of the source | Produces confident, wrong findings |
| Rewriting every paragraph | Dilutes the page's voice and wastes effort; fix the passages that get retrieved |
| Fabricating statistics to raise fact density | Destroys entity trust if discovered; use real sources or state the gap |
| Turning the whole page into bullet fragments | Loses the connective reasoning engines also extract |
| Ignoring classic search intent | A citable page that does not satisfy the query still loses the click |
| Reporting one composite score without sub-scores | Not actionable, and hides which weakness actually matters |

## Related Skills

- `geo` — access, entity signals, platform fit, measurement
- `aeo-audit` — runs citability scoring as part of a scored site audit
- `seo` — classic on-page and intent work
- `article-writing` — longer-form drafting workflow

## Provenance

Adapted and rewritten for ECC from MIT-licensed community work: `geo-seo-claude` (citability model), `geo-optimizer-skill` (evidence-based method ordering), and `Agentic-SEO-Skill` (GEO criteria). See `research/seo-geo-skills-landscape-2026-10.md`.
