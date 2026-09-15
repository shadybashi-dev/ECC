#!/usr/bin/env python3
"""
ComfyUI Food Generator for Antonia's Pizzeria & Italian Kitchen
Agent-to-ComfyUI Integration — FLUX.1-dev / SDXL with Food LoRA + Ultimate SD Upscale

Architecture:
┌──────────────────────────────┐
│  الوكيل الذكي (The Agent)   │
│  (يقرأ بيانات القائمة والـ SEO)│
└──────────────┬───────────────┘
               │ 1. حقن البرومبت + الأبعاد + الـ Seed في workflow.json
               ▼
┌──────────────────────────────┐
│       ComfyUI REST API       │  <-- http://127.0.0.1:8188
│   (FLUX.1-dev / SDXL Nodes)  │
└──────────────┬───────────────┘
               │ 2. معالجة العقد: Checkpoint -> LoRA -> KSampler -> Upscale
               ▼
┌──────────────────────────────┐
│      مجلد الصور المعتمدة     │  <-- التسمية الآلية لـ SEO والتحويل لـ WebP
│    (assets/img/seo/...)      │
└──────────────────────────────┘

Nodes Architecture:
1. Checkpoint Loader: FLUX.1-dev (or Juggernaut XL v9 for <8GB VRAM) — superior light physics
2. Food LoRA Loader: Commercial Food Styling LoRA weight 0.65-0.75 — crust crunch, cheese pull
3. KSampler: Steps 28-35, CFG 3.5-4.5, Sampler euler/simple or dpmpp_2m_sde_gpu
4. Ultimate SD Upscale: 4x-UltraSharp 1024->4K with leopard-charring & steam detail

Usage:
  python scripts/comfy_food_gen.py --workflow flux --slot ajarski-original
  python scripts/comfy_food_gen.py --workflow sdxl --all --api http://127.0.0.1:8188
  python scripts/comfy_food_gen.py --dry-run --all

Requires: Running ComfyUI server on 127.0.0.1:8188 with checkpoints in models/checkpoints/
          and LoRAs in models/loras/ and upscalers in models/upscale_models/
"""

import json
import urllib.request
import urllib.parse
import os
import time
import uuid
import argparse
import subprocess
from pathlib import Path
import sys

COMFY_HOST = "http://127.0.0.1:8188"
HERE = Path(__file__).resolve().parent.parent / "restaurant-site" / "comfyui"

def queue_prompt(workflow_api_json, host=COMFY_HOST, client_id=None):
    """Queue a workflow on ComfyUI REST API and return prompt_id"""
    if client_id is None:
        client_id = str(uuid.uuid4())
    payload = {"prompt": workflow_api_json, "client_id": client_id}
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f"{host}/prompt", data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            res = json.loads(response.read().decode('utf-8'))
            prompt_id = res.get('prompt_id')
            print(f"✅ Job Queued successfully! Prompt ID: {prompt_id} Client: {client_id}")
            return prompt_id, client_id
    except Exception as e:
        print(f"❌ Could not connect to ComfyUI at {host}: {e}")
        print(f"   Make sure ComfyUI is running: python main.py --listen")
        return None, None

def wait_for_completion(prompt_id, host=COMFY_HOST, timeout=600):
    """Poll /history until prompt_id appears"""
    start = time.time()
    while time.time() - start < timeout:
        try:
            req = urllib.request.Request(f"{host}/history/{prompt_id}")
            with urllib.request.urlopen(req, timeout=10) as r:
                hist = json.loads(r.read().decode('utf-8'))
                if prompt_id in hist:
                    # Check if completed
                    entry = hist[prompt_id]
                    if entry.get('status', {}).get('completed', False) or 'outputs' in entry:
                        return entry
        except Exception as e:
            # 404 while still processing is normal
            pass
        print(f"  ⏳ Waiting for {prompt_id}... {int(time.time()-start)}s")
        time.sleep(3)
    print(f"❌ Timeout waiting for {prompt_id}")
    return None

def get_output_images(history_entry):
    """Extract output image filenames from history entry"""
    images = []
    outputs = history_entry.get('outputs', {})
    for node_id, node_out in outputs.items():
        if 'images' in node_out:
            for img in node_out['images']:
                images.append(img)
    return images

