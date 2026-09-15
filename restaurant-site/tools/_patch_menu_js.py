import sys
J = "antonias/js/main.js"
s = open(J, encoding="utf-8").read()
anchor = "  /* ---------- Footer year ---------- */"
if s.count(anchor) != 1: sys.exit("ABORT: footer-year anchor")

block = '''  /* ---------- Menu page: category rail ----------
     Only present on menu.html; every lookup is guarded because this same
     script runs on all four pages. */
  const rail = $(".menu-rail");
  if (rail) {
    const chips = $$(".menu-chip", rail);
    const targets = chips
      .map((chip) => {
        const id = (chip.getAttribute("href") || "").slice(1);
        const section = id ? document.getElementById(id) : null;
        return section ? { chip, section } : null;
      })
      .filter(Boolean);

    const setCurrent = (active) => {
      targets.forEach(({ chip }) => {
        if (chip === active) chip.setAttribute("aria-current", "true");
        else chip.removeAttribute("aria-current");
      });
      // keep the active chip in view on a narrow, horizontally scrolling rail
      if (active && rail.scrollWidth > rail.clientWidth) {
        active.scrollIntoView({ inline: "center", block: "nearest",
          behavior: prefersReduced ? "auto" : "smooth" });
      }
    };

    if (targets.length) {
      setCurrent(targets[0].chip);
      // Track whichever section currently owns the band just under the rail.
      const seen = new Map();
      const railIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        const current = targets.find(({ section }) => seen.get(section));
        if (current) setCurrent(current.chip);
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      targets.forEach(({ section }) => railIO.observe(section));
    }
  }

'''
s = s.replace(anchor, block + anchor, 1)
open(J, "w", encoding="utf-8", newline="\n").write(s)
print("  menu rail block inserted")
