'use client'

import { useEffect, useState } from 'react'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' })
      const json = await res.json()
      setCategories(json.categories || [])
    } catch (e) {
      setError('Failed to load categories')
    } finally { setLoading(false) }
  }

  async function createCat() {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, slug: form.slug, description: form.description }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setForm({ name: '', slug: '', description: '' })
      load()
    } catch (err: any) {
      setError(err.message || 'Failed to create category')
    }
  }

  async function del(slug: string) {
    if (!confirm('Delete category?')) return
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(slug)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Cannot delete (may have products)')
      load()
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  if (loading) return <div className="p-6 text-brand-navy/60">Loading…</div>

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold brand-navy">Categories</h2>
      <form onSubmit={(e) => { e.preventDefault(); createCat() }} className="space-y-4 bg-brand-warm-white p-5 rounded-lg border border-brand-light max-w-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <input className="border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" defaultValue="" onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
          <input className="border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" defaultValue="" onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="slug" />
          <input className="border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" defaultValue="" onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
          <button className="bg-brand-yellow text-brand-navy-dark font-bold rounded px-4 py-2 hover:bg-brand-yellow-light">Add</button>
        </div>
      </form>
      {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="rounded-lg border border-brand-light overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-brand-light bg-brand-light/50"><th className="px-4 py-3 text-brand-navy/60">Name</th><th className="px-4 py-3 text-brand-navy/60">Slug</th><th className="px-4 py-3 text-brand-navy/60 text-right">Active</th><th className="px-4 py-3 text-brand-navy/60 text-right"></th></tr></thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-brand-light/50">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2 font-mono text-brand-navy/40">{c.slug}</td>
                <td className="px-4 py-2 text-right">{c.is_active === 1 ? '✓' : '—'}</td>
                <td className="px-4 py-2 text-right"><button onClick={() => del(c.slug)} className="text-xs underline text-red-500 hover:text-red-700">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
