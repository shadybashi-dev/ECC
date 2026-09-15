---
name: ui-stack-excellence
description: The strongest production UI stack for 2026 content-and-commerce websites — Tailwind CSS v4, shadcn/ui on Base UI primitives, Motion and GSAP ScrollTrigger, Lenis smooth scroll, MagicUI/Aceternity-style hero effects, plus the component-library decision matrix with star counts, bundle weights, Lighthouse scores, and accessibility grades. Use when selecting a UI library, building a premium hero, or pushing a marketing site past the default-template look without wrecking Core Web Vitals.
metadata:
  origin: project-synthesis
  layer: 4
  evidence: 2026 component-library comparisons, Lighthouse benchmarks, HTTP Archive CWV data
---

# UI Stack Excellence

"Strongest UI" means two things at once: **visually the most impressive** and
**technically the most performant**. Optimising one without the other produces
either an award-site that nobody can order from, or a fast site that looks like
every other template. This skill holds both halves.

---

## 1. Component library decision matrix (2026)

| Library | Type | Stars | Bundle | A11y | Tailwind | Lighthouse | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **shadcn/ui** | copy-paste | ~121k | 10–20 KB | AAA (Base UI) | native | 98 | **default choice** |
| **Base UI** | headless primitives | ~10.6k | 2–5 KB/comp | AAA | compatible | 96 | shadcn's primitive layer since Jul 2026 |
| **Radix UI** | headless primitives | ~19k | 3–5 KB/comp | AAA | compatible | 96 | still excellent; dev slowed post-WorkOS |
| **React Aria** | headless (Adobe) | ~11.5k | 2–4 KB/comp | AAA | compatible | — | strongest a11y research backing |
| **Headless UI** | headless (Tailwind Labs) | ~28.7k | ~4 KB/comp | AAA | native | 97 | few components, all correct |
| **HeroUI** (ex-NextUI) | styled React | ~30k | +Motion ~30 KB | good (React Aria) | v4 native | 92 | 71+ components, ships llms.txt + skills |
| **MagicUI** | animation-first | ~15.3k | moderate | good | native | — | best for animated marketing heroes |
| **Aceternity UI** | visual impact | — | heavier | partial | native | — | stunning heroes; audit the weight |
| **Mantine** | styled | ~31k | ~60 KB | AA | compatible | 94 | 120+ components, 70+ hooks |
| **MUI** | styled enterprise | ~98k | 100–200 KB | AA | partial | 88 | data grids, enterprise only |
| **Ant Design** | styled enterprise | ~96k | 150–300 KB | AA | no | 85 | dense dashboards only |
| **daisyUI** | CSS-only Tailwind plugin | ~42k | 10–20 KB, **0 KB JS** | partial | plugin | high | fastest zero-JS theming |
| **Tailwind Plus** | premium templates | closed | 0 KB JS | good (WAI-ARIA) | native | high | 500+ paid blocks |
| **HyperUI** | copy-paste blocks | ~12.2k | 0 KB JS | minimal | native | high | free static sections |
| **Tremor** | dashboards | ~3.5k | +charts | good | v4 | — | analytics surfaces |

Key 2026 fact: **shadcn/ui switched its default primitive layer from Radix to
Base UI in July 2026.** Radix is not deprecated and existing projects need no
migration — but new installs pull Base UI.

The headless direction won: **70% adoption growth in 2025.** Headless + your own
Tailwind styling is how you get a distinctive look with correct accessibility.

### Recommendation for a restaurant site

```
Tailwind CSS v4            ← styling layer (CSS-first @theme, logical props for RTL)
shadcn/ui (Base UI)        ← dialogs, menus, tabs, forms, sheets — accessible primitives
MagicUI / hand-built       ← hero and signature moments only
Motion (motion.dev)        ← React island micro-interactions (~8 KB)
GSAP + ScrollTrigger       ← pinned scrollytelling, complex sequences (now 100% free)
Lenis                      ← smooth momentum scroll (replaced Locomotive Scroll)
native CSS animation-timeline ← the simple ~80% of scroll effects, zero JS
```

**Do not** install MUI, Ant Design, or Mantine for a marketing site — you pay
100–300 KB for components you will restyle anyway.

---

## 2. The two-layer rule (how to be impressive *and* fast)

Most "beautiful" sites fail because they hydrate everything. Split the page:

**Layer A — Static, zero JS (Astro islands absent).**
Hero image, headlines, menu HTML, hours, address, reviews, footer, gallery
grid. This is 90% of the page and 100% of what Googlebot and AI crawlers read.
Motion here is **native CSS scroll-driven animation**, which runs on the
compositor off the main thread and costs 0 KB of JS:

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: none; }
}
.reveal {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; transform: none; }
}
```

Baseline support in all major browsers as of 2026. Use this for reveals,
progress bars, parallax, and sticky-section effects.

**Layer B — Islands, hydrated only where a human interacts.**
Menu filter, cart, reservation form, gallery lightbox. `client:visible` or
`client:idle`, never `client:load`. Budget: **< 40 KB total JS on the home page.**

If you find yourself marking everything `client:load`, you are building a React
app in an Astro costume — stop and re-split.

---

## 3. Hero patterns that do not read as generated

Banned (the default tells): centred headline + gradient blob + generic CTA;
`#F4F1EA` cream + terracotta + serif; identical rounded cards with one
`rgba(0,0,0,.1)` shadow; tracked-out ALL-CAPS eyebrow above every heading;
`A · B · C` meta strings; `→` appended to every button.

