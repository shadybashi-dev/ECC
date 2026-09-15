# ComfyUI Workflow Patterns

Ready-to-use workflow templates in API format. Replace placeholder values with real model names and prompts.

## Text-to-Image (SD 1.5 / SDXL)

```json
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {"ckpt_name": "MODEL_NAME.safetensors"}
  },
  "2": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "POSITIVE PROMPT", "clip": ["1", 1]}
  },
  "3": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "NEGATIVE PROMPT", "clip": ["1", 1]}
  },
  "4": {
    "class_type": "EmptyLatentImage",
    "inputs": {"width": 512, "height": 512, "batch_size": 1}
  },
  "5": {
    "class_type": "KSampler",
    "inputs": {
      "seed": 42,
      "steps": 20,
      "cfg": 7.0,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1.0,
      "model": ["1", 0],
      "positive": ["2", 0],
      "negative": ["3", 0],
      "latent_image": ["4", 0]
    }
  },
  "6": {
    "class_type": "VAEDecode",
    "inputs": {"samples": ["5", 0], "vae": ["1", 2]}
  },
  "7": {
    "class_type": "SaveImage",
    "inputs": {"filename_prefix": "ComfyUI", "images": ["6", 0]}
  }
}
```

**Dimensions guide:**
- SD 1.5: 512x512, 512x768, 768x512
- SDXL: 1024x1024, 1024x768, 768x1024, 1152x896
- Flux: 1024x1024, 1280x720, 720x1280

## Image-to-Image

Upload the source image first, then use this workflow. Set `denoise` between 0.3 (subtle) and 0.8 (major changes).

```json
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {"ckpt_name": "MODEL_NAME.safetensors"}
  },
  "2": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "POSITIVE PROMPT", "clip": ["1", 1]}
  },
  "3": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "NEGATIVE PROMPT", "clip": ["1", 1]}
  },
  "10": {
    "class_type": "LoadImage",
    "inputs": {"image": "UPLOADED_FILENAME.png"}
  },
  "11": {
    "class_type": "VAEEncode",
    "inputs": {"pixels": ["10", 0], "vae": ["1", 2]}
  },
  "5": {
    "class_type": "KSampler",
    "inputs": {
      "seed": 42,
      "steps": 20,
      "cfg": 7.0,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 0.65,
      "model": ["1", 0],
      "positive": ["2", 0],
      "negative": ["3", 0],
      "latent_image": ["11", 0]
    }
  },
  "6": {
    "class_type": "VAEDecode",
    "inputs": {"samples": ["5", 0], "vae": ["1", 2]}
  },
  "7": {
    "class_type": "SaveImage",
    "inputs": {"filename_prefix": "img2img", "images": ["6", 0]}
  }
}
```

## Upscaling (with model)

```json
{
  "1": {
    "class_type": "LoadImage",
    "inputs": {"image": "INPUT_IMAGE.png"}
  },
  "2": {
    "class_type": "UpscaleModelLoader",
    "inputs": {"model_name": "UPSCALE_MODEL.pth"}
  },
  "3": {
    "class_type": "ImageUpscaleWithModel",
    "inputs": {"upscale_model": ["2", 0], "image": ["1", 0]}
  },
  "4": {
    "class_type": "SaveImage",
    "inputs": {"filename_prefix": "upscaled", "images": ["3", 0]}
  }
}
```

## With LoRA

Insert a LoRA loader between checkpoint and the rest of the pipeline:

```json
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {"ckpt_name": "MODEL_NAME.safetensors"}
  },
  "8": {
    "class_type": "LoraLoader",
    "inputs": {
      "lora_name": "LORA_NAME.safetensors",
      "strength_model": 0.8,
      "strength_clip": 0.8,
      "model": ["1", 0],
      "clip": ["1", 1]
    }
  },
  "2": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "POSITIVE PROMPT", "clip": ["8", 1]}
  },
  "3": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "NEGATIVE PROMPT", "clip": ["8", 1]}
  },
  "4": {
    "class_type": "EmptyLatentImage",
    "inputs": {"width": 1024, "height": 1024, "batch_size": 1}
  },
  "5": {
    "class_type": "KSampler",
    "inputs": {
      "seed": 42,
      "steps": 20,
      "cfg": 7.0,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1.0,
      "model": ["8", 0],
      "positive": ["2", 0],
      "negative": ["3", 0],
      "latent_image": ["4", 0]
    }
  },
  "6": {
    "class_type": "VAEDecode",
    "inputs": {"samples": ["5", 0], "vae": ["1", 2]}
  },
  "7": {
    "class_type": "SaveImage",
    "inputs": {"filename_prefix": "lora_output", "images": ["6", 0]}
  }
}
```

Note: when using LoRA, the model and clip outputs come from the LoraLoader node (8), not the checkpoint (1). The VAE still comes from the checkpoint (["1", 2]).

## Inpainting

```json
{
  "1": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {"ckpt_name": "INPAINT_MODEL.safetensors"}
  },
  "10": {
    "class_type": "LoadImage",
    "inputs": {"image": "SOURCE_IMAGE.png"}
  },
  "11": {
    "class_type": "LoadImage",
    "inputs": {"image": "MASK_IMAGE.png"}
  },
  "12": {
    "class_type": "VAEEncode",
    "inputs": {"pixels": ["10", 0], "vae": ["1", 2]}
  },
  "13": {
    "class_type": "SetLatentNoiseMask",
    "inputs": {"samples": ["12", 0], "mask": ["11", 1]}
  },
  "2": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "WHAT TO PAINT IN MASKED AREA", "clip": ["1", 1]}
  },
  "3": {
    "class_type": "CLIPTextEncode",
    "inputs": {"text": "NEGATIVE PROMPT", "clip": ["1", 1]}
  },
  "5": {
    "class_type": "KSampler",
    "inputs": {
      "seed": 42,
      "steps": 25,
      "cfg": 7.0,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 0.9,
      "model": ["1", 0],
      "positive": ["2", 0],
      "negative": ["3", 0],
      "latent_image": ["13", 0]
    }
  },
  "6": {
    "class_type": "VAEDecode",
    "inputs": {"samples": ["5", 0], "vae": ["1", 2]}
  },
  "7": {
    "class_type": "SaveImage",
    "inputs": {"filename_prefix": "inpaint", "images": ["6", 0]}
  }
}
```

Note: LoadImage outputs `[IMAGE, MASK]` — index 0 is the image pixels, index 1 is the alpha/mask channel. For the mask image at node 11, we use output index 1 to get the mask data.
