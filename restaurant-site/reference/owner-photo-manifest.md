# Owner photo manifest (harvested from the live sites, 2026-09-14)

The editing sandbox cannot download from `antoniaspizza.com`,
`antoniaspizza.toast.site`, `pluto-images.toastcdn.com` or `toastcdn.com`
(all measured: connection cut). URLs + the live site's own alt texts were
captured with a server-side page reader instead. On any normal machine:

    bash tools/download_owner_photos.sh   # full-res originals -> assets/img/owner/
    python3 tools/place_owner_photos.py   # enhance + slot them, aspect-true

| live URL id | live alt text | local slot |
|---|---|---|
| 5eda752e | smiling chef in a red apron and gloves kneads pizza dough | dough-toss.jpg |
| f3455223 / 962cf92a | large cheese pizza slice on a wooden board with basil, olive oil, chili flakes, and a Coke / soda | slice-coke.jpg |
| bc063f34 | rustic wooden table set with steak, pasta, wine, roasted potatoes | pies-3.jpg |
| ece063b4 | grilled steak with a side salad … blue checkered napkin | grill.jpg (+ wheel/grill after a square crop) |
| 235db9ef | chef's hands placing braised lamb shank with roasted vegetables | pies-4.jpg |
| b3222d38 | sandwich with meat, cheese, egg, vegetables next to a latte | deli.jpg |
| a40ea15c / 2d273cc4 | the Ajarski dough boat / four versions | ajarski-2.jpg |
| 33d91b05 | pies from 10" to 28" | pies-1.jpg |
| e387718f | current deals | feast-wide.jpg |
| 083bec4a | "pizza, pasta, wings" on home BUT "fried chicken sandwich…" on /page/ajarski | VERIFY by eye |
| acec08fb | Johnny's Lunch food truck counter | archive only |
| 3269e926 | ramen bowl (not on the menu) | archive only |

Already real in-repo (no download needed): the patio at 891 Higuera
(`pies-2.jpg`), the 4-panel collage (`storefront.jpg`), Paso Robles at night
(`storefront-night.jpg`), the logo. The home gallery now leads with five
enhanced crops of these; `og/home.jpg` is a crop of the real pepperoni panel.
