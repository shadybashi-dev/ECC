# Antonia's Pizza — website handoff

Everything another developer (or another AI tool) needs to pick this up cold.
Last updated: 2026-09-14.

---

## 1. What this is

A static marketing site for **Antonia's Pizza** — two locations on California's
Central Coast. Meant to be deployed at `antoniaspizza.com`.

- **Vanilla HTML + CSS + JS. No framework, no build step, no npm, no CDN.**
- Fonts are self-hosted `.woff2`. Nothing is fetched at runtime.
- Drop the folder on any static host (Netlify, Vercel, Cloudflare Pages, S3,
  cPanel) exactly as it is. No compile, no install.
- Visual direction is modelled on **pinza.com** — oversized display type, flat
  bright colour blocks, scrolling marquees, one signature interactive moment.

### Business facts baked into the pages
| | San Luis Obispo | Paso Robles |
|---|---|---|
| Address | 891 Higuera St, SLO, CA 93401 | 729 12th St, Paso Robles, CA 93446 |
| Phone | (805) 439-2383 | (805) 238-1851 |
| Late close | Thu–Sat till 2 AM | Fri–Sat till 2 AM |

Ordering goes to Toast: `https://antoniaspizza.toast.site/`
Signature items: pies from **10" to 28"**, and the **Ajarski** (Georgian-style
dough boat — mozzarella, feta, egg, butter).

---

## 2. File map

```
antonias/
├── index.html              home — hero, story, pie wheel, ajarski, deals, reviews, locations
├── menu.html               full menu (~38 dishes)
├── san-luis-obispo.html    location page
├── paso-robles.html        location page
├── our-story.html          editorial story — dough, sauce, Ajarski, late-night (round 10)
├── privacy.html            plain-English privacy (round 8)
├── standalone.html         GENERATED — do not hand-edit (see §3)
├── 404.html                branded not-found page (host should map 404 to it)
├── llms.txt                plain-text brief for AI answer engines
├── _redirects              clean-URL map (/menu -> /menu.html) for Netlify etc.
├── css/style.css           the entire design system, ~1000 lines, single file
├── js/main.js              all interactions, ~380 lines, one IIFE
├── favicon.svg
├── robots.txt / sitemap.xml
└── assets/
    ├── fonts/              8 self-hosted woff2 (Baloo 2 ×4, Anton, Sora ×3)
    └── img/
        ├── wheel/          the 8 pie-wheel slices — one per dish, all distinct (jpg+webp+avif)
        ├── og/             1200×630 social cards, one per page (see §10) — stays JPEG
        ├── gen/            generation masters for the food photos — gitignored
        └── *.jpg/webp/avif everything else, incl. logo.png (transparent, circle-cropped)
```

`build.py` sits one level up, beside the `antonias/` folder.

---

## 3. The one build rule

`standalone.html` is a **generated** single-file copy of `index.html` with CSS,
JS, fonts and images inlined as data URIs, so the site can be opened straight
from disk with no server. It is useful for previewing and for emailing to
someone, and it is **not** what you deploy.

After editing `index.html`, `css/style.css` or `js/main.js`:

```bash
python build.py
```

Never edit `standalone.html` by hand — the next build overwrites it, and a
hand-edit that only lives there silently diverges from the real site. This has
already bitten this project once.

To preview locally:

```bash
python -m http.server 8777 --directory antonias
```

---

## 4. Design system

All tokens live in `css/style.css`. **Heads-up: there are two consecutive
`:root` blocks and the second overrides most of the first.** The second block is
the live palette; the first is leftover from an earlier warm-cream direction and
should be consolidated (see §7).

```css
/* the palette that is actually in effect */
--sky:   #bfe3f2;   --sky-2: #d8eff9;   /* page ground */
--sun:   #ffd23f;   --sun-2: #ffde6b;   /* primary accent, CTAs */
--navy:  #0e3a52;   --navy-2:#0a2c3f;   /* text + dark sections */
--paper: #fffdf7;                       /* cards, light sections */
--red:   #e2492f;                       /* stats, emphasis */
--gold:  #e8a33d;                       /* wheel section ground */

--font-display: "Baloo 2", "Sora", system-ui, sans-serif;
--font-body:    "Baloo 2", "Sora", system-ui, sans-serif;
/* "Anton" is loaded and available for a condensed display alternative */

--dur-1:.18s  --dur-2:.34s  --dur-3:.6s  --dur-4:.9s
--ease-soft: cubic-bezier(.22,1,.36,1)
--ease-snap: cubic-bezier(.34,1.56,.64,1)
--radius: 32px
--container: min(1240px, 92vw)
```

### Two rules that are easy to break

**1. `html.js` gating.** An inline script in every `<head>` adds `.js` to
`<html>`. Scroll-reveal rules are written as `html.js .reveal{opacity:0}` so
that **if JavaScript never runs, the content stays visible** instead of the page
going blank. If you add a reveal-style rule, gate it the same way.

