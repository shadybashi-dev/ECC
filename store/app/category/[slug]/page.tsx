import Link from 'next/link'
import { siteUrl } from '@/lib/siteUrl'

export const dynamic = 'force-dynamic'

async function getCategory(slug: string) {
  const res = await fetch(`${siteUrl()}/api/categories/${slug}`, { cache: 'no-store', headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  const json = await res.json()
  return json.category || null
}

async function getProducts(categorySlug: string) {
  const res = await fetch(`${siteUrl()}/api/products?category=${encodeURIComponent(categorySlug)}&limit=100`, { cache: 'no-store', headers: { Accept: 'application/json' } })
  if (!res.ok) return []
  const json = await res.json()
  return json.products || []
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [category, products] = await Promise.all([getCategory(slug), getProducts(slug)])
  if (!category) {
    return (
      <div className="px-3 py-10 md:px-4 md:py-16 flex-grow">
        <div className="container text-center">
          <h1 className="text-2xl font-bold brand-navy">Category not found</h1>
          <Link href="/categories" className="mt-4 inline-block bg-brand-yellow text-brand-navy-dark font-bold px-4 py-2 rounded-md no-underline">Go to categories</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container">
        <nav className="mb-6 text-xs text-brand-navy/60">
          <Link href="/" className="no-underline hover:underline">Home</Link> <span className="mx-1 text-brand-navy/30">/</span>
          <Link href="/categories" className="no-underline hover:underline">Categories</Link> <span className="mx-1 text-brand-navy/30">/</span>
          <span className="brand-navy font-medium">{category.name}</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold brand-navy mb-3">{category.name}</h1>
        {category.description && <p className="text-brand-navy/70 mb-8">{category.description}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? products.map((p: any) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="block no-underline">
              <article className="bg-brand-warm-white border border-brand-light rounded-lg p-4 hover:shadow-soft transition flex flex-col h-full">
                <div className="aspect-[4/5] bg-brand-light rounded overflow-hidden mb-3 flex items-center justify-center text-brand-primary/50 text-sm font-medium shrink-0">
                  {p.images?.[0] ? (
                    <img src={p.images[0].url} alt={p.images[0].alt || `Product ${p.name}`} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    'Image coming soon'
                  )}
                </div>
                <h3 className="font-bold brand-navy text-base">{p.name}</h3>
                <p className="mt-1 text-sm text-brand-navy/70 line-clamp-2 flex-grow">{p.shortDesc || p.description || ''}</p>
                <div className="mt-auto flex items-baseline gap-2">
                  <span className="font-bold text-brand-navy-dark">${((p.basePriceCents || 0) / 100).toFixed(2)}</span>
                  {p.test_data && <span className="text-xs text-brand-navy/40">(test data)</span>}
                </div>
                <span className="mt-3 block text-xs brand-yellow font-medium no-underline hover:underline">View details →</span>
              </article>
            </Link>
          )) : (
            <p className="text-brand-navy/60">No products in this category yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
