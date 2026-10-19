# ✂️ Post-production: logo, end card, vertical cut, sound

Everything below is copy-paste. Free tools only: **ffmpeg** (CLI) · **CapCut** (GUI) ·
**DaVinci Resolve** (GUI, better colour).

---

## 0. Get the real brand assets

```bash
mkdir -p assets && cd assets
curl -L -o logo.png https://antoniaspizza.com/assets/img/logo-current-192.png
file logo.png && python -c "from PIL import Image;print(Image.open('logo.png').size)"
```

The official mark on the site is only **192 × 192 px**. That is fine for a corner bug,
**not** for a full-screen end card. Do one of these, in order of preference:

1. Ask the client / designer for the **SVG or AI file** (best, 5 seconds of work).
2. Re-draw it in Illustrator/Figma using the 192 px file as reference.
3. Upscale: `magick logo.png -filter Lanczos -resize 800x logo@4x.png`
   (or the free app **Upscayl**). Accept that it will look soft at 1080p.

> Don't screenshot the logo from Google Images — wrong colours, wrong edges, possible
> watermark. Use the file the site itself loads.

Fonts (free, commercial-safe):
[Anton](https://fonts.google.com/specimen/Anton) ·
[Archivo Black](https://fonts.google.com/specimen/Archivo+Black) ·
[Playfair Display Italic](https://fonts.google.com/specimen/Playfair+Display)

---

## 1. ffmpeg: logo bug on every clip

Fades in over 0.4 s, sits at 80,80, 260 px wide, stays for the whole clip.

```bash
ffmpeg -y -i shot01.mp4 -loop 1 -i assets/logo.png -filter_complex \
"[1:v]format=rgba,scale=260:-1,fade=t=in:st=0:d=0.4:alpha=1[lg];\
 [0:v][lg]overlay=80:80:format=auto,format=yuv420p[v]" \
 -map "[v]" -map 0:a? -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k \
 shot01_logo.mp4
```

Vertical version (1080×1920) — keep the logo in the top safe zone:

```bash
ffmpeg -y -i shot01.mp4 -loop 1 -i assets/logo.png -filter_complex \
"[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920[bg];\
 [1:v]format=rgba,scale=180:-1,fade=t=in:st=0:d=0.4:alpha=1[lg];\
 [bg][lg]overlay=64:260:format=auto,format=yuv420p[v]" \
 -map "[v]" -map 0:a? -c:v libx264 -crf 18 -preset slow -c:a aac shot01_logo_9x16.mp4
```

---

## 2. Stitch the four shots

```bash
printf "file 'shot01_logo.mp4'\nfile 'shot02_logo.mp4'\nfile 'shot03_logo.mp4'\nfile 'shot04_logo.mp4'\n" > body.txt
ffmpeg -y -f concat -safe 0 -i body.txt \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac body.mp4
```

Add a 6-frame cross-dissolve between cuts if the motion jumps
(in CapCut: overlap the clips by 4 frames and use "Dissolve").

---

## 3. End card (do this in the editor, not in AI)

**Spec**

| Element | Value |
|---|---|
| Duration | 3.0 s (0:20–0:23) |
| Background | Cream `#F2E7D5` + 8 % grain texture |
| Logo | Centered, 22 % of frame width, top margin 22 % |
| Wordmark | "Antonia's Pizza" — Anton, tracking +2 %, `#1A1714` |
| URL | `antoniaspizza.com` — 62 % of headline size |
| Tagline | *The Future of Delivery is Here.* — Playfair Display Italic |
| Footer | "San Luis Obispo · Paso Robles — Open till 2AM Fri–Sat." |

**Build it as a still, then make it a clip:**

```bash
# endcard.png = 1920x1080 export from Canva / Figma / Resolve
ffmpeg -y -loop 1 -i endcard.png -f lavfi -i anullsrc=r=48000:cl=stereo -t 3 \
  -vf "scale=1920:1080,format=yuv420p" -r 24 \
  -c:v libx264 -crf 18 -preset slow -c:a aac -shortest endcard.mp4
```

Then append it:

```bash
printf "file 'body.mp4'\nfile 'endcard.mp4'\n" > final.txt
ffmpeg -y -f concat -safe 0 -i final.txt \
  -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac final.mp4
```

Add a 0.3 s white flash or a hard cut on the beat at 0:20 — hard cut lands better on
short-form than a dissolve.

---

## 4. Fix the AI-generated box lettering

The generated box will almost always carry a slightly misspelled wordmark. Three fixes,
cheapest first:

1. **Camera framing:** if the box is small or fast, the error reads as texture. Cut it short.
2. **Patch:** in Photoshop / CapCut (mask + content-aware fill), paint out the fake text and
   place the real logo on the lid with a perspective transform. This is the pro move.
3. **Re-render from a clean keyframe:** design the box yourself in Canva/Figma with the real
   logo, then run **image-to-video** on it (`fal_generate.py --image my_box.png`). Identity
   stays; motion gets generated. This is why `keyframe_hero.png` exists.

---

## 5. CapCut walkthrough (fastest GUI path)

1. New project → 9:16 (1080×1920) for Reels/TikTok, or 16:9 for YouTube.
2. Import the four clips + `endcard.png` → drag endcard to the end, set 3.0 s.
3. **Overlays → Add overlay → logo.png.** Scale to 180 px wide, position **x=64, y=260**.
   Animation → In → Fade, 0.4 s. Opacity 85 %.
4. **Text:** headline in Anton 96 pt, URL 60 pt, tagline in Playfair Display Italic 54 pt.
5. **Transitions:** none between shots, or "Dissolve" 4 frames maximum.
6. **Audio:** drop the music bed, then sound effects on the beats listed in `shotlist.md`.
   CapCut → Audio → Sound effects → search "whoosh", "sizzle", "cheese pull".
7. **Colour:** Adjustment → Temperature +6, Contrast +8, Shadows −5. Or apply a free
   "Kodak 2383" LUT.
8. Export: 1080p, 30 fps, high quality.

**TikTok/Reels safe zones (1080×1920):** keep text between **y = 220 and y = 1500**;
leave 140 px free on the right edge for the like/comment column and 180 px at the
bottom for the caption. Logo top-left survives both.

---

## 6. Sound design cheat sheet

| Time | Sound | Why |
|---|---|---|
| 0:00.2 | low sub swell + crowd murmur | sets scale |
| 0:00.6 | rising whoosh | the box lifts |
| 0:04.8 | metallic shimmer tail | cut to glide |
| 0:10.0 | wooden thud + card tap | landing |
| 0:15.5 | steam hiss + sizzle + choir hit | the reveal |
| 0:20.0 | music resolves on one mandolin pluck | end card |
| 0:20.3 | silence under the tagline | makes it land |

Free sources: [Pixabay Music](https://pixabay.com/music/) ·
[Freesound](https://freesound.org/) (check the licence per file).

Loudness pass for social (targets −14 LUFS):

```bash
ffmpeg -y -i final.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy final_social.mp4
```

---

## 7. Final QC commands

```bash
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 final_social.mp4

# poster frame for the thumbnail
ffmpeg -y -ss 00:00:02 -i final_social.mp4 -frames:v 1 poster.jpg

# 3-second silent teaser (first 3 s)
ffmpeg -y -t 3 -i final_social.mp4 -an -c:v libx264 -crf 20 teaser.mp4
```

---

## ⚖️ Before you publish

- Confirm you have the client's permission to use the **logo and name** in paid media.
- Confirm the model licence covers commercial use: **Wan 2.2 = Apache 2.0 ✅**,
  HunyuanVideo = Tencent Community licence ⚠️ (territory restrictions), LTX-2.5 =
  free under $10M revenue ⚠️.
- Disclose AI-generated footage where the platform requires it (TikTok has an
  "AI-generated content" label — use it; it does not hurt reach).
