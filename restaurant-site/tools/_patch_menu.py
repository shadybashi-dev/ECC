import re, sys
M = "antonias/menu.html"
s = open(M, encoding="utf-8").read()

CATS = [("deals","Deals"),("pizza","Pizza"),("ajarski","Ajarski"),("pasta","Pasta"),
        ("wings","Wings & Sides"),("salads","Salads"),("sandwiches","Sandwiches"),
        ("desserts","Desserts")]

# 1) Give every category block a stable id so the nav can target it.
#    <section id="deals"> already exists; the rest are .menu-section divs in order.
blocks = list(re.finditer(r'<div class="menu-section reveal">', s))
print(f"  menu-section blocks found: {len(blocks)}")
if len(blocks) != 7:
    sys.exit(f"ABORT: expected 7 category blocks, got {len(blocks)}")
for slug, _ in reversed(CATS[1:]):            # skip 'deals' (already a section id)
    pass
ids = [c[0] for c in CATS[1:]]
for m, slug in zip(reversed(blocks), reversed(ids)):
    s = s[:m.start()] + f'<div class="menu-section reveal" id="{slug}">' + s[m.end():]

# 2) Sticky category rail, injected right before the first category section.
rail = '''    <nav class="menu-rail" aria-label="Menu categories">
      <div class="container menu-rail-inner">
''' + "\n".join(
 f'        <a href="#{slug}" class="menu-chip">{label}</a>' for slug, label in CATS
) + '''
      </div>
    </nav>
'''
anchor = '    <section class="section" id="deals"'
if s.count(anchor) != 1: sys.exit("ABORT: deals section anchor")
s = s.replace(anchor, rail + anchor, 1)

# 3) Stagger index per item, so CSS can delay each one without :nth-child ladders.
def number_items(match):
    inner = match.group(1)
    out, i = [], 0
    for part in re.split(r'(<div class="menu-item">)', inner):
        if part == '<div class="menu-item">':
            out.append(f'<div class="menu-item" style="--i:{i}">'); i += 1
        else:
            out.append(part)
    return '<div class="menu-items">' + "".join(out) + '</div>'

s, n = re.subn(r'<div class="menu-items">(.*?)</div>\s*\n\s*(?=<div class="menu-item--feature"|</div>)',
               lambda m: number_items(m) + "\n          ", s, flags=re.S)
print(f"  menu-items groups numbered: {n}")

open(M, "w", encoding="utf-8", newline="\n").write(s)
idcount = len(re.findall(r'<div class="menu-section reveal" id="', s))
print(f"  category ids written: {idcount}")
print(f"  chips in rail: {s.count('class=\"menu-chip\"')}")
print(f"  items with --i: {len(re.findall(r'menu-item\" style=\"--i:', s))}")
