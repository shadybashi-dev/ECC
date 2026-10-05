# Citability Rubric — Full Anchors

Score each dimension 0–100. Anchor descriptions are behavioural: match the observed content, do not average impressions.

---

## 1. Answer Block Quality (30%)

Measures whether sections open with extractable answers.

| Band | Anchor |
| --- | --- |
| 90–100 | Every major section opens with a 1–2 sentence direct answer. Definition or quantified-answer patterns present. The first 40–60 words of a section stand alone as a complete answer. |
| 70–89 | Most sections have clear answer openings. Some definition patterns. Answers identifiable but occasionally need minor context. |
| 50–69 | Some answer-like openings, but many bury the answer mid-paragraph or at the end. Few explicit patterns. |
| 30–49 | Answers generally buried. No consistent pattern. Narrative-driven rather than answer-driven. |
| 0–29 | No identifiable answer blocks. Extraction would return nothing quotable. |

Look for: "X is…", "X refers to…", "X means…", "The average X is Y", "X differs from Y in N ways".

---

## 2. Self-Containment (25%)

Measures whether a passage survives extraction.

| Band | Anchor |
| --- | --- |
| 90–100 | 80%+ of blocks are fully self-contained; each names its subject; no pronoun chains; each carries at least one specific fact. |
| 70–89 | 60–79% self-contained; most passages name their subject; occasional context-dependent reference. |
| 50–69 | 40–59% self-contained; mixed explicit subjects and pronouns; some passages need prior sections. |
| 30–49 | 20–39% self-contained; heavy pronoun reliance; most passages need surrounding text. |
| 0–29 | Under 20%; extraction loses meaning. |

Per-passage checklist:

1. Does it name the subject rather than "it", "this", or "they"?
2. Can a reader understand the point from this passage alone?
3. Does it contain at least one specific fact, statistic, date, or named entity?
4. Is it between roughly 50 and 200 words?
5. Does it avoid opening with a conjunction ("But", "However", "And") that implies missing context?

---

## 3. Structural Parseability (20%)

Measures whether the markup decomposes into typed blocks.

| Band | Anchor |
| --- | --- |
| 90–100 | Clean H1 > H2 > H3 hierarchy. Question-form headings on informational sections. 2–4 sentence paragraphs. Tables for comparisons; ordered lists for processes; unordered lists for option sets. |
| 70–89 | Good hierarchy with minor skips. Some question headings. Mostly short paragraphs. Some tables and lists. |
| 50–69 | Hierarchy present but inconsistent. Few question headings. Mixed paragraph lengths. Limited structure. |
| 30–49 | Minimal heading structure. No question headings. Long paragraphs dominate. Rare lists or tables. |
| 0–29 | No usable structure; wall-of-text output. |

Also check: semantic elements for main content, a text equivalent for every chart or data visual, and no critical content locked behind client-side rendering.

---

## 4. Fact Density (15%)

Measures the concentration of verifiable specifics.

| Band | Anchor |
| --- | --- |
| 90–100 | Statistics, dates, and named sources throughout; in-text attribution; claims traceable to primary sources. |
| 70–89 | High density; most sections carry at least one specific, attributable fact. |
| 50–69 | Some statistics and named sources; much of the page is still general. |
| 30–49 | Mostly generalities; rare specifics; claims unattributed. |
| 0–29 | No evidence; marketing copy and vague superlatives only. |

Counting rule: a "fact" is a number with a unit, a date, a version, a named entity with an attributed claim, or a citable quotation. Flag it if a claim cannot be traced.

---

## 5. Passage Sizing (10%)

Measures whether blocks fall in extractable ranges.

| Band | Anchor |
| --- | --- |
| 90–100 | Majority of blocks 50–200 words, with many in the 134–167 word band reported as most-cited. |
| 70–89 | Most blocks in range; a few outliers. |
| 50–69 | Mixed; several 300+ word blocks. |
| 30–49 | Long blocks dominate; extraction returns over-long or fragmented text. |
| 0–29 | Single dense block or fragments only. |

Note: 134–167 words is a reported optimum from the GEO literature, not a hard rule. Content quality outranks hitting a word count.

---

## Composite and Reporting

```text
citability = 0.30*answer + 0.25*self_containment + 0.20*structure + 0.15*facts + 0.10*sizing
```

Report:

```text
Page: /pricing
Citability: 62/100
  Answer block quality   70  — "Pricing" section opens with a table, no definition sentence
  Self-containment       55  — 6 passages use "this plan" with no antecedent in the block
  Structural parseability 80 — clean hierarchy, one table, no question headings
  Fact density           60  — prices are specific; limits and overage rates are vague
  Passage sizing         65  — three 350+ word blocks

Highest-leverage fix: add a definition-led answer sentence to each pricing tier section.
```

Never report the composite alone. The sub-scores are the deliverable.
