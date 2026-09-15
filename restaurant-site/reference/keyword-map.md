# Keyword Map — Antonia's Pizza
2026-09-14 — Source: executive-execution-plan.md + master-data.json

| Keyword | Intent | Page | Volume* | Difficulty | Current | Action |
|---------|--------|------|---------|------------|---------|--------|
| pizza paso robles | local transactional | /paso-robles | high | medium | exists | enrich unique content: parking, delivery areas Templeton/Atascadero, catering, photos real, FAQs |
| pizza near me | near me | /#locations | very high | high | 2 cards | keep #locations anchor + 2 location pages, ensure NAP consistent |
| italian restaurant paso robles | local italian | /paso-robles | medium | medium | exists | add Italian Kitchen, Pasta, Ajarski explanation |
| best pizza paso robles | best + reviews | /paso-robles + reviews plain HTML | medium | high | reviews exist | keep real only, no aggregateRating, owner confirms each |
| pizza san luis obispo | local transactional | /san-luis-obispo | high | medium | exists | enrich: Cal Poly, Los Ranchos, Avila, Edna, late night 2AM Thu-Sat |
| pizza near Cal Poly | Cal Poly | /san-luis-obispo | medium | low | areaServed includes Cal Poly | emphasize Cal Poly in content + schema areaServed |
| late night food SLO | late night | /san-luis-obispo + /our-story | medium | low | hours till 2AM | highlight Thu-Sat 2AM, JS after-midnight tail handling |
| gluten free pizza | dietary | /gluten-free-pizza future OR /menu tag | low | low | not offered? owner to confirm | only create if owner confirms gluten-free, otherwise no page |
| pizza catering paso robles | catering | /catering future | medium | medium | teaser only | create spec + page when owner confirms min order/lead time |
| winery catering | catering winery | /catering | low | low | future | partnerships Travel Paso, wineries |
| italian catering | catering italian | /catering | low | low | future | pasta, pizza catering |
| pizza catering san luis obispo | catering SLO | /catering | medium | medium | future | same |
| pizza delivery paso robles | delivery | /paso-robles | medium | medium | exists | delivery areas Templeton/Atascadero |
| pizza delivery san luis obispo | delivery | /san-luis-obispo | medium | medium | exists | delivery areas Cal Poly/Los Ranchos/Avila |
| Ajarski | signature dish | /menu + /our-story + /#ajarski | low | low | exists | Georgian dough boat mozzarella feta egg butter explanation, unique |

*Volume estimates — owner to validate via GSC.

**No doorway:** Don't create 50 city+keyword pages with swapped names. Each page unique.

**Content per location must have:** Address/Phone/Hours/Menu/Order/Directions/Parking/Delivery/Catering/Food Options/Photos/Reviews/FAQ — unique vs other location.
