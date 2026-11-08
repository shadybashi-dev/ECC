import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export default async function AuditLogPage() {
  const db = getDb()
  const rows = db.prepare(
    `SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 100`
  ).all() as any[]

  return (
    <div className="px-3 py-8 md:px-4 md:py-14 lg:px-0 flex-grow">
      <div className="container max-w-6xl">
        <nav className="mb-6 text-xs text-brand-navy/60"><a href="/admin" className="no-underline hover:underline">Admin</a> <span className="mx-1 text-brand-navy/30">/</span> <span className="brand-navy font-medium">Audit log</span></nav>
        <h1 className="text-2xl font-bold brand-navy mb-2">Audit log</h1>
        <p className="text-brand-navy/60 mb-8">Operator actions are recorded for accountability. This list shows the most recent 100 events.</p>
        <div className="rounded-lg border border-brand-light overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-brand-light bg-brand-light/50">
              <th className="px-4 py-3 font-bold brand-navy">Time</th>
              <th className="px-4 py-3 font-bold brand-navy">Actor</th>
              <th className="px-4 py-3 font-bold brand-navy">Action</th>
              <th className="px-4 py-3 font-bold brand-navy">Target</th>
              <th className="px-4 py-3 font-bold brand-navy text-right">Details</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-brand-light/50">
                  <td className="px-4 py-2 font-mono text-xs text-brand-navy/40">{r.created_at}</td>
                  <td className="px-4 py-2 text-brand-navy/70">{r.actor_email}</td>
                  <td className="px-4 py-2 font-bold text-brand-navy">{r.action}</td>
                  <td className="px-4 py-2 text-brand-navy/70">{r.target_type || '—'}</td>
                  <td className="px-4 py-2 text-right"><a href={`/admin/audit-log/${r.id}`} className="text-xs underline text-brand-yellow no-underline hover:text-brand-yellow-light">View</a></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-brand-navy/60">No audit events recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
