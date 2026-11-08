import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/auth'
import { AdminShell } from '@/components/admin-shell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value
  const user = token ? getSession(token) : null
  if (!user || (user.role !== 'ADMIN' && user.role !== 'OPERATOR')) {
    redirect('/auth/login?next=/admin')
  }
  return <AdminShell user={user}>{children}</AdminShell>
}
