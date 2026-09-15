"""SEO injection pass: schema corrections, social cards, technical meta.

Everything here is grounded in the owner's own files or in the verified
business data in ../reference/. Two deliberate REMOVALS are part of the fix:

  * aggregateRating on all four pages. Google has not shown review stars for
    self-serving reviews (a business marking up its own rating on its own
    domain) since 2019, so the markup earns nothing -- and the declared
    reviewCount of 5 against 3 visible reviews is the kind of mismatch that
    invites a manual action. The three review nodes stay: they quote real,
    visible testimonials.
  * MenuItem "offers" prices on menu.html. The owner keeps prices off the
    website by choice, so the page shows no prices. Structured data must
    mirror what a visitor can see; 36 marked-up prices with zero visible ones
    is a markup/visibility mismatch. The dish names stay, which is what
    actually earns dish-level matches.

Run: python3 tools/_seo_inject.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "antonias"
DOMAIN = "https://antoniaspizza.com"
TOAST = "https://antoniaspizza.toast.site/"
TODAY = "2026-09-14"

log = []


def note(p, msg):
    log.append("  " + p + " | " + msg)


# ---------------------------------------------------------------- utilities

def newline_of(text):
    return "\r\n" if "\r\n" in text else "\n"


def find_jsonld(html):
    """Yield (start, end, parsed) for every application/ld+json block."""
    out = []
    for m in re.finditer(
        r'<script type="application/ld\+json">(.*?)</script>', html, re.S
    ):
        out.append((m.start(1), m.end(1), json.loads(m.group(1))))
    return out


def dump_graph(nodes, nl):
    """Serialize one or more nodes as a single @graph script body."""
    doc = {"@context": "https://schema.org", "@graph": nodes}
    body = json.dumps(doc, indent=2, ensure_ascii=False)
    return body.replace("\n", nl)


def ensure_meta(html, pattern, tag, path):
    """Insert `tag` before </head> unless `pattern` already matches."""
    if re.search(pattern, html, re.I):
        return html, False
    html = html.replace("</head>", tag + "\n</head>", 1)
    note(path, "added " + pattern)
    return html, True


def replace_meta(html, prop_or_name, new_tag, path, label):
    """Swap an existing <meta> by property/name, or append if absent."""
    rx = re.compile(
        r'[ \t]*<meta\s+(?:property|name)="%s"[^>]*>' % re.escape(prop_or_name),
        re.I,
    )
    if rx.search(html):
        return rx.sub(new_tag, html, count=1), False
    html = html.replace("</head>", new_tag + "\n</head>", 1)
    note(path, "added " + label)
    return html, True


def strip_agg(nodes, path):
    removed = 0
    for n in nodes:
        if "aggregateRating" in n:
            del n["aggregateRating"]
            removed += 1
        for dep in n.get("department", []) or []:
            if isinstance(dep, dict) and "aggregateRating" in dep:
                del dep["aggregateRating"]
                removed += 1
    if removed:
        note(path, "removed aggregateRating x%d" % removed)
    return removed


def add_order_action(node):
    """Declare that ordering happens on Toast, off-site.

    The site is a marketing front end: no cart, no checkout, no form posts.
    Marking the order path as an external EntryPoint describes the real
    architecture instead of implying this site takes orders.
    """
    node["potentialAction"] = {
        "@type": "OrderAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": TOAST,
            "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
            ],
        },
        "deliveryMethod": [
            "http://purl.org/goodrelations/v1#PickUp",
            "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet",
        ],
    }


def breadcrumb(trail):
    return {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "name": name,
                "item": DOMAIN + url,
            }
            for i, (name, url) in enumerate(trail)
        ],
    }


def amenities(node):
    node["amenityFeature"] = [
        {"@type": "LocationFeatureSpecification", "name": "Dine-in", "value": True},
        {"@type": "LocationFeatureSpecification", "name": "Takeout", "value": True},
        {"@type": "LocationFeatureSpecification", "name": "Delivery", "value": True},
    ]


# ---------------------------------------------------------------- per page

def og_image_for(page):
    """Local 1200x630 social card per page, served from this site's own domain."""
    return {
        "index.html": DOMAIN + "/assets/img/og/home.jpg",
        "menu.html": DOMAIN + "/assets/img/og/menu.jpg",
        "san-luis-obispo.html": DOMAIN + "/assets/img/og/slo.jpg",
        "paso-robles.html": DOMAIN + "/assets/img/og/paso.jpg",
    }[page]


