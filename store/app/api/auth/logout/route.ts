import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { destroySession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (token) destroySession(token)
  cookieStore.set('session', '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0 })
  return NextResponse.json({ ok: true })
}
