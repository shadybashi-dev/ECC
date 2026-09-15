# Visual study — Antonia's Pizza site (2026-09-14)

Panel (internal ensemble): **art director** (palette & cohesion), **color
scientist** (WCAG 2.1 luminance math on every colored text/surface pair),
**photo editor** (per-image photometric stats + pixel inspection of 9 assets),
**UI/a11y reviewer** (context mapping of every colored element to its real
section background). Every claim below is measured; nothing is vibes.

## 1. Method
- WCAG relative-luminance contrast computed for all 17 palette pairs in use.
- Every image referenced by HTML/CSS measured: brightness, saturation,
  warmth (R−B mean) via 1×1 downsample; the graded food set defines the
  family band (bright .23–.33, sat .46–.75, warm +43…+98).
- Nine assets opened and inspected at pixel level (hero-pep, hero-sauce,
  dough-toss, og/paso, og/slo, real-patio, + wheel/feast references).
- Every `--red`/`--gold` text or surface use mapped to its actual runtime
  background (section class chain), because the same token passes on paper
  and fails on sky, or vice-versa.

## 2. Palette verdict (color scientist)
Core pairs were already excellent: body ink-on-paper 11.8:1, cream-on-navy
11.8:1, cream-on-char 18.3:1, navy-on-sun 8.3:1, gold-on-char 8.6:1.
Failures found and **fixed**:

| element | was | ratio | now | ratio |
|---|---|---|---|---|
| `.hero .eyebrow` (gold on paper) | gold | 2.12 ✗ | `--gold-ink #8f6116` | 5.29 ✓ |
| `.review-card cite` (red on paper, 16px bold) | red | 3.95 ✗ | `--red-deep #c03a24` | 5.31 ✓ |
| `.skip-link` bg (cream text) | red | 3.95 ✗ | red-deep | 5.31 ✓ |
| `.section--red` surface (cream body text) | red | 3.95 ✗ | red-deep | 5.31 ✓ |
| `.section--red .eyebrow` | navy | 2.99 ✗ | cream | 5.31 ✓ |
| `.loc-tabs button.active` (cream, .9rem) | red | 3.95 ✗ | red-deep | 5.31 ✓ |
| `.craving-word` (h2 word on sky wheel band) | red→red/orange shimmer | 2.97 ✗ | char + char/navy shimmer | 13.7 ✓ |

New tokens live in `:root` with a comment; brand `--red`/`--gold` stay for
large type (≥24px / ≥18.66px bold) and graphics where 3.95 passes AA-large:
marquee band (22px w800), `.deal-card .price` (2.6rem), `.info-card .big`,
`.google-note b`, hero highlight spans, wheel needle, dots, underlines.
Verified AA-large-by-math, not by eye.

Not failures (checked and left alone): gold `.tag` chips sit on dark
`.dish-card` (8.6:1); `.loc-rows .row b` red sits on the dark band (4.6:1);
footer heads gold-on-navy (5.6:1); dark-section eyebrows gold-on-navy
(5.6:1) — their six ad-hoc inline `style="color:var(--gold)"` patches were
replaced by one `.section--dark .eyebrow` rule (single source of truth).

## 3. Image set verdict (photo editor)
Family band after the million-dollar grade: bright .23–.33, sat .46–.75,
warm +43…+98. Outliers found:

| asset | was | problem | treatment | now |
|---|---|---|---|---|
| `og/paso.jpg` | sat **0.06** | pillarboxed: ~60% of the share card was flat grey bars | rebuilt full-bleed from owner's real `storefront-night.jpg` (center-crop 825×433 → 1200×630) + warm night grade | sat .35, warm +34, no bars |
| `og/slo.jpg` | bright .50 sat .34 | soft blown-out tight crop of brick | rebuilt from owner's real `storefront.jpg` (800×420 → 1200×630) + grade | sat .53, warm +77 |
| `hero-sauce.jpg` | sat .21 bright .53 | high-key white-marble shoot next to moody siblings | two gentle grade passes (sat +, exposure −, warm +) | sat .33, warm +47 — same kitchen as the family |
| `dough-toss.jpg` | sat .38 | slightly flat vs wheel set | gentle sat pass | sat .42 in band |

**Untouched on purpose:** `real-patio.jpg` (documentary daytime, inspected —
excellent), `real-night`, `pies-2`, `storefront*` (owner's real photographs:
authenticity over matching), wheels/feast/hero-pep (already in band).
Both OG rebuilds use only owner real photos — honest share cards.

## 4. UI / typography verdict
- `.btn` default is sun-on-navy (8.3:1) since the dev round — the order path
  was never at risk; the red risk was in secondary surfaces above.
- Marquee stays brand red: 22px+ w800 passes AA-large by measurement.
- Heading/spacing rhythm unchanged (develop round); no layout shifted by
  this study — all changes are color tokens, two image rebuilds, two grades.

## 5. Gate after the study
harness 0 FAIL / 0 WARN · img audit 47/47 · node --check clean · build re-run
(standalone 5649 KB) · routes + rebuilt assets 200 · 0 inline gold styles
left in served HTML · pause list 16 + RM universal kill intact (shimmer
recolour touches no animation registration).

## 6. Open questions for external models (via the bridge pack)
1. `--gold-ink #8f6116` reads "toasted bronze" on paper — keep, or push the
   hero eyebrow to full navy like the base rule?
2. og/paso night sat .35 vs og/home .69 — acceptable honest spread, or grade
   the night warmer still?
3. Any red-on-light small-text use we missed? The harness does not check
   contrast yet — should `ensemble_review.py` grow a palette-contrast check?
