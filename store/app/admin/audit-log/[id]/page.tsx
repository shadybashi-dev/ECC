import { getDb } from '@/lib/db'

export default function AuditLogDetailPage({ params }: { params: { id: string } }) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM audit_log WHERE id = ?').get(params.id) as any
  if (!row) return <div className="p-6">Not found</div>

  return (
    <div className="px-3 py-8 md:px-4 md:py-14 lg:px-0 flex-grow">
      <div className="container max-w-3xl">
        <nav className="mb-6 text-xs text-brand-navy/60"><a href="/admin/audit-log" className="no-underline hover:underline">Audit log</a> <span className="mx-1 text-brand-navy/30">/</span> <span className="brand-navy font-medium">Event details</span></nav>
        <h1 className="text-2xl font-bold brand-navy mb-2">Audit event details</h1>
        <div className="bg-brand-warm-white p-6 rounded-lg border border-brand-light">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <dt className="font-bold brand-navy">Time</dt><dd className="text-brand-navy/70">{row.created_at}</dd>
            <dt className="font-bold brand-navy">Actor</dt><dd className="text-brand-navy/70">{row.actor_email}</dd>
            <dt className="font-bold brand-navy">Action</dt><dd className="text-brand-navy/70 font-bold">{row.action}</dd>
            <dt className="font-bold brand-navy">Target type</dt><dd className="text-brand-navy/70">{row.target_type || '—'}</dd>
            <dt className="font-bold brand-navy">Target ID</dt><dd className="text-brand-navy/70">{row.target_id || '—'}</dd>
          </dl>
          {row.details && (
            <div className="mt-6">
              <h3 className="text-sm font-bold brand-navy mb-2">Details</h3>
              <pre className="p-3 rounded bg-brand-light text-brand-navy text-xs overflow-x-auto">{row.details}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
