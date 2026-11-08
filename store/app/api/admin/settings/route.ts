import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { requireRole } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const auth = requireRole(req, ['ADMIN'])
  if (auth instanceof Response) return auth
  const db = getDb()
  const rows = db.prepare('SELECT * FROM settings ORDER BY key').all() as any[]
  return NextResponse.json({ settings: rows })
}

export async function POST(req: Request) {
  const auth = requireRole(req, ['ADMIN'])
  if (auth instanceof Response) return auth
  try {
    const { key, value } = await req.json()
    if (!key || typeof value === 'undefined') {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }
    const db = getDb()
    db.prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
    ).run(key, String(value))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
