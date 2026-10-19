#!/usr/bin/env python3
"""
fal_generate.py — Antonia's Pizza flying-box spot, generated through fal.ai.

Why this exists: open video models need a 24 GB GPU. fal.ai runs them for you and
returns an MP4 in about a minute. This is the fastest path from prompt to footage.

    export FAL_KEY="..."                       # https://fal.ai/dashboard/keys
    python fal_generate.py --image keyframe_hero.png --dry-run
    python fal_generate.py --image keyframe_hero.png --shot 1 --out out/shot01.mp4

Endpoints (verified 2026-10-19):
    fal-ai/wan/v2.2-5b/image-to-video    $0.15 / clip   <- recommended: keeps your box design
    fal-ai/wan/v2.2-5b/text-to-video     $0.08 / clip
    fal-ai/wan/v2.2-a14b/text-to-video   $0.08 / second @720p (better motion, slower)

No API key? Print this script's payload and hand it to a human. Do not commit keys.
"""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

QUEUE_BASE = "https://queue.fal.run"
I2V_5B = "fal-ai/wan/v2.2-5b/image-to-video"
T2V_5B = "fal-ai/wan/v2.2-5b/text-to-video"

# ----------------------------------------------------------------------------
# Shot prompts (match shotlist.md). {box} is expanded into the brand look so we
# never rely on the model to invent the packaging.
# ----------------------------------------------------------------------------
BOX = (
    "a giant premium pizza box — warm cream kraft card, deep tomato-red band, "
    "gold-foil serif wordmark \"Antonia's Pizza\" — lid cracked open, molten cheese "
    "stretching, thick golden steam curling out"
)

SHOTS = {
    "1": (
        "Low-angle hero shot, slow motion: {box} sits on a glossy black stage floor, then lifts "
        "off the ground and rises two feet, tilting as it hovers. Crimson and amber spotlights "
        "sweep across it, embers and dust drifting through the beams, ground fog rolling. Stunned "
        "silhouetted crowd at the edges. Camera pushes in low, slight handheld. Photoreal, "
        "anamorphic lens flare, shallow depth of field, 24fps, film grain."
    ),
    "2": (
        "Orbiting drone shot circling {box} as it glides forward through a dark futuristic stage, "
        "banking gently like a concept-car reveal. Golden light leaks from the lid, cheese pull "
        "glinting, energy particles in tomato-red and gold trailing behind. Spotlights streak past, "
        "fog swirling, audience silhouettes blurred in the foreground. Smooth aerial orbit, motion "
        "blur, cinematic grade."
    ),
    "3": (
        "A giant premium pizza box descends slowly onto a rustic wooden table in a warm pizzeria, fog clearing, stage "
        "light fading into golden practical light. Dust motes in the air, flour on the table, a "
        "hand-made 28-inch pie glow reflecting on the wood. Slow-motion, macro detail, shallow "
        "depth of field, warm and authentic."
    ),
    "4": (
        "Close-up: the lid of {box} opens in slow motion, a burst of golden steam rolling out, "
        "revealing a perfect steaming 28-inch pepperoni pizza — bubbling mozzarella, charred "
        "seasoned crust, fresh basil, an epic cheese pull. Camera slow push-in, steam backlit by "
        "warm light. Mouth-watering, photoreal food cinematography."
    ),
}

NEGATIVE = (
    "blurry, low quality, distorted text, misspelled lettering, warped logo, extra boxes, "
    "melting cardboard, watermark, jitter, static shot, cartoon, plastic look, oversaturated"
)


def build_prompt(shot: str) -> str:
    return SHOTS[str(shot)].format(box=BOX, box_cap=BOX[0].upper() + BOX[1:])


def image_to_data_uri(path: Path) -> str:
    """fal accepts data URIs, so we never have to expose a local file to the internet."""
    mime = mimetypes.guess_type(path.name)[0] or "image/png"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def _request(url: str, key: str, payload: dict | None = None, timeout: int = 60) -> dict:
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Authorization": f"Key {key}", "Content-Type": "application/json"},
        method="POST" if data else "GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:800]
        sys.exit(f"✗ HTTP {e.code} from {url}\n{body}")


def submit(endpoint: str, payload: dict, key: str) -> dict:
    return _request(f"{QUEUE_BASE}/{endpoint}", key, payload)


