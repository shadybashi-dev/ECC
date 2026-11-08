import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { resolveCart } from '@/lib/cart'
import { recordEvent } from '@/lib/analytics'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  const db = getDb()
  const user = token ? getSession(token) : null
  if (!user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 })
  const sql = `SELECT * FROM orders WHERE user_id = ? OR email = ? ORDER BY created_at DESC LIMIT 50`
  const rows = db.prepare(sql).all(user.id, user.email) as any[]
  return NextResponse.json({ orders: rows.map((r: any) => ({ ...r, items: [] })) })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const cart = await resolveCart(cookieStore)
  const db = getDb()
  const token = cookieStore.get('session')?.value
  const user = token ? getSession(token) : null

  try {
    const body = await request.json()
    const { email, shippingAddress, billingAddress, notes, idempotencyKey } = body
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'email_required' }, { status: 400 })
    }

    const items = db.prepare(
      `SELECT ci.id, ci.variant_id, ci.quantity, v.sku, v.name AS variant_name, v.stock, v.reserved,
              p.id AS product_id, p.name AS product_name, p.slug AS product_slug, p.base_price_cents,
              v.price_adj_cents
       FROM cart_items ci
       JOIN variants v ON v.id = ci.variant_id
       JOIN products p ON p.id = v.product_id
       WHERE ci.cart_id = ?`
    ).all(cart.id) as any[]
    if (!items.length) return NextResponse.json({ error: 'cart_empty' }, { status: 409 })

    for (const it of items) {
      const available = it.stock - it.reserved
      if (it.quantity > available) {
        return NextResponse.json({ error: 'insufficient_stock', variant: it.sku, available }, { status: 409 })
      }
    }

    const subtotal = items.reduce((s: number, it: any) => s + (it.base_price_cents + it.price_adj_cents) * it.quantity, 0)
    const shippingCents = 0
    const taxCents = 0
    const discountCents = 0
    const totalCents = subtotal + taxCents + shippingCents - discountCents

    const orderNumber = 'MO-' + randomBytes(6).toString('hex').toUpperCase()
    const emailForOrder = user ? user.email : email

    let orderId: string
    const tx = () => {
      const info = db.prepare(
        `INSERT INTO orders (order_number, user_id, email, status, payment_status, fulfillment_status,
          subtotal_cents, tax_cents, shipping_cents, discount_cents, total_cents, currency,
          idempotency_key, billing_address, shipping_address, notes)
         VALUES (?, ?, ?, 'PENDING', 'UNPAID', 'UNFULFILLED', ?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?)`
      ).run(
        orderNumber,
        user ? user.id : null,
        emailForOrder,
        subtotal,
        taxCents,
        shippingCents,
        discountCents,
        totalCents,
        idempotencyKey || null,
        JSON.stringify(billingAddress || null),
        JSON.stringify(shippingAddress || null),
        notes || null
      )
      const inserted = db.prepare('SELECT id FROM orders WHERE order_number = ?').get(orderNumber) as { id: string }
      orderId = inserted.id
      for (const it of items) {
        db.prepare(
          `INSERT INTO order_items (order_id, variant_id, product_id, sku, name, quantity, unit_price_cents, price_adj_cents, total_cents)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(orderId, it.variant_id, it.product_id, it.sku, it.variant_name, it.quantity, it.base_price_cents, it.price_adj_cents, (it.base_price_cents + it.price_adj_cents) * it.quantity)
        db.prepare('UPDATE variants SET reserved = reserved + ? WHERE id = ?').run(it.quantity, it.variant_id)
      }
      db.prepare('UPDATE carts SET updated_at = datetime(\'now\') WHERE id = ?').run(cart.id)
    }
    const trans = db.transaction(tx)
    trans()
    try {
      recordEvent({ type: 'checkout_started', orderId, orderNumber, totalCents })
    } catch {}

    return NextResponse.json({ orderId, orderNumber, totalCents, currency: 'USD' }, { status: 201 })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
