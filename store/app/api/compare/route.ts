import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slugs = searchParams.getAll('slug')
  if (!slugs.length) return NextResponse.json({ products: [] })

  const db = getDb()
  const placeholders = slugs.map(() => '?').join(',')
  const rows = db.prepare(
    `SELECT p.*, c.name AS category_name
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug IN (${placeholders}) AND p.status = 'ACTIVE' AND p.test_data = 0`
  ).all(slugs) as any[]

  return NextResponse.json({
    products: rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      price: (r.base_price_cents / 100).toFixed(2),
      stock: r.stock || 0,
      status: r.status,
    })),
  })
}
