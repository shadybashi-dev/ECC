import Link from 'next/link'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getProducts(slugs: string[]) {
  if (!slugs.length) return []
  const db = getDb()
  const placeholders = slugs.map(() => '?').join(',')
  const rows = db.prepare(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.slug IN (${placeholders}) AND p.status = 'ACTIVE' AND p.test_data = 0`
  ).all(slugs) as any[]
  return rows.map((r) => ({
    ...r,
    images: db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY position ASC, id ASC').all(r.id),
    variants: db.prepare('SELECT * FROM variants WHERE product_id = ? ORDER BY is_default DESC, id ASC').all(r.id),
  }))
}

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ slug?: string | string[] }> }) {
  const params = await searchParams
  const slugs = Array.isArray(params.slug) ? params.slug : params.slug ? [params.slug] : []
  const products = await getProducts(slugs)

  const fields = [
    { key: 'base_price_cents', label: 'Price', format: (v: any) => `$${(v / 100).toFixed(2)}` },
    { key: 'weight_kg', label: 'Weight (kg)', format: (v: any) => v ? v + ' kg' : '—' },
    { key: 'materials', label: 'Materials', format: (v: any) => v || '—' },
    { key: 'usage', label: 'Usage', format: (v: any) => v || '—' },
    { key: 'restrictions', label: 'Restrictions', format: (v: any) => v || '—' },
    { key: 'shipping_info', label: 'Shipping', format: (v: any) => v || '—' },
    { key: 'return_info', label: 'Returns', format: (v: any) => v || '—' },
  ]

  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container">
        <nav className="mb-6 text-xs text-brand-navy/60">
          <a href="/" className="no-underline hover:underline">Home</a> <span className="mx-1 text-brand-navy/30">/</span>
          <span className="brand-navy font-medium">Compare products</span>
        </nav>
        <h1 className="text-2xl font-bold brand-navy mb-2">Compare products</h1>
        <p className="text-brand-navy/60 mb-8">Select up to 4 products to compare specifications side by side.</p>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-navy/60 mb-4">No products selected for comparison.</p>
            <Link href="/categories" className="bg-brand-yellow text-brand-navy-dark font-bold px-5 py-2 rounded-md no-underline hover:bg-brand-yellow-light">Browse products</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-brand-light bg-brand-light/50">
                    <th className="px-4 py-3 font-bold brand-navy">Feature</th>
                    {products.map((p) => (
                      <th key={p.id} className="px-4 py-3 font-bold brand-navy text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/product/${p.slug}`} className="font-semibold no-underline hover:underline">{p.name}</Link>
                          <a
                            href={`/compare?slug=${slugs.filter((s) => s !== p.slug).join('&slug=')}`}
                            className="text-xs underline text-red-500 hover:text-red-700"
                            aria-label={`Remove ${p.name} from comparison`}
                          >
                            Remove
                          </a>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field.key} className="border-b border-brand-light/50">
                      <td className="px-4 py-3 font-bold brand-navy">{field.label}</td>
                      {products.map((p) => (
                        <td key={p.id} className="px-4 py-3 text-brand-navy/70">{field.format(p[field.key])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href="/categories" className="bg-brand-yellow text-brand-navy-dark font-bold px-5 py-2 rounded-md no-underline hover:bg-brand-yellow-light">Browse more products</Link>
              <a href="/" className="border border-brand-light text-brand-navy px-5 py-2 rounded-md no-underline hover:bg-brand-light">Back to home</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
