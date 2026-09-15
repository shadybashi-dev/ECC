# Professional Video Tools — Antonia's Pizza Short Videos with Logo

> Task: "هلأ مهمة جديدة بما انو عندك اللوغو انشئ فيدوهات قصيرة بعد ايجاد اكثر الادوات احترافية و تقدم و اجد لها مكان على الويب سايت"
> Translation: Since you have the logo, create short videos after finding the most professional & advanced tools and find a place for them on the website.

## Logo Assets Existing
- `assets/img/logo.png` 192×192 real owner photo
- `assets/img/logo-180.png` 180×180 apple-touch
- `favicon.svg` SVG favicon
- Owner's real photos: `storefront.jpg` / `pies-2.jpg` never AI-replaced

## Videos Created in Sandbox (ImageMagick only, no ffmpeg)
Sandbox capabilities checked 2026-09-14:
- `ffmpeg` NOT found, `ffprobe` NOT found, `convert` ImageMagick 6.9.11 Q16 found, PIL/moviepy NOT available.
- So MP4 creation blocked, using ImageMagick GIFs + CSS video-like sections (vanilla only, transform/opacity/filter only, pause+RM lists).

### GIFs in `assets/video/` (total 788KB)
- `logo-rotate.gif` 285KB — 8 frames ×45deg rotation (0,45,90,135,180,225,270,315), delay10 loop0, made with `convert -rotate`
- `logo-pulse.gif` 83KB — scale 80%→90%→100%→110%→120%→110%→100%→90%, delay8 loop0, made with `convert -resize`
- `logo-reveal.gif` 246KB — alpha fade 10%→20%→...→100%, delay8 loop0, made with `convert -alpha set -channel A -evaluate set`
- `promo-fade.gif` 48KB — white colorize fade 0%→20%→...→100%, delay12 loop0
- `promo-with-logo.png` 120KB — static promo: sky #bfe3f2 bg, navy #0e3a52 text "Antonia's Pizza / Hand-crafted pies 10"–28" / Two downtown kitchens — Open till 2AM", logo.png 200×200 centered -100px

Intermediate frames cleaned (frame-*.png, scale-*.png, reveal-*.png, promo-fade-*.png).

### CSS Videos (no video files, vanilla only)
In `videos.html` and `index.html#videos-teaser`:
- `@keyframes logoSpin` from rotate 0 scale .9 to rotate 360 scale 1 — 3s linear infinite (existing footer-brand img already has logoTurn 48s linear infinite)
- `@keyframes logoPulse` 0%,100% scale 1, 50% scale 1.12 — 2.2s ease-soft infinite (existing badgeGlint 5.5s infinite for order badge)
- `@keyframes logoReveal` from opacity 0 translateY 20px scale .9 to opacity 1 — 0.8s ease-soft both (gated html.js .reveal opacity 0, override (0,2,1)+!important)
- `@keyframes textSlide` from opacity 0 translateY 16px to opacity 1 — 0.6s 0.4s both
- `@keyframes bgShift` background-position 0% 50% → 100% 50% → 0% 50% — 8s ease infinite gradient sky/sun/sky-2

All registered in pause+RM:
- `html.motion-paused .css-video, .css-video__logo, .css-video__text {animation-play-state:paused !important}`
- `@media (prefers-reduced-motion:reduce) { html.js .css-video, .css-video__logo, .css-video__text {animation:none !important} }`
- Also existing lists include .order-badge, .footer-brand img, .sticker, .word-rotate, .meteors etc.

## Professional Tools Found (web_search 2026-09-14, 3 queries)

