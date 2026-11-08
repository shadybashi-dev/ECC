'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Order = {
  id: string; order_number: string; email: string; status: string; payment_status: string;
  fulfillment_status: string; total_cents: number; currency: string; created_at: string;
  items: Array<{ id: string; sku: string; name: string; quantity: number; unit_price_cents: number; total_cents: number }>;
}

export default function AdminOrderPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const orderNumber = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : ''

  useEffect(() => {
    load()
  }, [orderNumber])

  async function load() {
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Not found')
      const json = await res.json()
      setOrder(json.order)
    } catch (err: any) {
      setError(err.message || 'Failed to load order')
    } finally { setLoading(false) }
  }

  async function updateStatus(field: 'status' | 'payment_status' | 'fulfillment_status', value: string) {
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed')
      load()
    } catch (err: any) {
      setError(err.message || 'Update failed')
    }
  }

  const opts = (arr: string[]) => arr.map((s) => <option key={s} value={s}>{s}</option>)

  if (loading) return <div className="p-6 text-brand-navy/60">Loading…</div>
  if (!order) return <div className="p-6">{error || 'Not found'}</div>

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="text-brand-navy no-underline hover:underline">← Back to orders</Link>
        <span className="text-xs text-brand-navy/40 font-mono">{order.order_number}</span>
      </div>
      {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card field="status" label="Order status" value={order.status} options={['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED']} onChange={(v) => updateStatus('status', v)} />
        <Card field="payment_status" label="Payment" value={order.payment_status} options={['UNPAID','PAID','PARTIALLY_REFUNDED','REFUNDED','FAILED']} onChange={(v) => updateStatus('payment_status', v)} />
        <Card field="fulfillment_status" label="Fulfillment" value={order.fulfillment_status} options={['UNFULFILLED','PENDING','PARTIAL','FULFILLED']} onChange={(v) => updateStatus('fulfillment_status', v)} />
      </div>
      <div className="rounded-lg border border-brand-light overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-brand-light bg-brand-light/50"><th className="px-4 py-3">Item</th><th className="px-4 py-3 text-right">SKU</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Unit</th><th className="px-4 py-3 text-right">Total</th></tr></thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-b border-brand-light/50">
                <td className="px-4 py-2">{it.name}</td>
                <td className="px-4 py-2 text-right font-mono text-brand-navy/40">{it.sku}</td>
                <td className="px-4 py-2 text-right">{it.quantity}</td>
                <td className="px-4 py-2 text-right">${(it.unit_price_cents / 100).toFixed(2)}</td>
                <td className="px-4 py-2 text-right">${(it.total_cents / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-right"><div className="text-sm text-brand-navy/40">Total</div><div className="font-bold text-xl brand-navy-dark">${(order.total_cents / 100).toFixed(2)} {order.currency}</div></div>
        <div className="text-right text-sm text-brand-navy/60">{order.email}</div>
      </div>
    </div>
  )
}

function Card({ field, label, value, options, onChange }: { field: string; label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="p-3 rounded border border-brand-light bg-brand-warm-white">
      <div className="text-xs text-brand-navy/40">{label}</div>
      <select defaultValue={value} onChange={(e) => onChange(e.target.value)} className="mt-1 border border-brand-light rounded px-2 py-1 text-sm bg-brand-warm-white w-full">
        {opts(options)}
      </select>
    </div>
  )
}
