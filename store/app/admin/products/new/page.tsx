'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const init = {
  name: '', slug: '', description: '', shortDesc: '', sku: '', status: 'DRAFT',
  categoryId: '', basePriceCents: '', trackInventory: 'true', lowStockThreshold: '5',
  materials: '', care: '', usage: '', restrictions: '', shippingInfo: '', returnInfo: '',
  seoTitle: '', seoDescription: '', isFeatured: 'false', testData: 'false',
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState(init)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description,
          shortDesc: form.shortDesc,
          sku: form.sku || undefined,
          status: form.status,
          categoryId: form.categoryId || undefined,
          basePriceCents: Number(form.basePriceCents) || 0,
          trackInventory: form.trackInventory === 'true',
          lowStockThreshold: Number(form.lowStockThreshold) || 5,
          materials: form.materials || undefined,
          care: form.care || undefined,
          usage: form.usage || undefined,
          restrictions: form.restrictions || undefined,
          shippingInfo: form.shippingInfo || undefined,
          returnInfo: form.returnInfo || undefined,
          seoTitle: form.seoTitle || undefined,
          seoDescription: form.seoDescription || undefined,
          isFeatured: form.isFeatured === 'true',
          testData: form.testData === 'true',
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create product')
      router.push(`/admin/products/${json.product.slug}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-bold brand-navy">Add product</h2>
      <form onSubmit={submit} className="space-y-4 bg-brand-warm-white p-6 rounded-lg border border-brand-light">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" required />
          <Field label="Slug" name="slug" hint="e.g. product-name" />
        </div>
        <Field label="Description" as="textarea" rows={3} name="description" />
        <Field label="Short description" as="textarea" rows={2} name="shortDesc" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="SKU (optional)" name="sku" />
          <Field label="Base price (USD)" type="number" name="basePriceCents" hint="cents" />
          <Select label="Status" name="status" options={['DRAFT', 'ACTIVE', 'ARCHIVED']} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Materials" name="materials" />
          <Field label="Care" name="care" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Usage" name="usage" />
          <Field label="Restrictions" name="restrictions" />
        </div>
        <Field label="Shipping info" name="shippingInfo" hint="e.g. Ships within 3 business days" />
        <Field label="Return info" name="returnInfo" hint="e.g. Returns accepted within 30 days" />
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="SEO title" name="seoTitle" />
          <Field label="SEO description" name="seoDescription" />
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-brand-light">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" defaultChecked={form.isFeatured === 'true'} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked ? 'true' : 'false' })} />
            Featured
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-brand-navy/60">
            <input type="checkbox" defaultChecked={form.testData === 'true'} onChange={(e) => setForm({ ...form, testData: e.target.checked ? 'true' : 'false' })} />
            <span>Test data (not indexed, not purchasable)</span>
          </label>
        </div>
        <button type="submit" disabled={loading} className="bg-brand-yellow text-brand-navy-dark font-bold py-3 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50">
          {loading ? 'Creating…' : 'Create product'}
        </button>
        {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
      </form>
    </div>
  )
}

function Field({ label, name, type = 'text', rows, required, hint }: { label: string; name: string; type?: string; rows?: number; required?: boolean; hint?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium brand-navy">{label}{required ? ' *' : ''}{hint ? ` — ${hint}` : ''}</label>
      {rows ? (
        <textarea name={name} rows={rows} required={required} className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
      ) : (
        <input type={type} name={name} required={required} className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
      )}
    </div>
  )
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium brand-navy">{label}</label>
      <select name={name} className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-brand-warm-white">
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}
