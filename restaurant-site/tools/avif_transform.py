#!/usr/bin/env python3
"""Transform <img src="...webp"> to <picture> with AVIF+WebP sources."""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parents[1] / "antonias"
PAGES = ["index.html", "menu.html", "san-luis-obispo.html", "paso-robles.html", "our-story.html", "privacy.html"]

# Pattern to match <img ... src="assets/img/...webp" ...>
# We want to capture entire img tag and its src
IMG_RE = re.compile(r'<img\s+([^>]*?)src="([^"]+\.webp)"([^>]*?)>', re.IGNORECASE | re.DOTALL)

def transform_file(path):
    raw = path.read_text(encoding="utf-8")
    original = raw

    def repl(m):
        before_src = m.group(1)
        src = m.group(2)
        after_src = m.group(3)
        # src is like assets/img/hero-pep.webp or assets/img/wheel/cheese-slice.webp
        # Check if avif twin exists
        avif_src = src[:-5] + ".avif"  # replace .webp with .avif
        # Verify file exists on disk
        # raw src is relative to antonias folder, e.g., assets/img/hero-pep.webp
        avif_path = SITE / avif_src
        webp_path = SITE / src
        if not avif_path.exists():
            # No avif, keep original
            return m.group(0)
        # Reconstruct img tag attributes
        # before_src contains attrs before src, after_src after
        # Combine them to get full attrs without src (we will keep src in img)
        # We need to preserve all attrs
        # The full img tag without <img and > is: before_src + src="..." + after_src
        # We'll keep it as is for the inner img
        img_tag = f'<img {before_src}src="{src}"{after_src}>'
        # Clean double spaces
        img_tag = re.sub(r'\s+', ' ', img_tag).replace(' >', '>')

        # Build picture element
        # Indent preservation: we will output picture with newlines for readability
        picture = (
            f'<picture>\n'
            f'              <source srcset="{avif_src}" type="image/avif">\n'
            f'              <source srcset="{src}" type="image/webp">\n'
            f'              {img_tag}\n'
            f'            </picture>'
        )
        return picture

    # Avoid double-wrapping: if already inside <picture>, skip
    # Simplistic: if raw contains <picture>.*<img src="...webp" -> we need to ensure we don't wrap again
    # We'll first remove existing picture wrappers that we may have created earlier? For idempotency,
    # we will unwrap any picture that contains only source+img that we created, then re-wrap.
    # For simplicity, we will only transform img tags that are NOT already preceded by <source> in a picture.
    # Approach: use regex to find <picture> blocks and leave them alone, transform only lone img.

    # Split by picture blocks to avoid double wrapping
    parts = re.split(r'(<picture>.*?</picture>)', raw, flags=re.DOTALL | re.IGNORECASE)
    new_parts = []
    for part in parts:
        if part.lower().startswith('<picture'):
            # Already a picture block, keep as is
            new_parts.append(part)
        else:
            # Transform img tags in this part
            new_parts.append(IMG_RE.sub(repl, part))
    new_raw = ''.join(new_parts)

    if new_raw != original:
        path.write_text(new_raw, encoding="utf-8")
        print(f"Transformed {path.name}: {original.count('.webp')} -> {new_raw.count('.webp')} webp refs, {new_raw.count('.avif')} avif refs")
    else:
        print(f"No change {path.name}")

if __name__ == "__main__":
    for name in PAGES:
        p = SITE / name
        if p.exists():
            transform_file(p)
        else:
            print(f"Missing {name}")