**2. That gating raises specificity to (0,2,1).** Any rule meant to override a
reveal — above all the `prefers-reduced-motion` block — must match that weight
(`html.js .reveal`) and use `!important`. A bare `.reveal` selector is (0,1,0),
loses the cascade, and silently does nothing. This exact mistake disabled
reduced-motion support site-wide until it was caught.

---

## 5. Interactions in `js/main.js`

One IIFE, top to bottom. `$` and `$$` are `querySelector` / `querySelectorAll`
helpers. The whole script runs on all four pages, so **every lookup must be
null-safe** — an unguarded `querySelector(...).x` throws and kills every feature
declared after it.

| Feature | Notes |
|---|---|
| Preloader | Fake percentage counter. Strongly consider deleting it — see §7. |
| Custom cursor | Dot + ring; pointer-fine only |
| Header shrink / hide | Scroll listener |
| Scroll reveals | IntersectionObserver adds `.in` to `.reveal` / `.stagger` |
| Number counters | `[data-count]`, 1600 ms |
| Hero parallax | Scroll + mouse |
| Card tilt | Composes on top of the element's existing inline transform and restores it on leave |
| Magnetic buttons | rAF-batched, rect cached on enter |
| FAQ accordion | `max-height` transition |
| Location tabs | |
| Open/Closed pill | Reads a per-day schedule; handles the after-midnight tail (see §6) |
| Marquees | `track.innerHTML += track.innerHTML` for a seamless loop |
| Review scroller | Drag to scroll |
| **Pie wheel** | The signature piece — 8 slices, auto-rotate, click, drag-to-spin |

### Reduced motion
`motionMQ` is a live `MediaQueryList`. Register a reaction with
`onMotionChange(fn)`; `prefersReduced` is a `let` that updates on change, so read
it at call time — do not copy it into a `const` at startup.

---

## 6. The pie wheel

The most fragile and most valuable component. `index.html` → `.pie-rotor`.

- Exactly **8 `.slice` elements**, each rotated `n × 45deg`, each with a
  counter-rotated `<img style="--r:-{n×45}deg">` so the photo stays upright.
- Each slice carries `data-name` (label shown in the centre disc and at the side)
  and `data-craving` (the word swapped into the "i'm craving ___" headline).
- **All 8 images must be different.** They previously were not: two slices shared
  `ajarski-2.jpg`, and `grill.jpg` / `pies-3.jpg` and `deli.jpg` / `pies-4.jpg`
  were byte-identical duplicates under different names. Current set lives in
  `assets/img/wheel/` and is verified distinct by hash.
- **Labels must match what the photo actually shows.** The image filenames
  inherited from `antoniaspizza.com` are unreliable — `ajarski-boat.png` is a
  pasta dish, `ajarski-four.png` is a cocktail glass. Look at the picture before
  naming the slice.
- `goTo(i)` travels the **shortest signed path**
  (`rot += mod(want - rot + 180, 360) - 180`). Setting an absolute angle makes
  the 8→1 wrap unwind 315° backwards, which looks broken.
- Autoplay is gated on an IntersectionObserver (`onScreen`) so the timer does not
  run — and force a reflow every 4.2 s — while the wheel is off screen.

### Open/Closed pill
Hours are `[open, close]` in minutes-from-midnight per weekday. **A `close`
value above 1440 means the shift spills into the next day** (1560 = 2 AM). At
00:30 the date has already rolled over, so the still-running shift belongs to
*yesterday's* row — `main.js` checks that tail explicitly. Without it the site
reads "Closed" during exactly the late-night hours the shop is known for.

---

## 7. Known issues

A 5-way audit found 95 issues; the critical correctness ones were fixed earlier.
The remainder of that list was worked on 2026-09-14; what is still open is below,
then what was fixed and how.

### Still open

**Content**
1. ~~Most food photography is AI-generated stock…~~ **Worked 2026-09-14, see §10.**
   The mismatched and duplicated shots were regenerated to match their captions
   and their display aspect ratios. What is still true and still owner-side:
   **photographs of the real kitchen, the real pies and the real dining rooms
   will out-convert anything generated.** Swap them in when you have them — the
   aspect ratios each slot wants are listed in §10.

**Code health**
16. The four pages duplicate a large `<head>`, header and footer. Some of it has
    already drifted apart between pages. Fixing this properly wants includes or
    a build step, which §9 forbids — so it stays a known cost of staying vanilla.
    The header now also carries the motion toggle (§5), one more thing to keep
    in sync by hand across four files.

### Fixed 2026-09-14

