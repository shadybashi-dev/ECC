import { getDb } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: string
}

/** Create a DB-backed session and return the opaque token. */
export function createSession(userId: string): string {
  const db = getDb()
  const token = crypto.randomBytes(32).toString('hex')
  const maxAgeSeconds = Number(process.env.SESSION_MAX_AGE || '1209600')
  const expires = new Date(Date.now() + maxAgeSeconds * 1000)
  db.prepare('INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)').run(
    token,
    userId,
    expires.toISOString()
  )
  return token
}

/** Validate a session token. Returns the user or null. */
export function getSession(token: string): SessionUser | null {
  const db = getDb()
  const row = db.prepare(
    `SELECT u.id, u.email, u.name, u.role, s.expires
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token = ? AND s.expires > datetime('now')`
  ).get(token) as { id: string; email: string; name: string | null; role: string; expires: string } | undefined
  if (!row) return null
  return { id: row.id, email: row.email, name: row.name, role: row.role }
}

export function destroySession(token: string): void {
  getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token)
}

export function destroyAllUserSessions(userId: string): void {
  getDb().prepare('DELETE FROM sessions WHERE user_id = ?').run(userId)
}

export function cleanupExpiredSessions(): number {
  const info = getDb().prepare("DELETE FROM sessions WHERE expires < datetime('now')").run()
  return info.changes
}

/** Require an authenticated session from an incoming request (API routes). */
export function requireAuth(request: Request): { user: SessionUser } | Response {
  const token = request.headers.get('cookie')?.split('; ').find((c) => c.startsWith('session='))?.split('=')[1]
  if (!token) {
    return new Response(JSON.stringify({ error: 'authentication_required' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }
  const user = getSession(token)
  if (!user) {
    return new Response(JSON.stringify({ error: 'session_invalid' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }
  return { user }
}

export function requireRole(request: Request, allowed: string[]): { user: SessionUser } | Response {
  const result = requireAuth(request)
  if (result instanceof Response) return result
  if (!allowed.includes(result.user.role)) {
    return new Response(JSON.stringify({ error: 'forbidden' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    })
  }
  return result
}