def download_image(image_info, host=COMFY_HOST, dest_dir=Path("/tmp")):
    """Download image from ComfyUI /view endpoint"""
    filename = image_info['filename']
    subfolder = image_info.get('subfolder', '')
    filetype = image_info.get('type', 'output')
    params = urllib.parse.urlencode({"filename": filename, "subfolder": subfolder, "type": filetype})
    url = f"{host}/view?{params}"
    dest = dest_dir / filename
    try:
        urllib.request.urlretrieve(url, dest)
        print(f"  📥 Downloaded {filename} -> {dest} ({dest.stat().st_size/1024:.1f}KB)")
        return dest
    except Exception as e:
        print(f"  ❌ Failed to download {filename}: {e}")
        return None

def optimize_to_seo(src_path, seo_name, target_w, target_h, output_root, quality_webp=60, quality_avif=40):
    """
    Apply Antonia's color grading + resize to SEO targets + WebP/AVIF <60K
    Warm natural grading: golden caramelized crust, rich red sauce, ivory mozzarella
    """
    output_root = Path(output_root)
    seo_dir = output_root / "seo"
    seo_dir.mkdir(parents=True, exist_ok=True)

    # Enhanced JPG with warm grading
    enhanced = Path(f"/tmp/{seo_name}-enhanced.jpg")
    cmd = [
        "convert", str(src_path),
        "-auto-gamma",
        "-sigmoidal-contrast", "2,50%",
        "-modulate", "105,115",
        "-brightness-contrast", "3,5",
        "-unsharp", "0x0.75+0.75+0.008",
        "-resize", f"{target_w}x{target_h}^",
        "-gravity", "center",
        "-extent", f"{target_w}x{target_h}",
        "-quality", "85",
        str(enhanced)
    ]
    subprocess.run(cmd, check=True)
    print(f"  🎨 Enhanced {seo_name} {target_w}x{target_h} warm grading applied")

    # WebP adaptive <60K (hero <150K)
    is_hero = "hero" in seo_name
    limit_webp = 150*1024 if is_hero else 60*1024
    for q in [60, 50, 40, 30, 20, 15]:
        tmp_webp = Path(f"/tmp/{seo_name}-q{q}.webp")
        subprocess.run(["convert", str(enhanced), "-quality", str(q), str(tmp_webp)], check=True)
        size = tmp_webp.stat().st_size
        status = "PASS" if size <= limit_webp else "FAIL"
        print(f"    WebP q{q} -> {size/1024:.1f}KB {status}")
        if size <= limit_webp:
            final_webp = seo_dir / f"{seo_name}.webp"
            tmp_webp.rename(final_webp)
            print(f"    ✅ Saved WebP {final_webp} {size/1024:.1f}KB PASS")
            break
        tmp_webp.unlink(missing_ok=True)
    else:
        # Fallback resize 600x600 if still failing
        print(f"    ⚠️ WebP still >{limit_webp/1024}KB, trying 600x600 fallback")
        tmp_webp = Path(f"/tmp/{seo_name}-fallback.webp")
        subprocess.run(["convert", str(enhanced), "-resize", "600x600^", "-gravity", "center", "-extent", "600x600", "-quality", "20", str(tmp_webp)], check=True)
        final_webp = seo_dir / f"{seo_name}.webp"
        tmp_webp.rename(final_webp)

    # AVIF
    limit_avif = 150*1024 if is_hero else 60*1024
    for q in [40, 30, 20]:
        tmp_avif = Path(f"/tmp/{seo_name}-q{q}.avif")
        subprocess.run(["convert", str(enhanced), "-quality", str(q), str(tmp_avif)], check=True)
        size = tmp_avif.stat().st_size
        status = "PASS" if size <= limit_avif else "FAIL"
        print(f"    AVIF q{q} -> {size/1024:.1f}KB {status}")
        if size <= limit_avif:
            final_avif = seo_dir / f"{seo_name}.avif"
            tmp_avif.rename(final_avif)
            print(f"    ✅ Saved AVIF {final_avif} {size/1024:.1f}KB PASS")
            break
        tmp_avif.unlink(missing_ok=True)

    # JPG fallback
    final_jpg = seo_dir / f"{seo_name}.jpg"
    enhanced.rename(final_jpg)
    print(f"    ✅ Saved JPG {final_jpg} {final_jpg.stat().st_size/1024:.1f}KB")
    return final_jpg

