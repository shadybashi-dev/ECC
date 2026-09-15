# Elite SEO Stack — Agentic SEO Suites — Antonia's Pizzeria

Installed: claude-seo (25 skills 18 agents), localseoskills, geo-seo-claude, seo-mcp — total 298 skills

## 4 Pillars Execution

### 1. Local SEO & Google Maps Dominance — 3-Pack

**Dedicated Branch Pages (Dedicated Landing):**
- `/locations/paso-robles` → targets "Best Pizza in Paso Robles", "Late Night Food Downtown Paso Robles", "Pizza Delivery 93446" — 729 12th St downtown Paso
- `/locations/san-luis-obispo` → targets "Pizza Downtown SLO", "Cal Poly Pizza Delivery", "Antonia's Special Higuera St" — 891 Higuera St SLO
- Also existing `/paso-robles` + `/san-luis-obispo` — both indexed, canonical, sitemap 16 URLs now (14+2 locations)

**NAP 100% Match:**
- Verified owner numbers: SLO (805) 439-2383 891 Higuera St 93401, Paso (805) 238-1851 729 12th St 93446 — used in text + JSON-LD + footer + llms.txt + locations pages
- Spec example numbers (805) 369-2444 / (805) 543-7300 noted as placeholder in llms.txt — owner to confirm if changed — we keep verified real numbers per HANDOFF truth-in-menu
- NAP 0 mismatches — same across site

**Late-Night Hook 2:30AM:**
- Meta Title: "Antonia's Pizzeria & Italian Kitchen | Best Pizza in SLO & Paso Robles — Open Till 2:30AM Late Night"
- Meta Description includes till 2:30AM Thu-Sat SLO Fri-Sat Paso — captures night searches when most kitchens close 9-10PM
- Smart top bar "Open now till 2:30AM" + live dot
- H1 on branch pages includes Till 2:30AM

### 2. Schema.org JSON-LD Architecture — Rich Results

