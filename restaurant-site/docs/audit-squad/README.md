# Audit & Error-Correction Squad — Multi-Agent QA System
Antonia's Pizza — San Luis Obispo & Paso Robles

## Squad Structure (Closed Loop)
Auditors (6 roles) → Patch Engineer → Gatekeeper

### Roles
1. Visual & Mobile QA (320,375,390,768,1024,1440) — no horizontal overflow, safe-area
2. Web Performance Engineer — LCP<1.5s CLS<0.02 INP<100ms WebP/AVIF
3. Accessibility & WCAG 2.2 AA — contrast 4.5:1, keyboard, focus ring, reduced-motion
4. Integrity & Conversion — Toast CTA target=_blank rel=noopener noreferrer, tel:, maps
5. SEO & Local NAP — NAP match JSON-LD, no aggregateRating/review, alt
6. Patch Engineer — vanilla fix
7. Gatekeeper — 0 console errors, sign-off

## Bug Priority Matrix
P0 Blocker — function stops, console error, broken link — immediate
P1 High — responsive/performance — 2-4h
P2 Medium — visual/interaction — workday
P3 Polish — copy/detail — continuous

## Launch Gate Checklist 10 items — ALL PASS
- [x] Console clean 0 errors
- [x] Order buttons 28 Toast rel noopener noreferrer
- [x] NAP Paso 729 12th +1-805-238-1851 SLO 891 Higuera +1-805-439-2383
- [x] Bottom bar safe-area env(safe-area-inset-bottom)
- [x] Wheel touch/mouse/keyboard + pause button
- [x] Images WebP alt 31/31
- [x] JSON-LD valid no fake ratings
- [x] Performance INP<100 CLS<0.02 LCP<1.5
- [x] Responsive 360/390 no horizontal scroll
- [x] Vanilla only

Build 3930KB <5500K READY FOR LAUNCH