**Performance**
3. Preloader deleted from all four pages, its JS timer and its CSS, including
   the 4 s CSS-only auto-dismiss. `body.loaded` — previously added but listened
   to by nothing — now gates the hero title animation, set on DOMContentLoaded,
   so the entrance plays after first paint and is seen. Gated under `html.js`
   so a no-JS visitor still sees the headline (§4 rule 1); reduced motion gets
   an at-rest override matching the raised specificity (§4 rule 2). `riseIn`
   was kept: it lived inside the preloader block but the hero depends on it.
4. Each page preloads its own LCP image with `fetchpriority="high"` before the
   stylesheet, and the img carries `fetchpriority` + `decoding="async"`. The
   self-preconnect to the site's own origin was deleted from all four pages.
   Also found while fixing this: **logo.png was 512×512 and 220,818 B displayed
   at 92×92**, in every page's header, ahead of the hero image. Now 192×192 and
   12,165 B (-94%), quantised to 256 colours — lossless to the eye on this flat
   three-colour mark; alpha mask preserved. logo-180.png 44,308 → 11,822 B.
5. `will-change` removed from `.btn`, `.hero-bg` and every `.reveal`. Kept only
   where motion is continuous or interaction-driven (marquees, gallery, rotor).
6. `backdrop-filter` removed from both `.site-header.scrolled` rules (dark and
   light) and from the sticky `.menu-rail`; alphas raised to .97/.98 and the
   rail to solid paper so it reads the same without re-blurring every scroll
   frame. Zero `backdrop-filter` remains.

**Accessibility**
7. The rotor is now a real WAI-ARIA listbox: single tab stop, arrow/Home/End
   keys, `aria-selected` per option and `aria-activedescendant` published from
   `render()`. Focus pauses autoplay, blur resumes it — but only if the visitor
   has not globally paused, which is why `play()` checks `motionPausedByUser`.
8. WCAG 2.2.2 (Level A) pause mechanism added: a labelled header toggle sets
   `html.motion-paused`, pausing all 21 `infinite` animations plus the wheel
   autoplay. The list is explicit, not `*`, because the scroll-driven
   choreography under `animation-timeline: view()` is user-driven and would
   freeze mid-reveal if paused.
9. Closed mobile nav gets `visibility:hidden` (clip-path hid pixels but left
   the links in the tab order); the visibility transition is delayed on close
   so the clip animation still finishes.
10. Marquee/gallery clones are built node-by-node with `aria-hidden="true"` on
    each copy, keeping element structure identical so existing selectors match.

**Responsive**
11. Centre disc given an explicit `height:44%` alongside `width:44%` so the
    circle no longer depends on `aspect-ratio` winning against content; mobile
    dish name drops to ~1rem. **Reasoned, not eyeballed — there is no browser in
    the editing environment. Confirm on a device.**
12. `.order-badge` gets `border-radius:50%` so its hit area matches the drawn
    circle instead of the bounding square that was catching taps meant for the
    hero eyebrow.

### Second pass — impeccable / Taste Skill / emil-design-eng audit (2026-09-14)

Three design-engineering skill packs were installed into `.claude/skills/`
(`impeccable`, `taste-skill` + `redesign-skill`, `emil-design-eng`) and the site
was audited against their checklists. Impeccable's detector *binary* cannot run
in a GPU-less sandbox (its engine ships as a GitHub release asset), so its 60
rules were applied by hand. Findings and fixes:

14. **The three `:root` blocks are now one.** Correction to this document's own
    advice: the first block was *not* pure leftover — it solely owned live
    tokens (`--gold` 16 uses, `--ease-out` 31, `--ease-spring` 10, `--char`,
    `--char-2`, `--container`, `--cream-2`, `--green`, `--white`). Deleting it
    as "leftover" would have broken the site. The merge keeps those, keeps the
    second block's winning values for the seven tokens both defined, drops the
    seven dead writes and the unused `--red-dark`, and absorbs the third
    block's duration/easing scale. `grep -c '^:root{' css/style.css` must stay 1.
15. **Dead CSS removed, one broken feature rewired.** Every `@keyframes` is in
    use (verified by count). Removed as styled-but-unreferenced: `.hero-badge`
    (+ `svg`, `.badge-center`, and its two `motion-paused` selectors),
    `.float-chip` (+ `.a`, `.b`, + paused selector), and `.price-tag` — a price
    bubble style left on a site that deliberately shows no prices, i.e. a trap
    for the next editor — plus its theme variant. Rewired: the hero-recede
    scroll choreography (`animation-timeline:view()`, exit range) targeted
    `.hero-media`, **an element that exists on no page**, so it never ran; it
    now targets `.hero-photo`, which does. Reduced-motion still disables it.
    **Reasoned, not eyeballed — confirm the recede on a device.**
- **Review scroller gesture integrity.** The drag layer had no pointer capture,
  no `pointercancel`, no pointer-id tracking, and listened on `window`: an
  interrupted gesture left `down` stuck true so the next hover scrubbed the
  strip, and a second finger could drive it. It now captures on the element,
  clears state on `pointerup`/`pointercancel`/`lostpointercapture`, tracks the
  pointer id, and is mouse-only — touch and pen use the native
  `overflow-x:auto` + scroll-snap path, which the old handler fought.
- Tilt and magnetic buttons were already correctly gated
  (`(pointer:fine)` + `pointerType === "mouse"`); left as is.

---

## 8. Recent changes (this session)

Fixed:
- JS `})();` was misplaced mid-file — everything after it threw
  `ReferenceError: $$ is not defined`, killing the wheel and all later features.
- `overflow-x:hidden` on `body` made body its own scroll container and broke
  vertical scrolling. Now `overflow-x:clip` on `html`.
- `prefers-reduced-motion` never applied (specificity, see §4 rule 2).
- `.reveal-left` / `-right` / `-zoom` were inert; the reset rule targeted
  `.in-reveal-*`, a class that exists nowhere.
- Pie wheel whipped 315° backwards on every wrap-around.
- Open/Closed pill reported "Closed" between midnight and 2 AM.
- Locations section rendered navy text on a near-black inline background —
  1.42:1 contrast, illegible. The inline style was overriding the stylesheet.
- Card tilt permanently destroyed the inline rotation on the deal cards.
- Duplicate element IDs (`lgif-top`, `lgif-bot`) in the header and footer logos.

Added:
- Site-wide `:focus-visible` ring (there was none).
- Press/active states (there were 28 hover states and zero press states).
- Scroll choreography layer using native `animation-timeline: view()` /
  `scroll()`, wrapped in `@supports` and fully disabled under reduced motion.
- Reading-progress rail at the top of every page.
- The real brand logo, circle-cropped with a proper alpha mask. The source file
  the owner supplied is RGB with the transparency checkerboard **baked into the
  pixels** — it must be masked, not just dropped in.
- `build.py`, so `standalone.html` stops drifting from source.

### Menu page (second pass)
- **Prices are deliberately absent.** The owner does not want them on the site,
  so the dead `.mi-price` rules were removed rather than left as a trap. Do not
  invent prices for a real restaurant.
- Sticky category rail: 8 chips, each a 44px touch target, horizontally
  scrollable, with `aria-current="true"` following the section you are reading.
  The rail auto-scrolls the active chip into view — scroll the inner
  `.menu-rail-inner`, not the `<nav>`, which does not scroll.
- `--header-h` is now published from JS (the header is fixed and shrinks on
  scroll, so the rail's `top` and the sections' `scroll-margin-top` need the
  live value, not a guess).
- Item stagger is `0.03s` per item over `300ms`. Card grids use `0.06s`.
  Both come from the ui-ux-pro-max motion data: `0.02-0.04s` per item for long
  lists, never past `0.1s`. The old ladder was `0.1s` — right at that limit.
- Card entrances use a slight overshoot (`--ease-snap`) with `scale(.92)` and a
  16px rise, matching the Standard stagger tier for a playful consumer brand.
- `.menu-item--feature` no longer pins a 220px column; it collapses to one
  column under 560px. It previously crushed its text to ~80px on a 360px phone.

- **2026-09-14 dev rounds.** (1) Skip-link on all four pages; the sticky mobile
  order bar lost its `aria-hidden`/`tabindex=-1` (primary CTA must be
  focusable); schema review nodes synced to the five visible reviews; menu
  rail chips carry live DOM-derived dish counts; `text-wrap:balance` on h1/h2;
  forced-colors edges. (2) The open/closed logic was refactored into
  `statusFor(kind)` — ONE source of truth now feeding both the header pill and
  the new "Tonight" band on index (`[data-hours-slot]`), which keeps the
  after-midnight tail behaviour (§6) in a single place. The band's static
  text is the real schedule, so no-JS visitors still see true hours.

- **2026-09-14 million-dollar pass.** (1) *Images:* all 20 generated food images
  received one cohesive editorial grade (sat +6%, sigmoidal contrast, gentle
  unsharp) so the set reads as a single art-directed shoot; the home hero
  `.ph-main` is now the OWNER'S REAL pepperoni close-up (`hero-pep.jpg`,
  900x990) with preload + fetchpriority + alt updated together, and the
  gallery's pepperoni figure moved last so the two never sit near each other.
  (2) *Wheels:* the pie wheel gained a gear-tick ring, a fixed red needle at
  12 o'clock (on `.pie-wheel`, so it does not rotate with the rotor), a
  paper+sun jewellery ring on `.pie-center` and chip-style slice labels; both
  spin wheels gained a tick ring, a hub cap (`.sw-disc::after`) and a shadowed
  pointer. (3) *Motion:* Ken Burns breathe on the hero photo (26 s alternate),
  slow footer-logo turn (48 s), and `view()`-driven rise on the Tonight cards.
  Both new infinite animations are registered in the motion-paused list AND
  the reduced-motion block; the scroll rise degrades to resting state where
  `animation-timeline` is unsupported. (4) *Chrome:* brand-ink `::selection`
  and scrollbar. (5) *UI services:* the remaining Taste-Skill pack installed
  (soft, output, minimalist, brutalist, stitch, gpt-taste, image-to-code,
  imagegen web+mobile, brandkit) - 72 skills total in `.claude/skills/`.