### Logo Animation Tools — 8 best
1. **MotionVid** — Best Custom Motion (8.1/10) — $19/mo 500 gens $0.038 each, upload logo, describe motion in one sentence, Animora+Miltos generates custom animation. Best for custom prompt-generated logo motion. Free plan none. Re-renders mark can soften typography — if brand guidelines require exact file untouched, use Canva.
2. **Canva** — Best Free Template (6.4/10) — free template animation with exact file intact, free tier, paid limits. Most-recommended in LLM answers 71% for 'recommend AI tool for animating logo'. Template motion hundreds of brands also use.
3. **Jitter** — Frame-exact (6.7/10) — free 720p 30fps 3 files, transparent export on Max, frame-exact motion design. Best for manual control.
4. **Renderforest** — Template (5.6/10) — 3D effects, editable templates, 24/7 support, free 720p watermarked, Lite $9/mo Pro $19/mo Business $29/mo. Best for logo intros/outros.
5. **logoto.video** — Browser-based, upload SVG/PNG, pick soundtrack, beat-synced vertical 9:16 16:9 up to 4K free launch 720p/1080p/4K no watermark. Best for quick vertical social logo videos.
6. **Kapwing Animated Logo Maker** — AI prompt "Animate this logo like water rippling" MP4/GIF online studio.
7. **FlexClip** — Free logo animation maker templates stock media AI kinetic text countdown neon spins pops bounces rotates.
8. **Filmora** — Influence Kit Logo Reveal — desktop editor with logo reveal presets.

### Short-Form Video Tools — 21 best 2026
- **Best AI clipping:** OpusClip — long to viral shorts automatically.
- **Best free editor:** CapCut — full-featured mobile/desktop $0.
- **Best text-based:** Descript — edit video like document, Underlord AI.
- **Best AI avatars:** HeyGen Avatar IV realistic lip-sync.
- **Best frontier generation:** Sora 2 (OpenAI) + Veo 3.1 (Google) — photoreal + audio, available inside PostEverywhere, Canva, Runway.
- **Best budget generation:** Kling 3.0 $6.99/mo 15-sec clips 66 daily credits free 720p watermarked.
- **Best budget clipper:** Vizard.ai 60 free minutes/month.
- **All-in-One:** PostEverywhere $9/mo multi-model (Sora 2, Veo 3.1, Kling 3.0) generate+schedule, MakeAIVideo $29/mo dedicated social video generation 4.9/5, Quso.ai $19/mo clip+schedule.
- **Text-to-video:** InVideo AI $25/mo, Runway Gen-4/4.5 $15/mo frontier control, Lumen5, Pictory, Synthesia, Elai, Colossyan.

### Restaurant Video Ads Workflow — Dreamina (CapCut)
Dreamina (CapCut) — AI video ads for restaurants: image-to-video, text-to-video, Seedance 2.0-powered video creation, multimodal references, audio workflows, creative editing. Turn one dish photo into multiple ad versions: TikTok teaser, Instagram Reel, delivery-app promo, lunch special, seasonal menu, paid social ad.

Steps:
1. Choose right food asset — real photos first (real-* owner untouched).
3. Use image-to-video to animate real food photos — rising steam, gentle camera push-in, soft background movement, light reflection on drink, sauce drizzle, parallax, close-up reveal.
7. Turn one dish photo into multiple ads.

FAQ: Is Dreamina good for restaurant video ads? Yes — menu promos, dish videos, delivery ads, café Reels, bakery clips, food truck ads, seasonal campaigns.

## Where Videos Live on Antonia's Site
- **Homepage** `index.html#videos-teaser` after `catering-teaser` before FAQ — 3 GIFs rotate/pulse/reveal + link to /videos + promo PNG link, vanilla grid auto-fit minmax 240px, sky bg, navy border.
- **Videos page** `/videos` (`videos.html` 28K + `videos/index.html` clean URL) — dedicated showcase: loc-hero with CSS video logo reveal, #logo-animations 3 GIFs, #css-videos 3 CSS videos (spin/pulse/reveal), #promo 3 promos (promo-with-logo.png, promo-fade.gif, CSS text promo), #tools 4 info cards (logo animation best custom, short-form best 2026, restaurant video ads Dreamina workflow, where videos live), CTA band, footer with Videos link, VideoObject schema ×3 + BreadcrumbList + CollectionPage, canonical https://antoniaspizza.com/videos, OG image og/home.jpg.
- **Our Story** `our-story.html` — could add CSS video with dough-toss.jpg + logoTurn 48s footer-brand img already exists.
- **Menu** `menu.html` — 38 dishes — could add subtle image-to-video motion on dish cards (parallax, close-up reveal) via Dreamina workflow, but keep vanilla CSS transform/opacity/filter only, no external video for LCP.
- **Locations** `san-luis-obispo.html` + `paso-robles.html` — SLO 891 Higuera + Paso 729 12th — could add video of storefront, patio, real-box — real photos first, maps embed already added Round 13.
- **Catering** `catering.html` — real-box, real-patio, feast-wide, real-night — could add video of catering box, promo-with-logo.png + promo-fade.gif as placeholder, owner to provide real catering video.
- **Sitemap** 12→13 URLs (+/videos weekly 0.8), **_redirects** +/videos 200, **llms.txt** +Videos section 600+ chars, **footer Explore** +Videos link, **blog** could embed videos in late-night-slo and paso-wine-pairing posts.

