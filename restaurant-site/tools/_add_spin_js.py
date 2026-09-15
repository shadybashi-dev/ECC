import sys
J="antonias/js/main.js"; s=open(J,encoding="utf-8").read()
anchor="  /* ---------- Footer year ---------- */"
if s.count(anchor)!=1: sys.exit("ABORT anchor")

block = r'''  /* ---------- Spin-to-decide wheels ----------
     Eight segments, pointer at 12 o'clock. Segment i spans
     [i*45, (i+1)*45) measured clockwise from the top, so to bring segment i
     under the pointer the disc must land on -(i*45 + 22.5) plus whole turns. */
  $$("[data-spin-wheel]").forEach((wheel) => {
    const disc   = $(".sw-disc", wheel);
    const hub    = $("[data-spin-go]", wheel);
    const result = $("[data-spin-result]", wheel.closest(".spin-card") || document);
    if (!disc || !hub) return;

    let items = [];
    try { items = JSON.parse(wheel.dataset.spinItems || "[]"); } catch (_) { items = []; }
    if (!items.length) return;

    const SEG = 360 / items.length;
    const onceKey = wheel.dataset.spinOnce || "";
    let turns = 0, spinning = false;

    const store = {
      get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
      set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
    };

    function render(item, replay) {
      if (!result) return;
      const win = item.win !== false;
      const card = document.createElement("div");
      card.className = "sw-card" + (win ? "" : " sw-card--miss");
      if (item.img) {
        const img = document.createElement("img");
        img.src = item.img; img.alt = ""; img.loading = "lazy";
        card.appendChild(img);
      }
      const text = document.createElement("div");
      const k = document.createElement("div");
      k.className = "sw-k";
      k.textContent = replay ? item.name : (win ? item.name : item.name);
      const n = document.createElement("div");
      n.className = "sw-n";
      n.textContent = replay ? "You already spun today — " + (item.note || "") : (item.note || "");
      text.appendChild(k); text.appendChild(n);
      card.appendChild(text);

      if (item.img) {                       // pizza picker: send them to order it
        const a = document.createElement("a");
        a.className = "btn btn--sm";
        a.href = "https://antoniaspizza.toast.site/";
        a.target = "_blank"; a.rel = "noopener";
        a.textContent = "Order it";
        card.appendChild(a);
      }
      result.replaceChildren(card);
    }

    // A prize already won stays shown, so a refresh cannot re-roll it.
    if (onceKey) {
      const prev = store.get(onceKey);
      if (prev !== null) {
        const idx = Number(prev);
        if (Number.isInteger(idx) && items[idx]) {
          hub.disabled = true;
          const label = $("span", hub); if (label) label.textContent = "DONE";
          disc.style.transition = "none";
          disc.style.transform = "rotate(" + (-(idx * SEG + SEG / 2)) + "deg)";
          render(items[idx], true);
        }
      }
    }

    hub.addEventListener("click", () => {
      if (spinning || hub.disabled) return;
      const idx = Math.floor(Math.random() * items.length);
      const land = -(idx * SEG + SEG / 2);

      const finish = () => {
        spinning = false;
        render(items[idx], false);
        if (onceKey) {
          store.set(onceKey, String(idx));
          hub.disabled = true;
          const label = $("span", hub); if (label) label.textContent = "DONE";
        }
      };

      if (prefersReduced) {                 // no spin, just the answer
        disc.style.transition = "none";
        disc.style.transform = "rotate(" + land + "deg)";
        finish();
        return;
      }

      spinning = true;
      if (result) result.replaceChildren();
      turns += 5 + Math.floor(Math.random() * 3);   // 5-7 full rotations
      disc.style.transition = "";                   // back to the CSS easing
      disc.style.transform = "rotate(" + (land - turns * 360) + "deg)";
      disc.addEventListener("transitionend", finish, { once: true });
    });
  });

'''
s = s.replace(anchor, block + anchor, 1)
open(J,"w",encoding="utf-8",newline="\n").write(s)
print("spin logic inserted")
