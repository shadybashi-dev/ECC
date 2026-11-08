export const dynamic = 'force-dynamic'

export default function Robots() {
  return `User-agent: *
Allow: /

# Public pages and products may be indexed
Allow: /category/
Allow: /product/
Allow: /help/
Allow: /about
Allow: /contact
Allow: /policies/

# Never index customer-facing or administrative paths
Disallow: /cart
Disallow: /checkout
Disallow: /auth
Disallow: /orders
Disallow: /account
Disallow: /admin
Disallow: /api
Disallow: /search

# Prevent search-result and filter spam
Disallow: /*?*
Disallow: /*&*

Sitemap: ${process.env.SITE_URL || 'http://localhost:3000'}/sitemap.xml
`
}
