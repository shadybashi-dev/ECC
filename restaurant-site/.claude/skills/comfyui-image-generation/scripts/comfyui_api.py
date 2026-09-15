#!/usr/bin/env python3
"""ComfyUI API Client - CLI tool for interacting with a local ComfyUI instance.

All output is JSON for easy parsing. Uses only Python stdlib (no pip dependencies).
Auto-detects WSL2 and routes API calls through Windows curl.exe when needed,
so ComfyUI doesn't need --listen 0.0.0.0 or any special configuration.
"""

import argparse
import json
import mimetypes
import os
import random
import subprocess
import sys
import time
import uuid
import urllib.request
import urllib.parse
import urllib.error

BASE = "http://127.0.0.1:8188"
USE_CURL_EXE = False
CURL_EXE = "/mnt/c/Windows/System32/curl.exe"


# ── Environment detection ────────────────────────────────────────────

def is_wsl():
    try:
        with open("/proc/version", "r") as f:
            return "microsoft" in f.read().lower()
    except OSError:
        return False


def probe_urllib(url, timeout=3):
    try:
        urllib.request.urlopen(url, timeout=timeout)
        return True
    except Exception:
        return False


def probe_curl_exe(url, timeout=3):
    if not os.path.exists(CURL_EXE):
        return False
    try:
        r = subprocess.run(
            [CURL_EXE, "-s", "--max-time", str(timeout), url],
            capture_output=True, timeout=timeout + 3
        )
        return r.returncode == 0 and len(r.stdout) > 2
    except Exception:
        return False


def auto_detect_host(port):
    """Find ComfyUI automatically. In WSL2, falls back to curl.exe to reach Windows localhost."""
    global USE_CURL_EXE

    test_url = f"http://127.0.0.1:{port}/system_stats"

    # Direct connection (native Linux/Mac/Windows, or WSL2 with mirrored networking)
    if probe_urllib(test_url):
        return "127.0.0.1"

    if is_wsl():
        # Use Windows curl.exe to reach Windows localhost — no config changes needed
        if probe_curl_exe(test_url):
            USE_CURL_EXE = True
            return "127.0.0.1"

        print(json.dumps({
            "error": "Cannot reach ComfyUI.",
            "hint": "Make sure ComfyUI is running on Windows (port 8188)."
        }))
        sys.exit(1)

    print(json.dumps({"error": f"Cannot connect to ComfyUI at {test_url}. Is it running?"}))
    sys.exit(1)


def set_base(host, port):
    global BASE
    BASE = f"http://{host}:{port}"


# ── HTTP layer ───────────────────────────────────────────────────────
# Two backends: urllib (direct) or curl.exe (WSL2 → Windows proxy).

def _wsl_win_path(posix_path):
    """Convert a WSL/Linux path to a Windows path for curl.exe."""
    try:
        r = subprocess.run(
            ["wslpath", "-w", os.path.abspath(posix_path)],
            capture_output=True, text=True, timeout=5
        )
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    except Exception:
        pass
    return posix_path


