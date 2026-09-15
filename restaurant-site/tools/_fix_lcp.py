#!/usr/bin/env python3
"""Fix HANDOFF §7.4 — the LCP image was never prioritised.

Three problems, one per page:

1. `<link rel="preconnect" href="https://antoniaspizza.com">` preconnects to the
   origin the site IS deployed on. A self-preconnect buys nothing: the browser
   already has the connection. It wastes a socket setup and a line of critical
   head. Removed.

2. The largest above-the-fold image (the LCP element) had no priority signal, so
   it started downloading only when the parser reached it, hundreds of lines
   into the body, behind the stylesheet. A `rel="preload" as="image"` with
   `fetchpriority="high"` in the head starts it in parallel with the CSS
   instead.

3. The same img tag had neither `fetchpriority` nor `decoding` attributes, so
   even once discovered it competed for priority with everything else and could
   block the main thread on decode.

The LCP image differs per page, so it is declared here explicitly rather than
guessed from the DOM.
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent / "antonias"

# The single largest above-the-fold image on each page, verified by reading the
# markup: it is the first non-lazy img after the header logo.
LCP = {
    "index.html": "assets/img/hero-sauce.jpg",
    "menu.html": "assets/img/feast.jpg",
    "san-luis-obispo.html": "assets/img/pies-2.jpg",
    "paso-robles.html": "assets/img/storefront-night.jpg",
}

PRECONNECT = '  <link rel="preconnect" href="https://antoniaspizza.com">\n'

failures = []
for page, lcp in LCP.items():
    p = ROOT / page
    s = p.read_text()

    # 1. drop the self-preconnect
    if PRECONNECT in s:
        s = s.replace(PRECONNECT, "", 1)
    else:
        failures.append(f"{page}: self-preconnect line not found verbatim")

    # 2. preload the LCP image, immediately before the stylesheet so it is
    #    discovered as early as possible
    marker = '  <link rel="stylesheet" href="css/style.css">'
    preload = f'  <link rel="preload" as="image" href="{lcp}" fetchpriority="high">\n'
    if marker in s and preload not in s:
        s = s.replace(marker, preload + marker, 1)
    elif preload in s:
        pass
    else:
        failures.append(f"{page}: stylesheet link not found verbatim")

    # 3. priority + async decode on the img itself. Attribute order is not
    #    significant, so inserting right after src= is safe and unambiguous.
    src = f'src="{lcp}" '
    if src in s and 'fetchpriority="high"' not in s.split(src)[1].split(">")[0]:
        s = s.replace(src, f'src="{lcp}" fetchpriority="high" decoding="async" ', 1)
    else:
        failures.append(f"{page}: could not tag the LCP img")

    p.write_text(s)
    print(f"  {page}: preconnect removed, preload added, LCP prioritised ({lcp.split('/')[-1]})")

if failures:
    print("\nFAILURES:")
    for f in failures:
        print("  -", f)
    sys.exit(1)
print("\nAll four pages updated.")
