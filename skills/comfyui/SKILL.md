---
name: comfyui
description: Operate ComfyUI as a local or remote node-graph backend for image and video generation. Use when installing, starting, troubleshooting, or driving ComfyUI workflows through its API, including queueing prompts, uploading inputs, monitoring jobs, and downloading outputs.
metadata:
  origin: ECC
  tags: comfyui, diffusion, image-generation, video-generation, workflows, api
allowed-tools: Read, Grep, Glob, Bash(curl:*), Bash(python:*)
argument-hint: "[ComfyUI task or workflow description]"
---

# ComfyUI

Use [shadybashi-dev/ComfyUI](https://github.com/shadybashi-dev/ComfyUI) as the repository source. It is a fork of [Comfy-Org/ComfyUI](https://github.com/Comfy-Org/ComfyUI), so confirm the requested fork or upstream revision before pinning a deployment.

ComfyUI is a node-graph UI and API for diffusion-based image and video workflows. This skill covers the agent-facing workflow: prepare a valid API-format graph, submit it, observe the queue, retrieve output metadata, and download the generated files.

## When to Use

- Install or start ComfyUI locally.
- Run an existing ComfyUI workflow from an API-format JSON graph.
- Generate an image or video from a prompt with a user-approved workflow.
- Upload an input image, mask, or other explicitly requested asset.
- Inspect queue state, prompt history, node metadata, or output files.
- Diagnose missing models, invalid node inputs, stalled queues, or failed prompts.

Do not use this skill to silently install custom nodes, download large model checkpoints, or expose ComfyUI to the public internet.

## Security and Operational Rules

1. **Keep the server private by default.** Use `127.0.0.1` unless the user explicitly requests LAN access. If remote access is required, use an authenticated, access-controlled tunnel or reverse proxy; do not bind an unauthenticated ComfyUI server to `0.0.0.0`.
2. **Treat workflows and custom nodes as executable input.** Review unfamiliar workflows and custom-node repositories before running them. Do not install or execute arbitrary Python, shell, or model-management commands without explicit user approval.
3. **Never expose secrets.** Do not put API keys, tokens, credentials, or private file paths in workflow JSON, prompts, logs, screenshots, or generated artifacts.
4. **Use explicit paths.** Only upload files the user named or approved. Store generated outputs in a known workspace directory and report the exact path.
5. **Prefer the API over UI automation.** The API is deterministic and easier to verify. Use the browser UI only when the user specifically needs a visual interaction or the required operation has no API path.
6. **Do not claim success from a queued prompt.** A prompt ID only proves that the server accepted a request. Wait for history/output and verify the downloaded file exists.
7. **Keep model downloads deliberate.** Check disk space and the model's source/license before downloading a checkpoint, VAE, LoRA, ControlNet model, or custom node.

## Configuration

Use an environment variable for the server URL instead of hard-coding a host in scripts:

```bash
export COMFYUI_BASE_URL="${COMFYUI_BASE_URL:-http://127.0.0.1:8188}"
curl --fail-with-body "$COMFYUI_BASE_URL/system_stats"
```

`COMFYUI_BASE_URL` may point to a user-approved remote server. Do not assume that a URL reachable from the agent is reachable from the user's browser, or vice versa.

## Installation and Startup

The fork's working tree should be kept separate from ECC. Do not clone ComfyUI inside this repository unless the user explicitly requests a vendored checkout.

```bash
git clone https://github.com/shadybashi-dev/ComfyUI.git "$HOME/ComfyUI"
cd "$HOME/ComfyUI"
python3 -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python main.py --listen 127.0.0.1 --port 8188
```

Use the platform-specific launch instructions from the ComfyUI repository when a portable package, GPU runtime, or OS-specific dependency is needed. Confirm the process is healthy before submitting a workflow:

```bash
curl --fail-with-body "$COMFYUI_BASE_URL/system_stats"
curl --fail-with-body "$COMFYUI_BASE_URL/queue"
```

If ComfyUI is already installed, inspect the existing checkout and Python environment before reinstalling dependencies. Never overwrite an existing environment or custom-node directory without permission.

## Workflow Formats

ComfyUI commonly exposes two JSON shapes:

- **API format:** a map of node IDs to objects with `class_type` and `inputs`. Use this with `POST /prompt`.
- **UI/workflow format:** includes canvas metadata, links, and node positions. It is useful for the UI but is not the direct `/prompt` payload.

Use the workflow's API/export format for automation. Confirm every referenced node type exists on the target server before queueing:

```bash
curl --fail-with-body "$COMFYUI_BASE_URL/object_info" > /tmp/comfyui-object-info.json
```

Do not fabricate node class names or input keys. Start from a user-provided API workflow or a workflow exported by the running server, then change only the requested inputs.

## Queue a Workflow

A minimal API request contains a workflow graph under `prompt`. Generate a unique `client_id` for each session and preserve the returned `prompt_id`:

```bash
python - <<'PY'
import json
import os
import uuid
import urllib.request

base_url = os.environ.get("COMFYUI_BASE_URL", "http://127.0.0.1:8188").rstrip("/")
workflow_path = "workflow_api.json"
with open(workflow_path, encoding="utf-8") as handle:
    workflow = json.load(handle)

payload = json.dumps({
    "prompt": workflow,
    "client_id": str(uuid.uuid4()),
}).encode("utf-8")
request = urllib.request.Request(
    f"{base_url}/prompt",
    data=payload,
    headers={"Content-Type": "application/json"},
)
with urllib.request.urlopen(request, timeout=30) as response:
    result = json.load(response)

if "error" in result or "prompt_id" not in result:
    raise RuntimeError(f"ComfyUI rejected the workflow: {result}")
print(result["prompt_id"])
PY
```

Before submitting, verify that:

- the workflow is API format;
- all input and output paths are intentional;
- the requested prompt, seed, dimensions, sampler, and model are set;
- the referenced checkpoint and custom nodes are installed;
- the workflow does not contain unexpected executable or network-related nodes.

## Monitor and Retrieve Results

Poll history using the returned prompt ID. Treat `status.completed` or an output entry as success, and surface node-level errors when present:

```bash
PROMPT_ID="replace-with-the-queued-prompt-id"
curl --fail-with-body "$COMFYUI_BASE_URL/history/$PROMPT_ID"
```

For long jobs, poll with a bounded timeout rather than looping forever. A safe polling loop should:

1. wait between requests;
2. stop when the prompt is complete or failed;
3. report the last queue/history response on timeout;
4. avoid printing the entire workflow or sensitive input metadata.

Completed history normally includes output metadata such as `filename`, `subfolder`, and `type`. Download an output through `/view` using URL encoding:

```bash
python - <<'PY'
import os
import urllib.parse
import urllib.request

base_url = os.environ.get("COMFYUI_BASE_URL", "http://127.0.0.1:8188").rstrip("/")
filename = "output.png"       # replace with verified history metadata
subfolder = ""                # replace with verified history metadata
type_name = "output"          # replace with verified history metadata
query = urllib.parse.urlencode({
    "filename": filename,
    "subfolder": subfolder,
    "type": type_name,
})
output_path = "comfyui-output.png"
with urllib.request.urlopen(f"{base_url}/view?{query}", timeout=60) as response:
    with open(output_path, "wb") as handle:
        handle.write(response.read())
print(output_path)
PY
```

Verify the file type, size, and path after downloading. For images, inspect dimensions when possible. For video, confirm the container and duration before presenting it as complete.

## Upload an Input Asset

Only upload an explicitly approved local file. Use the server's upload endpoint and keep the returned filename/subfolder values; those values are what the workflow's `LoadImage` or equivalent node should reference:

```bash
curl --fail-with-body \
  -F "image=@/absolute/path/to/approved-input.png" \
  -F "overwrite=true" \
  "$COMFYUI_BASE_URL/upload/image"
```

Do not upload `.env` files, SSH keys, source repositories, or unrelated workspace files. Check the response before queueing the workflow.

## Troubleshooting Matrix

| Symptom | Checks |
|---|---|
| Connection refused | Confirm the ComfyUI process, host, port, and `COMFYUI_BASE_URL`; then check `/system_stats`. |
| `invalid_prompt` | Read the returned node errors; compare `class_type` and input names with `/object_info`. |
| Missing checkpoint/model | Inspect the server's configured model directories and install only an approved, compatible model. |
| Custom node missing | Confirm the node package is installed in the target ComfyUI checkout and restart the server; do not auto-install unknown code. |
| Job remains queued | Check `/queue`, GPU/resource utilization, and other running prompts; use a timeout and preserve the prompt ID. |
| Output not found | Fetch `/history/{prompt_id}` again, use its exact `filename`/`subfolder`/`type`, and verify the server output directory. |
| OOM or CUDA failure | Reduce resolution/batch size, release other jobs, or choose an approved lower-memory workflow; do not silently change the requested quality target. |
| NSFW or policy refusal | Report the server/model result accurately; do not bypass safety controls or replace the model without approval. |

## Completion Report

For every generated asset, report:

- ComfyUI server used (local or approved remote, without credentials);
- workflow name or path and the relevant model/checkpoint;
- prompt ID and final status;
- output path(s), media type, and basic dimensions/duration when available;
- any warnings, missing nodes, substitutions, or unresolved failures.

Never report only “generated” when the job is merely queued.