def get(path):
    url = f"{BASE}{path}"
    try:
        if USE_CURL_EXE:
            r = subprocess.run(
                [CURL_EXE, "-s", "--max-time", "15", url],
                capture_output=True, timeout=20
            )
            if r.returncode != 0:
                raise ConnectionError(r.stderr.decode(errors="replace"))
            return json.loads(r.stdout)
        with urllib.request.urlopen(url, timeout=15) as r:
            return json.loads(r.read())
    except (json.JSONDecodeError, ConnectionError, urllib.error.URLError) as e:
        print(json.dumps({"error": f"Request failed ({url}): {e}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


def post(path, data=None):
    url = f"{BASE}{path}"
    try:
        if USE_CURL_EXE:
            cmd = [CURL_EXE, "-s", "--max-time", "15", "-X", "POST"]
            stdin_data = None
            if data is not None:
                cmd += ["-H", "Content-Type: application/json", "--data-binary", "@-"]
                stdin_data = json.dumps(data).encode()
            cmd.append(url)
            r = subprocess.run(cmd, input=stdin_data, capture_output=True, timeout=20)
            body = r.stdout.strip()
            return json.loads(body) if body else {}
        if data is not None:
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode(),
                headers={"Content-Type": "application/json"},
            )
        else:
            req = urllib.request.Request(url, data=b"", method="POST")
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read()
            return json.loads(body) if body else {}
    except (json.JSONDecodeError, ConnectionError, urllib.error.URLError) as e:
        print(json.dumps({"error": f"Request failed ({url}): {e}"}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


def get_binary(path):
    url = f"{BASE}{path}"
    try:
        if USE_CURL_EXE:
            r = subprocess.run(
                [CURL_EXE, "-s", "--max-time", "60", url],
                capture_output=True, timeout=65
            )
            if r.returncode != 0:
                raise ConnectionError(r.stderr.decode(errors="replace"))
            return r.stdout
        with urllib.request.urlopen(url, timeout=60) as r:
            return r.read()
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


def upload_multipart(filepath, overwrite=False, subfolder=""):
    """Upload a file to ComfyUI. Handles curl.exe path conversion in WSL2."""
    url = f"{BASE}/upload/image"

    if USE_CURL_EXE:
        win_path = _wsl_win_path(filepath)
        cmd = [CURL_EXE, "-s", "--max-time", "60", "-X", "POST",
               "-F", f"image=@{win_path}"]
        if overwrite:
            cmd += ["-F", "overwrite=true"]
        if subfolder:
            cmd += ["-F", f"subfolder={subfolder}"]
        cmd.append(url)
        try:
            r = subprocess.run(cmd, capture_output=True, timeout=65)
            return json.loads(r.stdout)
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.exit(1)

    # urllib multipart
    boundary = uuid.uuid4().hex
    filename = os.path.basename(filepath)
    mime = mimetypes.guess_type(filepath)[0] or "application/octet-stream"

    with open(filepath, "rb") as f:
        file_data = f.read()

    parts = []
    parts.append(
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'
        f"Content-Type: {mime}\r\n\r\n".encode()
        + file_data
    )
    if overwrite:
        parts.append(
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="overwrite"\r\n\r\ntrue'.encode()
        )
    if subfolder:
        parts.append(
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="subfolder"\r\n\r\n{subfolder}'.encode()
        )

    body = b"\r\n".join(parts) + f"\r\n--{boundary}--\r\n".encode()

    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


# ── Wait & download helper ──────────────────────────────────────────

def wait_and_download(prompt_id, save_to=None, timeout=600):
    """Poll /history until prompt completes, then optionally download output files."""
    start = time.time()
    while time.time() - start < timeout:
        history = get(f"/history/{prompt_id}")
        if prompt_id in history:
            entry = history[prompt_id]
            status = entry.get("status", {})
            if status.get("completed") or status.get("status_str") == "error":
                break
        time.sleep(2)
    else:
        return {"error": "Timeout waiting for generation", "prompt_id": prompt_id}

    if status.get("status_str") == "error":
        return {"error": "Generation failed", "status": status}

    outputs = entry.get("outputs", {})
    files = []
    for node_id, node_output in outputs.items():
        for media_key in ("images", "gifs", "audio", "video"):
            if media_key not in node_output:
                continue
            for item in node_output[media_key]:
                filename = item["filename"]
                subfolder = item.get("subfolder", "")
                filetype = item.get("type", "output")
                file_info = {"filename": filename, "subfolder": subfolder, "type": filetype}

                if save_to:
                    os.makedirs(save_to, exist_ok=True)
                    dest = os.path.join(save_to, filename)
                    params = urllib.parse.urlencode(
                        {"filename": filename, "subfolder": subfolder, "type": filetype}
                    )
                    data = get_binary(f"/view?{params}")
                    with open(dest, "wb") as f:
                        f.write(data)
                    file_info["saved_to"] = dest
                    file_info["size_bytes"] = len(data)

                files.append(file_info)
    return files


# ── Commands ─────────────────────────────────────────────────────────

def cmd_status(args):
    print(json.dumps(get("/system_stats"), indent=2))


def cmd_models(args):
    if args.folder:
        print(json.dumps(get(f"/models/{args.folder}"), indent=2))
    else:
        print(json.dumps(get("/models"), indent=2))


def cmd_nodes(args):
    if args.class_type:
        print(json.dumps(get(f"/object_info/{args.class_type}"), indent=2))
    else:
        data = get("/object_info")
        summary = {name: info.get("category", "") for name, info in data.items()}
        print(json.dumps(summary, indent=2))


def cmd_queue(args):
    print(json.dumps(get("/queue"), indent=2))


def cmd_history(args):
    if args.prompt_id:
        print(json.dumps(get(f"/history/{args.prompt_id}"), indent=2))
    else:
        path = "/history"
        if args.max:
            path += f"?max_items={args.max}"
        print(json.dumps(get(path), indent=2))


def cmd_run(args):
    with open(args.workflow, "r") as f:
        workflow = json.load(f)

    if "prompt" in workflow and isinstance(workflow["prompt"], dict):
        payload = workflow
    else:
        payload = {"prompt": workflow}

    client_id = str(uuid.uuid4())
    payload["client_id"] = client_id

    result = post("/prompt", payload)
    prompt_id = result.get("prompt_id")

    if not prompt_id:
        print(json.dumps({"error": "Failed to queue", "details": result}, indent=2))
        return

    info = {"queued": True, "prompt_id": prompt_id}

    if result.get("node_errors"):
        info["node_errors"] = result["node_errors"]

    if args.wait or args.save_to:
        print(json.dumps({"status": "queued, waiting...", "prompt_id": prompt_id}))
        files = wait_and_download(prompt_id, args.save_to, args.timeout)
        info["completed"] = True
        info["files"] = files

    print(json.dumps(info, indent=2))


def cmd_generate(args):
    seed = args.seed if args.seed is not None else random.randint(0, 2**53)

    if not args.checkpoint:
        checkpoints = get("/models/checkpoints")
        if not checkpoints:
            print(json.dumps({"error": "No checkpoints available on this ComfyUI instance"}))
            sys.exit(1)
        checkpoint = checkpoints[0]
        print(json.dumps({"info": f"No --checkpoint given, using: {checkpoint}"}),
              file=sys.stderr)
    else:
        checkpoint = args.checkpoint

    workflow = {
        "1": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {"ckpt_name": checkpoint},
        },
        "2": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": args.prompt, "clip": ["1", 1]},
        },
        "3": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": args.negative or "", "clip": ["1", 1]},
        },
        "4": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "width": args.width,
                "height": args.height,
                "batch_size": args.batch,
            },
        },
        "5": {
            "class_type": "KSampler",
            "inputs": {
                "seed": seed,
                "steps": args.steps,
                "cfg": args.cfg,
                "sampler_name": args.sampler,
                "scheduler": args.scheduler,
                "denoise": 1.0,
                "model": ["1", 0],
                "positive": ["2", 0],
                "negative": ["3", 0],
                "latent_image": ["4", 0],
            },
        },
        "6": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["5", 0], "vae": ["1", 2]},
        },
        "7": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": args.prefix or "ComfyUI",
                "images": ["6", 0],
            },
        },
    }

    client_id = str(uuid.uuid4())
    payload = {"client_id": client_id, "prompt": workflow}
    result = post("/prompt", payload)
    prompt_id = result.get("prompt_id")

    if not prompt_id:
        print(json.dumps({"error": "Failed to queue", "details": result}, indent=2))
        return

    info = {"queued": True, "prompt_id": prompt_id, "seed": seed, "checkpoint": checkpoint}

    if args.wait or args.save_to:
        print(json.dumps({"status": "generating...", "prompt_id": prompt_id, "seed": seed}))
        files = wait_and_download(prompt_id, args.save_to, args.timeout)
        info["completed"] = True
        info["files"] = files

    print(json.dumps(info, indent=2))


