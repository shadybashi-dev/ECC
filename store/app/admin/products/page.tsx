import Link from 'next/link'
import { getDb } from '@/lib/db'

export default function AdminProducts() {
  const db = getDb()
  const products = db.prepare(
    `SELECT p.id, p.name, p.slug, p.status, p.base_price_cents, p.test_data, p.created_at,
            (SELECT COUNT(*) FROM variants v WHERE v.product_id = p.id) AS variant_count,
            (SELECT COALESCE(SUM(v.stock - v.reserved), 0) FROM variants v WHERE v.product_id = p.id) AS available_stock
     FROM products p
     ORDER BY p.created_at DESC`
  ).all() as Array<{ id: string; name: string; slug: string; status: string; base_price_cents: number; test_data: number; created_at: string; variant_count: number; available_stock: number }>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold brand-navy">Products</h2>
        <Link href="/admin/products/new" className="bg-brand-yellow text-brand-navy-dark font-bold px-4 py-2 rounded-md no-underline hover:bg-brand-yellow-light transition">Add product</Link>
      </div>
      <div className="rounded-lg border border-brand-light overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-light bg-brand-light/50">
              <th className="px-4 py-3 text-brand-navy/60 font-medium">Product</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium">Status</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right">Price</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right">Variants</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right">Available</th>
              <th className="px-4 py-3 text-brand-navy/60 font-medium text-right">Updated</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-brand-light/50 hover:bg-brand-light/30 transition">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.slug}`} className="font-bold brand-navy no-underline hover:underline">{p.name}</Link>
                  {p.test_data && <span className="ml-2 text-[10px] border border-brand-navy/30 text-brand-navy/50 px-1.5 py-0 rounded">test</span>}
                </td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge(p.status)}`}>{p.status}</span></td>
                <td className="px-4 py-3 text-right font-mono">${(p.base_price_cents / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">{p.variant_count}</td>
                <td className="px-4 py-3 text-right font-mono">{p.available_stock}</td>
                <td className="px-4 py-3 text-right text-brand-navy/40 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {products.length === 0 && <p className="text-brand-navy/50 text-sm">No products yet.</p>}
    </div>
  )
}

function statusBadge(status: string) {
  switch (status) {
    case 'ACTIVE': return 'bg-brand-light/50 text-brand-navy'
    case 'DRAFT': return 'bg-brand-navy/10 text-brand-navy/60'
    case 'ARCHIVED': return 'bg-red-50 text-red-600'
    default: return 'text-brand-navy/60'
  }
}
