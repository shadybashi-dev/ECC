import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/db'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  const db = getDb()
  const user = token ? getSession(token) : null
  const { orderNumber } = await params
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber) as any
  if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (user && order.user_id !== user.id && user.role !== 'ADMIN' && user.role !== 'OPERATOR') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  if (!user) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id)
  return NextResponse.json({ order: { ...order, items } })
}
