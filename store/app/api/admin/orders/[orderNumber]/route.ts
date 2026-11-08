import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { addAuditLog } from '@/lib/audit'

export const runtime = 'nodejs'

const allowedStatus = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
const allowedPayment = ['UNPAID', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FAILED']
const allowedFulfillment = ['UNFULFILLED', 'PENDING', 'PARTIAL', 'FULFILLED']

export async function GET(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  const { orderNumber } = await params
  const db = getDb()
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber) as any
  if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
  return NextResponse.json({ order: { ...order, items } })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const { orderNumber } = await params
    const db = getDb()
    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber) as any
    if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    const body = await req.json()
    const updates: string[] = []
    const values: any[] = []
    const meta: any = {}
    if (body.status !== undefined) {
      if (!allowedStatus.includes(body.status)) return NextResponse.json({ error: 'invalid_status' }, { status: 400 })
      updates.push('status = ?'); values.push(body.status); meta.status = body.status
    }
    if (body.payment_status !== undefined) {
      if (!allowedPayment.includes(body.payment_status)) return NextResponse.json({ error: 'invalid_payment_status' }, { status: 400 })
      updates.push('payment_status = ?'); values.push(body.payment_status); meta.payment_status = body.payment_status
    }
    if (body.fulfillment_status !== undefined) {
      if (!allowedFulfillment.includes(body.fulfillment_status)) return NextResponse.json({ error: 'invalid_fulfillment_status' }, { status: 400 })
      updates.push('fulfillment_status = ?'); values.push(body.fulfillment_status); meta.fulfillment_status = body.fulfillment_status
    }
    if (updates.length) {
      values.push(order.id)
      db.prepare(`UPDATE orders SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = ?`).run(...values)
    }
    addAuditLog(db, auth.user.id, 'order.updated', 'order', order.id, { ...meta, order_number: order.orderNumber })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'server_error' }, { status: 500 })
  }
}
