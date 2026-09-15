import sys
J="antonias/js/main.js"; s=open(J,encoding="utf-8").read()
old='''      // keep the active chip in view on a narrow, horizontally scrolling rail
      if (active && rail.scrollWidth > rail.clientWidth) {
        active.scrollIntoView({ inline: "center", block: "nearest",
          behavior: prefersReduced ? "auto" : "smooth" });
      }'''
new='''      // Keep the active chip in view on a narrow rail. The element that
      // actually scrolls is the inner flex row, not the <nav> -- and scroll it
      // directly rather than via scrollIntoView, which would also move the page.
      if (active && scroller && scroller.scrollWidth > scroller.clientWidth) {
        const target = active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2;
        const left = Math.max(0, Math.min(target, scroller.scrollWidth - scroller.clientWidth));
        scroller.scrollTo({ left, behavior: prefersReduced ? "auto" : "smooth" });
      }'''
if s.count(old)!=1: sys.exit(f"ABORT: {s.count(old)} matches")
s=s.replace(old,new,1)
old2='    const chips = $$(".menu-chip", rail);'
new2='''    const scroller = $(".menu-rail-inner", rail);
    const chips = $$(".menu-chip", rail);'''
if s.count(old2)!=1: sys.exit("ABORT chips decl")
s=s.replace(old2,new2,1)
open(J,"w",encoding="utf-8",newline="\n").write(s)
print("rail auto-scroll fixed")
