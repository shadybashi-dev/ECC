import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/categories`, { cache: 'no-store', headers: { Accept: 'application/json' } })
  if (!res.ok) return []
  const json = await res.json()
  return json.categories || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container">
        <h1 className="text-2xl md:text-3xl font-bold brand-navy">Categories</h1>
        <p className="mt-2 text-brand-navy/70">Browse our catalog. Only active products are shown; draft items are hidden.</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.length > 0 ? categories.map((cat: any) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="block bg-brand-warm-white border border-brand-light rounded-lg p-5 no-underline hover:bg-brand-navy/5 transition">
              <h3 className="font-bold brand-navy">{cat.name}</h3>
              <p className="mt-1 text-sm text-brand-navy/60">{cat.description || ''}</p>
            </Link>
          )) : (
            <p className="text-brand-navy/60">No categories yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