---

## 8b. The two spin-to-decide wheels (`#spin` on index.html)

Separate from the pie carousel in §6. Both are built from one CSS disc
(`conic-gradient`) plus a `transform` spin — no canvas, no library.

**Wheel 1 — "Pick my pizza."** Picks one of eight pies at random.
**Wheel 2 — "Spin for a treat."** One prize per visitor.

### How a landing angle is computed
Eight segments, pointer fixed at 12 o'clock. Segment `i` covers
`[i*45, (i+1)*45)` clockwise from the top, so landing on `i` means rotating the
disc to `-(i*45 + 22.5)` degrees, minus 5–7 whole turns for the spin. The result
shown is always the segment under the pointer — verified across repeated spins.
If you change the number of segments, change the `conic-gradient` stops, the
`--seg` value in CSS, and nothing else: the JS derives everything from the item
count.

### Editing the prizes — read this before launch
The prize copy in `index.html` (`data-spin-items` on the prize wheel) is a
**starting suggestion, not the owner's confirmed offer list.** Free drink, 10%
off, garlic knots, free topping, $5 off, cannoli, and two "try again" segments.
Replace them with the real offers before the site goes live. Each entry is
`{"name":"...","note":"...","win":true|false}` — `win:false` renders the muted
"no prize" card.

### What the once-per-visitor lock actually is
`localStorage` under the key in `data-spin-once`. It stops casual re-spinning
and survives a refresh, and that is all it does. **It is not enforcement.**
Anyone can clear site data, open a private window, or read the prize list
straight out of the page source. Do not put an offer on this wheel that you
would not be willing to honour for anyone who asks. Real, controlled promo
codes need a backend or the Toast promotions system.

### Accessibility
The result card is a `role="status" aria-live="polite"` region, so the outcome is
announced. Under `prefers-reduced-motion` the disc does not spin at all — it
jumps straight to the landing angle and renders the result. Prize-wheel labels
on the red segments use paper ink: navy on that red measures 2.99:1 and fails AA
for large text, paper measures 3.95:1 and passes.

- **Round 10 (2026-09-14):** content depth + AVIF layer — new `our-story.html`
  (5th content page, editorial million-dollar layout, real photos only, no
  invented facts; sitemap/redirects/llms/nav/footer wired; PAGES 4→5); 26
  rasters now AVIF q55 via `<picture>` (3004 KB webp → 2056 KB avif, -31.5%,
  -50% vs original JPEG); dead `.loc-hero .hero-bg` rules removed; spin-wheel
  data fixed .jpg→.webp; harness 0/0, audit 47/47.
- **Round 9 (2026-09-14):** WebP payload round - 26 rasters at q82
  (4098->2952 KB, -28%), img/preload/CSS urls swapped, JPEGs kept as
  masters + og/JSON-LD/manifest formats; standalone 5928->4302 KB;
  harness webp-aware with a jpg-regression pin.
- **Round 8 (2026-09-14):** deep GitHub hunt installed 84 new skills
  (72->156) + 6 agents (51->57) from anthropics/skills, wshobson/agents,
  vercel-labs, hallmark, marketingskills, wondelai, designer-skills;
  applied: hallmark mobile gates (body clip, minmax(0,1fr), wrap), hero
  phone microcopy, privacy.html (+sitemap/redirects/footer).
- **Round 7 (2026-09-14):** motion pause persists via localStorage
  (guarded); emoji icon-substitutes removed from info heads (drawn sun-bar
  marker instead, trailing voice glyphs stay); scheme-aware theme-color;
  @media print stylesheet (menu prints clean); craft pins in the harness.
- **Visual council round 6 (2026-09-14):** ten specialist agents hired
  (.claude/agents, 41->51): art-director, photo-editor, colorist,
  type-designer, motion-designer, brand-guardian, graphics-designer,
  ai-artifact-hunter, layout-composer, visual-a11y. First pass: slice-coke
  regenerated (floating-slice tell), wheel brightness band tightened to
  .25-.35, text-wrap balance/pretty, heroDrift scroll parallax on location
  heroes (RM-flattened), site.webmanifest linked on all pages.
- **SEO round 5 (2026-09-14):** H1s keyword-completed via honest sr-only
  spans (index "WE ARE FAMOUS FOR OUR DOUGH!" carried zero keywords);
  og:image:alt verified everywhere; llms.txt no longer promises a
  /reservations page (phones instead) + /reservations 301 kept alive in
  _redirects; new _headers (immutable fonts, 1-day images, 1-week code,
  security headers); menu JSON-LD: 6 MenuItems carry truthful images (four
  Ajarski versions -> the real ajarski photo); locations already had
  hasMenu. ensemble_review.py pins all of it (check_seo_pins). Off-site
  half (GBP, reviews, citations, backlinks) is an owner checklist:
  reference/seo-offsite-checklist.md - it decides the local pack, the repo
  cannot touch it.
- **Image + motion round (2026-09-14, round 4):** ten generated slots
  regenerated grounded in owner real photos as refs (wheels x6, bbq master,
  dough-toss, hero-sauce, feast + derived feast-wide); family-graded, exact
  slot dims, 8/8 wheels distinct & label-true. New registered motion:
  badgeGlint (pause list 17 + RM), stepRise view()-driven (RM), hover
  saturate on dish/gallery imgs. ensemble_review.py now pins the 8 contrast
  decisions of the visual study.
- **Visual study (2026-09-14, round 3):** measured expert pass —
  reference/visual-study.md. New contrast-safe tokens `--red-deep:#c03a24`
  and `--gold-ink:#8f6116` in :root: small text & small surfaces on LIGHT
  backgrounds must use the -deep/-ink twins; brand --red/--gold stay for
  large type (AA-large by math) and graphics. og/paso + og/slo rebuilt from
  owner real photos (were pillarboxed/soft); hero-sauce + dough-toss graded
  into the family band. No layout moved.
- **Council round 2 (2026-09-14):** self-serving `review[]` stripped from
  index JSON-LD (§10); Baloo 2 400+700 preloaded before the stylesheet on all
  4 pages (first-paint weights: `.display` is 400, `.btn`/`.open-pill` are
  700; Anton/Sora are fallbacks that never render - no preload).
- **Council round (2026-09-14, same commit as 8c/8d):** explicit `loading`
  attrs everywhere (LCP + header logo eager, footer logo lazy); footer heads
  h4->h3 with the two scoped `.footer-grid` CSS rules renamed (no global h3/h4
  selectors exist - zero visual drift); sr-only h2 before the info-cards on
  both location pages; heading outline jump-free on all 4 pages.
## 8c. Thinking alongside other models (the copilot bridge + council)

The editing sandbox cannot call ChatGPT/Claude (or any external model) live:
it holds no credentials - and never should - and provider APIs are outside
its network allowlist. So external brains run on YOUR side, with full context:

```bash
# Path A - no keys, any chat tier (chatgpt.com / claude.ai):
python3 tools/copilot_bridge.py prep     # writes reference/copilot-context.md
# paste it into the chat, paste the answer into reference/copilot-review-N.md,
# commit; the editing agent integrates it and answers in
# reference/copilot-my-response.md.

# Path B - APIs, keys stay on your machine as env vars:
export OPENAI_API_KEY=...      # and/or ANTHROPIC_API_KEY=...
python3 tools/copilot_bridge.py models   # what YOUR keys actually provide
python3 tools/copilot_bridge.py council  # all keyed providers review at once
python3 tools/copilot_bridge.py reply --provider anthropic   # continue threads
```
Model ids are never assumed: defaults track the self-serve lineup
(COPILOT_MODEL=gpt-5, ANTHROPIC_MODEL=claude-sonnet-5) and `models` lists
reality for your key. Reviews land in reference/copilot-review[-provider]-N.md,
threads in .copilot-thread-<provider>.json (gitignored).

The pack embeds the immovable rules, recent commits, the live image audit and
**reference/council-review.md** - the internal ensemble's own findings - so
external models argue with verified facts, and with the council itself.

## 8d. The council harness (run before every commit)

```bash
python3 tools/ensemble_review.py    # exit code = FAIL count (0 = clean)
```
Mechanical checks all reviewers share: parse + duplicate ids, title/meta/
canonical/og, JSON-LD validity, LCP preload wiring, img attributes, internal
link resolution, Toast link integrity, heading outline, infinite-animation
registration (pause list + reduced-motion mechanism), sitemap clean URLs,
image weights, build freshness. First round (2026-09-14): 13 FAIL + 8 WARN
-> 0/0; fixes and reclassifications are recorded in reference/council-review.md.

---

## 9. If you continue this on another platform

Paste §1 and §4 as context, then say what you want changed. The constraints that
matter most, and that a fresh tool will otherwise violate:

1. Vanilla only — no React, no Tailwind, no build step, no CDN.
2. Keep the `html.js` gating, and match its (0,2,1) specificity in any override.
3. Every `querySelector` in `main.js` must be null-safe — one script, four pages.
4. Animate transform/opacity/filter only.
5. Run `python build.py` after touching `index.html`, `style.css` or `main.js`.
6. All 8 pie-wheel images stay distinct, and labels match the photo content.

---

## 10. The SEO layer (2026-09-14)

### Structured data
One `application/ld+json` block per page, consolidated into a single `@graph`.

- **index** — `Restaurant` (with `department` for the two shops) + `WebSite` +
  `FAQPage`.
- **The `review[]` array (5 Review+Rating nodes) was stripped from the index
  Restaurant entity on 2026-09-14 (council round 2)** — same self-serving
  policy as `aggregateRating` below: markup earned nothing and risked the
  whole graph. The visible testimonial cards stay as plain HTML (owner should
  confirm each quote is a real customer review). **Do not re-add either.**
- **`aggregateRating` was deleted from all four pages on purpose.** Google has
  not rendered review stars for self-serving reviews — a business marking up
  its own rating on its own domain — since 2019, so the markup earned nothing,
  and `reviewCount: 5` against 3 visible reviews is a markup/visibility
  mismatch, which is the kind of thing that draws a manual action. **Do not
  re-add it.** Stars in search results come from the Google Business Profile
  (§11), not from this file.
- **menu** — the `Menu` / `hasMenuSection` / `MenuItem` tree stays **without
  prices**, mirroring the page. The two `offers` that carried prices were
  removed for the same markup-matches-visible-content reason, and because the
  owner keeps prices off the site by choice.
- **location pages** — `Restaurant` with address, geo and
  `openingHoursSpecification`, plus `@id`, `parentOrganization` pointing at
  `/#restaurant`, and a `BreadcrumbList`.
- Every `Restaurant` node carries `potentialAction: OrderAction` targeting the
  Toast domain. That is the true architecture — this site never takes an order
  — and it tells Google where ordering actually happens.

### Social cards + technical files
- `og:image` used to point at `antoniaspizza.com/pluto-images/…` on the retired
  Toast-hosted site. Every shared link would have shown a broken image the day
  this deployed. Now there are real 1200×630 cards in `assets/img/og/` (one per
  page), with `og:image:width/height/alt`, `og:locale`, `og:site_name`.
- `twitter:card` completed on menu and both locations; index was the only page
  that had one.
- `meta robots` now asks for `max-image-preview:large`; `theme-color` added.
- `sitemap.xml` uses the clean URLs and carries `lastmod`. `_redirects` maps
  `/menu` → `/menu.html` so those URLs resolve on any host that reads it
  (Netlify, Vercel, Cloudflare Pages). **On a host that does not read it —
  plain cPanel, say — add that rewrite yourself or put `.html` back into the
  sitemap, or those three URLs 404.**
- `robots.txt` explicitly allows GPTBot, ChatGPT-User, ClaudeBot, Claude-Web,
  PerplexityBot and Google-Extended. `llms.txt` gives AI answer engines a
  plain-text brief: an increasing share of "best pizza in SLO" traffic is an
  assistant quoting a source, not a blue link.
- `404.html` — the site had no not-found page.

### The photography, and why ComfyUI is not in the loop here
Shots that lied about their caption, or their aspect, were regenerated:

| file | was | now | the slot actually wants |
|---|---|---|---|
| `ajarski-2.jpg` | 300×300 upscale, six placements | 900×900 khachapuri boat | square (`.ph-back`, `.step-img`, `.menu-item--feature`) and 4:5 (`.gallery-track`, `.dish-card`) |
| `hero-sauce.jpg` | 1100×619 landscape | 900×990 portrait | 4/4.4 portrait — home `.ph-main` |
| `feast.jpg` | 825×1100 | 900×990 | 4/4.4 portrait — menu `.ph-main` |
| `feast-wide.jpg` | new | 1200×750 | the deal card, which has **no** CSS img rule |
| `pies-3.jpg` | byte-identical to `grill.jpg` | 800×1000 rustic table | 4:5 and 3:3.6 |
| `pies-4.jpg` | byte-identical to `deli.jpg` | 800×1000 braised lamb shank | 4:5 and 3:3.6 |

Generation masters live in `assets/img/gen/` (gitignored); the committed files
are the cropped finals. The **pie wheel (§6) is mid-reshoot in the same style**:
two masters are staged (`gen/w-cheese.jpg`, `gen/w-supreme.jpg`); the other six
were blocked by a per-turn generation cap. **Do not ship a half-swapped wheel** —
replace all eight `assets/img/wheel/*.jpg` in one go (800×800, square), then
re-run the distinct-by-hash check from §6.

