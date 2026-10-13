# Restaurant TV Menu Board

A polished **1920×1080 digital menu board** for restaurant TVs. This version is populated from the two menu images provided in the conversation: build-your-own pizza options and prices, popular gourmet pizzas, appetizers, salads, calzones, pasta, and desserts. Prices are shown in USD as in the images.

The real restaurant name, order URL, and other business details were not present in the images, so the board uses the neutral title **PIZZA MENU** and does not display invented contact details or a non-working QR code.

## Run locally

```bash
cd menu-tv
npm install        # one time
npm run dev        # http://localhost:5173
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server on port 5173 |
| `npm run build` | Type-check and build production files into `dist/` |
| `npm run preview` | Preview the production build on port 4173 |
| `npm run typecheck` | Run the TypeScript check only |
| `npm run smoke` | Run the DOM smoke test, including rotation and keyboard controls |

Useful URL parameters:

- `?intro=1` replays the animated opening; `?intro=0` skips it.
- `?lite=1` disables particles and backdrop motion for lower-powered TVs.

## Menu content

All editable restaurant/menu content is in **`src/data/menu.ts`**:

- Pizza crust, sauce, topping, and size/price options are rendered in a dedicated, TV-readable price matrix.
- Gourmet pizza prices show the lowest gourmet size from the supplied price table; the full seven-size table is on the Build Your Own screen.
- Wings show all four portion sizes and prices; salads show Medium and Large pricing; calzone and pasta add-ons are included.
- The restaurant name is currently `PIZZA MENU`. Replace it with the restaurant's real name when ready.
- To show an ordering QR code, set `restaurant.orderUrl` to the real online ordering URL. With no URL, the panel shows the build-your-own promotion instead.
- Dish photos are locally bundled generated illustrations in `public/img/`; replace them with the restaurant's own approved food photography when available.

## Open-source stack

| Tool | Version | Source | Role |
| --- | --- | --- | --- |
| React | 19.3 | [facebook/react](https://github.com/facebook/react) | UI |
| Vite | 8.3 | [vitejs/vite](https://github.com/vitejs/vite) | Dev server and bundler |
| Tailwind CSS | 4.3 | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | Styling and design tokens |
| Motion | 14.2 | [motiondivision/motion](https://github.com/motiondivision/motion) | Hints and pause-state transitions |
| anime.js | 4.5 | [juliangarnier/anime](https://github.com/juliangarnier/anime) | Staggered menu-card entrances and background orbs |
| GSAP | 3.15 | [greensock/GSAP](https://github.com/greensock/GSAP) | Animated opening, `DrawSVGPlugin`, and `SplitText` |
| tsParticles | 4.4 | [tsparticles/tsparticles](https://github.com/tsparticles/tsparticles) | Subtle floating particles |
| Swiper | 14.3 | [nolimits4web/swiper](https://github.com/nolimits4web/swiper) | Featured food-image carousel |
| Lenis | 1.3 | [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | Smooth touch/wheel scrolling |
| NumberFlow | 0.6 | [barvian/number-flow](https://github.com/barvian/number-flow) | Animated clock and prices |
| qrcode.react | 4.2 | [zpao/qrcode.react](https://github.com/zpao/qrcode.react) | Optional QR code when an order URL is configured |
| Lucide React | 1.56 | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | Icons |
| Fontsource Inter | 5.3 | [fontsource/fontsource](https://github.com/fontsource/fontsource) | Locally bundled Latin font |

Dependencies and fonts are local; the production board can run offline after it has been built and copied to the TV/signage device.

## Project layout

```text
menu-tv/
├─ index.html
├─ vite.config.ts
├─ public/img/                 # locally served menu photos
└─ src/
   ├─ App.tsx                  # screen composition, rotation, kiosk controls
   ├─ index.css                # theme, effects, and fonts
   ├─ data/menu.ts             # restaurant, menu, prices, and pizza options
   ├─ types.ts
   ├─ components/
   │  ├─ PizzaBuilderBoard.tsx # crust/sauce/topping choices + size/price matrix
   │  ├─ DishBoard.tsx · DishCard.tsx · FeaturedHero.tsx
   │  ├─ TopBar.tsx · CategoryRail.tsx · GuestPanel.tsx
   │  └─ Backdrop.tsx · ParticlesBg.tsx · IntroCurtain.tsx · Stage.tsx
   └─ hooks/
      ├─ useRotation.ts · useKioskKeys.ts · useStageScale.ts
      └─ useLenisScroll.ts · useIdleCursor.ts · useNow.ts
```

## TV / kiosk controls

| Key | Action |
| --- | --- |
| `Space` | Pause/resume category rotation |
| `→` / `←` | Next / previous category |
| `1`–`7` | Jump to a category |
| `F` | Toggle fullscreen |
| `I` | Replay intro |
| Click/tap a category | Jump to it immediately |

The board is designed for 16:9 Full HD, scales cleanly to 4K and smaller displays, and hides the pointer after a few seconds of inactivity. Each menu category rotates automatically; multi-page categories get equal time per page.

Change `CATEGORY_MS` in `src/App.tsx` to adjust how long each category stays on screen. Update category colors in `src/data/menu.ts` and the global palette in `src/index.css`.