def cmd_upload(args):
    filepath = args.file
    if not os.path.exists(filepath):
        print(json.dumps({"error": f"File not found: {filepath}"}))
        sys.exit(1)
    result = upload_multipart(filepath, overwrite=args.overwrite, subfolder=args.subfolder)
    print(json.dumps(result, indent=2))


def cmd_download(args):
    params = urllib.parse.urlencode(
        {"filename": args.filename, "subfolder": args.subfolder or "", "type": args.type or "output"}
    )
    data = get_binary(f"/view?{params}")
    save_path = args.save_to or args.filename
    if os.path.isdir(save_path):
        save_path = os.path.join(save_path, args.filename)
    with open(save_path, "wb") as f:
        f.write(data)
    print(json.dumps({"saved": save_path, "size_bytes": len(data)}))


def cmd_interrupt(args):
    post("/interrupt")
    print(json.dumps({"interrupted": True}))


def cmd_free(args):
    post("/free", {"unload_models": True, "free_memory": True})
    print(json.dumps({"freed": True}))


def cmd_clear_queue(args):
    post("/queue", {"clear": True})
    print(json.dumps({"cleared": "queue"}))


def cmd_clear_history(args):
    post("/history", {"clear": True})
    print(json.dumps({"cleared": "history"}))


# ── Start / Stop (cross-platform) ────────────────────────────────────

