/* ============================================================
   ANTONIA'S PIZZA — Interactions & Animation Engine
   Vanilla JS · no dependencies · respects reduced motion
   ============================================================ */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Preloader ---------- */
  const preloader = $(".preloader");
  if (preloader) {
    const count = $(".pl-count", preloader);
    const bar = $(".pl-bar i", preloader);
    let progress = 0;
    const tick = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 14 + 4);
      if (count) count.textContent = String(Math.floor(progress)).padStart(3, "0") + "%";
      if (bar) bar.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          preloader.classList.add("done");
          document.body.classList.add("loaded");
          setTimeout(() => preloader.remove(), 1000);
        }, 250);
      }
    }, prefersReduced ? 10 : 90);
  }

  /* ---------- Custom cursor ---------- */
  const dot = $(".cursor-dot");
  const ring = $(".cursor-ring");
  if (dot && ring && !prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    });
    (function loop() {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    $$("a, button, .dish-card, .faq-item button").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("grow"));
      el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
    });
  } else if (dot && ring) { dot.remove(); ring.remove(); }

  /* ---------- Header: shrink + hide on scroll down ---------- */
  const header = $(".site-header");
  let lastY = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 40);
      header.classList.toggle("hidden", y > 480 && y > lastY && !document.body.classList.contains("nav-open"));
    }
    lastY = y;
    const sticky = $(".sticky-order");
    if (sticky) sticky.classList.toggle("show", y > innerHeight * 0.9);
  }, { passive: true });

  /* ---------- Mobile nav ---------- */
  const toggle = $(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", document.body.classList.contains("nav-open"));
    });
    $$(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("nav-open"))
    );
  }

  /* ---------- Scroll reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .stagger").forEach((el) => io.observe(el));

  /* ---------- Stat counters ---------- */
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count || "0");
      const decimals = (String(el.dataset.count).split(".")[1] || "").length;
      const dur = 1600;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + (el.dataset.suffix || "");
        if (p < 1) requestAnimationFrame(step);
      };
      prefersReduced ? (el.textContent = target + (el.dataset.suffix || "")) : requestAnimationFrame(step);
      statIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => statIO.observe(el));

  /* ---------- Hero parallax (scroll + mouse) ---------- */
  const heroBg = $(".hero-bg");
  if (heroBg && !prefersReduced) {
    addEventListener("scroll", () => {
      const y = scrollY;
      if (y < innerHeight * 1.2) heroBg.style.transform = `scale(1.12) translateY(${y * 0.18}px)`;
    }, { passive: true });
    addEventListener("mousemove", (e) => {
      const dx = (e.clientX / innerWidth - 0.5) * 14;
      const dy = (e.clientY / innerHeight - 0.5) * 10;
      heroBg.style.marginLeft = dx + "px";
      heroBg.style.marginTop = dy + "px";
    });
  }

  /* ---------- 3D tilt on dish cards ---------- */
  if (!prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    $$(".dish-card, .deal-card, .deal-mini").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    $$(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22 - 3}px) scale(1.03)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach((item) => {
    const btn = $("button", item);
    const panel = $(".faq-a", item);
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      $$(".faq-item.open").forEach((o) => {
        o.classList.remove("open");
        $(".faq-a", o).style.maxHeight = null;
        $("button", o).setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Location tabs ---------- */
  $$(".loc-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".loc-tabs button").forEach((b) => b.classList.remove("active"));
      $$(".loc-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $(`#${btn.dataset.target}`)?.classList.add("active");
    });
  });

  /* ---------- Open / closed pill (live status) ---------- */
  const pill = $("[data-open-pill]");
  if (pill) {
    // hours per day (Sun..Sat): [open, close] in minutes-midnight; close<open means past midnight
    const SLO = [[660,1440],[660,1440],[660,1440],[660,1440],[660,1560],[660,1560],[660,1560]]; // Thu-Sat till 2AM
    const schedule = pill.dataset.openSchedule === "paso"
      ? [[660,1440],[660,1440],[660,1440],[660,1440],[660,1440],[660,1560],[660,1560]] // Fri-Sat till 2AM
      : SLO;
    const now = new Date();
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const [open, close] = schedule[day];
    const isOpen = mins >= open && mins < close;
    const fmt = (m) => {
      const h = Math.floor((m % 1440) / 60), mm = m % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      return `${((h + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${ampm}`;
    };
    pill.classList.toggle("closed", !isOpen);
    pill.querySelector(".label").textContent = isOpen
      ? `Open now · till ${fmt(close)}`
      : `Closed · opens ${fmt(open)}`;
  }

  /* ---------- Marquee duplication (seamless loop) ---------- */
  $$(".marquee-track, .gallery-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Review scroller: drag to scroll ---------- */
  $$(".review-scroller").forEach((sc) => {
    let down = false, startX = 0, startScroll = 0;
    sc.addEventListener("pointerdown", (e) => {
      down = true; startX = e.clientX; startScroll = sc.scrollLeft;
    });
    addEventListener("pointermove", (e) => {
      if (!down) return;
      sc.scrollLeft = startScroll - (e.clientX - startX);
    });
    addEventListener("pointerup", () => { down = false; });
  });

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();

  /* ============================================================
     PIE WHEEL — pinza.com-style rotating slice carousel
     auto-rotate · click-to-focus · drag-to-spin · synced labels
     ============================================================ */
  $$("[data-wheel]").forEach((wheel) => {
    const rotor = $(".pie-rotor", wheel);
    const slices = $$(".slice", rotor);
    const nameEls = [ $("[data-dish-name]", wheel), $("[data-side-name]", document) ].filter(Boolean);
    const cravingEls = [ $("[data-craving-out]") ].filter(Boolean);
    const section = wheel.closest("section");
    const N = slices.length;
    const STEP = 360 / N;
    let rot = 0, current = -1, timer = null, started = false;
    const reduced = prefersReduced;

    const mod = (n, m) => ((n % m) + m) % m;

    function render(animate = true) {
      rotor.style.transition = animate && !reduced ? "transform .9s cubic-bezier(.22,1,.36,1)" : "none";
      rotor.style.transform = `rotate(${rot}deg)`;
      const idx = mod(Math.round(-rot / STEP), N);
      if (idx !== current) {
        current = idx;
        slices.forEach((s, i) => s.classList.toggle("active", i === idx));
        const s = slices[idx];
        nameEls.forEach((el) => {
          el.classList.remove("swap");
          void el.offsetWidth; // restart animation
          el.textContent = s.dataset.name;
          el.classList.add("swap");
        });
        cravingEls.forEach((el) => {
          el.classList.remove("swap");
          void el.offsetWidth;
          el.textContent = s.dataset.craving;
          el.classList.add("swap");
        });
      }
    }

    function goTo(i) { rot = -STEP * i; render(); }
    function next() { goTo(mod(current + 1, N)); }
    function prev() { goTo(mod(current - 1, N)); }

    function play() {
      if (reduced) return;
      stop();
      timer = setInterval(next, 4200);
    }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    /* spin-in when the section first scrolls into view */
    const spinIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          rot = -STEP * 2;           // start offset
          render(false);
          requestAnimationFrame(() => { rot = 0; render(true); });
          setTimeout(play, 1400);
          spinIO.disconnect();
        }
      });
    }, { threshold: 0.35 });
    if (section) spinIO.observe(section); else { started = true; render(false); play(); }

    /* slice click */
    let pressed = false, moved = false, a0 = 0, rot0 = 0;
    slices.forEach((s, i) => {
      s.addEventListener("click", () => {
        if (moved) return;
        goTo(i); play();
      });
    });

    /* drag to spin (mouse + touch) */
    const centerOf = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    rotor.addEventListener("pointerdown", (e) => {
      pressed = true; moved = false;
      const c = centerOf(rotor);
      a0 = Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180 / Math.PI;
      rot0 = rot;
      stop();
      rotor.setPointerCapture(e.pointerId);
    });
    rotor.addEventListener("pointermove", (e) => {
      if (!pressed) return;
      const c = centerOf(rotor);
      const a = Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180 / Math.PI;
      let d = a - a0;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      if (Math.abs(d) > 6) moved = true;
      rot = rot0 + d;
      render(false);
    });
    function release() {
      if (!pressed) return;
      pressed = false;
      rot = Math.round(rot / STEP) * STEP; // snap
      render(true);
      play();
    }
    rotor.addEventListener("pointerup", release);
    rotor.addEventListener("pointercancel", release);

    /* arrows */
    $("[data-wheel-next]", wheel.closest(".container") || document)?.addEventListener("click", () => { next(); play(); });
    $("[data-wheel-prev]", wheel.closest(".container") || document)?.addEventListener("click", () => { prev(); play(); });

    /* pause on hover (desktop) */
    wheel.addEventListener("pointerenter", () => { if (!pressed) stop(); });
    wheel.addEventListener("pointerleave", () => { if (!pressed) play(); });

    render(false);
  });

  /* ---------- Magic UI port: spotlight tracking ---------- */
  $$(".spot").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });
