import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { registerSchema } from '@/lib/validators'
import { getDb } from '@/lib/db'
import { hashPassword, createSession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    const db = getDb()
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email)
    if (existing) {
      return NextResponse.json({ error: 'email_in_use' }, { status: 409 })
    }

    const passwordHash = await hashPassword(data.password)
    db.prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)').run(
      data.email,
      data.name,
      passwordHash,
      'CUSTOMER'
    )
    const user = db.prepare('SELECT id, email, name, role FROM users WHERE email = ?').get(data.email) as {
      id: string; email: string; name: string | null; role: string
    }

    const token = createSession(user.id)
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: Number(process.env.SESSION_MAX_AGE || '1209600'),
    })

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
