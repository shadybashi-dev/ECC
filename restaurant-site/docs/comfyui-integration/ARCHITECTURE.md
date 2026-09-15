# ComfyUI Integration Architecture — Antonia's Pizzeria

## Overview
This document describes the Agent-to-ComfyUI integration for generating cinematic realistic food photography for Antonia's Pizzeria & Italian Kitchen.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Intelligent Agent (The Agent)                 │
│  - Reads menu data: antonias/menu/index.html            │
│  - Reads SEO rules: slots_v2.json seo_rules             │
│  - Reads GEO data: llms.txt / llms-full.txt             │
│  - Reads conversion psychology: Star/Puzzle/Plowhorse   │
│  - Generates cinematic prompts with 45-degree angle,    │
│    10 o'clock soft window light, leopard-charring,      │
│    olive oil shine, steam, 85mm f/2.8                   │
└───────────────────────┬─────────────────────────────────┘
                        │ 1. Inject prompt + dimensions + seed
                        │    into workflow.json
                        │    - Positive: authentic Georgian Ajarski...
                        │    - Negative: cartoon, plastic, wax...
                        │    - Width/Height: 800x800, 1920x1080
                        │    - Seed: uuid4 or fixed
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: ComfyUI REST API                              │
│  - Host: http://127.0.0.1:8188                          │
│  - Endpoints:                                           │
│    POST /prompt {prompt, client_id} -> prompt_id        │
│    GET /history/{prompt_id} -> outputs                  │
│    GET /view?filename=&subfolder=&type= -> image        │
│  - Models:                                              │
│    FLUX.1-dev (preferred) or Juggernaut XL v9           │
│    Commercial Food Styling LoRA 0.65-0.75               │
│    4x-UltraSharp upscaler                               │
└───────────────────────┬─────────────────────────────────┘
                        │ 2. Process nodes:
                        │    CheckpointLoaderSimple
                        │    -> LoraLoader
                        │    -> CLIPTextEncode (pos/neg)
                        │    -> EmptyLatentImage
                        │    -> KSampler (28-35 steps, CFG 3.5-4.5,
                        │       euler/simple or dpmpp_2m_sde_gpu/karras)
                        │    -> VAEDecode
                        │    -> UltimateSDUpscale (4x-UltraSharp)
                        │    -> SaveImage
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Post-Processing & SEO Optimization            │
│  - Download from /view endpoint                         │
│  - Color grading:                                       │
│    auto-gamma (soft daylight 45°)                       │
│    sigmoidal-contrast 2,50% (leopard-charring)          │
│    modulate 105,115 (golden caramelized, rich red,      │
│                     ivory mozzarella)                   │
│    brightness-contrast 3,5 + unsharp 0x0.75 (shine)      │
│  - Resize + centre-crop to target:                      │
│    800x800 menu <60K, 1920x1080 hero <150K,             │
│    1200x900 bento/wheel                                 │
│  - WebP adaptive q60->15 to meet <60K                   │
│  - AVIF q40->20 to meet <60K                            │
│  - Save to assets/img/seo/[dish]-[feature]-[city]-      │
│    [restaurant].jpg/.webp/.avif                         │
└───────────────────────┬─────────────────────────────────┘
                        │ 3. Build verification
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Site Build                                    │
│  - python restaurant-site/build.py                      │
│  - -> antonias/standalone.html 3692KB <5500K PASS       │
│  - NAP 100% verified, Conversion integrity preserved    │
└─────────────────────────────────────────────────────────┘
```

## Nodes Detailed

### Checkpoint Loader
- **FLUX.1-dev**: `flux1-dev.safetensors` — superior light physics for oils, liquids, baked goods
- **Juggernaut XL v9**: `juggernautXL_v9Rdphoto2Lightning.safetensors` — excellent for 6-8GB VRAM

### LoRA Loader
- **Commercial Food Styling LoRA**: `commercial-food-styling-v2.safetensors`
- Weight 0.65-0.75 (0.70 ideal) — enhances crust crunch and cheese pull without overfitting

### KSampler
- Steps: 28-35 (32 ideal)
- CFG: 3.5-4.5 (4.0 ideal) — coherence without color burn
- Sampler: `euler` + `simple` or `dpmpp_2m_sde_gpu` + `karras`
- Denoise: 1.0 initial, 0.35 upscale

### Ultimate SD Upscale
- Model: `4x-UltraSharp.pth`
- 1024px -> 2048px (2x) then downsample to target for 4K detail preservation
- Tile 512x512, padding 32, blur 8

## Prompts

See `slots_v2.json` for 13 official slots:

1. **Ajarski Cheese Boat** — Star/Puzzle Only Higuera — thick warm golden-brown sourdough boat, bubbling mozzarella + feta, raw egg yolk + butter, sea salt, black pepper, oregano, steam, 45-degree, 10 o'clock light, dark slate, Sony A7R V 85mm f/2.8, 8k
2. **Antonia's Special** — Star Signature — California-Neapolitan, leopard-char blisters, Grande mozzarella golden-brown spots, cup-and-char pepperoni, cremini mushrooms, red onions, bacon bits, pepperoncini, pizza peel, flour dust, cinematic backlight, cheese stretch, Michelin editorial, 8k
3. **28-inch King** — Star Party Price Anchor — 24h cold ferment, leopard-spotted, ivory mozzarella light browning, rich red sauce, olive oil shine, cheese pull, steam, 45-degree, dark wood, 16 slices 615 sq in 6-8 people
... plus 10 more (Margherita, Calzone, Wings, Pasta, Tiramisu, BBQ Chicken, Supreme, Dough Toss, Tomato Sauce, Hero 1920)

All prompts forbid: text, logos, brands, faces, branded bottles, marble studio kitchens, generic dishes, plastic, wax, cartoon, oversaturated.

## Automation Script

`scripts/comfy_food_gen.py` implements:

- `queue_prompt(workflow_api_json)` — POST /prompt
- `wait_for_completion(prompt_id)` — poll /history
- `get_output_images(history_entry)` — extract outputs
- `download_image(image_info)` — GET /view
- `optimize_to_seo(src, seo_name, w, h, output_root)` — warm grading + resize + WebP/AVIF <60K
- `inject_prompt_into_workflow(workflow, slot, style_suffix, negative, seed)` — agent injection
- CLI: --workflow flux/sdxl_v2 --slot id --all --dry-run --api --site --seed

## Agent Integration

`agent_integration.py` — intelligent agent that:

- Analyzes menu by conversion psychology Star/Puzzle/Plowhorse/Dog
- Generates cinematic prompts with camera specs (45-degree, 10 o'clock, 85mm f/2.8, 8k)
- Builds ComfyUI payloads
- Understands SEO naming formula and truth-in-menu

## Why not in sandbox?

Measured, not assumed:
- GPU /dev/nvidia* none
- torch cuda False, RAM 3.8 GiB / 2 threads SDXL needs ~10 GiB
- huggingface.co, civitai.com unreachable 000
- Conclusion: No weights can be downloaded and no sampler can run here
- Solution: Run on owner machine with GPU 6GB+ SDXL 12GB+ FLUX

## Usage

```bash
# 1. Run ComfyUI locally
git clone https://github.com/Comfy-Org/ComfyUI.git && cd ComfyUI
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Place checkpoints/models as described
python main.py --listen

# 2. Generate via agent
python scripts/comfy_food_gen.py --workflow flux --slot ajarski-original --api http://127.0.0.1:8188
python scripts/comfy_food_gen.py --workflow flux --all --api http://127.0.0.1:8188 --site restaurant-site/antonias/assets/img
python scripts/comfy_food_gen.py --workflow sdxl_v2 --all --dry-run

# 3. Rebuild
cd restaurant-site && python build.py
```

## Verification

- WebP 26 files 0 >60K excluding hero, hero 1600 82.2KB 1920 101.1KB <150K PASS
- AVIF 26 files 0 >60K PASS
- standalone.html 3692KB <5500K PASS
- NAP 100%, Conversion integrity preserved
