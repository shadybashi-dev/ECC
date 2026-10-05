# Evidence Base and Measurement

What is actually known about GEO, how strong the evidence is, and how to measure without fooling yourself.

## Evidence Tiers

Label every claim you make with one of these. Do not blur them.

| Tier | Meaning | Examples |
| --- | --- | --- |
| **Peer-reviewed** | Published with a reproducible method | Princeton/Georgia Tech/IIT Delhi KDD 2024 GEO study; AutoGEO (ICLR 2026); MAGEO (ACL 2026) |
| **Platform-documented** | Stated by the operator | Crawler token purposes in vendor docs; Google statements on AI Overviews eligibility |
| **Large-sample industry** | Vendor study with disclosed methodology | Ahrefs brand-mention correlation study; SE Ranking content-length analysis |
| **Vendor-reported** | Marketing or blog claim without a method | "AI traffic converts 4.4x better"; market-size forecasts |
| **Unverified** | Assumption or anecdote | Most single-site before/after stories |

When a user asks "is this real?", the honest answer names the tier. Most of the surprising numbers in circulation are vendor-reported.

## Peer-Reviewed Findings

### Princeton / Georgia Tech / IIT Delhi — KDD 2024

The first systematic GEO study. Measured visibility changes across ~10,000 queries on a generative engine. Directional results, ordered by reported impact:

| Method | Reported effect | How to apply |
| --- | --- | --- |
| Cite sources | Large positive | Add authoritative inline citations for factual claims |
| Add statistics | Positive | Replace vague claims with specific numbers, dates, units |
| Add quotations | Positive | Attribute expert statements with name, role, organization, year |
| Authoritative tone | Small positive | Write with confidence and precision, not hedging |
| Improve fluency | Positive | Simplify sentence structure; remove filler |
| Simplify language | Small positive | Define terms, use concrete examples |
| Use technical terminology | Small positive | Use correct domain vocabulary where it aids precision |
| Vary vocabulary | Small positive | Avoid repetitive phrasing |
| Keyword stuffing | Neutral to negative | Do not do it |

Treat the ordering as directional. Effect sizes depend on query, domain, and engine, and the study predates the current engine lineup.

### Follow-on work

- **AutoGEO (ICLR 2026)** — learns engine preferences automatically and rewrites content accordingly. Useful as evidence that preferences are both learnable and engine-specific.
- **MAGEO (ACL 2026)** — reusable strategy learning across engines. Reinforces that no single "GEO recipe" transfers universally.

Read the papers before quoting effect sizes to a client.

## Where the Field Is Weak

- Most public numbers come from vendor studies with undisclosed or non-reproducible methods.
- Engines change retrieval frequently; a result from six months ago may not hold.
- Citation ≠ traffic ≠ revenue. A citation without a click has brand value at best; do not report it as pipeline.
- Nearly all published studies use Western English queries. Non-English and non-Western markets are largely unmeasured — say so rather than extrapolating.

## Measurement Protocol

### 1. Build a query panel

- 15–30 prompts that mirror how buyers actually ask.
- Mix intent: awareness ("what is X"), consideration ("X vs Y"), decision ("best X for Y"), branded, and problem-led.
- Use full natural-language prompts, not keywords. Store them in a file so the panel is identical across runs.
- Include two or three prompts where the brand should *not* appear, as a control.

### 2. Record per-query observations

| Field | Notes |
| --- | --- |
| engine | The specific product surface |
| prompt | Verbatim, from the frozen panel |
| mentioned | Brand named anywhere in the answer |
| cited | Brand URL appears in the source list |
| citation_position | Order among sources |
| cited_url | Which page earned the citation |
| competitors | Other brands cited for the same prompt |
| observed_at | ISO date |

### 3. Baseline before changing anything

Run the panel, save the raw outputs, and store them with the panel file. Without a baseline, no later number is meaningful.

### 4. Isolate the intervention

Change one class of thing per window (access, structure, content, mentions). Record other events in the window: algorithm updates, PR, product launches, seasonality. If several changes ship at once, say that the result cannot be attributed to any single one.

### 5. Re-measure and report honestly

- Report mention rate and citation share per engine, with the panel size and both dates.
- Report the control prompts too; if they moved, something systemic happened.
- State confounders explicitly.
- Never claim causation from a before/after pair alone.

## Metrics That Are Worth Tracking

| Metric | Definition | Why it matters |
| --- | --- | --- |
| Mention rate | Share of prompts where the brand is named | Top-of-funnel presence |
| Citation share | Share of prompts where the site is a cited source | Direct attribution |
| Citation position | Median order of the source in the citation list | Visibility within the answer |
| Competitor overlap | Share of prompts citing both brand and a competitor | Competitive displacement |
| AI referral sessions | Analytics sessions from AI referrers | Actual traffic, imperfectly attributed |
| Query coverage | Share of the panel with any brand presence | Gap sizing |

Avoid composite "AI visibility score" numbers with undisclosed weights. If a score is used, publish its components.

## Reference: AI Referral Sources

Useful for analytics segmentation; referrer strings change, so re-verify periodically.

```text
chatgpt.com, chat.openai.com
perplexity.ai
claude.ai
gemini.google.com, bard.google.com
copilot.microsoft.com
you.com
poe.com
```

Most analytics tools need a custom channel group or regex to capture these. A large share of AI traffic arrives as direct or (not set) — treat referrer-based attributions as a lower bound.

## Reporting Template

```text
AI visibility — baseline 2026-10-05
Panel: 24 prompts, fixed, stored at research/ai-panel.md
Engines: ChatGPT, Perplexity, Google AIO

Engine      | Mention rate | Citation share | Median position
ChatGPT     | 8/24 (33%)   | 5/24 (21%)     | 3
Perplexity  | 11/24 (46%)  | 7/24 (29%)     | 2
Google AIO  | 15/24 (63%)  | 9/24 (38%)     | 4
Control prompts moved: no

Confounders in window: none
Interventions shipped: robots.txt access fix, 6 passage rewrites
```

No single-run, single-engine number should leave the report without its panel size and date.
