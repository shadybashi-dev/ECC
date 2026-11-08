import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { eventType, payload } = await req.json()
    if (!eventType || typeof payload !== 'object') {
      return NextResponse.json({ error: 'invalid_event' }, { status: 400 })
    }
    const db = getDb()
    db.prepare(
      `INSERT INTO analytics_events (event_type, payload, created_at)
       VALUES (?, ?, datetime('now'))`
    ).run(eventType, JSON.stringify(payload))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

export async function GET(_req: Request) {
  const db = getDb()
  const rows = db.prepare(
    `SELECT event_type, COUNT(*) AS count, MIN(created_at) AS first_seen, MAX(created_at) AS last_seen
     FROM analytics_events
     GROUP BY event_type
     ORDER BY count DESC`
  ).all() as any[]
  return NextResponse.json({ events: rows })
}
