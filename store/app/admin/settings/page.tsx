'use client'

import { useEffect, useState } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Array<{ key: string; value: string }>>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' })
      const json = await res.json()
      setSettings(json.settings || [])
    } catch {
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  async function save(key: string) {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      if (!res.ok) throw new Error('Save failed')
      setEditing(null)
      setValue('')
      load()
    } catch {
      setError('Save failed')
    }
  }

  if (loading) return <div className="p-6 text-brand-navy/60">Loading…</div>

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold brand-navy">Store settings</h2>
      <p className="text-brand-navy/60 text-sm">Operator-configurable values. Changes apply immediately.</p>
      {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-brand-warm-white p-5 rounded-lg border border-brand-light">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-brand-light bg-brand-light/50"><th className="px-4 py-3">Key</th><th className="px-4 py-3">Value</th><th className="px-4 py-3 text-right"></th></tr></thead>
          <tbody>
            {settings.map((s) => editing === s.key ? (
              <tr key={s.key} className="border-b border-brand-light/50">
                <td className="px-4 py-2 font-mono text-brand-navy/40">{s.key}</td>
                <td className="px-4 py-2"><input className="border border-brand-light rounded px-2 py-1 text-brand-navy w-full" defaultValue={s.value} onChange={(e) => setValue(e.target.value)} /></td>
                <td className="px-4 py-2 text-right">
                  <button onClick={() => save(s.key)} className="text-xs bg-brand-yellow text-brand-navy-dark font-bold px-2 py-1 rounded hover:bg-brand-yellow-light">Save</button>
                  <button onClick={() => { setEditing(null); setValue('') }} className="ml-2 text-xs underline text-brand-navy/50 hover:text-brand-navy">Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={s.key} className="border-b border-brand-light/50">
                <td className="px-4 py-2 font-mono text-brand-navy/40">{s.key}</td>
                <td className="px-4 py-2">{s.value}</td>
                <td className="px-4 py-2 text-right"><button onClick={() => { setEditing(s.key); setValue(s.value) }} className="text-xs underline text-brand-navy hover:text-brand-navy-dark">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
