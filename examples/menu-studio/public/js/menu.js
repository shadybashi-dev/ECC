// Customer menu renderer: fetches /api/menu, renders bilingual RTL/LTR menu.
(() => {
  const state = { menu: null, lang: localStorage.getItem('ms-lang') || 'ar', query: '' };

  const $ = (sel) => document.querySelector(sel);
  const L = (key) => window.t(state.lang, key);
  const pick = (obj, base) => obj[`${base}_${state.lang}`] || obj[`${base}_ar`] || '';

  const applyDir = () => {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  };

  const priceChips = (item) => {
    const c = state.menu.restaurant.currency;
    if (item.prices) {
      return `<span class="price-chip">${window.fmtPrice(item.prices.m, c, state.lang)} ${L('medium')}</span>
              <span class="price-chip">${window.fmtPrice(item.prices.l, c, state.lang)} ${L('large')}</span>`;
    }
    return `<span class="price-chip">${window.fmtPrice(item.price ?? 0, c, state.lang)}</span>`;
  };

  const tagHtml = (tag) => `<span class="tag tag-${tag}">${L(tag)}</span>`;

  const cardHtml = (item, icon) => {
    const tags = (item.tags || []).map(tagHtml).join('');
    const img = item.img
      ? `<img src="${item.img}" alt="${pick(item, 'name')}" loading="lazy"
              onerror="this.remove();this.closest('.thumb').classList.add('no-img')" />`
      : '';
    return `
      <article class="card ${item.available === false ? 'unavailable' : ''}" data-search="${(pick(item, 'name') + ' ' + item.name_ar + ' ' + item.name_en).toLowerCase()}">
        <div class="thumb" data-icon="${icon}">${img}${item.available === false ? `<div class="soldout">${L('soldout')}</div>` : ''}</div>
        <div class="body">
          <h3>${pick(item, 'name')}</h3>
          <p class="desc">${pick(item, 'desc')}</p>
          <div class="foot">
            <div class="tags">${tags}</div>
            <div class="prices">${priceChips(item)}</div>
          </div>
        </div>
      </article>`;
  };

  const visibleItems = (cat) => {
    const q = state.query.trim().toLowerCase();
    return cat.items.filter((it) => !q || `${it.name_ar} ${it.name_en} ${it.desc_ar} ${it.desc_en}`.toLowerCase().includes(q));
  };

  const render = () => {
    const { menu } = state;
    const r = menu.restaurant;
    $('#brand-name').textContent = pick(r, 'name');
    $('#brand-sub').textContent = `${r.name_en} · Wood-Fired Pizza`;
    $('#hero-title').textContent = pick(r, 'name');
    $('#hero-tagline').textContent = pick(r, 'tagline');
    $('#hero-hours').textContent = pick(r, 'hours');
    $('#hero-hotline').textContent = `${L('hotlineLabel')} ${r.hotline}`;
    $('#hero-address').textContent = pick(r, 'address');
    $('#foot-brand').textContent = pick(r, 'name');
    $('#foot-note').textContent = L('footNote');
    $('#foot-line').textContent = `${r.name_en} Wood-Fired Pizza · hotline ${r.hotline}`;
    $('#search').placeholder = L('search');
    $('#lang-toggle').textContent = L('langBtn');
    document.title = `${pick(r, 'name')} — ${pick(r, 'tagline')}`;

    $('#catnav').innerHTML = menu.categories
      .map((c) => `<button data-cat="${c.id}" class="${state.activeCat === c.id ? 'active' : ''}">${c.icon} ${pick(c, 'name')}</button>`)
      .join('');

    const sections = menu.categories
      .map((cat) => {
        const items = visibleItems(cat);
        if (!items.length) return '';
        return `
        <section class="category" id="cat-${cat.id}">
          <h2>${cat.icon} ${pick(cat, 'name')}</h2>
          <p class="sub">${items.length} ${state.lang === 'ar' ? 'أصناف' : 'items'}</p>
          <div class="grid">${items.map((it) => cardHtml(it, cat.icon)).join('')}</div>
        </section>`;
      })
      .join('');
    $('#menu-root').innerHTML = sections || `<p class="empty">${L('empty')}</p>`;
  };

  const bind = () => {
    $('#lang-toggle').addEventListener('click', () => {
      state.lang = state.lang === 'ar' ? 'en' : 'ar';
      localStorage.setItem('ms-lang', state.lang);
      applyDir();
      render();
    });
    $('#print-btn').addEventListener('click', () => window.print());
    $('#search').addEventListener('input', (e) => {
      state.query = e.target.value;
      render();
    });
    $('#catnav').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      state.activeCat = btn.dataset.cat;
      render();
      document.getElementById(`cat-${btn.dataset.cat}`)?.scrollIntoView({ behavior: 'smooth' });
    });
    // highlight active category while scrolling
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          state.activeCat = en.target.id.replace('cat-', '');
          document.querySelectorAll('#catnav button').forEach((b) => b.classList.toggle('active', b.dataset.cat === state.activeCat));
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    new MutationObserver(() => {
      document.querySelectorAll('section.category').forEach((s) => io.observe(s));
    }).observe(document.getElementById('menu-root'), { childList: true });
  };

  const init = async () => {
    const res = await fetch('/api/menu');
    if (!res.ok) throw new Error(`menu fetch failed: ${res.status}`);
    state.menu = await res.json();
    state.activeCat = state.menu.categories[0]?.id;
    applyDir();
    render();
    bind();
  };

  init().catch((err) => {
    document.getElementById('menu-root').innerHTML = `<p class="empty">⚠️ ${err.message}</p>`;
  });
})();
