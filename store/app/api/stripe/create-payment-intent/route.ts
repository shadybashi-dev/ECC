import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey && stripeKey.startsWith('sk_') ? new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' }) : null

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  const db = getDb()
  const user = token ? getSession(token) : null

  if (!stripe) {
    return NextResponse.json({ error: 'payment_not_configured' }, { status: 501 })
  }

  try {
    const { orderId } = await request.json()
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any
    if (!order) return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
    if (user && order.user_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    if (order.payment_status !== 'UNPAID') return NextResponse.json({ error: 'order_already_paid' }, { status: 409 })

    const idempotencyKey = order.idempotencyKey || `pi_${order.id}`
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalCents,
      currency: order.currency,
      metadata: { order_number: order.orderNumber, order_id: order.id },
      idempotencyKey,
    })

    db.prepare('UPDATE orders SET stripe_payment_intent_id = ?, updated_at = datetime(\'now\') WHERE id = ?').run(paymentIntent.id, order.id)

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderNumber: order.orderNumber })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'server_error' }, { status: 500 })
  }
}
