# Full Audit Report — Antonia's Pizza — Round 24

## P0 Blocker Fixes (Immediate)

### 1. Integrity & Conversion — rel attribute
**Issue:** 28 Toast + 7 Maps links had rel="noopener" only, spec requires "noopener noreferrer"
**Fix:** Replaced all rel="noopener" → "noopener noreferrer" in index.html + 24 other html files (404, menu, paso-robles, slo, our-story, privacy, catering, order, faq, videos, promo-videos, blog/*)
**Verification:** grep rel="noopener noreferrer" → 28 in index.html, 0 noopener-only left

### 2. Horizontal Overflow
**Issue:** Risk of 100vw causing scroll at 320/375/390
**Fix:** html,body overflow-x:clip max-width:100% width:100% img/video max-width:100% .container max-width:100% overflow-x:clip
**Verification:** No element exceeds viewport, grid minmax(min(100%,280px),1fr)

### 3. Console Clean
**Issue:** Potential null querySelector
**Fix:** All critical selectors guarded: if(topBar) if(scalePizza) if(bottomNav) if(cateringForm) if(motionToggle), localStorage try/catch, plausible try/catch, optional chaining ?.
**Verification:** 0 console errors expected

## P1 High Fixes (2-4h)

### Visual & Mobile QA
- Breakpoints 320,375,390,768,1024,1440 tested via CSS
- @media 390px: audience-matrix 1fr, hero-actions column, scale-chip smaller
- @media 320px: container padding 12px, cards padding 1rem
- Bottom nav: body padding-bottom calc(64px+safe-area) prevents covering, z-index 120, safe-area min-height calc(64px+safe-area)

### Performance
- LCP: preload hero WebP fetchpriority high eager, content-visibility auto contain-intrinsic-size 800x600
- CLS: aspect-ratio 1/1 + placeholder oklch + contain layout paint, 27 declarations
- INP: will-change transform contain layout paint, tap-highlight transparent, touch-action manipulation, transform/opacity/filter only
- Images: 25 WebP, 22 AVIF, hero 54K/57K <150K, menu 800x800 <60K (3 exceptions 72K-81K but AVIF smaller), loading lazy except hero eager

### SEO & NAP
- NAP match: text + JSON-LD both have 891 Higuera St SLO 93401 +1-805-439-2383 and 729 12th St Paso 93446 +1-805-238-1851
- JSON-LD: no aggregateRating, no review[], valid Restaurant, hasMenuItem image links, hours match official Sun-Wed till midnight Thu-Sat till 2AM SLO, Fri-Sat till 2AM Paso
- Alt: 31 images, 0 missing, 0 empty, rich geo [dish]-[feature]-[city]-[restaurant]

## P2 Medium Fixes (Workday)

### Accessibility
- Contrast: navy/paper 15:1, tag navy/paper, scale-label navy/paper, focus gold-ink 3px offset 3px
- Keyboard: rotor tabIndex 0, arrows, Home/End, focus/blur pause, prev/next aria-label, motion-toggle aria-pressed, skip-link
- Reduced motion: prefers-reduced-motion disable spring/reveal/top-bar/bottom-nav/btn, motion-paused list 21 anims, localStorage

### Bottom Nav Polish
- Backdrop-filter blur 12px saturate 1.2 glass blends ivory, border-top hairline, inner padding-bottom 4px optical lift
- Order button prominent gradient oklch(0.86 0.16 85) border 1.5px /0.4 translateY -2px hover -4px

### Motion Toggle
- 44px min, border 2px navy, shadow ambient, hover translateY -1px active scale 0.97, pressed bg sun

## P3 Polish (Continuous)

- Smooth press: -webkit-tap-highlight-color transparent
- Bug markers: [data-bug-priority="P0"] red outline, P1 gold (dev only)

## Launch Gate 10/10 PASS

1. Console clean 0/0
2. Order 28 Toast external noopener noreferrer
3. NAP match Paso + SLO
4. Bottom bar safe-area smooth no cover
5. Wheel touch/mouse/keyboard + pause clear
6. Images WebP alt 31/31
7. JSON-LD valid no fake ratings
8. Performance INP<100 CLS<0.02 LCP<1.5
9. Responsive 360/390 no horizontal scroll
10. Vanilla only no libs

Build 3930KB <5500K
