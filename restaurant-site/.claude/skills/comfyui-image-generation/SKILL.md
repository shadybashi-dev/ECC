---
name: comfyui
description: Control a local ComfyUI instance to generate images, videos, and audio via its REST API. Use this skill whenever the user mentions ComfyUI, wants to generate or create AI images, videos, or audio, asks about Stable Diffusion, SDXL, or Flux workflows, wants to queue or manage generation tasks, needs to check available models or GPU status, or mentions anything related to AI media generation with a local setup. Also trigger when the user says things like "generate an image", "create a picture of", "make me a video of", "upscale this image", "do img2img", "inpaint", or similar — they have ComfyUI as their local generation backend.
---

# ComfyUI Integration

Control a local ComfyUI instance at `http://127.0.0.1:8188` to generate images, videos, and audio.

## CLI Script

All API operations go through the CLI script. Find it at `scripts/comfyui_api.py` within this skill's directory. All output is JSON.

```bash
SCRIPT="<this_skill_directory>/scripts/comfyui_api.py"

# Lifecycle — start/stop ComfyUI from the skill
python $SCRIPT start                     # launch ComfyUI, wait until API ready
python $SCRIPT start --exe "C:\path\to\ComfyUI.exe"  # custom exe path
python $SCRIPT stop                      # kill ComfyUI process

# System
python $SCRIPT status                    # GPU info, ComfyUI version, memory
python $SCRIPT models                    # list model folder categories
python $SCRIPT models checkpoints        # list available checkpoints
python $SCRIPT models loras              # list LoRAs
python $SCRIPT nodes                     # list all node types (name → category)
python $SCRIPT nodes KSampler            # inspect a node's inputs/outputs

# Generate (quick txt2img)
python $SCRIPT generate \
  --prompt "a cat in space" \
  --negative "blurry, low quality" \
  --checkpoint "model.safetensors" \
  --width 1024 --height 1024 \
  --steps 20 --cfg 7.0 \
  --wait --save-to ./output/

# Run any workflow JSON
python $SCRIPT run workflow.json --wait --save-to ./output/

# File operations
python $SCRIPT upload image.png          # upload to ComfyUI input dir
python $SCRIPT download ComfyUI_00001_.png --save-to ./

# Queue management
python $SCRIPT queue                     # show running & pending
python $SCRIPT interrupt                 # stop current generation
python $SCRIPT clear-queue               # clear all pending
python $SCRIPT free                      # unload models, free VRAM

# History
python $SCRIPT history                   # all recent generations
python $SCRIPT history <prompt_id>       # specific generation details
```

## Standard Workflow

### Step 1 — Ensure ComfyUI is running
Try connecting first. If ComfyUI is not running, start it automatically:
```bash
python $SCRIPT status
# If this fails:
python $SCRIPT start
```
The `start` command auto-detects the ComfyUI executable on Windows, launches it, and waits until the API is ready. In WSL2 it uses PowerShell to launch the Windows process.

### Step 2 — Discover available assets
Check what models the user has before building a workflow:
```bash
python $SCRIPT models checkpoints
python $SCRIPT models loras
python $SCRIPT models vae
```

### Step 3 — Generate

**Text-to-image (simple):** Use the `generate` subcommand. Pick a checkpoint from the list in step 2. Choose dimensions appropriate for the model (512x512 for SD1.5, 1024x1024 for SDXL/Flux).

**Complex workflows (img2img, inpainting, video, audio, ControlNet, etc.):** Build a workflow JSON and use `run`. See the section below on building workflows.

### Step 4 — Retrieve results
If you used `--wait --save-to`, files are already downloaded. Otherwise:
```bash
python $SCRIPT history <prompt_id>   # find output filenames
python $SCRIPT download <filename> --save-to ./output/
```
After downloading, use the Read tool to display the image to the user.

## Building Custom Workflow JSON

ComfyUI workflows in API format are flat dictionaries of nodes. Each node has a string ID, a `class_type`, and `inputs`. Nodes connect via links: `["source_node_id", output_index]`.

### Discovering nodes

The user's ComfyUI instance may have custom nodes for video generation (AnimateDiff, SVD, CogVideo), audio (AudioCraft), or other tasks. Discover what's available:

