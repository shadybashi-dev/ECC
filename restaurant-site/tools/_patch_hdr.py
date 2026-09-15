import sys
J="antonias/js/main.js"; s=open(J,encoding="utf-8").read()
a='  /* ---------- Header: shrink + hide on scroll down ---------- */'
if s.count(a)!=1: sys.exit("ABORT anchor")
blk='''  /* ---------- Publish the header height as --header-h ----------
     The header is fixed and shrinks on scroll, so anything that has to sit
     below it (the menu rail, scroll-margin on anchor targets) needs the live
     value rather than a guess. */
  const headerEl = $(".site-header");
  if (headerEl) {
    let hFrame = 0;
    const syncHeaderH = () => {
      const h = Math.round(headerEl.getBoundingClientRect().height);
      if (h) document.documentElement.style.setProperty("--header-h", h + "px");
    };
    const queueSync = () => {
      if (hFrame) return;
      hFrame = requestAnimationFrame(() => { hFrame = 0; syncHeaderH(); });
    };
    syncHeaderH();
    addEventListener("resize", queueSync, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(queueSync).observe(headerEl);
  }

'''
s=s.replace(a, blk+a, 1)
open(J,"w",encoding="utf-8",newline="\n").write(s)
print("header-h sync inserted")