Strong alternatives for food:

| Pattern | Why it works | Cost |
| --- | --- | --- |
| **Full-bleed dish, type overlaid on the dark side** | The food is the hero; type rides the shadow. Instantly appetising. | 0 KB JS |
| **Oven-to-table sequence** (3-frame scrub on scroll) | Communicates heat and immediacy; ScrollTrigger scrub | ~15 KB |
| **Split editorial** — huge display type left, stacked dish photos right, asymmetric | Magazine feel, high craft signal | 0 KB JS |
| **Bento grid of the menu** — varied tile sizes, one live tile | Shows breadth without a wall of identical cards | 0 KB JS |
| **Cheese-pull / steam moment** — one looped 3s webm, muted, no audio | Single highest-arousal image possible for pizza | ~300 KB video — gate it |
| **Late-night takeover** — dark palette, glowing "OPEN TILL 2 AM" | Owns the time-slot competitors ignore | 0 KB JS |

Pick **one**. Spend the boldness in exactly one place and keep everything else
quiet — that contrast is what reads as intentional.

---

## 4. Detail craft — the difference between good and premium

These are the things a reviewer cannot name but everyone feels:

1. **Concentric radius.** Inner radius = outer radius − gap. A 16 px card with
   8 px padding contains a 8 px button, not another 16 px one.
2. **Optical alignment, not mathematical.** Circular icons need slightly more
   padding than square ones to look equal.
3. **Border + shadow together, or neither.** A 1 px border alone looks like a
   wireframe; a shadow alone looks detached.
4. **Hover states change two properties, not one** (e.g. lift + border color).
   One reads as a bug.
5. **Focus rings are designed, not default.** `outline: none` without a
   replacement is an accessibility failure, not a design choice.
6. **Numbers are tabular** (`font-variant-numeric: tabular-nums`) so prices and
   times do not jitter.
7. **Text wrapping:** `text-wrap: balance` on headings, `text-wrap: pretty` on
   paragraphs. Prevents the orphaned last word.
8. **Empty and loading states are designed.** A skeleton that matches the final
   layout keeps CLS at zero.
9. **Type scale is a real ratio** (1.2 or 1.25), not ad-hoc pixel values.
10. **Spacing rhythm:** one base unit (4 or 8 px), section padding in a
    deliberate progression, not uniform 96 px everywhere.
11. **Images have explicit `width`/`height` or `aspect-ratio`** — always.
12. **No horizontal overflow at 360 px.** Test at 360, 390, 414, 768, 1024, 1440.

---

## 5. Dark mode as a direction, not a toggle

Do not ship a toggle by default. **Choose** light or dark based on what the
brand is. A late-night kitchen open until 2 AM has a genuine reason to be dark
— and dark surfaces make warm food colours pop (higher perceived contrast on
reds/ambers).

If you ship both, both must feel intentional. A dark mode that is `filter:
invert()` on the light palette is worse than no dark mode.

---

## 6. Performance gates for a "premium" UI

Premium is not allowed to be slow. Hard limits:

| Metric | Gate |
| --- | --- |
| Home page JS | < 40 KB (target), < 100 KB (absolute) |
| LCP | < 1.5 s |
| INP | < 100 ms |
| CLS | < 0.02 |
| Hero image | < 180 KB AVIF, preloaded, `fetchpriority="high"` |
| Fonts | ≤ 2 families, variable WOFF2, subsetted, `swap` |
| Third-party in `<head>` | **zero** |
| Lighthouse mobile | ≥ 95 |

Rules that keep the gates green:

- GSAP is loaded **only on the page that uses ScrollTrigger**, dynamically,
  after first paint.
- Lenis is optional. It is a nice-to-have that costs JS and can break native
  scroll behaviour, sticky positioning, and anchor jumps. Skip it on the
  ordering path entirely.
- Video heroes: poster image first, video swapped in after `load`, only on
  desktop-class connections (`navigator.connection.effectiveType`), never on
  the ordering flow.
- Maps embeds and Instagram feeds load **after interaction or after `load`** —
  never render-blocking.
- Every animation uses `transform`/`opacity` only.
- `content-visibility: auto` on below-fold sections.

---

## 7. Anti-template verification

Before calling any surface done, screenshot it and answer honestly:

1. Could this be any other restaurant's site with the logo swapped? If yes, redo.
2. Is there exactly one memorable moment? (Zero = flat. Three = noise.)
3. Would a designer recognise this as a Tailwind/shadcn default?
4. Is the palette derived from the actual food, or from a preset?
5. Does it look as good at 360 px as at 1440 px?
6. Is the primary CTA the highest-contrast element on screen?
7. Does it survive `prefers-reduced-motion` and still feel designed?

Four or more "yes" answers, and it ships.

> Related: `frontend-design` (aesthetic direction and the AI-tell catalogue),
> `design-system` (tokenising all of the above),
> `make-interfaces-feel-better` (§4 expanded),
> `motion-foundations` / `motion-patterns` / `motion-advanced` (implementation),
> `neuromarketing-priming` (why these choices sell),
> `react-performance` (protecting INP under heavy UI).