```bash
python $SCRIPT nodes                         # full list
python $SCRIPT nodes AnimateDiff             # inspect specific node
python $SCRIPT nodes VideoLinearCFGGuidance  # another example
```

Use the node's `input.required` and `input.optional` fields to understand what parameters and connections each node needs. The `output` array tells you what types it produces and at which index.

### Workflow structure

```json
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {"ckpt_name": "model.safetensors"}
  },
  "2": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "a beautiful landscape", "clip": ["1", 1]}
  }
}
```

Key rules:
- Node IDs are strings ("1", "2", etc.)
- Literal values: `"text": "hello"`, `"seed": 42`
- Links to other nodes: `"model": ["1", 0]` means "output index 0 of node 1"
- `CheckpointLoaderSimple` outputs: index 0 = MODEL, 1 = CLIP, 2 = VAE

### Image-to-image workflow

For img2img, first upload the input image, then build a workflow that uses `LoadImage` instead of `EmptyLatentImage`:

```bash
python $SCRIPT upload input.png
```

Then in the workflow JSON, use:
```json
{
  "10": {
    "class_type": "LoadImage",
    "inputs": {"image": "input.png"}
  },
  "11": {
    "class_type": "VAEEncode",
    "inputs": {"pixels": ["10", 0], "vae": ["1", 2]}
  }
}
```
And set `denoise` < 1.0 in KSampler (e.g., 0.6-0.8 for moderate changes).

### Inpainting workflow

Upload both the image and a mask:
```bash
python $SCRIPT upload photo.png
python $SCRIPT upload mask.png
```
Use `LoadImage` for both and connect them to `SetLatentNoiseMask` or inpainting-specific nodes.

### Upscaling workflow

Check available upscale models:
```bash
python $SCRIPT models upscale_models
```
Use nodes like `UpscaleModelLoader` and `ImageUpscaleWithModel`.

### Video & audio workflows

These depend on installed custom nodes. First discover what's available:
```bash
python $SCRIPT nodes | python3 -c "import sys,json; d=json.load(sys.stdin); [print(k) for k in d if any(w in k.lower() for w in ['video','animate','svd','cog','audio','music'])]"
```
Then inspect the relevant nodes and build the workflow accordingly.

## Modifying Workflow Parameters

When the user wants to tweak a generation (change prompt, seed, model, etc.):

1. Read the workflow JSON file
2. Find the target node by `class_type`
3. Update the `inputs` values
4. Save and re-run

Common node types and their key inputs:
| Node | Input | What it controls |
|------|-------|-----------------|
| `CLIPTextEncode` | `text` | Prompt text |
| `CheckpointLoaderSimple` | `ckpt_name` | Model/checkpoint |
| `EmptyLatentImage` | `width`, `height` | Image dimensions |
| `KSampler` | `seed` | Reproducibility (random int for random) |
| `KSampler` | `steps` | Quality/detail (15-50 typical) |
| `KSampler` | `cfg` | Prompt adherence (5-12 typical) |
| `KSampler` | `sampler_name` | Sampling algorithm |
| `KSampler` | `denoise` | Strength (1.0 = full, <1.0 for img2img) |
| `SaveImage` | `filename_prefix` | Output filename pattern |
| `LoraLoader` | `lora_name`, `strength_model` | LoRA selection & weight |

## Error Handling

- **Connection refused**: ComfyUI is not running. Start it with `python $SCRIPT start`.
- **Node errors in queue response**: The workflow JSON has invalid node connections or missing inputs. Check `node_errors` in the response.
- **Model not found**: The checkpoint/LoRA name doesn't match an available file. List models and suggest the closest match.
- **Out of memory**: Use `python $SCRIPT free` to unload models, then retry with smaller dimensions or fewer steps.
- **Timeout**: Generation is taking too long. Check `python $SCRIPT queue` for status. For video generation, increase `--timeout`.

## API Reference

For the complete API endpoint reference (all HTTP methods, parameters, and response formats), read `references/api-reference.md`.

For example workflow JSON templates, read `references/workflow-patterns.md`.
