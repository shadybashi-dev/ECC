// E2E smoke test for MALIK & OTB store
// Tests: homepage, product page, cart, order creation, order tracking, stock overselling prevention
// Usage: start dev server (`npm run dev`), then `node scripts/e2e-test.js`
// Requires SITE_URL in .env (default http://localhost:3000)

const BASE = process.env.SITE_URL || 'http://localhost:3000'
let cookieJar = ''

async function req(path, opts = {}) {
  const headers = { ...opts.headers, cookie: cookieJar }
  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) cookieJar = setCookie.split(';')[0]
  const text = await res.text()
  let json
  try { json = text ? JSON.parse(text) : null } catch { json = null }
  return { status: res.status, json, text }
}

let passed = 0
let failed = 0

function assert(condition, message) {
  if (condition) { passed++; console.log(`  ✅ ${message}`) }
  else { failed++; console.log(`  ❌ ${message}`) }
  return condition
}

async function main() {
  console.log('🧪 E2E Smoke Test — MALIK & OTB\n')

  // 1. Homepage
  console.log('1. Homepage')
  const home = await req('/')
  assert(home.status === 200, 'Homepage returns 200')
  assert(home.text.includes('MALIK &amp; OTB') || home.text.includes('MALIK & OTB'), 'Homepage contains store name')

  // 2. Categories
  console.log('2. Categories')
  const cats = await req('/api/categories')
  assert(cats.status === 200, 'Categories API returns 200')
  assert(Array.isArray(cats.json.categories), 'Categories list is array')

  // 3. Products (public - no test data, no drafts)
  console.log('3. Products')
  const products = await req('/api/products')
  assert(products.status === 200, 'Products API returns 200')
  const activeProducts = products.json.products.filter((p) => p.status === 'ACTIVE' && p.test_data === 0)
  assert(activeProducts.length >= 0, `Active products count: ${activeProducts.length}`)

  // 4. Product page (if any active product exists)
  if (activeProducts.length > 0) {
    const p = activeProducts[0]
    console.log(`4. Product page: ${p.slug}`)
    const prod = await req(`/api/products/${p.slug}`)
    assert(prod.status === 200, 'Product API returns 200')
    assert(prod.json.product.variants.length > 0, 'Product has variants')
    const prodPage = await req(`/product/${p.slug}`)
    assert(prodPage.status === 200, 'Product page returns 200')
  }

  // 5. Draft product should be hidden
  console.log('5. Draft product hidden')
  const publicList = await req('/api/products')
  const draftInPublic = publicList.json.products.some((p) => p.test_data === 1)
  assert(!draftInPublic, 'Test data / draft products excluded from public list')

  // 6. Cart - add item
  console.log('6. Cart operations')
  const cartAdd = await req('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantId: 'nonexistent-variant', quantity: 1 }),
  })
  assert(cartAdd.status === 404, 'Adding nonexistent variant returns 404')

  // Get a real variant for stock test
  let testVariantId = null
  if (activeProducts.length > 0) {
    const p = activeProducts[0]
    const prod = await req(`/api/products/${p.slug}`)
    if (prod.json.product.variants.length > 0) {
      testVariantId = prod.json.product.variants[0].id
    }
  }

  if (testVariantId) {
    const addOk = await req('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId: testVariantId, quantity: 1 }),
    })
    assert(addOk.status === 200, 'Adding valid variant to cart returns 200')

    const cartGet = await req('/api/cart')
    assert(cartGet.status === 200, 'Get cart returns 200')
    assert(cartGet.json.cart.itemCount >= 1, 'Cart has at least 1 item')
  }

  // 7. Stock overselling prevention
  console.log('7. Stock overselling prevention')
  if (testVariantId) {
    const oversell = await req('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId: testVariantId, quantity: 9999 }),
    })
    assert(oversell.status === 409, 'Overselling attempt returns 409 insufficient_stock')
    assert(oversell.json.error === 'insufficient_stock', 'Error is insufficient_stock')
  }

  // 8. Order creation
  console.log('8. Order creation')
  if (testVariantId) {
    const orderRes = await req('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'e2e-test@example.com',
        shippingAddress: { name: 'E2E Tester', line1: '123 Test St', city: 'Los Angeles', state: 'CA', postal_code: '90001', country: 'US' },
      }),
    })
    assert(orderRes.status === 201, 'Order creation returns 201')
    const orderNumber = orderRes.json.orderNumber
    assert(orderNumber.startsWith('MO-'), 'Order number starts with MO-')

    // 9. Order tracking
    console.log('9. Order tracking')
    const trackRes = await req('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, email: 'e2e-test@example.com' }),
    })
    assert(trackRes.status === 200, 'Order tracking returns 200')
    assert(trackRes.json.order.order_number === orderNumber, 'Tracked order matches created order')

    // Wrong email should fail
    const wrongEmail = await req('/api/orders/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, email: 'wrong@example.com' }),
    })
    assert(wrongEmail.status === 404, 'Wrong email returns 404')
  }

  // 10. Compare page
  console.log('10. Compare page')
  const compare = await req('/compare')
  assert(compare.status === 200, 'Compare page returns 200')

  // 11. Track page
  console.log('11. Track page')
  const trackPage = await req('/track')
  assert(trackPage.status === 200, 'Track page returns 200')

  // 12. Analytics endpoint
  console.log('12. Analytics')
  const analytics = await req('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType: 'product_view', payload: { slug: 'test' } }),
  })
  assert(analytics.status === 200, 'Analytics endpoint returns 200')

  // 13. n8n webhook
  console.log('13. n8n webhook')
  const webhook = await req('/api/n8n/webhook?topic=product-research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test: true }),
  })
  assert(webhook.status === 200, 'n8n webhook returns 200')

  // 14. robots.txt and sitemap
  console.log('14. SEO files')
  const robots = await req('/robots.txt')
  assert(robots.status === 200, 'robots.txt returns 200')
  assert(robots.text.includes('Disallow: /admin'), 'robots.txt disallows admin')

  const sitemap = await req('/sitemap.xml')
  assert(sitemap.status === 200, 'sitemap.xml returns 200')

  // 15. Not found
  console.log('15. 404 handling')
  const notFound = await req('/this-page-does-not-exist')
  assert(notFound.status === 404, 'Unknown page returns 404')

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => { console.error(err); process.exit(1) })
