"""Slot the owner's downloaded full-res photos onto the site.

Run AFTER tools/download_owner_photos.sh. Every mapping is content-matched to
the live site's own alt text; anything the alt makes doubtful is listed under
VERIFY and NOT placed automatically. Enhance + crop to each slot's true aspect,
q82 progressive, stripped - edits, not replacements of truth.
"""
import subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1] / "antonias"
OWN = ROOT / "assets/img/owner"
SLOTS = {  # owner file -> (site file, WxH)
    "chef-red-apron.jpg":    ("dough-toss.jpg",   "900x900"),
    "cheese-slice-soda.jpg": ("slice-coke.jpg",   "1200x800"),
    "rustic-table.jpg":      ("pies-3.jpg",       "800x1000"),
    "grilled-steak.jpg":     ("grill.jpg",        "1000x622"),
    "lamb-shank-plate.jpg":  ("pies-4.jpg",       "800x1000"),
    "deli-latte.jpg":        ("deli.jpg",         "1000x750"),
    "ajarski-hero.jpg":      ("ajarski-2.jpg",    "900x900"),
    "pies-hero.jpg":         ("pies-1.jpg",       "1200x900"),
    "deals.jpg":             ("feast-wide.jpg",   "1200x750"),
}
VERIFY = ["gallery-spread.jpg (alt differs between two live pages - look first)",
          "johnnys-counter.jpg (Johnny's Lunch truck - archive only)",
          "ramen-bowl.jpg (not on the menu - archive only)"]
if not OWN.exists():
    sys.exit("owner/ missing - run tools/download_owner_photos.sh first")
for src, (dst, spec) in SLOTS.items():
    p = OWN / src
    if not p.exists():
        print("  skip (not downloaded):", src); continue
    subprocess.run(["convert", str(p), "-resize", spec + "^", "-gravity", "center",
                    "-extent", spec, "-unsharp", "0x1+0.4+0.02", "-quality", "82",
                    "-interlace", "Plane", "-strip", str(ROOT / "assets/img" / dst)], check=True)
    print("  placed %-22s -> %s %s" % (src, dst, spec))
print("  VERIFY by eye before placing:")
for v in VERIFY: print("   -", v)
print("  then: python3 tools/_img_attr_audit.py && python3 build.py")
