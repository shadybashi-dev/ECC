import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { loginSchema } from '@/lib/validators'
import { getDb } from '@/lib/db'
import { verifyPassword, createSession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = loginSchema.parse(body)

    const db = getDb()
    const user = db.prepare(
      'SELECT id, email, name, password_hash, role FROM users WHERE email = ?'
    ).get(data.email) as { id: string; email: string; name: string | null; password_hash: string; role: string } | undefined
    if (!user || !(await verifyPassword(data.password, user.password_hash))) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
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

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch (err: any) {
    if (err?.issues) return NextResponse.json({ error: 'invalid_input', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
