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

export async function GET(req: Request) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const testData = searchParams.get('test_data')
  const q = searchParams.get('q')
  const limit = Math.min(Number(searchParams.get('limit') || '20'), 100)
  const offset = Number(searchParams.get('offset') || '0')

  let sql = `SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p LEFT JOIN categories c ON c.id = p.category_id
             WHERE 1=1`
  const params: any[] = []

  const cookieHeader = req.headers.get('cookie') || ''
  const token = cookieHeader.split('; ').find((c) => c.startsWith('session='))?.split('=')[1]
  const isAdmin = token ? (() => {
    try {
      const { getSession } = require('@/lib/auth')
      const s = getSession(token)
      return s && (s.role === 'ADMIN' || s.role === 'OPERATOR')
    } catch { return false }
  })() : false

  if (!isAdmin) {
    sql += ` AND p.status = 'ACTIVE' AND p.test_data = 0`
  } else {
    if (status) { sql += ` AND p.status = ?`; params.push(status) }
    if (testData !== '1') sql += ` AND p.test_data = 0`
  }
  if (category) { sql += ` AND c.slug = ?`; params.push(category) }
  if (featured === '1') sql += ` AND p.is_featured = 1`
  if (q) { sql += ` AND (p.name LIKE ? OR p.sku LIKE ?)`; params.push(`%${q}%`, `%${q}%`) }
  sql += ` ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const rows = db.prepare(sql).all(params) as any[]
  return NextResponse.json({ products: rows.map(productRow), limit, offset })
}

export async function POST(req: Request) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const data = productSchema.parse(await req.json())
    const db = getDb()
    if (data.sku) {
      const existing = db.prepare('SELECT id FROM products WHERE sku = ?').get(data.sku)
      if (existing) return NextResponse.json({ error: 'sku_in_use' }, { status: 409 })
    }
    if (db.prepare('SELECT id FROM products WHERE slug = ?').get(data.slug)) {
      return NextResponse.json({ error: 'slug_in_use' }, { status: 409 })
    }
    const id = db.prepare(
      `INSERT INTO products (name, slug, description, short_desc, sku, status, category_id, base_price_cents,
        track_inventory, low_stock_threshold, weight_kg, dimensions_cm, materials, care, usage, restrictions,
        shipping_info, return_info, seo_title, seo_description, is_featured, test_data, created_by_id, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      auth.user.id,
      data.status === 'ACTIVE' ? new Date().toISOString() : null
    ).lastInsertRowid as unknown as string
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any
    return NextResponse.json({ product: productRow(row) }, { status: 201 })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