import platform as _platform

POWERSHELL = "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe"

# Common install locations — {user} is replaced at runtime
_WIN_SEARCH = [
    r"C:\Users\{user}\Desktop",
    r"C:\Users\{user}",
    r"C:\ComfyUI",
    r"D:\ComfyUI",
]
_UNIX_SEARCH = [
    os.path.expanduser("~/ComfyUI"),
    os.path.expanduser("~/comfyui"),
    os.path.expanduser("~/Desktop/ComfyUI"),
    "/opt/ComfyUI",
]


def _get_platform():
    """Return 'wsl', 'windows', 'mac', or 'linux'."""
    if is_wsl():
        return "wsl"
    s = _platform.system().lower()
    if s == "darwin":
        return "mac"
    if s == "windows":
        return "windows"
    return "linux"


def _find_comfyui_windows():
    """Search for ComfyUI.exe on Windows (from WSL2 or native Windows)."""
    plat = _get_platform()

    if plat == "wsl":
        if not os.path.exists(POWERSHELL):
            return None
        try:
            r = subprocess.run(
                [POWERSHELL, "-Command", "$env:USERNAME"],
                capture_output=True, text=True, timeout=5
            )
            win_user = r.stdout.strip()
        except Exception:
            win_user = os.environ.get("USER", "")

        for pattern in _WIN_SEARCH:
            base = pattern.format(user=win_user)
            wsl_base = "/mnt/" + base[0].lower() + base[2:].replace("\\", "/")
            if not os.path.isdir(wsl_base):
                continue
            for d1 in os.scandir(wsl_base):
                if not d1.is_dir():
                    continue
                exe = os.path.join(d1.path, "ComfyUI", "ComfyUI.exe")
                if os.path.isfile(exe):
                    return base + "\\" + d1.name + "\\ComfyUI\\ComfyUI.exe"
                for d2 in os.scandir(d1.path) if d1.is_dir() else []:
                    if not d2.is_dir():
                        continue
                    exe = os.path.join(d2.path, "ComfyUI", "ComfyUI.exe")
                    if os.path.isfile(exe):
                        return base + "\\" + d1.name + "\\" + d2.name + "\\ComfyUI\\ComfyUI.exe"
        return None

    if plat == "windows":
        user = os.environ.get("USERNAME", "")
        for pattern in _WIN_SEARCH:
            base = pattern.format(user=user)
            if not os.path.isdir(base):
                continue
            for d1 in os.scandir(base):
                if not d1.is_dir():
                    continue
                exe = os.path.join(d1.path, "ComfyUI", "ComfyUI.exe")
                if os.path.isfile(exe):
                    return exe
        return None

    return None


def _find_comfyui_mainpy():
    """Search for ComfyUI main.py on Linux/Mac."""
    for base in _UNIX_SEARCH:
        main = os.path.join(base, "main.py")
        if os.path.isfile(main):
            return main
    return None


