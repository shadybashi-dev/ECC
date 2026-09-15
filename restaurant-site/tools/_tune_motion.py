import sys, re
C="antonias/css/style.css"; s=open(C,encoding="utf-8").read()
def rep(old,new,label):
    global s
    c=s.count(old); print(f"  {label}: {c}")
    if c!=1: sys.exit(f"ABORT {label}: {c}")
    s=s.replace(old,new,1)

# The ladder was .05s -> .55s, i.e. 0.1s per item. Guidance: 0.02-0.04s for long
# lists, never past 0.1s or the tail drags. 0.06s matches the Standard tier.
old_ladder="\n".join(
  f"html.js .stagger.in > *:nth-child({i}){{transition-delay:{d}s}}"
  for i,d in zip(range(1,7), ['.05','.15','.25','.35','.45','.55']))
new_ladder="\n".join(
  f"html.js .stagger.in > *:nth-child({i}){{transition-delay:{round(0.04+(i-1)*0.06,2)}s}}"
  for i in range(1,7))
if s.count(old_ladder)!=1:
    # the file may use a slightly different spacing; fall back to per-line edits
    n=0
    for i,d in zip(range(1,7), ['.05','.15','.25','.35','.45','.55']):
        o=f"html.js .stagger.in > *:nth-child({i}){{transition-delay:{d}s}}"
        nw=f"html.js .stagger.in > *:nth-child({i}){{transition-delay:{round(0.04+(i-1)*0.06,2)}s}}"
        if s.count(o)==1: s=s.replace(o,nw,1); n+=1
    print(f"  stagger ladder retuned line-by-line: {n}/6")
    if n!=6: sys.exit("ABORT ladder")
else:
    s=s.replace(old_ladder,new_ladder,1); print("  stagger ladder retuned: 6/6")

# Card entrance: a small overshoot (back.out equivalent) reads as playful, which
# is the brand. --ease-snap is already cubic-bezier(.34,1.56,.64,1).
rep('''  .dish-card,.deal-card,.info-card,.review-card{
    animation:cardIn var(--ease-soft) both;
    animation-timeline:view();
    animation-range:entry 0% entry 60%;
  }
  @keyframes cardIn{
    from{ opacity:0; transform:translateY(40px) scale(.965) }
    to  { opacity:1; transform:none }
  }''',
'''  .dish-card,.deal-card,.info-card,.review-card{
    animation:cardIn var(--ease-snap) both;
    animation-timeline:view();
    animation-range:entry 0% entry 55%;
  }
  /* scale .92 + 16px rise with a slight overshoot on settle */
  @keyframes cardIn{
    from{ opacity:0; transform:translateY(16px) scale(.92) }
    to  { opacity:1; transform:none }
  }''',
    "card entrance: overshoot easing")

open(C,"w",encoding="utf-8",newline="\n").write(s)
print("  motion retuned")
