// Menu Studio dashboard: CRUD over /api/menu with immutable state updates.
(() => {
  const state = { menu: null, original: null, activeCat: null, lang: 'ar', imgStatus: {} };
  const $ = (sel) => document.querySelector(sel);
  const L = (key) => window.t(state.lang, key);
  const clone = (v) => JSON.parse(JSON.stringify(v));

  const cats = () => state.menu.categories;
  const activeCat = () => cats().find((c) => c.id === state.activeCat);

  // immutable helpers -------------------------------------------------------
  const updateItem = (catId, itemId, patch) => {
    state.menu = {
      ...state.menu,
      categories: cats().map((c) =>
        c.id !== catId ? c : { ...c, items: c.items.map((it) => (it.id !== itemId ? it : { ...it, ...patch })) }
      ),
    };
  };
  const updateCategory = (catId, patch) => {
    state.menu = { ...state.menu, categories: cats().map((c) => (c.id !== catId ? c : { ...c, ...patch })) };
  };
  const moveItem = (catId, itemId, dir) => {
    const cat = cats().find((c) => c.id === catId);
    const idx = cat.items.findIndex((i) => i.id === itemId);
    const to = idx + dir;
    if (to < 0 || to >= cat.items.length) return;
    const items = [...cat.items];
    [items[idx], items[to]] = [items[to], items[idx]];
    updateCategory(catId, { items });
  };

  // image existence probe ---------------------------------------------------
  const probeImg = (src) => {
    if (!src) return Promise.resolve(false);
    if (state.imgStatus[src] !== undefined) return Promise.resolve(state.imgStatus[src]);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { state.imgStatus[src] = true; resolve(true); };
      img.onerror = () => { state.imgStatus[src] = false; resolve(false); };
      img.src = src;
    });
  };

  // KPIs --------------------------------------------------------------------
  const renderKpis = async () => {
    const items = cats().flatMap((c) => c.items);
    const avail = items.filter((i) => i.available !== false).length;
    const hidden = items.length - avail;
    const prices = items.map((i) => (i.prices ? (i.prices.m + i.prices.l) / 2 : i.price ?? 0));
    const avg = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const missingChecks = await Promise.all(
      items.filter((i) => i.img).map(async (i) => !(await probeImg(i.img)))
    );
    const missing = missingChecks.filter(Boolean).length + items.filter((i) => !i.img).length;
    $('#kpis').innerHTML = `
      <div class="kpi"><b>${items.length}</b><span>${L('kpiItems')}</span></div>
      <div class="kpi"><b>${avail}</b><span>${L('kpiAvailable')}</span></div>
      <div class="kpi ${hidden ? 'warn' : ''}"><b>${hidden}</b><span>${L('kpiHidden')}</span></div>
      <div class="kpi ${missing ? 'warn' : ''}"><b>${missing}</b><span>${L('kpiMissingImg')}</span></div>
      <div class="kpi"><b>${avg}</b><span>${L('kpiAvg')}</span></div>`;
  };

  // tables ------------------------------------------------------------------
  const rowHtml = (cat, item) => {
    const hasImg = !!item.img;
    const ok = hasImg ? state.imgStatus[item.img] : false;
    const priceCell = item.prices
      ? `<div class="cell-price">
           <small>${L('medium')}</small><input type="number" min="0" step="0.5" data-field="price-m" value="${item.prices.m}" />
           <small>${L('large')}</small><input type="number" min="0" step="0.5" data-field="price-l" value="${item.prices.l}" />
         </div>`
      : `<div class="cell-price"><input type="number" min="0" step="0.5" data-field="price" value="${item.price ?? 0}" /></div>`;
    return `
      <tr data-item="${item.id}">
        <td>
          <input type="text" dir="rtl" data-field="name_ar" value="${item.name_ar ?? ''}" />
          <input type="text" dir="ltr" data-field="name_en" value="${item.name_en ?? ''}" />
          <input type="text" dir="rtl" data-field="desc_ar" value="${item.desc_ar ?? ''}" placeholder="${L('colDesc')} AR" />
        </td>
        <td>${priceCell}</td>
        <td>
          <div class="img-cell">
            ${hasImg && ok ? `<img src="${item.img}" alt="" />` : `<span class="miss">📷</span>`}
            <span class="img-status ${hasImg && ok ? 'ok' : 'miss'}">${hasImg && ok ? L('imgOk') : L('imgMissing')}</span>
          </div>
          <input type="text" dir="ltr" data-field="img" value="${item.img ?? ''}" placeholder="img/….jpg" />
        </td>
        <td>
          <label class="switch"><input type="checkbox" data-field="available" ${item.available !== false ? 'checked' : ''} />${L('available')}</label><br />
          <label class="switch"><input type="checkbox" data-field="popular" ${item.tags?.includes('popular') ? 'checked' : ''} />${L('popularToggle')}</label>
        </td>
        <td>
          <div class="row-actions">
            <button data-act="up" title="${L('up')}">${L('up')}</button>
            <button data-act="down" title="${L('down')}">${L('down')}</button>
            <button data-act="delete" class="danger">${L('delete')}</button>
          </div>
        </td>
      </tr>`;
  };

  const renderCats = () => {
    $('#cat-list').innerHTML = cats()
      .map(
        (c) => `<li><button data-cat="${c.id}" class="${c.id === state.activeCat ? 'active' : ''}">
          <span>${c.icon} ${c.name_ar}</span><span class="count">${c.items.length}</span></button></li>`
      )
      .join('');
  };

  const renderTable = () => {
    const cat = activeCat();
    if (!cat) return;
    $('#active-cat-name').textContent = `${cat.icon} ${cat.name_ar} / ${cat.name_en}`;
    $('#items-body').innerHTML = cat.items.map((it) => rowHtml(cat, it)).join('');
  };

  const renderStatic = () => {
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = L(el.dataset.i18n); });
    $('#set-title').textContent = L('settings');
    $('#cats-title').textContent = L('categoriesTitle') || 'الأقسام';
    $('#add-cat').textContent = L('addCategory');
    $('#add-item').textContent = L('addItem');
    $('#save-btn').textContent = L('save');
    $('#export-btn').textContent = L('export');
    $('#reset-btn').textContent = L('reset');
    const r = state.menu.restaurant;
    $('#store-name').textContent = r.name_ar;
    $('#set-tagline-ar').value = r.tagline_ar;
    $('#set-tagline-en').value = r.tagline_en;
    $('#set-hotline').value = r.hotline;
    $('#set-hours-ar').value = r.hours_ar;
    $('#set-hours-en').value = r.hours_en;
    $('#set-currency').value = r.currency;
  };

  const renderAll = async () => {
    renderStatic();
    renderCats();
    renderTable();
    await renderKpis();
  };

  // persistence -------------------------------------------------------------
  const markDirty = () => { $('#save-state').textContent = '●'; $('#save-state').style.color = 'var(--accent)'; };
  const save = async () => {
    $('#save-state').textContent = L('saving');
    const res = await fetch('/api/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.menu),
    });
    if (!res.ok) {
      $('#save-state').textContent = `⚠ ${res.status}`;
      $('#save-state').style.color = 'var(--danger)';
      return;
    }
    state.original = clone(state.menu);
    $('#save-state').textContent = L('saved');
    $('#save-state').style.color = 'var(--ok)';
  };

  // events ------------------------------------------------------------------
  const bind = () => {
    $('#cat-list').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      state.activeCat = btn.dataset.cat;
      renderCats();
      renderTable();
    });
    $('#items-body').addEventListener('input', (e) => {
      const tr = e.target.closest('tr[data-item]');
      if (!tr) return;
      const field = e.target.dataset.field;
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      const cat = activeCat();
      const id = tr.dataset.item;
      if (field === 'price-m') updateItem(cat.id, id, { prices: { ...activeCat().items.find((i) => i.id === id).prices, m: Number(value) } });
      else if (field === 'price-l') updateItem(cat.id, id, { prices: { ...activeCat().items.find((i) => i.id === id).prices, l: Number(value) } });
      else if (field === 'price') updateItem(cat.id, id, { price: Number(value) });
      else if (field === 'available') updateItem(cat.id, id, { available: value });
      else if (field === 'popular') {
        const item = cat.items.find((i) => i.id === id);
        const tags = value ? [...new Set([...(item.tags || []), 'popular'])] : (item.tags || []).filter((t) => t !== 'popular');
        updateItem(cat.id, id, { tags });
      } else updateItem(cat.id, id, { [field]: value });
      if (field === 'img') { delete state.imgStatus[value]; renderTable(); }
      markDirty();
      renderKpis();
    });
    $('#items-body').addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      const tr = btn.closest('tr[data-item]');
      const cat = activeCat();
      const id = tr.dataset.item;
      if (btn.dataset.act === 'delete') {
        if (btn.dataset.armed) {
          updateCategory(cat.id, { items: cat.items.filter((i) => i.id !== id) });
          renderCats(); renderTable(); await renderKpis();
        } else {
          btn.dataset.armed = '1';
          btn.textContent = L('confirmDelete');
          setTimeout(() => { btn.dataset.armed = ''; renderTable(); }, 3000);
          return;
        }
      }
      if (btn.dataset.act === 'up') moveItem(cat.id, id, -1);
      if (btn.dataset.act === 'down') moveItem(cat.id, id, 1);
      markDirty();
      renderTable();
    });
    $('#add-item').addEventListener('click', () => {
      const cat = activeCat();
      const id = `item-${Date.now().toString(36)}`;
      updateCategory(cat.id, {
        items: [...cat.items, { id, img: '', name_ar: 'صنف جديد', name_en: 'New item', desc_ar: '', desc_en: '', tags: [], price: 0, available: true }],
      });
      markDirty(); renderCats(); renderTable(); renderKpis();
    });
    $('#add-cat').addEventListener('click', () => {
      const id = `cat-${Date.now().toString(36)}`;
      state.menu = {
        ...state.menu,
        categories: [...cats(), { id, icon: '🍽', name_ar: L('newCategory'), name_en: 'New category', items: [] }],
      };
      state.activeCat = id;
      markDirty(); renderCats(); renderTable();
    });
    ['set-tagline-ar', 'set-tagline-en', 'set-hotline', 'set-hours-ar', 'set-hours-en'].forEach((fid) => {
      document.getElementById(fid).addEventListener('input', (e) => {
        const key = fid.replace('set-', '').replace('-', '_');
        state.menu = { ...state.menu, restaurant: { ...state.menu.restaurant, [key]: e.target.value } };
        markDirty();
      });
    });
    $('#set-currency').addEventListener('change', (e) => {
      state.menu = { ...state.menu, restaurant: { ...state.menu.restaurant, currency: e.target.value } };
      markDirty(); renderKpis();
    });
    $('#save-btn').addEventListener('click', save);
    $('#reset-btn').addEventListener('click', async () => {
      state.menu = clone(state.original);
      await renderAll();
      $('#save-state').textContent = '';
    });
    $('#export-btn').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state.menu, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'menu.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });
    window.addEventListener('beforeunload', (e) => {
      if ($('#save-state').textContent === '●') e.preventDefault();
    });
  };

  const init = async () => {
    const res = await fetch('/api/menu');
    if (!res.ok) throw new Error(`menu fetch failed: ${res.status}`);
    state.menu = await res.json();
    state.original = clone(state.menu);
    state.activeCat = state.menu.categories[0]?.id;
    await renderAll();
    bind();
  };

  init().catch((err) => {
    document.querySelector('.main').innerHTML = `<p class="empty">⚠️ ${err.message}</p>`;
  });
})();