def cmd_start(args):
    """Launch ComfyUI and wait until the API is ready. Works on WSL2, Windows, Linux, Mac."""
    port = args.port
    plat = _get_platform()

    # Check if already running
    test_url = f"http://127.0.0.1:{port}/system_stats"
    already_up = probe_urllib(test_url) or (plat == "wsl" and probe_curl_exe(test_url))
    if already_up:
        print(json.dumps({"status": "already_running", "port": port}))
        return

    exe_path = args.exe if hasattr(args, "exe") and args.exe else None
    launch_info = {}

    if plat in ("wsl", "windows"):
        # Windows / WSL2 — find and launch ComfyUI.exe via PowerShell or directly
        if not exe_path:
            exe_path = _find_comfyui_windows()
        if not exe_path:
            print(json.dumps({
                "error": "ComfyUI not found",
                "hint": "Use --exe to specify the path, e.g.: --exe 'C:\\path\\to\\ComfyUI\\ComfyUI.exe'"
            }))
            sys.exit(1)

        launch_info = {"exe": exe_path}

        if plat == "wsl":
            subprocess.run(
                [POWERSHELL, "-Command", f"Start-Process -FilePath '{exe_path}'"],
                capture_output=True, timeout=10
            )
        else:
            subprocess.Popen([exe_path], creationflags=0x00000008)  # DETACHED_PROCESS

    else:
        # Linux / Mac — find main.py and run with python
        if not exe_path:
            exe_path = _find_comfyui_mainpy()
        if not exe_path:
            print(json.dumps({
                "error": "ComfyUI main.py not found",
                "hint": "Use --exe to specify the path, e.g.: --exe '/path/to/ComfyUI/main.py'",
                "searched": _UNIX_SEARCH
            }))
            sys.exit(1)

        launch_info = {"main_py": exe_path}
        comfyui_dir = os.path.dirname(exe_path)

        # Try venv python first, then system python
        venv_python = os.path.join(comfyui_dir, "venv", "bin", "python")
        python_bin = venv_python if os.path.isfile(venv_python) else "python3"

        subprocess.Popen(
            [python_bin, exe_path, "--port", str(port)],
            cwd=comfyui_dir,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )

    print(json.dumps({"status": "starting", **launch_info}))

    # Wait for API to become available
    timeout = args.timeout if hasattr(args, "timeout") and args.timeout else 300
    start_time = time.time()
    while time.time() - start_time < timeout:
        if probe_urllib(test_url) or (plat == "wsl" and probe_curl_exe(test_url, timeout=2)):
            print(json.dumps({"status": "running", "port": port,
                              "startup_seconds": round(time.time() - start_time, 1)}))
            return
        time.sleep(3)

    print(json.dumps({"error": "Timeout waiting for ComfyUI to start",
                       "waited_seconds": timeout}))
    sys.exit(1)


def cmd_stop(args):
    """Stop ComfyUI. Works on WSL2, Windows, Linux, Mac."""
    plat = _get_platform()
    port = args.port

    if plat in ("wsl", "windows") and os.path.exists(POWERSHELL):
        try:
            r = subprocess.run(
                [POWERSHELL, "-Command",
                 "Get-Process ComfyUI -ErrorAction SilentlyContinue | Stop-Process -Force -PassThru | Select-Object -Property Id, ProcessName | ConvertTo-Json"],
                capture_output=True, text=True, timeout=10
            )
            output = r.stdout.strip()
            if output:
                print(json.dumps({"stopped": True, "details": json.loads(output) if output.startswith(("{", "[")) else output}))
                return
            # Fallback: kill by port
            subprocess.run(
                [POWERSHELL, "-Command",
                 f"Get-NetTCPConnection -LocalPort {port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object {{ Stop-Process -Id $_ -Force }}"],
                capture_output=True, timeout=10
            )
            print(json.dumps({"stopped": True, "method": "port_kill", "port": port}))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.exit(1)
    else:
        # Linux / Mac — find process by port and kill it
        try:
            r = subprocess.run(
                ["lsof", "-ti", f":{port}"],
                capture_output=True, text=True, timeout=5
            )
            pids = r.stdout.strip().split()
            if pids:
                for pid in pids:
                    subprocess.run(["kill", pid], capture_output=True, timeout=5)
                print(json.dumps({"stopped": True, "pids": pids}))
            else:
                print(json.dumps({"status": "not_running", "port": port}))
        except FileNotFoundError:
            # lsof not available, try fuser
            try:
                subprocess.run(["fuser", "-k", f"{port}/tcp"], capture_output=True, timeout=5)
                print(json.dumps({"stopped": True, "method": "fuser"}))
            except Exception as e:
                print(json.dumps({"error": f"Cannot find process on port {port}: {e}",
                                  "hint": "Kill ComfyUI manually"}))


