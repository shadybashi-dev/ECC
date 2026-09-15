# comfyui-claude-skill

> **Generate images, videos, and audio from your terminal.** Tell Claude what you want in natural language — ComfyUI does the rest.

---

No browser. No node editor. No dragging wires. Just say what you want:

```
> generate a medieval castle at sunset, cinematic lighting, 8k
> start comfyui and create a cyberpunk cityscape, 1024x1024
> upscale the last image with 4x model
> list my checkpoints and LoRAs
```

Claude Code talks to your local ComfyUI instance through a lightweight Python CLI — 15 commands, zero dependencies, full control.

## Demo

```
You: "genera un astronauta su Marte, stile oil painting"

Claude Code:
├── Checks ComfyUI status (not running)
├── Starts ComfyUI automatically
├── Discovers available checkpoints
├── Picks the best model for the task
├── Builds workflow JSON
├── Queues generation
├── Waits for completion
├── Downloads the image
└── Shows you the result
```

Everything automated. You just describe what you want.

## What You Can Do

| Command | What it does |
|---------|-------------|
| `start` / `stop` | Launch and kill ComfyUI from the terminal |
| `status` | GPU info, VRAM usage, ComfyUI version |
| `models` | List checkpoints, LoRAs, VAEs, upscale models |
| `nodes` | Inspect any node type (inputs, outputs, options) |
| `generate` | One-command txt2img with all parameters |
| `run` | Execute any ComfyUI workflow JSON |
| `upload` / `download` | Move images in and out |
| `queue` | View running and pending jobs |
| `interrupt` | Stop current generation |
| `free` | Unload all models, reclaim VRAM |
| `history` | Browse past generations |

All output is JSON. Easy to chain, parse, and automate.

## Quick Start

### 1. Install

```bash
mkdir -p ~/.claude/commands

# Download the skill
curl -o ~/.claude/commands/comfyui.md \
  https://raw.githubusercontent.com/MastroMimmo/comfyui-claude-skill/main/SKILL.md

# Clone the CLI tool
git clone https://github.com/MastroMimmo/comfyui-claude-skill.git ~/comfyui-skill
```

Update the script path in `~/.claude/commands/comfyui.md`:
```
SCRIPT="~/comfyui-skill/scripts/comfyui_api.py"
```

### 2. Use

Open Claude Code and talk naturally:

```
"generate a photo of a golden retriever in a field of sunflowers"
"show me what checkpoints I have"
"create a 4-image grid of different art styles"
"run my custom workflow.json"
```

Or invoke with `/comfyui`.

## WSL2 — It Just Works

The biggest pain point with ComfyUI on Windows + WSL2: localhost networking. ComfyUI listens on Windows, but your terminal runs in Linux. Nothing connects.

**This skill solves it automatically.** No `--listen 0.0.0.0`, no firewall rules, no IP hunting.

How:
1. Tries direct connection to `127.0.0.1:8188`
2. If that fails, detects WSL2 via `/proc/version`
3. Routes API calls through Windows `curl.exe` — reaches Windows localhost natively

ComfyUI runs with default settings. The skill handles the rest.

## RTX 50-Series (Blackwell) Support

RTX 5070 / 5080 / 5090 need PyTorch with CUDA 12.8+ and `sm_120` architecture support:

```bash
pip install torch torchvision torchaudio \
  --index-url https://download.pytorch.org/whl/cu128 \
  --force-reinstall
```

Also remove `xformers` — it doesn't support Blackwell yet.

## Building Custom Workflows

The skill isn't limited to txt2img. You can build and run any ComfyUI workflow:

**img2img** — Upload an image, encode with VAE, denoise at 0.6-0.8
**Inpainting** — Upload image + mask, use inpainting-specific nodes
**Upscaling** — Load upscale model, run `ImageUpscaleWithModel`
**Video** — AnimateDiff, SVD, CogVideo (if custom nodes installed)
**Audio** — AudioCraft nodes (if installed)

Discover what's available:
```bash
python comfyui_api.py nodes                    # List all node types
python comfyui_api.py nodes AnimateDiff        # Inspect specific node
python comfyui_api.py models upscale_models    # List upscale models
```

## Project Structure

```
comfyui-claude-skill/
├── SKILL.md                    # Skill instructions (copy to ~/.claude/commands/)
├── scripts/
│   └── comfyui_api.py          # CLI tool — Python stdlib only, zero deps
└── references/
    ├── api-reference.md         # ComfyUI REST API docs
    └── workflow-patterns.md     # Workflow JSON templates
```

## Requirements

- Python 3.8+ (standard library only — no pip install needed)
- [ComfyUI](https://github.com/comfyanonymous/ComfyUI) running locally (default port 8188)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

## Credits

- **[ComfyUI](https://github.com/comfyanonymous/ComfyUI)** — The powerful node-based UI for Stable Diffusion that makes all of this possible

## License

MIT — see [LICENSE](LICENSE).
