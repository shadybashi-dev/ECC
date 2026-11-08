import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { cartItemSchema } from '@/lib/validators'
import { resolveCart, cartItems } from '@/lib/cart'

export const runtime = 'nodejs'

export async function GET(_request: Request) {
  const cookieStore = await cookies()
  const cart = await resolveCart(cookieStore)
  const db = getDb()
  const items = await cartItems(db, cart.id)
  const enriched = items.map((it: any) => ({
    id: it.id,
    variantId: it.variant_id,
    quantity: it.quantity,
    variant: {
      sku: it.sku,
      name: it.variant_name,
      priceAdjCents: it.price_adj_cents,
      stock: it.stock,
      active: it.active === 1,
    },
    product: {
      id: it.product_id,
      slug: it.product_slug,
      name: it.product_name,
      basePriceCents: it.base_price_cents,
      status: it.status,
      testData: it.test_data === 1,
    },
    unitPriceCents: it.base_price_cents + it.price_adj_cents,
    lineTotalCents: (it.base_price_cents + it.price_adj_cents) * it.quantity,
  }))
  const subtotal = enriched.reduce((s: number, it: any) => s + it.lineTotalCents, 0)
  return NextResponse.json({ cart: { id: cart.id, items: enriched, subtotalCents: subtotal, itemCount: enriched.reduce((s: number, it: any) => s + it.quantity, 0) } })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const cart = await resolveCart(cookieStore)
  const db = getDb()
  try {
    const data = cartItemSchema.parse(await request.json())
    const variant = db.prepare('SELECT v.*, p.status, p.test_data FROM variants v JOIN products p ON p.id = v.product_id WHERE v.id = ?').get(data.variantId) as any
    if (!variant) return NextResponse.json({ error: 'variant_not_found' }, { status: 404 })
    if (variant.active !== 1) return NextResponse.json({ error: 'variant_inactive' }, { status: 409 })
    if (variant.status !== 'ACTIVE' || variant.test_data === 1) {
      return NextResponse.json({ error: 'variant_not_purchasable' }, { status: 409 })
    }
    const available = variant.stock - variant.reserved
    const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND variant_id = ?').get(cart.id, data.variantId)
    const totalQty = (existing?.quantity || 0) + data.quantity
    if (totalQty > available) {
      return NextResponse.json({ error: 'insufficient_stock', available, inCart: existing?.quantity || 0 }, { status: 409 })
    }
    if (existing) {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(totalQty, existing.id)
    } else {
      db.prepare('INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)').run(cart.id, data.variantId, data.quantity)
    }
    db.prepare('UPDATE carts SET updated_at = datetime(\'now\') WHERE id = ?').run(cart.id)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const cart = await resolveCart(cookieStore)
  const db = getDb()
  db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id)
  db.prepare('UPDATE carts SET updated_at = datetime(\'now\') WHERE id = ?').run(cart.id)
  return NextResponse.json({ ok: true })
}