def load_workflow(workflow_name):
    """Load workflow JSON by name: flux, sdxl, sdxl_v2"""
    mapping = {
        "flux": HERE / "workflow_flux_food.json",
        "sdxl": HERE / "workflow_food_sdxl.json",
        "sdxl_v2": HERE / "workflow_food_sdxl_v2.json",
        "sdxl-v2": HERE / "workflow_food_sdxl_v2.json",
    }
    path = mapping.get(workflow_name, HERE / "workflow_flux_food.json")
    if not path.exists():
        print(f"❌ Workflow not found: {path}, falling back to flux")
        path = HERE / "workflow_flux_food.json"
    return json.loads(path.read_text()), path

def load_slots(slots_file=None):
    """Load slots definition"""
    if slots_file is None:
        # Prefer v2 if exists
        v2 = HERE / "slots_v2.json"
        v1 = HERE / "slots.json"
        slots_file = v2 if v2.exists() else v1
    else:
        slots_file = Path(slots_file)
    data = json.loads(Path(slots_file).read_text())
    return data, slots_file

def inject_prompt_into_workflow(workflow, slot, style_suffix, negative, seed=None):
    """Inject positive/negative prompts, dimensions, seed into workflow"""
    wf = json.loads(json.dumps(workflow))  # deep copy
    if seed is None:
        seed = int(uuid.uuid4()) % 2**32

    # Find CLIPTextEncode nodes (usually 2 and 3, or 3 and 4 for FLUX with LoRA)
    # Strategy: find all CLIPTextEncode and assume first is positive, second negative
    clip_nodes = [k for k, v in wf.items() if not k.startswith('_') and v.get('class_type') == 'CLIPTextEncode']
    clip_nodes_sorted = sorted(clip_nodes, key=lambda x: int(x) if x.isdigit() else 999)

    if len(clip_nodes_sorted) >= 2:
        pos_node = clip_nodes_sorted[0]
        neg_node = clip_nodes_sorted[1]
        # Compose positive prompt
        positive = slot['prompt']
        if style_suffix and style_suffix not in positive:
            positive = f"{positive}, {style_suffix}"
        wf[pos_node]['inputs']['text'] = positive
        wf[neg_node]['inputs']['text'] = slot.get('negative_override', negative)
        print(f"  📝 Injected positive into node {pos_node}: {positive[:120]}...")
        print(f"  📝 Injected negative into node {neg_node}: {wf[neg_node]['inputs']['text'][:120]}...")

    # Find EmptyLatentImage node for dimensions
    for k, v in wf.items():
        if k.startswith('_'):
            continue
        if v.get('class_type') == 'EmptyLatentImage':
            wf[k]['inputs']['width'] = slot['width']
            wf[k]['inputs']['height'] = slot['height']
            print(f"  📐 Set dimensions node {k}: {slot['width']}x{slot['height']}")

    # Find KSampler nodes for seed, steps, cfg, sampler
    for k, v in wf.items():
        if k.startswith('_'):
            continue
        if v.get('class_type') == 'KSampler':
            wf[k]['inputs']['seed'] = seed
            if 'flux_cfg' in slot:
                wf[k]['inputs']['cfg'] = slot['flux_cfg']
            if 'flux_steps' in slot:
                wf[k]['inputs']['steps'] = slot['flux_steps']
            if 'sampler' in slot and 'sampler_name' in wf[k]['inputs']:
                wf[k]['inputs']['sampler_name'] = slot['sampler']
            if 'scheduler' in slot and 'scheduler' in wf[k]['inputs']:
                wf[k]['inputs']['scheduler'] = slot['scheduler']
            print(f"  🎲 Set KSampler node {k}: seed={seed} steps={wf[k]['inputs'].get('steps')} cfg={wf[k]['inputs'].get('cfg')} sampler={wf[k]['inputs'].get('sampler_name')} scheduler={wf[k]['inputs'].get('scheduler')}")

        # Also UltimateSDUpscale seed
        if v.get('class_type') == 'UltimateSDUpscale':
            wf[k]['inputs']['seed'] = seed

    return wf

