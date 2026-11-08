'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Trash2, Plus, Save, Image, ArrowLeft } from 'lucide-react'

type Product = {
  id: string; name: string; slug: string; description: string | null; short_desc: string | null;
  sku: string | null; status: string; category_id: string | null; base_price_cents: number;
  track_inventory: number; low_stock_threshold: number; materials: string | null; care: string | null;
  usage: string | null; restrictions: string | null; shipping_info: string | null; return_info: string | null;
  seo_title: string | null; seo_description: string | null; is_featured: number; test_data: number;
  images: Array<{ id: string; url: string; alt: string | null; position: number; is_primary: number }>;
  variants: Array<{ id: string; sku: string; name: string; price_adj_cents: number; stock: number; reserved: number; is_default: number; bar_code: string | null; active: number }>;
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [params.slug])

  async function load() {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(params.slug as string)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Not found')
      const json = await res.json()
      setProduct(json.product)
    } catch (err: any) {
      setError(err.message || 'Failed to load product')
    } finally {
      setLoading(false)
  }
  }

  async function saveProduct() {
    if (!product) return
    setSaving(true)
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(product.slug)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDesc: product.short_desc,
          sku: product.sku || undefined,
          status: product.status,
          categoryId: product.category_id || undefined,
          basePriceCents: product.base_price_cents,
          trackInventory: product.track_inventory === 1,
          lowStockThreshold: product.low_stock_threshold,
          materials: product.materials || undefined,
          care: product.care || undefined,
          usage: product.usage || undefined,
          restrictions: product.restrictions || undefined,
          shippingInfo: product.shipping_info || undefined,
          returnInfo: product.return_info || undefined,
          seoTitle: product.seo_title || undefined,
          seoDescription: product.seo_description || undefined,
          isFeatured: product.is_featured === 1,
          testData: product.test_data === 1,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Save failed')
      setSaving(false)
      if (json.product.slug !== product.slug) router.push(`/admin/products/${json.product.slug}`)
    } catch (err: any) {
      setSaving(false)
      setError(err.message || 'Save failed')
    }
  }

  async function addVariant() {
    if (!product) return
    const sku = window.prompt('Variant SKU:')
    if (!sku) return
    const name = window.prompt('Variant name (e.g. Large / Red):')
    const stock = Number(window.prompt('Initial stock:')) || 0
    try {
      const res = await fetch('/api/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, sku, name: name || sku, stock }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      load()
    } catch (err: any) {
      setError(err.message || 'Failed to add variant')
    }
  }

  async function updateVariantStock(variantId: string, stock: number) {
    try {
      const res = await fetch(`/api/variants/${variantId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stock }) })
      if (!res.ok) throw new Error('update failed')
      load()
    } catch (e) {
      setError('Stock update failed')
    }
  }

  async function deleteVariant(variantId: string) {
    if (!confirm('Delete this variant?')) return
    try {
      const res = await fetch(`/api/variants/${variantId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Cannot delete variant used in orders')
      load()
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  async function deleteProduct() {
    if (!confirm('Delete this product? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(product!.slug)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  if (loading) return <div className="p-6 text-brand-navy/60">Loading…</div>
  if (!product) return (
    <div className="p-6"><div className="text-brand-navy/60">{error || 'Not found'}</div>
    <button onClick={() => router.back()} className="mt-4 underline text-brand-navy">Back</button></div>
  )

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-brand-navy hover:underline no-underline"><ArrowLeft className="w-4 h-4" /> Back to products</button>
        <button onClick={saveProduct} disabled={saving} className="ml-auto bg-brand-yellow text-brand-navy-dark font-bold flex items-center gap-2 px-4 py-2 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50"><Save className="w-4 h-4" /> Save</button>
        <button onClick={deleteProduct} className="bg-red-50 text-red-600 border border-red-100 font-bold flex items-center gap-2 px-4 py-2 rounded-md no-underline hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /> Delete product</button>
      </div>
      {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5 bg-brand-warm-white p-5 rounded-lg border border-brand-light">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
          <Input label="Slug" value={product.slug} onChange={(e) => setProduct({ ...product, slug: e.target.value })} required hint="URL key" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="SKU" value={product.sku ?? ''} onChange={(e) => setProduct({ ...product, sku: e.target.value || null })} hint="Stock-keeping unit" />
          <Input type="number" label="Base price (cents)" value={String(product.base_price_cents)} onChange={(e) => setProduct({ ...product, base_price_cents: Number(e.target.value) || 0 })} hint="USD cents" />
        </div>
        <Select label="Status" value={product.status} onChange={(e) => setProduct({ ...product, status: e.target.value })} options={['DRAFT', 'ACTIVE', 'ARCHIVED']} />
        <Input label="SEO title" value={product.seo_title ?? ''} onChange={(e) => setProduct({ ...product, seo_title: e.target.value || null })} />
        <Input label="SEO description" value={product.seo_description ?? ''} onChange={(e) => setProduct({ ...product, seo_description: e.target.value || null })} hint="Meta description" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Materials" value={product.materials ?? ''} onChange={(e) => setProduct({ ...product, materials: e.target.value || null })} />
          <Input label="Care" value={product.care ?? ''} onChange={(e) => setProduct({ ...product, care: e.target.value || null })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Usage" value={product.usage ?? ''} onChange={(e) => setProduct({ ...product, usage: e.target.value || null })} />
          <Input label="Restrictions" value={product.restrictions ?? ''} onChange={(e) => setProduct({ ...product, restrictions: e.target.value || null })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Shipping info" value={product.shipping_info ?? ''} onChange={(e) => setProduct({ ...product, shipping_info: e.target.value || null })} hint="Shown on product page" />
          <Input label="Return info" value={product.return_info ?? ''} onChange={(e) => setProduct({ ...product, return_info: e.target.value || null })} hint="Shown on product page" />
        </div>
        <Input label="Description (HTML shown on product page)" as="textarea" rows={4} value={product.description ?? ''} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
        <Input label="Short description" as="textarea" rows={2} value={product.short_desc ?? ''} onChange={(e) => setProduct({ ...product, short_desc: e.target.value })} />

        <div className="flex items-center gap-3 pt-4 border-t border-brand-light">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" defaultChecked={product.is_featured === 1} onChange={(e) => setProduct({ ...product, is_featured: e.target.checked ? 1 : 0 })} />
            Featured
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none text-brand-navy/60">
            <input type="checkbox" defaultChecked={product.test_data === 1} onChange={(e) => setProduct({ ...product, test_data: e.target.checked ? 1 : 0 })} />
            <span>Test data — excluded from index and purchases</span>
          </label>
        </div>
      </form>

      <div className="bg-brand-warm-white p-5 rounded-lg border border-brand-light">
        <h3 className="font-bold brand-navy mb-3">Variants</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="border-b border-brand-light text-brand-navy/60">
              <th className="px-3 py-2">SKU</th><th className="px-3 py-2">Name</th><th className="px-3 py-2 text-right">Price adj (cents)</th><th className="px-3 py-2 text-right">Stock</th><th className="px-3 py-2 text-right">Reserved</th><th className="px-3 py-2 text-center">Active</th><th className="px-3 py-2 text-center">Default</th><th className="px-3 py-2 text-right">Barcode (GTIN)</th><th className="px-3 py-2 text-right">Actions</th></tr></thead>
            <tbody>
              {product.variants.map((v) => (
                <tr key={v.id} className="border-b border-brand-light/50">
                  <td className="px-3 py-2 font-mono">{v.sku}</td>
                  <td className="px-3 py-2">{v.name}</td>
                  <td className="px-3 py-2 text-right"><Input type="number" value={String(v.price_adj_cents)} onChange={(e) => {}} disabled className="bg-transparent border-none w-full p-0" /></td>
                  <td className="px-3 py-2 text-right"><Input type="number" min="0" value={String(v.stock)} onChange={(e) => updateVariantStock(v.id, Number(e.target.value) || 0)} /></td>
                  <td className="px-3 py-2 text-right font-mono text-brand-navy/40">{v.reserved}</td>
                  <td className="px-3 py-2 text-center">{v.active === 1 ? '✓' : '—'}</td>
                  <td className="px-3 py-2 text-center">{v.is_default === 1 ? '✓' : '—'}</td>
                  <td className="px-3 py-2 text-right font-mono text-brand-navy/40">{v.bar_code || '—'}</td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => deleteVariant(v.id)} className="text-xs underline text-red-500 hover:text-red-700" aria-label={`Delete variant ${v.sku}`}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={addVariant} className="text-sm border border-brand-light rounded px-3 py-1.5 text-brand-navy hover:bg-brand-light no-underline">Add variant</button>
        </div>
        <p className="mt-3 text-xs text-brand-navy/50">Stock and reservations are updated live here. GTIN (barcode) is stored only when supplied by the vendor.</p>
      </div>

      <div className="bg-brand-warm-white p-5 rounded-lg border border-brand-light">
        <h3 className="font-bold brand-navy mb-3">Images</h3>
        <div className="grid gap-2 sm:grid-cols-4">
          {product.images.map((img) => (
            <div key={img.id} className="relative group">
              <img src={img.url} alt={img.alt || ''} className="w-full h-32 object-cover rounded border border-brand-light opacity-70 group-hover:opacity-100" loading="lazy" />
              <span className="absolute inset-0 bg-black/20 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100">{img.is_primary === 1 ? 'Primary' : ''}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          <Input label="Image URL" placeholder="https://..." onChange={(e) => {}} disabled hint="Image upload not implemented yet — add rows directly in the database." />
          <button disabled className="text-sm border border-brand-light rounded px-3 py-1.5 text-brand-navy hover:bg-brand-light no-underline">Attach image</button>
        </div>
        <p className="mt-3 text-xs text-brand-navy/50">Image delete is not implemented in the UI yet — remove rows directly in the database.</p>
        <p className="mt-3 text-xs text-brand-navy/50">Use descriptive alt text. Product photos are illustrative only.</p>
      </div>

      <p className="text-xs text-brand-navy/40">Note: some admin actions (image uploads, variant delete) are intentionally minimal in this build; they can be completed directly in the SQLite/PostgreSQL database until built.</p>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', as, rows, required, hint, disabled }: any) {
  const Comp = as === 'textarea' ? 'textarea' : 'input'
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium brand-navy/70">{label}{hint ? ` — ${hint}` : ''}</label>
      <Comp
        type={type}
        name={label}
        defaultValue={value}
        onChange={(e: any) => onChange(e.target.value)}
        rows={rows}
        required={required}
        disabled={disabled}
        className="w-full border border-brand-light rounded px-2.5 py-2 text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-brand-warm-white"
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium brand-navy/70">{label}</label>
      <select defaultValue={value} onChange={(e: any) => onChange(e.target.value)} className="w-full border border-brand-light rounded px-2.5 py-2 text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-brand-warm-white">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
