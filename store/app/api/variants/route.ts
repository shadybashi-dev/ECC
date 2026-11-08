import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { variantSchema } from '@/lib/validators'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('product_id')
  if (!productId) return NextResponse.json({ error: 'product_id_required' }, { status: 400 })
  const rows = db.prepare('SELECT * FROM variants WHERE product_id = ? ORDER BY is_default DESC, id ASC').all(productId) as any[]
  return NextResponse.json({ variants: rows })
}

export async function POST(req: Request) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const data = variantSchema.parse(await req.json())
    const db = getDb()
    if (db.prepare('SELECT id FROM variants WHERE sku = ?').get(data.sku)) {
      return NextResponse.json({ error: 'sku_in_use' }, { status: 409 })
    }
    if (data.barCode && db.prepare('SELECT id FROM variants WHERE bar_code = ?').get(data.barCode)) {
      return NextResponse.json({ error: 'barcode_in_use' }, { status: 409 })
    }
    if (data.isDefault) {
      db.prepare('UPDATE variants SET is_default = 0 WHERE product_id = ?').run(data.productId)
    }
    const id = db.prepare(
      `INSERT INTO variants (product_id, sku, name, price_adj_cents, stock, reserved, is_default, bar_code, weight_kg, active)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`
    ).run(
      data.productId,
      data.sku,
      data.name,
      data.priceAdjCents ?? 0,
      data.stock ?? 0,
      data.isDefault ?? false ? 1 : 0,
      data.barCode || null,
      data.weightKg ?? null,
      data.active ?? true ? 1 : 0
    ).lastInsertRowid as unknown as string
    const row = db.prepare('SELECT * FROM variants WHERE id = ?').get(id) as any
    return NextResponse.json({ variant: row }, { status: 201 })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
