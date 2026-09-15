#!/usr/bin/env python3
"""
ComfyUI Food Generator for Antonia's Pizzeria & Italian Kitchen
Agent-to-ComfyUI Integration — FLUX.1-dev / SDXL with Food LoRA + Ultimate SD Upscale

See /scripts/comfy_food_gen.py for full implementation — this is a symlink-friendly wrapper.

Usage from this folder:
  python3 comfy_food_gen.py --workflow flux --slot ajarski-original --api http://127.0.0.1:8188
  python3 comfy_food_gen.py --workflow sdxl_v2 --all --dry-run
"""

import sys
from pathlib import Path
# Import main from scripts/comfy_food_gen.py
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "scripts"))
from comfy_food_gen import main

if __name__ == "__main__":
    sys.exit(main())
