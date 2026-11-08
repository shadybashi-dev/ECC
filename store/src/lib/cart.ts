import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { randomBytes } from 'node:crypto'

export function getCartId(cookieStore: ReturnType<typeof cookies>): string {
  const existing = cookieStore.get('cart_session')?.value
  if (existing) return existing
  const cryptoId = randomBytes(16).toString('hex')
  cookieStore.set('cart_session', cryptoId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return cryptoId
}

export async function resolveCart(cookieStore: ReturnType<typeof cookies>) {
  const db = getDb()
  const token = cookieStore.get('session')?.value
  const user = token ? getSession(token) : null

  if (user) {
    let cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(user.id) as any
    if (!cart) {
      const id = randomBytes(16).toString('hex')
      const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000).toISOString()
      db.prepare('INSERT INTO carts (id, user_id, expires_at) VALUES (?, ?, ?)').run(id, user.id, expiresAt)
      cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(id) as any
    }
    const anonId = cookieStore.get('cart_session')?.value
    if (anonId) {
      const anon = db.prepare('SELECT * FROM carts WHERE session_id = ? AND user_id IS NULL').get(anonId) as any
      if (anon) {
        const items = db.prepare('SELECT * FROM cart_items WHERE cart_id = ?').all(anon.id)
        for (const it of items) {
          const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND variant_id = ?').get(cart.id, it.variant_id)
          if (existing) {
            db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(it.quantity, existing.id)
          } else {
            db.prepare('UPDATE cart_items SET cart_id = ? WHERE id = ?').run(cart.id, it.id)
          }
        }
        db.prepare('DELETE FROM carts WHERE id = ?').run(anon.id)
        cookieStore.set('cart_session', '', { maxAge: 0, path: '/' })
      }
    }
    return cart
  }

  const cartSessionId = getCartId(cookieStore)
  let cart = db.prepare('SELECT * FROM carts WHERE session_id = ? AND user_id IS NULL').get(cartSessionId) as any
  if (!cart) {
    const id = randomBytes(16).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000).toISOString()
    db.prepare('INSERT INTO carts (id, session_id, expires_at) VALUES (?, ?, ?)').run(id, cartSessionId, expiresAt)
    cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(id) as any
  }
  return cart
}

export async function cartItems(db: any, cartId: string) {
  return db.prepare(
    `SELECT ci.id, ci.variant_id, ci.quantity,
            v.sku, v.name AS variant_name, v.price_adj_cents, v.stock, v.active,
            p.id AS product_id, p.slug AS product_slug, p.name AS product_name, p.base_price_cents, p.status, p.test_data
     FROM cart_items ci
     JOIN variants v ON v.id = ci.variant_id
     JOIN products p ON p.id = v.product_id
     WHERE ci.cart_id = ?`
  ).all(cartId)
}
