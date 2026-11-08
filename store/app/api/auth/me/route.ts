import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return NextResponse.json({ user: null })
  const user = getSession(token)
  return NextResponse.json({ user: user || null })
}
