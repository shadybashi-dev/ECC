import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { categorySchema } from '@/lib/validators'

export const runtime = 'nodejs'

export async function GET() {
  const db = getDb()
  const rows = db.prepare(
    `SELECT id, name, slug, description, is_active, sort, seo_title, seo_desc, created_at, updated_at
     FROM categories WHERE is_active = 1 ORDER BY sort ASC, name ASC`
  ).all() as Array<{ id: string; name: string; slug: string; description: string | null; is_active: number; sort: number; seo_title: string | null; seo_desc: string | null; created_at: string; updated_at: string }>
  return NextResponse.json({ categories: rows.map((r) => ({ ...r, is_active: r.is_active === 1 })) })
}

export async function POST(req: Request) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const data = categorySchema.parse(await req.json())
    const db = getDb()
    const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(data.slug)
    if (existing) return NextResponse.json({ error: 'slug_in_use' }, { status: 409 })
    db.prepare(
      'INSERT INTO categories (name, slug, description, is_active, sort, seo_title, seo_desc) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      data.name,
      data.slug,
      data.description ?? null,
      data.isActive ?? true ? 1 : 0,
      data.sort ?? 0,
      data.seoTitle ?? null,
      data.seoDesc ?? null
    )
    const row = db.prepare('SELECT * FROM categories WHERE slug = ?').get(data.slug) as any
    return NextResponse.json({ category: { ...row, is_active: row.is_active === 1 } }, { status: 201 })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
