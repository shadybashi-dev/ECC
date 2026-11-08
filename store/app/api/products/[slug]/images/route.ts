import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { z } from 'zod'

export const runtime = 'nodejs'

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  position: z.number().int().min(0).optional(),
  isPrimary: z.boolean().optional(),
})

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = requireRole(req, ['ADMIN', 'OPERATOR'])
  if (auth instanceof Response) return auth
  try {
    const { slug } = await params
    const data = imageSchema.parse(await req.json())
    const db = getDb()
    const product = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug)
    if (!product) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    if (data.isPrimary) {
      db.prepare('UPDATE product_images SET is_primary = 0 WHERE product_id = ?').run(product.id)
    }
    const id = db.prepare(
      'INSERT INTO product_images (product_id, url, alt, position, is_primary) VALUES (?, ?, ?, ?, ?)'
    ).run(
      product.id,
      data.url,
      data.alt ?? null,
      data.position ?? 0,
      data.isPrimary ?? false ? 1 : 0
    ).lastInsertRowid as unknown as string
    const row = db.prepare('SELECT * FROM product_images WHERE id = ?').get(id) as any
    return NextResponse.json({ image: row }, { status: 201 })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
