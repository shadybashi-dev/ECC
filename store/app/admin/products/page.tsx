'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const res = await fetch('/api/products?limit=200&test_data=0', { cache: 'no-store' })
      const json = await res.json()
      setProducts(json.products || [])
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.slug.toLowerCase().includes(filter.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold brand-navy">Products</h2>
        <Link href="/admin/products/new" className="bg-brand-yellow text-brand-navy-dark font-bold px-4 py-2 rounded-md no-underline hover:bg-brand-yellow-light transition">Add product</Link>
      </div>
      <div className="relative">
        <input type="text" placeholder="Search by name, slug or SKU" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy pl-9 focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
        <div className="absolute left-3 top-2.5 text-brand-navy/40">🔍</div>
      </div>
      {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="rounded-lg border border-brand-light overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-light bg-brand-light/50">
              <th className="px-4 py-3 text-brand-navy/60 font-medium">Product</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium">Status</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right">Price</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right">Stock</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right">Updated</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-4 text-brand-navy/60 text-center">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-4 text-brand-navy/50 text-center">No products found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-brand-light/50 hover:bg-brand-light/30 transition">
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.slug}`} className="font-bold brand-navy no-underline hover:underline">{p.name}</Link>
                    {p.test_data && <span className="ml-2 text-[10px] border border-brand-navy/30 text-brand-navy/50 px-1.5 py-0 rounded">test</span>}
                  </td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'ACTIVE' ? 'bg-brand-light/50 text-brand-navy' : 'bg-brand-navy/10 text-brand-navy/60'}`}>{p.status}</span></td>
                  <td className="px-4 py-3 text-right font-mono">${(p.base_price_cents || 0) / 100}</td>
                  <td className="px-4 py-3 text-right font-mono">{p.available_stock ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-brand-navy/40 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right"><Link href={`/admin/products/${p.slug}`} className="text-xs underline text-brand-navy hover:text-brand-navy-dark">Edit</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
