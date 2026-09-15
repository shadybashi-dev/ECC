"""Audit every <img width height> against its file's intrinsic aspect ratio.

Attributes that lie about the ratio mis-reserve layout space, and where no
object-fit:cover box exists they visibly squash the photo. Re-derive height
from the file when adding images, then run this:

    python3 tools/_img_attr_audit.py
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "antonias"
PAGES = ["index.html", "menu.html",
         "san-luis-obispo.html", "paso-robles.html", "404.html"]
_cache = {}


def dims(rel):
    if rel not in _cache:
        # Use [0] to get first frame for GIFs, otherwise multi-frame outputs concatenate
        path = str(ROOT / rel) + "[0]"
        out = subprocess.run(["identify", "-format", "%w %h", path],
                             capture_output=True, text=True).stdout.split()
        if len(out) < 2:
            # Fallback without [0]
            out = subprocess.run(["identify", "-format", "%w %h", str(ROOT / rel)],
                                 capture_output=True, text=True).stdout.split()
        _cache[rel] = (int(out[0]), int(out[1]))
    return _cache[rel]


def main():
    ok = bad = 0
    for page in PAGES:
        for m in re.finditer(r"<img\s[^>]*>", (ROOT / page).read_text(encoding="utf-8")):
            tag = m.group(0)
            src = re.search(r'src="([^"]+)"', tag)
            wh = re.search(r'width="(\d+)" height="(\d+)"', tag)
            if not src or not wh or src.group(1).startswith("data:"):
                continue
            if not (ROOT / src.group(1)).exists():
                print("  MISSING  %s -> %s" % (page, src.group(1)))
                bad += 1
                continue
            w, h = map(int, wh.groups())
            fw, fh = dims(src.group(1))
            if abs(w / h - fw / fh) > 0.02:
                print("  RATIO LIE %s %s attrs %dx%d file %dx%d"
                      % (page, src.group(1), w, h, fw, fh))
                bad += 1
            else:
                ok += 1
    print("  consistent: %d   mismatches: %d" % (ok, bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
