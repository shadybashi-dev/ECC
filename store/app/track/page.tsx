'use client'

import { useState } from 'react'

type Order = {
  order_number: string; email: string; status: string; payment_status: string;
  fulfillment_status: string; total_cents: number; currency: string; created_at: string;
  items: Array<{ id: string; sku: string; name: string; quantity: number; unit_price_cents: number; total_cents: number }>;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Order not found')
      setOrder(json.order)
    } catch (err: any) {
      setError(err.message || 'Order not found. Please check your order number and email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-md mx-auto">
        <h1 className="text-2xl font-bold brand-navy mb-2">Track your order</h1>
        <p className="text-brand-navy/60 mb-8">Enter your order number and email address to check the status.</p>
        {error && <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
        {order && (
          <div className="mb-6 p-4 rounded bg-brand-light border border-brand-primary">
            <h2 className="font-bold brand-navy mb-2">Order {order.order_number}</h2>
            <div className="grid gap-2 text-sm">
              <div><span className="font-bold brand-navy">Status:</span> {order.status}</div>
              <div><span className="font-bold brand-navy">Payment:</span> {order.payment_status}</div>
              <div><span className="font-bold brand-navy">Fulfillment:</span> {order.fulfillment_status}</div>
              <div><span className="font-bold brand-navy">Total:</span> ${(order.total_cents / 100).toFixed(2)} {order.currency}</div>
              <div><span className="font-bold brand-navy">Date:</span> {new Date(order.created_at).toLocaleDateString()}</div>
            </div>
            <h3 className="font-bold brand-navy mt-4 mb-2">Items</h3>
            <ul className="space-y-2 text-brand-navy/70">
              {order.items.map((it) => (
                <li key={it.id} className="flex justify-between border-b border-brand-light/30 pb-2">
                  <span>{it.name} <span className="text-brand-navy/40 text-xs">({it.sku})</span></span>
                  <span>${(it.total_cents / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium brand-navy mb-1">Order number</label>
            <input required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium brand-navy mb-1">Email address</label>
            <input type="email" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-yellow text-brand-navy-dark font-bold py-3 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50">
            {loading ? 'Checking…' : 'Track order'}
          </button>
        </form>
      </div>
    </div>
  )
}
