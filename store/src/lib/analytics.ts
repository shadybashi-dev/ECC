/**
 * Lightweight, privacy-safe analytics events.
 * Events are stored in a local `analytics_events` table and can be exported
 * to an external analytics provider by the operator. No personal data is
 * sent to third parties by default.
 */

import { getDb } from '@/lib/db'

export type AnalyticsEvent =
  | { type: 'product_view'; productId: string; slug: string }
  | { type: 'add_to_cart'; variantId: string; quantity: number }
  | { type: 'checkout_started'; orderId: string; orderNumber: string; totalCents: number }
  | { type: 'purchase_confirmed'; orderId: string; orderNumber: string; totalCents: number }
  | { type: 'refunded'; orderId: string; orderNumber: string; amountCents: number }

export function recordEvent(event: AnalyticsEvent): void {
  try {
    const db = getDb()
    db.prepare(
      `INSERT INTO analytics_events (event_type, payload, created_at)
       VALUES (?, ?, datetime('now'))`
    ).run(event.type, JSON.stringify(event))
  } catch {
    // Analytics must never break the purchase flow.
  }
}
