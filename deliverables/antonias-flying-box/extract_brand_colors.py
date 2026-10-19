#!/usr/bin/env python3
"""
extract_brand_colors.py — pull the real brand hex codes out of Antonia's logo.

The site's stylesheet is compiled and not publicly listable, so instead of guessing
we sample the official mark itself. Feed it the logo PNG (or a good photo of the
storefront sign) and it prints a palette you can paste into the prompt, the end card,
and the CapCut text styles.

    pip install pillow numpy
    python extract_brand_colors.py logo.png
    python extract_brand_colors.py logo.png --k 6 --out palette.png

Output: dominant colours sorted by coverage, with hex / RGB / HSL, plus a swatch PNG.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image


def rgb_to_hex(rgb: np.ndarray) -> str:
    return "#{:02X}{:02X}{:02X}".format(*(int(round(c)) for c in rgb))


def kmeans(pixels: np.ndarray, k: int, iterations: int = 25, seed: int = 0) -> tuple[np.ndarray, np.ndarray]:
    """Tiny k-means in numpy (avoids a scikit-learn dependency)."""
    rng = np.random.default_rng(seed)
    centroids = pixels[rng.choice(len(pixels), size=k, replace=False)].astype(np.float64)

    for _ in range(iterations):
        dist = ((pixels[:, None, :] - centroids[None, :, :]) ** 2).sum(axis=2)
        labels = dist.argmin(axis=1)
        for i in range(k):
            members = pixels[labels == i]
            if len(members):
                centroids[i] = members.mean(axis=0)

    counts = np.bincount(labels, minlength=k).astype(np.float64)
    order = counts.argsort()[::-1]
    weights = counts[order] / counts.sum()

    # Drop empty clusters and near-duplicates (k-means often leaves a dead centroid
    # on flat logos, which would otherwise print as a 0.0 % duplicate swatch).
    kept_c, kept_w = [], []
    for c, w in zip(centroids[order], weights):
        if w < 0.01:
            continue
        if any(np.linalg.norm(c - kc) < 24 for kc in kept_c):
            continue
        kept_c.append(c)
        kept_w.append(w)
    return np.array(kept_c), np.array(kept_w)


def load_pixels(path: Path, max_side: int = 400) -> np.ndarray:
    img = Image.open(path).convert("RGBA")
    img.thumbnail((max_side, max_side), Image.LANCZOS)
    arr = np.asarray(img).reshape(-1, 4)
    # Drop transparent and near-white/near-black background pixels: they inflate the
    # palette with colours that are not actually part of the mark.
    rgb, alpha = arr[:, :3].astype(np.float64), arr[:, 3]
    keep = (alpha > 200) & (rgb.max(axis=1) < 250) & (rgb.max(axis=1) > 12)
    rgb = rgb[keep]
    if len(rgb) < 50:
        raise SystemExit("✗ not enough opaque pixels — is the logo mostly transparent?")
    return rgb


def main() -> None:
    ap = argparse.ArgumentParser(description="Extract a brand palette from a logo image")
    ap.add_argument("image", type=Path)
    ap.add_argument("--k", type=int, default=5, help="number of colours (default 5)")
    ap.add_argument("--out", default="palette.png", help="where to save the swatch strip")
    args = ap.parse_args()

    pixels = load_pixels(args.image)
    centres, weights = kmeans(pixels, k=args.k)

    print(f"\nSource: {args.image}  ·  {len(pixels):,} sampled pixels\n")
    print(f"{'#':<3}{'HEX':<10}{'RGB':<18}{'COVERAGE':>9}  SWATCH")
    for i, (c, w) in enumerate(zip(centres, weights), 1):
        hexc = rgb_to_hex(c)
        r, g, b = (int(round(v)) for v in c)
        bar = "█" * max(1, int(round(w * 30)))
        print(f"{i:<3}{hexc:<10}rgb({r:>3}, {g:>3}, {b:>3})   {w * 100:>7.1f}%  {bar}")

    primary = rgb_to_hex(centres[0])
    print("\n— paste into the prompt / end card —")
    print(f'primary: {primary}')
    print("palette: " + " ".join(rgb_to_hex(c) for c in centres))

    # swatch strip
    tile, pad = 160, 12
    strip = Image.new("RGB", (tile * len(centres) + pad * (len(centres) + 1), tile + pad * 2), "#FFFFFF")
    for i, c in enumerate(centres):
        block = Image.new("RGB", (tile, tile), tuple(int(round(v)) for v in c))
        strip.paste(block, (pad + i * (tile + pad), pad))
    strip.save(args.out)
    print(f"\nswatches saved → {args.out}")


if __name__ == "__main__":
    main()
