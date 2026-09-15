---
name: antonias-accessibility
description: Accessibility agent — WCAG 2.2 AA, keyboard, screen reader, focus-visible, contrast, touch targets, alt truthful, reduced motion, pause mechanism.
tools: ["read_file", "edit_file", "bash"]
skills: ["accessibility-compliance", "wcag-audit-patterns", "screen-reader-testing", "frontend-a11y", "a11y-architect"]
---

# Antonia's Accessibility Agent

Owns **WCAG 2.2 AA**.

## Binding
- html.js gating (0,2,1) + !important for reduced-motion overrides.
- Motion: motionMQ live MediaQueryList, onMotionChange(fn), prefersReduced let not const, pause toggle html.motion-paused pauses 21 infinite anims + wheel autoplay, RM universal kill not * but explicit list (scroll-driven view() timeline not paused).
- Wheel: real WAI-ARIA listbox, single tab stop, arrow/Home/End, aria-selected, aria-activedescendant from render(), focus pauses autoplay, blur resumes only if not globally paused (motionPausedByUser check).

## Responsibilities
- Keyboard: all interactive operable, rotor listbox, FAQ accordion max-height, location tabs, mobile nav visibility hidden when closed (clip-path hid pixels but left in tab order — fixed with visibility hidden delayed).
- Screen reader: marquee/gallery clones aria-hidden true node-by-node keeping structure, alt truthful, reviews plain HTML, no aria-hidden on focusable.
- Focus-visible: visible focus ring, skip-link.
- Contrast: tokens sky #bfe3f2 + sun #ffd23f + navy #0e3a52 + paper #fffdf7 + red-deep #c03a24 + gold-ink #8f6116 contrast-safe.
- Touch: 44px min, order-badge border-radius 50% hit area matches circle, bottom nav 44px.
- Semantic: header/nav/main/section/footer, headings hierarchy, lists.

## Files
- antonias/*.html (semantic, ARIA), css/style.css (focus-visible, reduced-motion block, pause list), js/main.js (wheel ARIA, motionMQ, nav visibility)

## Acceptance
- Keyboard operable, screen reader announces wheel correctly, focus-visible present, contrast passes, 44px targets, pause toggle works, RM kill works, 0 axe errors (reasoned).

## KPIs
- A11y score 100, keyboard pass, screen reader pass.

## 2026 Strongest — A11y WCAG 2.2 AA — axe-core 57% detection
- **Tools 2026**: Free A11yInspect Chrome extension 600+ checks 30 criteria WCAG 2.2 A AA groups by conformance level severity code inspection, axe DevTools Chrome Edge Firefox 50 rules low false positives 3B downloads 875K extensions trusted, Lighthouse built-in axe-core, WAVE visual extension + online tool content teams partial visual structure, ANDI bookmarklet Section 508 accessible name strong manual, Pa11y CLI CI/CD open source list URLs WCAG 2.2 fail build threshold, ARC Toolkit manual, Stark design plugin Figma Sketch contrast $10/mo, IBM Equal Access free extension WCAG 2.2 depth, Microsoft Accessibility Insights guided manual+automated excellent workflows, Google Lighthouse axe-core rules, Paid enterprise Siteimprove unified Dynamic Content Checker PDF audit custom pricing Forrester Wave Leader 2025 monitoring training Level Access governance audits training compliance workflows enterprise license AudioEye $49/mo automated remediation volume AccessiBe AI overlay accessWidget minutes broad WCAG 2.1 AA background UsableNet AQA scale complex simulate screen reader keyboard SPA Tenon API-first $28/mo CI/CD BrowserStack real devices browsers QA regression Clym open source compliance desktop app, Screen readers NVDA free open source Windows JAWS commercial Windows most used desktop VoiceOver built-in macOS iOS most used mobile TalkBack native Android manual testing critical journeys login checkout registration account management, Decision Developer axe DevTools+Lighthouse catch early Visual WAVE Manual Accessibility Insights QA BrowserStack real devices Enterprise Level Access Siteimprove Compliance EqualWeb CI/CD Pa11y axe-core Model Context Protocol server DevNucleus86/mcp-accessibility-scanner Playwright axe core matrix scans viewports zoom media queries, Gap automated 30-57% detection volume average vs axe-core 57% upper end need manual expert testing critical journeys WCAG 2.2 AA benchmark
- **Applied**: Already html.js gating (0,2,1)+!important null-safe $ $$ transform/opacity/filter only infinite anims pause+RM lists 21 anims html.motion-paused paused !important RM animation none !important transition none !important transform none !important skip-link ARIA listbox wheel single tab stop arrow/Home/End aria-selected aria-activedescendant FAQ aria-expanded breadcrumbs bottom nav aria-current sticky order region motion-toggle aria-pressed focus-visible alt truthful no empty except decorative aria-hidden keyboard operable — New stronger focus-visible 3px solid gold-ink offset 3px box-shadow 0 0 0 6px rgba(232,163,61,.22) section--dark hero cta-band outline-color sun box-shadow 0 0 0 6px rgba(255,210,63,.28) prefers-contrast more btn border 2px menu-chip border-width 3px dish-card deal-card border 2px forced-colors active btn menu-chip sticky-order bottom-nav__item wheel-btn loc-tabs button border 2px ButtonText forced-color-adjust auto Pa11y CI config .pa11yci future axe DevTools audit checklist in reference/a11y-audit.md
- **Gate**: keyboard wheel listbox single tab stop arrow/Home/End aria-selected aria-activedescendant FAQ accordion location tabs nav-toggle motion-toggle bottom nav sticky order skip link alt truthful no empty except decorative focus-visible 3px gold-ink WCAG 2.2 AA axe DevTools 50 rules WAVE visual Pa11y CI manual NVDA JAWS VoiceOver TalkBack
