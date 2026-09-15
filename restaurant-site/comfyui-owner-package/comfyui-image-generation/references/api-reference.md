# ComfyUI API Reference

Base URL: `http://127.0.0.1:8188`

## Endpoints

### POST /prompt
Queue a workflow for execution.

**Body:**
```json
{
  "client_id": "uuid-string",
  "prompt": { ...workflow nodes... },
  "extra_data": {"extra_pnginfo": {"workflow": {}}},
  "front": false
}
```

**Response:**
```json
{"prompt_id": "uuid", "number": 5, "node_errors": {}}
```
Non-empty `node_errors` means validation failed — the workflow won't execute.

### GET /queue
```json
{
  "queue_running": [[number, prompt_id, prompt, extra_data, output_nodes]],
  "queue_pending": [[number, prompt_id, prompt, extra_data, output_nodes]]
}
```

### POST /queue
Delete items or clear: `{"delete": ["prompt_id"]}` or `{"clear": true}`

### GET /history
### GET /history/{prompt_id}
Optional: `?max_items=N`

```json
{
  "prompt_id": {
    "prompt": [...],
    "outputs": {
      "node_id": {
        "images": [{"filename": "ComfyUI_00001_.png", "subfolder": "", "type": "output"}]
      }
    },
    "status": {"status_str": "success", "completed": true}
  }
}
```

### POST /history
Delete or clear: `{"delete": ["prompt_id"]}` or `{"clear": true}`

### GET /view
Retrieve a generated/uploaded file as binary.

**Params:** `filename` (required), `subfolder`, `type` (output|input|temp), `preview` (e.g. "jpeg;quality=80")

### POST /upload/image
Upload file to input directory. Multipart form with fields: `image` (file), `subfolder`, `overwrite` ("true"/"false"), `type` (input|temp|output).

**Response:** `{"name": "actual_filename.png", "subfolder": "", "type": "input"}`

### POST /upload/mask
Same as /upload/image but for masks. Extra field: `original_ref` (JSON string).

### GET /system_stats
```json
{
  "system": {"os": "...", "python_version": "...", "comfyui_version": "..."},
  "devices": [{"name": "cuda:0 ...", "type": "cuda", "vram_total": N, "vram_free": N}]
}
```

### GET /object_info
### GET /object_info/{node_class}
Full schema of available node types — inputs (required/optional), outputs, category.

Input types: `["MODEL"]` = link type, `["INT", {"default":0, "min":0, "max":999}]` = value with constraints, `[["euler","heun",...]]` = enum/dropdown.

### GET /models
List model folder categories: `["checkpoints", "loras", "vae", "controlnet", ...]`

### GET /models/{folder}
List files in a model folder: `["model1.safetensors", "model2.ckpt", ...]`

### GET /embeddings
List available embedding files.

### POST /interrupt
Stop the currently running generation immediately.

### POST /free
Body: `{"unload_models": true, "free_memory": true}`

## WebSocket

`ws://127.0.0.1:8188/ws?clientId={uuid}`

Message types:
- `status` — queue count changes
- `execution_start` — prompt begins
- `execution_cached` — cached node IDs
- `executing` — current node (null = done)
- `progress` — step-by-step (`value`/`max`)
- `executed` — output node result (images, etc.)
- `execution_success` / `execution_error` / `execution_interrupted`

## Workflow API Format

Flat dict of nodes keyed by string IDs:
```json
{
  "node_id": {
    "class_type": "NodeName",
    "inputs": {
      "literal_param": "value",
      "linked_param": ["other_node_id", output_index]
    }
  }
}
```

Output indices come from the node's `output` array in `/object_info`. Example: `CheckpointLoaderSimple` outputs `[MODEL, CLIP, VAE]` → indices 0, 1, 2.