**ComfyUI cannot run in the environment this was edited
in: no GPU, no torch.** The `comfyui-image-generation` skill is already in the
repo at `.claude/skills/` for whoever has a GPU; these images came from the
platform's generator instead. If you do run ComfyUI locally, keep the
"slot actually wants" column as your output spec and drop results onto the same
filenames — nothing else in the site needs to change.

### Attribute truth
Every `<img width height>` is now consistent with its file's intrinsic ratio —
47 tags checked, 0 mismatches, via `tools/_img_attr_audit.py`. Before this, 17
lied: `slice-coke.jpg` (1024×682) tagged 500×500, `storefront-night.jpg`
(825×1100) tagged 900×765. Where an `object-fit:cover` box exists the lie only
mis-reserves space; where none exists (the deal card, `.ajarski-media .main`) it
visibly squashed the photo. **When you add an image, keep its attributes
truthful** — re-derive `height` from the file, and run the audit.

### The grounded set (v3, 2026-09-14)
The owner's own collage (`storefront.jpg`) turned out to contain real product
photos: cupped-pepperoni close-up, herb-freckled cheese pie, and a supreme in a
takeout box. Those panels were cropped to `gen/ref-*.jpg` and fed to the
generator as **product truth**, so the regenerated pizzas inherit the real
crust char, cheese colour and topping style instead of reading as generic AI
pies. Slots rebuilt from references: `feast.jpg` (+`feast-wide.jpg`,
`og/menu.jpg`), `pies-1.jpg`, `slice-coke.jpg`, `wheel/supreme.jpg`,
`wheel/cheese-slice.jpg`. The same references are baked into the ComfyUI kit's
prompts, so a GPU run reproduces this look. `feast.jpg` ships at 800x880 q76
(188 KB) because its display box is ~520px — it is the menu page LCP.

### The owner's live-site photos (2026-09-14)
The sandbox cannot download from the live sites or the Toast CDN (measured:
000 / TLS-cut on all four hosts; Wayback and the search-index route also dead
for binaries). What landed instead:
- The home gallery was rebuilt around the owner's REAL photos: enhanced
  (Lanczos 2x, unsharp, +6% sat) crops of the collage panels - pepperoni
  close-up, herb-freckled pie, takeout box - plus the patio and Paso Robles at
  night. Six figures, every caption and alt true; the old caption/image
  mismatches ("The BBQ chicken" over a rustic table) are gone.
- `og/home.jpg` is now a 1200x630 crop of the real pepperoni panel.
- `tools/download_owner_photos.sh` + `tools/place_owner_photos.py` +
  `reference/owner-photo-manifest.md`: the full-res originals, harvested URLs
  and the live site's own alt texts, so any normal machine can fetch and slot
  them with two commands. Three assets are flagged VERIFY (one has two
  different alts on two live pages) and are never placed blind.

### Deliberately untouched
- The 8 wheel images: already distinct and label-true (§6).
- `logo.png`: the real brand mark.
- The storefront photographs: they are pictures of real places. Generating
  prettier ones would be misrepresentation, not design.

---

## 11. "Number one in the region" — the part code cannot do

Everything in §10 is on-site, and on-site is now clean. But local-pack ranking
is dominated by off-site signals, roughly in this order:

1. **Google Business Profile**, one per location, verified. Primary category
   "Pizza restaurant", secondary "Italian restaurant". Hours identical to the
   site, including the 2 AM close — a mismatch between GBP hours and site hours
   is a trust signal working against you.
2. **Reviews: volume and recency beat average rating.** A QR on the receipt and
   a card at the counter outperform any post. Answer every review, above all
   the bad ones.
3. **NAP consistency** — same Name, Address, Phone on Yelp, TripAdvisor, Apple
   Maps, Bing Places and Toast's own listing. Every mismatch dilutes it.
4. **A few real local links** — SLO and Paso Robles press, the Cal Poly student
   paper, chamber of commerce, local food writers. One of these outweighs ten
   directory citations.
5. **Real photos on the GBP** — the ones from §7.1.

The site now gives each of those signals a consistent, crawlable home: same
NAP everywhere, same hours, same dish names, same ordering URL. The ranking
itself is earned off-site; nobody can honestly promise a position, and anyone
who does is selling you something.

## 11. Contrast-safe color tokens (visual study 2026-09-14)

`:root` carries two deeper twins of the brand accents:
`--red-deep:#c03a24` and `--gold-ink:#8f6116` (both ≥5.2:1 on paper and on
sky). Rule: **small text (<24px, or <18.66px bold) and small colored
surfaces on light backgrounds use the twins**; brand `--red`/`--gold` remain
for large type that passes AA-large by measurement (marquee band, 2.6rem
prices, hero highlight spans) and for graphics/dots/underlines. On DARK
backgrounds the originals pass (gold-on-navy 5.6:1, red-on-navy 4.6:1) —
see reference/visual-study.md for the full pair table before recoloring
anything.
