import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { resolveCart, cartItems } from '@/lib/cart'
import { z } from 'zod'

export const runtime = 'nodejs'

const qtySchema = z.object({ quantity: z.number().int().min(0).max(99) })

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const cart = await resolveCart(cookieStore)
  const db = getDb()
  try {
    const { id } = await params
    const { quantity } = qtySchema.parse(await request.json())
    const item = db.prepare('SELECT * FROM cart_items WHERE id = ? AND cart_id = ?').get(id, cart.id)
    if (!item) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    const variant = db.prepare('SELECT stock, reserved FROM variants WHERE id = ?').get(item.variant_id) as any
    const available = variant.stock - variant.reserved
    if (quantity > 0 && quantity > available) {
      return NextResponse.json({ error: 'insufficient_stock', available }, { status: 409 })
    }
    if (quantity === 0) {
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(id)
    } else {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, id)
    }
    db.prepare('UPDATE carts SET updated_at = datetime(\'now\') WHERE id = ?').run(cart.id)
    const items = await cartItems(db, cart.id)
    return NextResponse.json({ ok: true, items })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const cart = await resolveCart(cookieStore)
  const db = getDb()
  const { id } = await params
  db.prepare('DELETE FROM cart_items WHERE id = ? AND cart_id = ?').run(id, cart.id)
  db.prepare('UPDATE carts SET updated_at = datetime(\'now\') WHERE id = ?').run(cart.id)
  return NextResponse.json({ ok: true })
}
