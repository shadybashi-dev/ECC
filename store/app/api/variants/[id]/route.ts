import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'

export const runtime = 'nodejs'

const updateSchema = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
  priceAdjCents: z.number().int().optional(),
  stock: z.number().int().min(0).optional(),
  reserved: z.number().int().min(0).optional(),
  isDefault: z.boolean().optional(),
  barCode: z.string().optional().or(z.literal('')),
  weightKg: z.number().optional(),
  active: z.boolean().optional(),
})

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const { id } = await params
    const data = updateSchema.parse(await req.json())
    const db = getDb()
    const variant = db.prepare('SELECT * FROM variants WHERE id = ?').get(id)
    if (!variant) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    if (data.isDefault) {
      db.prepare('UPDATE variants SET is_default = 0 WHERE product_id = ?').run(variant.product_id)
    }
    const fields: string[] = []
    const values: any[] = []
    for (const [k, v] of Object.entries(data)) {
      if (v === undefined) continue
      fields.push(`${k} = ?`)
      values.push(k === 'isDefault' || k === 'active' ? (v ? 1 : 0) : v)
    }
    if (fields.length) {
      values.push(id)
      db.prepare(`UPDATE variants SET ${fields.join(', ')} WHERE id = ?`).run(...values)
    }
    const row = db.prepare('SELECT * FROM variants WHERE id = ?').get(id) as any
    return NextResponse.json({ variant: row })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireRole(_req, ['ADMIN'])
  if (auth instanceof Response) return auth
  const { id } = await params
  const db = getDb()
  const variant = db.prepare('SELECT * FROM variants WHERE id = ?').get(id)
  if (!variant) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const inUse = db.prepare('SELECT id FROM order_items WHERE variant_id = ? LIMIT 1').get(id)
  if (inUse) return NextResponse.json({ error: 'variant_in_use' }, { status: 409 })
  db.prepare('DELETE FROM variants WHERE id = ?').run(id)
  return NextResponse.json({ ok: true })
}