def main():
    parser = argparse.ArgumentParser(description="ComfyUI Food Generator for Antonia's Pizzeria")
    parser.add_argument("--workflow", default="flux", choices=["flux", "sdxl", "sdxl_v2", "sdxl-v2"], help="Which workflow to use")
    parser.add_argument("--api", default=COMFY_HOST, help="ComfyUI API host")
    parser.add_argument("--site", default=str(Path(__file__).parent.parent / "restaurant-site" / "antonias" / "assets" / "img"), help="Output site img root")
    parser.add_argument("--slots", default=None, help="Slots JSON file")
    parser.add_argument("--slot", default=None, help="Generate single slot by id (e.g., ajarski-original)")
    parser.add_argument("--all", action="store_true", help="Generate all slots")
    parser.add_argument("--dry-run", action="store_true", help="Print plan without queuing")
    parser.add_argument("--seed", type=int, default=None, help="Fixed seed for reproducibility")
    args = parser.parse_args()

    print("🍕 ComfyUI Food Generator initialized for Antonia's Pizzeria...")
    print(f"   Workflow: {args.workflow} | API: {args.api} | Site: {args.site}")

    workflow, wf_path = load_workflow(args.workflow)
    print(f"   Loaded workflow: {wf_path} ({len(workflow)} nodes)")

    slots_data, slots_path = load_slots(args.slots)
    print(f"   Loaded slots: {slots_path} — {len(slots_data.get('slots', []))} slots")
    print(f"   Style suffix: {slots_data.get('style_suffix','')[:100]}...")
    print(f"   Negative: {slots_data.get('negative','')[:100]}...")

    # Filter slots
    all_slots = slots_data.get('slots', [])
    if args.slot:
        target = [s for s in all_slots if s['id'] == args.slot or s['seo_name'] == args.slot]
        if not target:
            print(f"❌ Slot {args.slot} not found. Available: {[s['id'] for s in all_slots]}")
            return 1
        slots_to_run = target
    elif args.all:
        slots_to_run = all_slots
    else:
        # Default: show list and run first as demo
        print("\nAvailable slots:")
        for s in all_slots:
            print(f"  - {s['id']}: {s['file']} {s['width']}x{s['height']} [{s.get('category','')}]")
        print("\nUse --slot <id> or --all to generate")
        return 0

    print(f"\n🚀 Generating {len(slots_to_run)} slots with {args.workflow}...")

    for slot in slots_to_run:
        print(f"\n{'='*70}")
        print(f"🍕 Slot: {slot['id']} — {slot['seo_name']} {slot['width']}x{slot['height']}")
        print(f"   File: {slot['file']} Category: {slot.get('category','')}")
        print(f"   Prompt: {slot['prompt'][:150]}...")

        wf_injected = inject_prompt_into_workflow(
            workflow, slot,
            slots_data.get('style_suffix',''),
            slots_data.get('negative',''),
            seed=args.seed
        )

        if args.dry_run:
            print(f"  [DRY-RUN] Would queue {slot['id']} with {slot['width']}x{slot['height']}")
            continue

        # Queue on ComfyUI
        prompt_id, client_id = queue_prompt(wf_injected, host=args.api)
        if not prompt_id:
            print(f"  ❌ Failed to queue {slot['id']}, skipping")
            continue

        # Wait for completion
        history = wait_for_completion(prompt_id, host=args.api)
        if not history:
            print(f"  ❌ Timeout for {slot['id']}")
            continue

        images = get_output_images(history)
        if not images:
            print(f"  ❌ No output images for {slot['id']}")
            continue

        print(f"  🖼️ Got {len(images)} output images")
        for img_info in images[:1]:  # Take first
            tmp_path = download_image(img_info, host=args.api, dest_dir=Path("/tmp"))
            if tmp_path and tmp_path.exists():
                # Optimize to SEO
                optimize_to_seo(
                    tmp_path,
                    slot['seo_name'],
                    slot['width'],
                    slot['height'],
                    args.site
                )
                # Cleanup tmp
                tmp_path.unlink(missing_ok=True)
            else:
                print(f"  ❌ Download failed for {slot['id']}")

    print(f"\n✅ Done. Generated {len(slots_to_run)} slots.")
    print(f"   Check output in {args.site}/seo/")
    print(f"   Run: python ../restaurant-site/build.py to regenerate standalone.html <5500K")
    return 0

if __name__ == "__main__":
    sys.exit(main())
