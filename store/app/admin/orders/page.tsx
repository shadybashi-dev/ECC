import Link from 'next/link'
import { getDb } from '@/lib/db'

export default function AdminOrders() {
  const db = getDb()
  const orders = db.prepare(
    `SELECT o.order_number, o.email, o.status, o.payment_status, o.fulfillment_status, o.total_cents, o.currency, o.created_at
     FROM orders o
     ORDER BY o.created_at DESC
     LIMIT 100`
  ).all() as any[]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold brand-navy">Orders</h2>
      <div className="rounded-lg border border-brand-light overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-light bg-brand-light/50">
              <th className="px-4 py-3 text-brand-navy/60">Order</th>
              <th className="px-4 py-3 text-brand-navy/60">Email</th>
              <th className="px-4 py-3 text-brand-navy/60">Status</th>
              <th className="px-4 py-3 text-brand-navy/60">Payment</th>
              <th className="px-4 py-3 text-brand-navy/60">Fulfillment</th>
              <th className="px-4 py-3 text-brand-navy/60 text-right">Total</th>
              <th className="px-4 py-3 text-brand-navy/60 text-right">Date</th>
              <th className="px-4 py-3 text-brand-navy/60 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.order_number} className="border-b border-brand-light/50">
                <td className="px-4 py-2"><Link href={`/admin/orders/${o.order_number}`} className="font-bold brand-navy no-underline hover:underline">{o.order_number}</Link></td>
                <td className="px-4 py-2 text-brand-navy/60">{o.email}</td>
                <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColor(o.status)}`}>{o.status}</span></td>
                <td className="px-4 py-2">{o.payment_status}</td>
                <td className="px-4 py-2">{o.fulfillment_status}</td>
                <td className="px-4 py-2 text-right font-mono">${(o.total_cents / 100).toFixed(2)} {o.currency}</td>
                <td className="px-4 py-2 text-right text-brand-navy/40 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && <p className="text-brand-navy/50 text-sm">No orders yet.</p>}
    </div>
  )
}

function statusColor(s: string) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-indigo-100 text-indigo-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    REFUNDED: 'bg-red-100 text-red-700',
  }
  return map[s] || 'bg-brand-light text-brand-navy'
}
