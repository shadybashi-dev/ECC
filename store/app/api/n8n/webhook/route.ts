import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

/**
 * n8n webhook receiver stub.
 *
 * These endpoints are intentionally minimal. They receive webhooks from n8n
 * and persist them for review. No financial action (price change, purchase,
 * refund, publish, email send) is performed here — those require explicit
 * operator approval and a verified sender/payment account.
 *
 * To wire real n8n automation, point n8n webhooks at these URLs and replace
 * the placeholder logic with validated, scope-limited actions.
 */

const allowedTopics = [
  'product-research',
  'supplier-offers',
  'content-drafts',
  'order-exceptions',
  'customer-service',
  'revenue-reconciliation',
]

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const topic = searchParams.get('topic')
    if (!topic || !allowedTopics.includes(topic)) {
      return NextResponse.json({ error: 'invalid_topic' }, { status: 400 })
    }
    const payload = await req.json().catch(() => ({}))
    const db = getDb()
    db.prepare(
      `INSERT INTO n8n_webhooks (topic, payload, received_at)
       VALUES (?, ?, datetime('now'))`
    ).run(topic, JSON.stringify(payload))
    return NextResponse.json({ ok: true, topic, received: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
