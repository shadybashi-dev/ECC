import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { categorySchema } from '@/lib/validators'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const db = getDb()
  const row = db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug) as any
  if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ category: { ...row, is_active: row.is_active === 1 } })
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const { slug } = await params
    const data = categorySchema.parse(await req.json())
    const db = getDb()
    const current = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug) as any
    if (!current) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    if (data.slug !== slug && db.prepare('SELECT id FROM categories WHERE slug = ?').get(data.slug)) {
      return NextResponse.json({ error: 'slug_in_use' }, { status: 409 })
    }
    db.prepare(
      'UPDATE categories SET name = ?, slug = ?, description = ?, is_active = ?, sort = ?, seo_title = ?, seo_desc = ?, updated_at = datetime(\'now\') WHERE slug = ?'
    ).run(
      data.name,
      data.slug,
      data.description ?? null,
      data.isActive ?? true ? 1 : 0,
      data.sort ?? 0,
      data.seoTitle ?? null,
      data.seoDesc ?? null,
      slug
    )
    const row = db.prepare('SELECT * FROM categories WHERE slug = ?').get(data.slug) as any
    return NextResponse.json({ category: { ...row, is_active: row.is_active === 1 } })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = requireRole(_req, ['ADMIN'])
  if (auth instanceof Response) return auth
  const { slug } = await params
  const db = getDb()
  const products = db.prepare('SELECT id FROM products WHERE category_id = (SELECT id FROM categories WHERE slug = ?) LIMIT 1').get(slug)
  if (products) return NextResponse.json({ error: 'category_in_use' }, { status: 409 })
  db.prepare('DELETE FROM categories WHERE slug = ?').run(slug)
  return NextResponse.json({ ok: true })
}
