import { getDb } from '@/lib/db'

export default function AdminDashboard() {
  const db = getDb()
  const orderCount = db.prepare('SELECT COUNT(*) AS c FROM orders').get() as { c: number }
  const revenue = db.prepare("SELECT COALESCE(SUM(total_cents), 0) AS c FROM orders WHERE payment_status = 'PAID'").get() as { c: number }
  const pending = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE status = 'PENDING'").get() as { c: number }
  const refunded = db.prepare("SELECT COALESCE(SUM(total_cents), 0) AS c FROM orders WHERE payment_status = 'REFUNDED'").get() as { c: number }
  const lowStock = db.prepare(
    `SELECT COUNT(*) AS c FROM variants v JOIN products p ON p.id = v.product_id WHERE v.active = 1 AND p.status = 'ACTIVE' AND v.stock - v.reserved <= v.stock AND (v.stock - v.reserved) <= (SELECT COALESCE(MIN(low_stock_threshold), 5) FROM products) AND v.stock - v.reserved <= 5`
  ).get() as { c: number }
  const productCount = db.prepare("SELECT COUNT(*) AS c FROM products WHERE status = 'ACTIVE' AND test_data = 0").get() as { c: number }

  const analytics = db.prepare(
    `SELECT event_type, COUNT(*) AS count FROM analytics_events GROUP BY event_type ORDER BY count DESC`
  ).all() as Array<{ event_type: string; count: number }>

  const eventMap: Record<string, number> = {}
  for (const row of analytics) eventMap[row.event_type] = row.count

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold brand-navy">Dashboard</h2>
      <p className="text-brand-navy/60 text-sm">Store overview. Test-data items are excluded.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products (active)" value={productCount.toLocaleString()} />
        <StatCard label="Orders" value={orderCount.c.toLocaleString()} />
        <StatCard label="Revenue (paid)" value={`${(revenue.c / 100).toFixed(2)} USD`} />
        <StatCard label="Refunded" value={`${(refunded.c / 100).toFixed(2)} USD`} variant="warn" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending orders" value={pending.c.toLocaleString()} />
        <StatCard label="Low-stock variants" value={lowStock.c.toLocaleString()} variant="warn" />
        <StatCard label="Product views" value={(eventMap['product_view'] || 0).toLocaleString()} />
        <StatCard label="Add to cart" value={(eventMap['add_to_cart'] || 0).toLocaleString()} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Checkout started" value={(eventMap['checkout_started'] || 0).toLocaleString()} />
        <StatCard label="Purchase confirmed" value={(eventMap['purchase_confirmed'] || 0).toLocaleString()} />
        <StatCard label="Refund events" value={(eventMap['refunded'] || 0).toLocaleString()} variant="warn" />
        {orderCount.c > 0 && (
          <StatCard label="Conversion (est.)" value={`${(((eventMap['purchase_confirmed'] || 0) / Math.max(eventMap['product_view'] || 1, 1)) * 100).toFixed(1)}%`} />
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, variant }: { label: string; value: string; variant?: 'default' | 'warn' }) {
  return (
    <div className="p-4 rounded-lg border border-brand-light bg-brand-warm-white">
      <p className="text-xs text-brand-navy/50 font-medium">{label}</p>
      <p className="mt-1 text-xl font-bold {variant === 'warn' ? 'text-brand-navy-dark' : 'text-brand-navy'}">{value}</p>
    </div>
  )
}
