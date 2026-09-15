import sys
C = "antonias/css/style.css"
s = open(C, encoding="utf-8").read()
def rep(old, new, label):
    global s
    c = s.count(old); print(f"  {label}: {c}")
    if c != 1: sys.exit(f"ABORT {label}: {c}")
    s = s.replace(old, new, 1)

# The 220px column never had a breakpoint override: at 360px it left the text
# roughly 80px wide. Let it collapse to a single column on phones.
rep('.menu-item--feature{grid-column:1/-1;display:grid;grid-template-columns:220px 1fr;gap:1.4rem;align-items:center;background:var(--char-2);color:var(--cream);border-radius:var(--radius);padding:1.2rem;margin-top:1rem}',
    '.menu-item--feature{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,220px) minmax(0,1fr);gap:1.4rem;align-items:center;background:var(--char-2);color:var(--cream);border-radius:var(--radius);padding:1.2rem;margin-top:1rem}',
    "feature: allow the columns to shrink")

# .mi-price was styled in two places and used in zero: the menu carries no
# prices on purpose. Remove the dead rules rather than leave a trap.
rep('.menu-item .mi-price{font-family:var(--font-display);white-space:nowrap;color:var(--red)}\n', "", "drop unused .mi-price (1/2)")
rep('.menu-item .mi-price{color:var(--red)}\n', "", "drop unused .mi-price (2/2)")

rep('@media (max-width:820px){.menu-items{grid-template-columns:1fr}}',
    '''@media (max-width:820px){.menu-items{grid-template-columns:1fr}}
@media (max-width:560px){
  .menu-item--feature{grid-template-columns:1fr;text-align:left}
  .menu-item--feature img{max-width:240px}
}''',
    "feature: single column on phones")

open(C, "w", encoding="utf-8", newline="\n").write(s)
print("  responsive + dead-rule pass done")
