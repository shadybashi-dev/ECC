# ComfyUI food-photography kit for Antonia's Pizza

> **NEW V2 — FLUX.1-dev + Food LoRA + Ultimate SD Upscale — See README_V2.md for full Agent-to-ComfyUI architecture**
> V2 adds: `workflow_flux_food.json` (FLUX.1-dev 0.70 LoRA euler/simple 32 steps CFG 4.0 + 4x-UltraSharp), `workflow_food_sdxl_v2.json` (Juggernaut XL v9 0.68 LoRA dpmpp_2m_sde_gpu/karras), `slots_v2.json` (13 official Antonia's slots Star/Puzzle/Plowhorse with Ajarski + Antonia's Special cinematic prompts), `scripts/comfy_food_gen.py` (full agent automation queue_prompt + WebP <60K), `agent_integration.py` (intelligent menu analysis)

Reproduces the site's entire food set deterministically on **your** hardware.
Cloned from https://github.com/Comfy-Org/ComfyUI.git (see below for why the
sandbox could not run it).

## Why this kit exists instead of a sandbox run — measured, not assumed
| check | result in the editing sandbox |
|---|---|
| GPU device (`/dev/nvidia*`) | none |
| `torch` | installable from PyPI (2.14.0+cu130, 5.3 GB) but `cuda: False` |
| RAM / cores | 3.8 GiB / 2 threads — SDXL needs ~10 GiB even on CPU |
| `huggingface.co`, `civitai.com` (checkpoint hosts) | unreachable (000) |
Conclusion: no weights can be downloaded and no sampler can run here. The
images currently on the site were produced with the platform's generator; this
kit is the owner-side path to a stronger, reproducible set.

## Run it on a machine with a GPU (6 GB+ VRAM for SDXL, 12 GB+ recommended)
```bash
git clone https://github.com/Comfy-Org/ComfyUI.git && cd ComfyUI
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# one checkpoint into ComfyUI/models/checkpoints/, e.g. RealVisXL V5.0 or
# SDXL base 1.0 from Hugging Face / Civitai; put its filename in
# workflow_food_sdxl.json node "1" ckpt_name
python main.py            # server on 127.0.0.1:8188
# in a second shell, from this folder:
python3 run_food_set.py --api http://127.0.0.1:8188 \
        --site ../antonias/assets/img
```
The runner reads `slots.json` (file, exact pixel size, prompt), patches the
workflow per slot, queues it over the ComfyUI HTTP API, waits for the render,
then post-processes each result (resize/centre-crop to the slot's true aspect,
q82 progressive JPEG, metadata stripped) and writes it straight onto the site
filename. `--dry-run` prints the plan without touching anything.

## Rules the set obeys (mirrors HANDOFF §6/§10)
- Every slot's pixel size is the aspect its CSS box actually uses; never stretch.
- Wheel slices: 8 prompts, 8 distinct dishes, label == photo content.
- Storefronts, patio and logo are NEVER generated — they are photographs of
  real places and the real brand mark. This kit only covers food.
- Prices appear in no prompt and no output.
