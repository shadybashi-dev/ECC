import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { orderNumber, email } = await req.json()
    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }
    const db = getDb()
    const order = db.prepare(
      'SELECT * FROM orders WHERE order_number = ? AND lower(email) = lower(?)'
    ).get(orderNumber, email) as any
    if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
    return NextResponse.json({ order: { ...order, items } })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