## SEO / GEO / CRO Notes
- **SEO:** VideoObject schema with contentUrl thumbnailUrl uploadDate, canonical, OG, sitemap weekly, internal linking from home footer Explore + catering teaser + blog. No invented facts. Alt text descriptive.
- **GEO:** llms.txt Videos section for AI answer engines, entity Antonia's Pizza + two kitchens, structured data.
- **CRO:** Videos above fold? No — placed after hero/social-proof/story/wheel/tonight/marquee/ajarski/fresh/deals/gallery/reviews/locations/catering — but teaser before FAQ, CTA band after. Could test above fold later.
- **Performance:** GIFs 83KB-285KB, total 788KB, CSS videos 0KB extra, no MP4, no external JS, vanilla only, transform/opacity/filter only, pause+RM.
- **Accessibility:** alt text on all GIFs, pause toggle, reduced-motion none.

## Next Steps for Owner (MP4 creation, requires external tools, not possible in sandbox)
1. Use logo.png 192×192 (or svg favicon.svg if vector needed) upload to MotionVid/Canva/Jitter/Renderforest/logoto.video/Kapwing.
2. Prompt examples:
   - "Rotate 360° with ease-out, 2 seconds, transparent background, loop"
   - "Pulse like breathing, scale 0.9→1.1, 1.5s infinite, centered"
   - "Fade in from 0% opacity with slight upward motion, 0.8s, end hold 0.5s"
   - "For restaurant promo: Hand-crafted pies 10"–28" text appears after logo, sky blue background #bfe3f2, navy text #0e3a52, open till 2AM badge"
3. Export: 1080p MP4, 9:16 vertical for TikTok/Reel, 16:9 horizontal for website/YouTube, transparent WebM for overlay.
4. For dish videos: Use Dreamina image-to-video with real photos (real-pesto, real-box, real-patio, real-night, real-pep) — animate with rising steam, gentle push-in, sauce drizzle, parallax.
5. Upload to YouTube/TikTok/Instagram, embed via iframe or convert to WebM/MP4 for site (but keep vanilla — no external CDN per HANDOFF, self-host in assets/video/).
6. Update VideoObject schema contentUrl to MP4 when available.

## References
- web_search 2026-09-14 3 queries: Dreamina CapCut AI restaurant video ads (image-to-video Seedance 2.0), logo animation (logoto.video, Kapwing, FlexClip, MotionVid $19/mo, Jitter, Canva, Renderforest, Filmora), short-form AI 2026 (OpusClip, CapCut, Descript, HeyGen, Sora 2, Veo 3.1, Kling 3.0 $6.99/mo, MakeAIVideo $29/mo, PostEverywhere $9/mo, InVideo $25/mo, Runway $15/mo, Vizard.ai 60m free).
- Sandbox check: which ffmpeg ffprobe convert magick → only convert found, ffmpeg not found, PIL/moviepy not available, logo assets exist.
- Created assets: logo-frame.png 175K, 8 rotation frames 116-124K, logo-rotate.gif 285K delay10 loop0, scale frames, logo-pulse.gif 83K delay8, reveal frames, logo-reveal.gif 246K, promo-bg.png 32K, promo-with-logo.png 120K, promo-fade.gif 48K.
