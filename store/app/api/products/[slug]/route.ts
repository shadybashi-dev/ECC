import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { productSchema } from '@/lib/validators'

export const runtime = 'nodejs'

function productRow(row: any) {
  return {
    ...row,
    track_inventory: row.track_inventory === 1,
    is_featured: row.is_featured === 1,
    test_data: row.test_data === 1,
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = getDb()
  const row = db.prepare(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug = ?`
  ).get(slug) as any
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const cookieHeader = _req.headers.get('cookie') || ''
  const token = cookieHeader.split('; ').find((c) => c.startsWith('session='))?.split('=')[1]
  const isAdmin = token ? (() => {
    try {
      const { getSession } = require('@/lib/auth')
      const s = getSession(token)
      return s && (s.role === 'ADMIN' || s.role === 'OPERATOR')
    } catch { return false }
  })() : false

  if (!isAdmin && (row.status !== 'ACTIVE' || row.test_data === 1)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY position ASC, id ASC').all(row.id) as any[]
  const variants = db.prepare('SELECT * FROM variants WHERE product_id = ? ORDER BY is_default DESC, id ASC').all(row.id)
  return NextResponse.json({ product: { ...productRow(row), images, variants } })
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const { slug: currentSlug } = await params
    const data = productSchema.parse(await req.json())
    const db = getDb()
    if (!db.prepare('SELECT id FROM products WHERE slug = ?').get(currentSlug)) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    if (data.slug !== currentSlug && db.prepare('SELECT id FROM products WHERE slug = ?').get(data.slug)) {
      return NextResponse.json({ error: 'slug_in_use' }, { status: 409 })
    }
    if (data.sku && db.prepare('SELECT id FROM products WHERE sku = ? AND slug <> ?').get(data.slug, currentSlug)) {
      return NextResponse.json({ error: 'sku_in_use' }, { status: 409 })
    }
    db.prepare(
      `UPDATE products SET name = ?, slug = ?, description = ?, short_desc = ?, sku = ?, status = ?,
        category_id = ?, base_price_cents = ?, track_inventory = ?, low_stock_threshold = ?,
        weight_kg = ?, dimensions_cm = ?, materials = ?, care = ?, usage = ?, restrictions = ?,
        shipping_info = ?, return_info = ?, seo_title = ?, seo_description = ?, is_featured = ?,
        test_data = ?, updated_at = datetime('now'),
        published_at = CASE WHEN ? = 'ACTIVE' AND published_at IS NULL THEN datetime('now') ELSE published_at END
       WHERE slug = ?`
    ).run(
      data.name,
      data.slug,
      data.description ?? null,
      data.shortDesc ?? null,
      data.sku || null,
      data.status,
      data.categoryId || null,
      data.basePriceCents,
      data.trackInventory ?? true ? 1 : 0,
      data.lowStockThreshold ?? 5,
      data.weightKg ?? null,
      data.dimensionsCm ?? null,
      data.materials ?? null,
      data.care ?? null,
      data.usage ?? null,
      data.restrictions ?? null,
      data.shippingInfo ?? null,
      data.returnInfo ?? null,
      data.seoTitle ?? null,
      data.seoDescription ?? null,
      data.isFeatured ?? false ? 1 : 0,
      data.testData ?? false ? 1 : 0,
      data.status,
      currentSlug
    )
    const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(data.slug) as any
    return NextResponse.json({ product: productRow(row) })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = requireRole(_req, ['ADMIN'])
  if (auth instanceof Response) return auth
  const { slug } = await params
  const db = getDb()
  if (!db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  db.prepare('DELETE FROM products WHERE slug = ?').run(slug)
  return NextResponse.json({ ok: true })
}
