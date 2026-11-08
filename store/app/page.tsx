import Link from 'next/link'
import { siteUrl } from '@/lib/siteUrl'

export const dynamic = 'force-dynamic'
import { ShoppingCart, ArrowRight, Mail, MapPin } from 'lucide-react'

async function getFeatured() {
  try {
    const res = await fetch(`${siteUrl()}/api/products?featured=1&limit=6`, { cache: 'no-store', headers: { Accept: 'application/json' } })
    const json = await res.json()
    return json.products || []
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${siteUrl()}/api/categories`, { cache: 'no-store', headers: { Accept: 'application/json' } })
    const json = await res.json()
    return json.categories || []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeatured()
  const categories = await getCategories()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

  return (
    <div className="flex-grow">
      <section className="px-3 py-10 md:px-4 md:py-16 lg:px-0">
        <div className="container">
          <div className="text-center md:text-left max-w-3xl mx-auto md:mx-0">
            <h1 className="text-3xl md:text-5xl font-bold brand-navy tracking-tight">Independent store, built to last.</h1>
            <p className="mt-4 text-lg text-brand-navy/80">MALIK & OTB — California, USA · English · USD.</p>
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
              <Link href="/categories" className="bg-brand-yellow text-brand-navy-dark font-bold px-6 py-3 rounded-md no-underline hover:bg-brand-yellow-light transition">Shop now</Link>
              <Link href="/about" className="border border-brand-navy text-brand-navy font-medium px-6 py-3 rounded-md no-underline hover:bg-brand-navy/5 transition">About us</Link>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="px-3 py-10 md:px-4 md:py-16">
          <div className="container">
            <h2 className="text-2xl font-bold brand-navy mb-6">Browse by category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat: any) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} className="block bg-brand-warm-white border border-brand-light rounded-lg p-5 text-center no-underline hover:bg-brand-navy hover:text-white transition group">
                  <span className="brand-navy font-semibold text-sm group-hover:text-white">{cat.name}</span>
                  <p className="mt-1 text-xs text-brand-navy/60 group-hover:text-brand-primary">{cat.description || ''}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="px-3 py-10 md:px-4 md:py-16 bg-brand-light/40">
          <div className="container">
            <h2 className="text-2xl font-bold brand-navy mb-6">Featured</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p: any) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="block no-underline">
                  <article className="bg-brand-warm-white border border-brand-light rounded-lg p-4 hover:shadow-soft transition">
                    <div className="aspect-[4/5] bg-brand-light rounded overflow-hidden mb-3 flex items-center justify-center text-brand-primary/50 text-sm font-medium">
                      {p.images?.[0] ? (
                        <img src={p.images[0].url} alt={p.images[0].alt || `Product ${p.name}`} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        'Image coming soon'
                      )}
                    </div>
                    <h3 className="font-bold brand-navy text-base">{p.name}</h3>
                    <p className="mt-1 text-sm text-brand-navy/70 line-clamp-2">{p.shortDesc || p.description || ''}</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-bold text-brand-navy-dark">${((p.basePriceCents || 0) / 100).toFixed(2)}</span>
                      {p.test_data && <span className="text-xs text-brand-navy/40">(test data)</span>}
                    </div>
                    <span className="mt-3 block text-xs brand-yellow font-medium no-underline hover:underline">View details →</span>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-3 py-10 md:px-4 md:py-16">
        <div className="container">
          <h2 className="text-2xl font-bold brand-navy mb-8 text-center">Questions? We answer directly.</h2>
          <div className="max-w-xl mx-auto grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 bg-brand-warm-white border border-brand-light rounded-lg">
              <Mail className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold brand-navy">Email</h3>
                <p className="text-sm text-brand-navy/70">piratespizza999@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-brand-warm-white border border-brand-light rounded-lg">
              <MapPin className="w-5 h-5 text-brand-navy mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-bold brand-navy">Location</h3>
                <p className="text-sm text-brand-navy/70">California, USA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
