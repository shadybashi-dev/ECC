import { getDb } from '@/lib/db'

export default function SystemHealthPage() {
  const db = getDb()
  const orderCount = db.prepare('SELECT COUNT(*) AS c FROM orders').get() as { c: number }
  const paid = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE payment_status = 'PAID'").get() as { c: number }
  const failed = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE payment_status = 'FAILED'").get() as { c: number }
  const refunded = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE payment_status = 'REFUNDED'").get() as { c: number }
  const pending = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE status = 'PENDING'").get() as { c: number }
  const productCount = db.prepare("SELECT COUNT(*) AS c FROM products WHERE status = 'ACTIVE' AND test_data = 0").get() as { c: number }
  const draftCount = db.prepare("SELECT COUNT(*) AS c FROM products WHERE status = 'DRAFT'").get() as { c: number }
  const migrations = db.prepare('SELECT * FROM schema_migrations ORDER BY id DESC LIMIT 5').all() as any[]
  const webhooks = db.prepare('SELECT COUNT(*) AS c FROM n8n_webhooks').get() as { c: number }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h2 className="text-lg font-bold brand-navy">System health</h2>
      <p className="text-brand-navy/60 text-sm">Operational status for the operator. No personal data is shown.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Orders" value={orderCount.c.toLocaleString()} />
        <StatCard label="Paid" value={paid.toLocaleString()} />
        <StatCard label="Failed payments" value={failed.toLocaleString()} variant="warn" />
        <StatCard label="Refunded" value={refunded.toLocaleString()} variant="warn" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending orders" value={pending.toLocaleString()} />
        <StatCard label="Active products" value={productCount.toLocaleString()} />
        <StatCard label="Draft products" value={draftCount.toLocaleString()} />
        <StatCard label="n8n webhooks received" value={webhooks.c.toLocaleString()} />
      </div>
      <div className="rounded-lg border border-brand-light overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-brand-light bg-brand-light/50"><th className="px-4 py-3">Migration</th><th className="px-4 py-3">Applied at</th></tr></thead>
          <tbody>
            {migrations.map((m) => (
              <tr key={m.name} className="border-b border-brand-light/50">
                <td className="px-4 py-2 font-mono text-brand-navy/40">{m.name}</td>
                <td className="px-4 py-2 text-brand-navy/60">{m.applied_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