def poll(status_url: str, key: str, timeout: int = 900) -> str:
    """Returns the response_url once the job completes."""
    started = time.time()
    last = None
    while time.time() - started < timeout:
        data = _request(status_url, key)
        status = data.get("status")
        if status != last:
            print(f"  … {status}", flush=True)
            last = status
        if status == "COMPLETED":
            return data.get("response_url") or status_url.replace("/status", "")
        if status in ("FAILED", "CANCELLED"):
            sys.exit(f"✗ job {status}: {json.dumps(data)[:600]}")
        time.sleep(3)
    sys.exit("✗ timed out waiting for fal queue")


def download(url: str, out: Path, key: str) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"Authorization": f"Key {key}"})
    with urllib.request.urlopen(req, timeout=300) as resp, out.open("wb") as f:
        while chunk := resp.read(1 << 20):
            f.write(chunk)
    print(f"✅ saved {out}  ({out.stat().st_size / 1e6:.1f} MB)")


def main() -> None:
    ap = argparse.ArgumentParser(description="Generate one Antonia's Pizza shot via fal.ai")
    ap.add_argument("--shot", default="1", choices=list(SHOTS), help="shot number from shotlist.md")
    ap.add_argument("--image", help="keyframe for image-to-video (recommended)")
    ap.add_argument("--text-to-video", action="store_true", help="force text-to-video")
    ap.add_argument("--prompt", help="override the prompt entirely")
    ap.add_argument("--prompt-file", help="read the prompt from a file (e.g. prompt_master.txt)")
    ap.add_argument("--out", default=None, help="output mp4 path")
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--resolution", default="720p", choices=["580p", "720p"])
    ap.add_argument("--aspect", default="16:9", choices=["16:9", "9:16", "1:1", "auto"])
    ap.add_argument("--frames", type=int, default=121, help="17–161 frames (121 ≈ 5s @24fps)")
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--steps", type=int, default=40, help="2–50")
    ap.add_argument("--guidance", type=float, default=3.5)
    ap.add_argument("--dry-run", action="store_true", help="print the request, spend nothing")
    args = ap.parse_args()

    if args.prompt_file:
        prompt = Path(args.prompt_file).read_text().strip()
    elif args.prompt:
        prompt = args.prompt
    else:
        prompt = build_prompt(args.shot)

    use_i2v = bool(args.image) and not args.text_to_video
    payload: dict = {
        "prompt": prompt,
        "negative_prompt": NEGATIVE,
        "seed": args.seed,
        "num_frames": max(17, min(161, args.frames)),
        "frames_per_second": args.fps,
        "resolution": args.resolution,
        "aspect_ratio": args.aspect,
        "num_inference_steps": max(2, min(50, args.steps)),
        "guidance_scale": args.guidance,
    }
    endpoint = I2V_5B if use_i2v else T2V_5B

    if use_i2v:
        img = Path(args.image)
        if not img.exists():
            sys.exit(f"✗ keyframe not found: {img}")
        payload["image_url"] = image_to_data_uri(img)
    else:
        # T2V schema is stricter; keep the payload to fields shared by both endpoints.
        payload.pop("num_inference_steps", None)
        payload.pop("guidance_scale", None)

    out = Path(args.out) if args.out else Path(f"out/shot{args.shot}_{'i2v' if use_i2v else 't2v'}.mp4")

    printable = dict(payload)
    if "image_url" in printable and len(str(printable["image_url"])) > 120:
        printable["image_url"] = str(printable["image_url"])[:80] + "…(base64 data URI)"
    print(f"endpoint : {endpoint}")
    print(f"output   : {out}")
    print("payload  :", json.dumps(printable, indent=2, ensure_ascii=False))

    if args.dry_run:
        print("\n(dry run — nothing was generated, no credits spent)")
        return

    key = os.environ.get("FAL_KEY", "").strip()
    if not key:
        sys.exit("✗ FAL_KEY is not set. Get one at https://fal.ai/dashboard/keys")

    print("\nsubmitting…")
    job = submit(endpoint, payload, key)
    print(f"request_id: {job.get('request_id')}")
    response_url = poll(job["status_url"], key)

    result = _request(response_url, key, timeout=120)

    video = result.get("video") or {}
    url = video.get("url") if isinstance(video, dict) else None
    if not url:
        sys.exit(f"✗ unexpected result: {json.dumps(result)[:600]}")

    print(f"seed actually used: {result.get('seed')}")
    download(url, out, key)


if __name__ == "__main__":
    main()
