import React from 'react'
import { siteUrl } from '@/lib/siteUrl'

export const dynamic = 'force-dynamic'

async function getProduct(slug: string) {
  const res = await fetch(`${siteUrl()}/api/products/${encodeURIComponent(slug)}`, { cache: 'no-store', headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  const json = await res.json()
  return json.product || null
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: 'Product — MALIK & OTB' }
}

function ProductViewTracker({ slug }: { slug: string }) {
  React.useEffect(() => {
    fetch(`${siteUrl()}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'product_view', payload: { productId: '', slug } }),
    }).catch(() => {})
  }, [slug])
  return null
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) {
    return (
      <div className="px-3 py-12 md:px-4 md:py-20 flex-grow">
        <div className="container text-center">
          <h1 className="text-2xl font-bold brand-navy">Product not found</h1>
          <p className="mt-2 text-brand-navy/60">This item is not available, is a draft, or does not exist.</p>
          <a href="/" className="mt-4 inline-block bg-brand-yellow text-brand-navy-dark font-bold px-4 py-2 rounded-md no-underline">Home</a>
        </div>
      </div>
    )
  }
  return (
    <>
      <ProductViewTracker slug={slug} />
      <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
        <div className="container">
          <nav className="mb-6 text-xs text-brand-navy/60">
            <a href="/" className="no-underline hover:underline">Home</a> <span className="mx-1 text-brand-navy/30">/</span>
            <a href="/categories" className="no-underline hover:underline">Categories</a> <span className="mx-1 text-brand-navy/30">/</span>
            {product.category_slug && (
              <>
                <a href={`/category/${product.category_slug}`} className="no-underline hover:underline">{product.category_name}</a> <span className="mx-1 text-brand-navy/30">/</span>
              </>
            )}
            <span className="brand-navy font-medium">{product.name}</span>
          </nav>
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="space-y-3">
                {product.images?.[0] ? (
                  <img src={product.images[0].url} alt={product.images[0].alt || product.name} className="w-full rounded-lg border border-brand-light object-cover aspect-[4/5]" loading="lazy" />
                ) : (
                  <div className="aspect-[4/5] bg-brand-light rounded-lg flex items-center justify-center text-brand-primary/50 text-sm">No image</div>
                )}
                {(product.images || []).slice(1).map((img: any, i: number) => (
                  <img key={i} src={img.url} alt={img.alt || ''} className="w-16 h-16 rounded border border-brand-light object-cover cursor-pointer opacity-50 hover:opacity-100 transition" loading="lazy" />
                ))}
              </div>
            </div>
            <div className="md:col-span-7 space-y-6">
              <div>
                <h1 className="text-3xl font-bold brand-navy">{product.name}</h1>
                <p className="mt-2 text-brand-navy/70">{product.shortDesc || product.description || ''}</p>
                {product.test_data && <span className="inline-block mt-1 text-xs border border-brand-navy/30 text-brand-navy/50 px-2 py-0.5 rounded">Test data — not available for purchase</span>}
              </div>
              <div>
                <h3 className="font-bold text-sm brand-navy mb-2">Price</h3>
                <p className="text-2xl font-bold brand-navy-dark">${((product.basePriceCents || 0) / 100).toFixed(2)} USD</p>
              </div>
              {product.variants.length > 1 && (
                <div>
                  <h3 className="font-bold text-sm brand-navy mb-2">Variant</h3>
                  <div className="flex gap-2">
                    {product.variants.map((v: any) => (
                      <button key={v.id} className={`px-3 py-1.5 text-sm rounded border transition ${v.is_default ? 'bg-brand-navy text-white border-brand-navy' : 'bg-brand-warm-white text-brand-navy border-brand-light hover:border-brand-navy'}`}>
                        {v.name} {v.price_adj_cents > 0 ? ` +$${(v.price_adj_cents / 100).toFixed(2)}` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-bold text-sm brand-navy mb-2">Quantity</h3>
                <input type="number" min="1" max={(product.variants[0]?.stock || 0)} defaultValue="1" className="w-20 border border-brand-light rounded px-2 py-1.5 text-brand-navy" />
              </div>
              <button className="w-full bg-brand-yellow text-brand-navy-dark font-bold py-3 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={(product.variants[0]?.stock || 0) <= 0}>
                {(product.variants[0]?.stock || 0) > 0 ? 'Add to cart' : 'Out of stock'}
              </button>
              {product.shipping_info && <div className="text-sm text-brand-navy/60"><strong>Shipping:</strong> {product.shipping_info}</div>}
              {product.return_info && <div className="text-sm text-brand-navy/60"><strong>Returns:</strong> {product.return_info}</div>}
            </div>
          </div>
          {product.description && (
            <section className="mt-16 border-t border-brand-light pt-10">
              <h2 className="text-xl font-bold brand-navy mb-4">Details</h2>
              <div className="text-brand-navy/70 prose-sm max-w-none">{product.description}</div>
            </section>
          )}
          <section className="mt-16">
            <h2 className="text-xl font-bold brand-navy mb-4">Specifications &amp; restrictions</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-brand-navy/70">
              <dt className="font-bold brand-navy">SKU</dt><dd>{product.sku || '—'}</dd>
              <dt className="font-bold brand-navy">Materials</dt><dd>{product.materials || '—'}</dd>
              <dt className="font-bold brand-navy">Usage</dt><dd>{product.usage || '—'}</dd>
              <dt className="font-bold brand-navy">Restrictions</dt><dd>{product.restrictions || '—'}</dd>
              <dt className="font-bold brand-navy">Care</dt><dd>{product.care || '—'}</dd>
              <dt className="font-bold brand-navy">Weight</dt><dd>{product.weightKg ? product.weightKg + ' kg' : '—'}</dd>
            </dl>
          </section>
        </div>
      </div>
    </>
  )
}

function useEffectOnce(fn: () => void) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = React.useRef(false)
  if (!ref.current) {
    ref.current = true
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(fn, [])
  }
  return null
}