# ── Argument parser ──────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser(description="ComfyUI API Client")
    p.add_argument("--host", default=None, help="ComfyUI host (auto-detected if omitted)")
    p.add_argument("--port", type=int, default=8188)
    sub = p.add_subparsers(dest="command", required=True)

    sub.add_parser("status", help="System stats & GPU info")

    m = sub.add_parser("models", help="List available models")
    m.add_argument("folder", nargs="?", help="checkpoints, loras, vae, controlnet, upscale_models, ...")

    n = sub.add_parser("nodes", help="List available node types")
    n.add_argument("class_type", nargs="?", help="Inspect a specific node class")

    sub.add_parser("queue", help="Show queue status")

    h = sub.add_parser("history", help="Generation history")
    h.add_argument("prompt_id", nargs="?")
    h.add_argument("--max", type=int, help="Max entries to return")

    r = sub.add_parser("run", help="Queue a workflow JSON file")
    r.add_argument("workflow", help="Path to workflow JSON (API format)")
    r.add_argument("--wait", action="store_true", help="Wait for completion")
    r.add_argument("--save-to", help="Download results to this directory")
    r.add_argument("--timeout", type=int, default=600, help="Max seconds to wait")

    g = sub.add_parser("generate", help="Quick txt2img generation")
    g.add_argument("--prompt", required=True, help="Positive prompt text")
    g.add_argument("--negative", default="", help="Negative prompt text")
    g.add_argument("--checkpoint", help="Checkpoint filename (auto-selects first if omitted)")
    g.add_argument("--width", type=int, default=512)
    g.add_argument("--height", type=int, default=512)
    g.add_argument("--steps", type=int, default=20)
    g.add_argument("--cfg", type=float, default=7.0)
    g.add_argument("--sampler", default="euler", help="Sampler name")
    g.add_argument("--scheduler", default="normal", help="Scheduler name")
    g.add_argument("--seed", type=int, help="Seed (random if omitted)")
    g.add_argument("--batch", type=int, default=1, help="Batch size")
    g.add_argument("--prefix", default="ComfyUI", help="Output filename prefix")
    g.add_argument("--wait", action="store_true", help="Wait for completion")
    g.add_argument("--save-to", help="Download results to this directory")
    g.add_argument("--timeout", type=int, default=600)

    u = sub.add_parser("upload", help="Upload a file to ComfyUI input")
    u.add_argument("file", help="Path to file to upload")
    u.add_argument("--subfolder", default="")
    u.add_argument("--overwrite", action="store_true")

    d = sub.add_parser("download", help="Download a generated file")
    d.add_argument("filename", help="Filename to download")
    d.add_argument("--type", default="output", help="output, input, or temp")
    d.add_argument("--subfolder", default="")
    d.add_argument("--save-to", help="Save path or directory")

    sub.add_parser("interrupt", help="Stop current generation")
    sub.add_parser("free", help="Unload models & free GPU memory")
    sub.add_parser("clear-queue", help="Clear the entire queue")
    sub.add_parser("clear-history", help="Clear all history")

    s = sub.add_parser("start", help="Launch ComfyUI and wait until ready")
    s.add_argument("--exe", help="Windows path to ComfyUI.exe (auto-detected if omitted)")
    s.add_argument("--timeout", type=int, default=300, help="Max seconds to wait for startup")

    st = sub.add_parser("stop", help="Stop ComfyUI process")

    args = p.parse_args()

    # start/stop don't need a live connection — skip auto_detect
    if args.command in ("start", "stop"):
        set_base("127.0.0.1", args.port)
    elif args.host:
        set_base(args.host, args.port)
    else:
        detected = auto_detect_host(args.port)
        set_base(detected, args.port)

    {
        "status": cmd_status,
        "models": cmd_models,
        "nodes": cmd_nodes,
        "queue": cmd_queue,
        "history": cmd_history,
        "run": cmd_run,
        "generate": cmd_generate,
        "upload": cmd_upload,
        "download": cmd_download,
        "interrupt": cmd_interrupt,
        "free": cmd_free,
        "clear-queue": cmd_clear_queue,
        "clear-history": cmd_clear_history,
        "start": cmd_start,
        "stop": cmd_stop,
    }[args.command](args)


if __name__ == "__main__":
    main()
