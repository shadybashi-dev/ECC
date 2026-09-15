"""Queue every slot in slots.json on a running ComfyUI server and write the
post-processed results straight onto the site. GPU machine only (see README).

    python3 run_food_set.py --api http://127.0.0.1:8188 --site ../antonias/assets/img
"""
import argparse, json, subprocess, time, uuid
from pathlib import Path
import urllib.request

HERE = Path(__file__).resolve().parent

def api(url, payload=None):
    req = urllib.request.Request(url,
        data=json.dumps(payload).encode() if payload else None,
        headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--api", default="http://127.0.0.1:8188")
    ap.add_argument("--site", default=str(HERE.parent / "antonias/assets/img"))
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    slots = json.loads((HERE / "slots.json").read_text())
    wf = json.loads((HERE / "workflow_food_sdxl.json").read_text())
    site = Path(a.site)
    for s in slots["slots"]:
        g = json.loads(json.dumps(wf))
        g["2"]["inputs"]["text"] = s["prompt"] + ", " + slots["style_suffix"]
        g["3"]["inputs"]["text"] = slots["negative"]
        g["4"]["inputs"]["width"], g["4"]["inputs"]["height"] = s["width"], s["height"]
        g["5"]["inputs"]["seed"] = int(uuid.uuid4()) % 2**32
        if a.dry_run:
            print("  would render %-24s %dx%d" % (s["file"], s["width"], s["height"])); continue
        pid = api(a.api + "/prompt", {"prompt": g, "client_id": str(uuid.uuid4())})["prompt_id"]
        while pid not in api(a.api + "/history"):
            time.sleep(2)
        out = api(a.api + "/history/" + pid)[pid]["outputs"]
        img = next(iter(out.values()))["images"][0]
        src = Path(img["subfolder"]) / img["filename"] if img.get("subfolder") else Path(img["filename"])
        dst = site / s["file"]; dst.parent.mkdir(parents=True, exist_ok=True)
        spec = "%dx%d" % (s["width"], s["height"])
        subprocess.run(["convert", str(src), "-resize", spec + "^", "-gravity", "center",
                        "-extent", spec, "-quality", "82", "-interlace", "Plane", "-strip",
                        str(dst)], check=True)
        print("  wrote %-26s %s" % (s["file"], spec))
    print("done." if not a.dry_run else "dry run complete.")

if __name__ == "__main__":
    main()
