import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getDb } from '@/lib/db'
import { addAuditLog } from '@/lib/audit'

export const runtime = 'nodejs'

export const config = { api: { bodyParser: false } }

const stripeKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const stripe = stripeKey && stripeKey.startsWith('sk_') ? new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' }) : null

async function fulfillOrder(db: any, paymentIntent: Stripe.PaymentIntent) {
  const order = db.prepare('SELECT * FROM orders WHERE stripe_payment_intent_id = ?').get(paymentIntent.id) as any
  if (!order) return
  const tx = db.transaction(() => {
    if (order.payment_status !== 'PAID') {
      db.prepare('UPDATE orders SET payment_status = \'PAID\', status = \'CONFIRMED\', updated_at = datetime(\'now\') WHERE id = ?').run(order.id)
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
      for (const it of items) {
        db.prepare('UPDATE variants SET stock = stock - ?, reserved = reserved - ? WHERE id = ?').run(it.quantity, it.quantity, it.variant_id)
      }
    }
    addAuditLog(db, 'system:stripe', 'order.paid', 'order', order.id, { order_number: order.orderNumber, amount: order.totalCents })
  })
  tx()
  return order
}

export async function POST(req: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 501 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `webhook_error: ${err.message}` }, { status: 400 })
  }

  const db = getDb()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await fulfillOrder(db, pi)
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const order = db.prepare('SELECT * FROM orders WHERE stripe_payment_intent_id = ?').get(pi.id) as any
        if (order && order.payment_status !== 'FAILED') {
          db.prepare('UPDATE orders SET payment_status = \'FAILED\', status = \'CANCELLED\', updated_at = datetime(\'now\') WHERE id = ?').run(order.id)
          const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
          for (const it of items) {
            db.prepare('UPDATE variants SET reserved = reserved - ? WHERE id = ? AND reserved > 0').run(it.quantity, it.variant_id)
          }
          addAuditLog(db, 'system:stripe', 'order.payment_failed', 'order', order.id, { order_number: order.orderNumber })
        }
        break
      }
      case 'charge.refunded': {
        const ch = event.data.object as Stripe.Charge
        const order = db.prepare('SELECT * FROM orders WHERE stripe_payment_intent_id = ?').get(ch.payment_intent as string) as any
        if (order) {
          db.prepare('UPDATE orders SET payment_status = \'REFUNDED\', status = \'REFUNDED\', updated_at = datetime(\'now\') WHERE id = ?').run(order.id)
          addAuditLog(db, 'system:stripe', 'order.refunded', 'order', order.id, { order_number: order.orderNumber, amount: ch.amount })
        }
        break
      }
    }
    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'server_error' }, { status: 500 })
  }
}