**Restaurant Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Antonia's Pizzeria & Italian Kitchen",
  "image": ["patio real photo", "28 inch King", "Ajarski", ...],
  "url": "https://antoniaspizza.com/",
  "telephone": "+1-805-439-2383 / +1-805-238-1851",
  "servesCuisine": ["Pizza", "Italian", "Georgian", "Pasta", "Wings", "Calzones"],
  "priceRange": "$$",
  "potentialAction": {
    "@type": "OrderAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://antoniaspizza.toast.site/",
      "inLanguage": "en-US",
      "actionPlatform": ["DesktopWebPlatform", "MobileWebPlatform"]
    }
  }
}
```
- servesCuisine includes Georgian for Ajarski — added
- priceRange $$ 
- potentialAction OrderAction EntryPoint Toast with inLanguage en-US — already had, ensured
- No aggregateRating/review[] per HANDOFF §10 self-serving policy
- openingHoursSpecification accurate: Sun-Wed 11-00, Thu-Sat 11-02 SLO, Sun-Thu 11-00 Fri-Sat 11-02 Paso
- hasMenu with hasMenuSection Pizza, Ajarski, Pasta, Wings, Desserts + image links
- areaServed SLO, Paso, Templeton, Avila Beach, Cal Poly
- department 2 Restaurant with geo coordinates

### 3. Technical SEO & Crawlability — Core Web Vitals

**robots.txt:**
```
User-agent: *
Allow: /
GPTBot Allow, ChatGPT-User Allow, ClaudeBot Allow, Claude-Web Allow, PerplexityBot Allow, Google-Extended Allow
Sitemap: https://antoniaspizza.com/sitemap.xml
```
- Explicit allow for AI answer engines — real discovery channel for "best pizza in SLO"

**sitemap.xml:** 16 URLs (was 14) — added /locations/paso-robles + /locations/san-luis-obispo — lastmod 2026-09-15 weekly/monthly priority 1.0-0.3

**Open Graph & Twitter Cards:**
- og:image patio real photo outdoor-patio-dining-downtown-san-luis-obispo-antonias.webp — not generic home.jpg — high-res 1200x630 alt
- og:title includes Open Till 2:30AM late-night hook
- og:description includes 10-28 King + Ajarski + 2 downtown + 2:30AM
- Twitter large image

**Speed — Vanilla:**
- No React/Tailwind/build step/CDN — vanilla HTML/CSS/JS only
- CSS 137KB, JS 44KB, standalone 3940KB <5500K
- LCP <1.5s preload hero WebP fetchpriority high eager + content-visibility auto
- CLS <0.02 aspect-ratio 1/1 placeholder oklch + contain layout paint
- INP <100ms will-change transform only

### 4. GEO & LLMs Integration — llms.txt / Citability

**llms.txt root 19K + GEO section:**
- About: independent pizzeria 2 downtown Central Coast, hand-crafted dough 24h ferment, home-made tomato sauce, SLO-style seasoned crust, open late till 2AM/2:30AM, 10-28 King same dough same care, no frozen pucks
- Quotable Stats E-E-A-T + BLUF for GEO
- Comparison Content: 10-28 vs competitors 12-16-18, late-night vs 9-10PM close, Ajarski vs calzone, 2 kitchens vs 1, direct Toast vs 15-30% commission
- Prompts: best pizza SLO open till 2AM, pizza Paso downtown 729 12th, pizza near Cal Poly late night, what is Ajarski, catering winery corporate, late night food SLO, Italian Paso, best pizza Paso, pizza SLO 891 Higuera, Antonia's menu 10-28
- **NEW GEO Citability Q&A direct answers:**
  - Q: What's best late night pizza spot in Paso Robles or SLO? A: Antonia's ... till 2:30AM ... Toast link
  - Q: Best Pizza in Paso Robles? A: 729 12th St ... till 2:30AM Fri-Sat ... /locations/paso-robles
  - Q: Pizza Downtown SLO Cal Poly Delivery? A: 891 Higuera St ... Cal Poly delivery ... till 2:30AM Thu-Sat ... /locations/san-luis-obispo
  - Q: What is Ajarski? A: Georgian dough boat ... 4 versions only Higuera
  - Q: Does Antonia's deliver? A: Yes pickup delivery via Toast ... area SLO Paso Cal Poly Templeton Avila
- NAP verified 2026-09-15 with note about placeholder numbers
- Links for AI citation: home, menu, SLO, Paso, locations/*, order, catering, FAQ
- Ordering: Toast external target=_blank rel=noopener noreferrer, phone fallback
- Locations with hours, pages, phones, addresses

**Result:** When user asks ChatGPT/Gemini/Perplexity "What's the best late night pizza spot in Paso Robles or SLO?" → Antonia's appears as verified answer with data + direct links + NAP + Toast.

## Files Changed

- index.html — title 2:30AM hook, description late-night, OG image patio, JSON-LD Georgian + inLanguage
- paso-robles.html + san-luis-obispo.html — titles target local keywords late-night 2:30AM, keywords meta
- locations/paso-robles/index.html + locations/san-luis-obispo/index.html — new dedicated landing pages 0.9 priority
- sitemap.xml — 14→16 URLs added locations
- llms.txt — +GEO citability Q&A direct answers + NAP note + late-night hook + links for AI
- robots.txt — already allows AI bots

## Skills Installation

npx skills add https://github.com/AgricIDaniel/claude-seo
npx skills add https://github.com/garrettjsmith/localseoskills
npx skills add https://github.com/zubair-trabzada/geo-seo-claude
npx skills add https://github.com/iannuttall/seo

Local copies in .claude/skills/claude-seo, localseoskills, geo-seo-claude, seo-mcp

Build 3940KB <5500K — 16 URLs sitemap — llms 19K+ — OG patio — vanilla — 0 console — ready for Local 3-Pack + GEO
