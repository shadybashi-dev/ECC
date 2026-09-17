# Menu Studio 🍕

نظام منيو احترافي كامل لمطاعم البيتزا (وأي مطبخ): منيو رقمي ثنائي اللغة + لوحة تحكم لإدارة المنيو + خط إنتاج صور أطباق واقعية.

A complete, zero-dependency restaurant menu system: bilingual (AR RTL / EN LTR) customer menu,
admin dashboard with full CRUD, and a hyper-realistic dish photography pipeline.

## Run

```bash
cd examples/menu-studio
node server.mjs          # PORT env optional, default 8080, binds 0.0.0.0
```

- Customer menu: `http://localhost:8080/`
- Dashboard: `http://localhost:8080/dashboard.html`
- API: `GET /api/menu` · `PUT /api/menu` (server-side validated, atomic write)

## Features

**Customer menu**

- Hero بصورة حقيقية من فرن الحطب، شريط أقسام لاصق مع scroll-spy، بحث فوري بالعربي والإنجليزي.
- بطاقات أصناف بأسعار المقاسات (وسط/كبير)، شارات (الأكثر طلباً، حار، نباتي، اختيار الشيف).
- تبديل لغة فوري RTL ↔ LTR، معالجة "غير متوفر اليوم"، ونسخة طباعة/PDF عبر `@media print`.

**Dashboard**

- KPIs: عدد الأصناف، المتاح، المخفي، الصور الناقصة، متوسط السعر.
- تحرير مباشر: الأسماء والوصف بالعربي والإنجليزي، الأسعار (سعر واحد أو مقاسان)، مسار الصورة.
- فحص وجود الصور (image probe) مع مؤشر ✓/✗ لكل صنف.
- إضافة/حذف أصناف وأقسام (حذف بخطوتين)، ترتيب ▲/▼، تبديل العملة، حفظ/تراجع/تصدير JSON.

## Data

`data/menu.json` هو المصدر الوحيد للحقيقة — Schema موثق في
`skills/restaurant-menu-dashboard/SKILL.md`.

## Photography

صور الأطباق تُولَّد وفق وصفة `skills/food-photo-realism/SKILL.md` (عدسة، إضاءة نافذة جانبية،
خلفية داكنة، وقائمة فحص واقعية). أسماء الملفات = معرفات الأصناف: `public/img/{item-id}.jpg`.

## Registered tooling in this repo

| Tool | Path | Purpose |
|------|------|---------|
| Skill | `skills/restaurant-menu-dashboard/` | Menu + dashboard architecture & checklists |
| Skill | `skills/food-photo-realism/` | Hyper-real dish photo prompt recipes + QA |
| Agent | `agents/menu-studio-builder.md` | End-to-end menu system builder |
| Command | `/menu-build` | Scaffold/run workflow |