def process(page):
    f = ROOT / page
    html = f.read_text(encoding="utf-8")
    nl = newline_of(html)
    og = og_image_for(page)

    # --- robots + theme colour -------------------------------------------
    html, _ = replace_meta(
        html,
        "robots",
        '  <meta name="robots" content="index, follow, max-image-preview:large,'
        ' max-snippet:-1, max-video-preview:-1">',
        page,
        "meta robots",
    )
    html, _ = ensure_meta(
        html,
        r'name="theme-color"',
        '  <meta name="theme-color" content="#0e3a52">',
        page,
    )

    # --- Open Graph: real, self-hosted card -------------------------------
    html, _ = replace_meta(
        html, "og:image", '  <meta property="og:image" content="%s">' % og, page, "og:image"
    )
    html, _ = replace_meta(
        html, "og:image:width", '  <meta property="og:image:width" content="1200">',
        page, "og:image:width",
    )
    html, _ = replace_meta(
        html, "og:image:height", '  <meta property="og:image:height" content="630">',
        page, "og:image:height",
    )
    html, _ = replace_meta(
        html,
        "og:image:alt",
        '  <meta property="og:image:alt" content="Antonia\'s Pizza — hand-crafted'
        ' pies in San Luis Obispo and Paso Robles">',
        page,
        "og:image:alt",
    )
    html, _ = ensure_meta(html, r'property="og:locale"',
                          '  <meta property="og:locale" content="en_US">', page)
    html, _ = ensure_meta(html, r'property="og:site_name"',
                          '  <meta property="og:site_name" content="Antonia\'s Pizza">', page)

    # --- Twitter card on all four pages -----------------------------------
    html, _ = replace_meta(
        html, "twitter:card",
        '  <meta name="twitter:card" content="summary_large_image">', page, "twitter:card")
    html, _ = replace_meta(html, "twitter:image",
                           '  <meta name="twitter:image" content="%s">' % og, page,
                           "twitter:image")
    for name, source in (("twitter:title", "og:title"),
                         ("twitter:description", "og:description")):
        if not re.search(r'name="%s"' % name, html):
            m = re.search(r'property="%s" content="([^"]*)"' % source, html)
            if m:
                html = html.replace(
                    "</head>",
                    '  <meta name="%s" content="%s">\n</head>' % (name, m.group(1)),
                    1,
                )
                note(page, "added " + name)

    # --- structured data ---------------------------------------------------
    blocks = find_jsonld(html)
    new_nodes = []
    for _, _, data in blocks:
        nodes = data.get("@graph", [data]) if isinstance(data, dict) else list(data)
        strip_agg(nodes, page)

        for n in nodes:
            t = n.get("@type")
            if t == "Restaurant":
                add_order_action(n)
                amenities(n)
                if page == "index.html":
                    # Logo and hero image must resolve on THIS site, not the
                    # retired Toast-hosted one.
                    n["logo"] = DOMAIN + "/assets/img/logo.png"
                    n["image"] = [og, DOMAIN + "/assets/img/pies-2.jpg",
                                  DOMAIN + "/assets/img/storefront-night.jpg"]
                    note(page, "Restaurant: OrderAction, amenities, local logo+image")
                else:
                    n["image"] = [og]
                    n["@id"] = DOMAIN + "/" + page.replace(".html", "") + "#restaurant"
                    n["parentOrganization"] = {"@id": DOMAIN + "/#restaurant"}
                    note(page, "Restaurant: OrderAction, amenities, @id, parentOrganization")

            elif t == "Menu":
                # Prices stay off the site, so they stay out of the markup.
                stripped = 0
                for sec in n.get("hasMenuSection", []) or []:
                    for item in sec.get("hasMenuItem", []) or []:
                        if "offers" in item:
                            del item["offers"]
                            stripped += 1
                n["@id"] = DOMAIN + "/menu#menu"
                note(page, "Menu: removed %d price offers, added @id" % stripped)

        new_nodes.extend(nodes)

    # Breadcrumb trails for the three non-home pages.
    if page == "menu.html":
        new_nodes.append(breadcrumb([("Home", "/"), ("Menu", "/menu")]))
        note(page, "BreadcrumbList: Home > Menu")
    elif page == "san-luis-obispo.html":
        new_nodes.append(breadcrumb([("Home", "/"),
                                     ("San Luis Obispo", "/san-luis-obispo")]))
        note(page, "BreadcrumbList: Home > San Luis Obispo")
    elif page == "paso-robles.html":
        new_nodes.append(breadcrumb([("Home", "/"),
                                     ("Paso Robles", "/paso-robles")]))
        note(page, "BreadcrumbList: Home > Paso Robles")

    # Rewrite every ld+json block as one consolidated @graph.
    body = dump_graph(new_nodes, nl)
    for start, end, _ in reversed(blocks):
        html = html[:start] + nl + body + nl + "  " + html[end:]

    f.write_text(html, encoding="utf-8")
    note(page, "consolidated %d ld+json node(s) into one @graph" % len(new_nodes))


def main():
    for page in ("index.html", "menu.html",
                 "san-luis-obispo.html", "paso-robles.html"):
        print("== " + page)
        process(page)
        for line in log:
            if line.startswith("  " + page):
                print(line)
        log.clear()
    print("\nSEO injection complete.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
