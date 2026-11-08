import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.SITE_URL || 'http://localhost:3000'

export default async function sitemap() {
  const urls: Array<{ url: string; lastModified?: string; changeFrequency?: string; priority?: number }> = [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/categories`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/help`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/policies/shipping`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/policies/returns`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/policies/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/policies/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const db = getDb()
    const categories = db.prepare("SELECT slug, updated_at FROM categories WHERE is_active = 1").all() as Array<{ slug: string; updated_at: string }>
    for (const c of categories) {
      urls.push({ url: `${siteUrl}/category/${c.slug}`, lastModified: c.updated_at, changeFrequency: 'weekly', priority: 0.7 })
    }
    const products = db.prepare("SELECT slug, updated_at FROM products WHERE status = 'ACTIVE' AND test_data = 0").all() as Array<{ slug: string; updated_at: string }>
    for (const p of products) {
      urls.push({ url: `${siteUrl}/product/${p.slug}`, lastModified: p.updated_at, changeFrequency: 'daily', priority: 0.9 })
    }
  } catch {
    // DB may not be initialized yet at build time
  }

  return urls
}
