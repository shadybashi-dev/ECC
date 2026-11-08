'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Layout, ShoppingCart, Package, FileText, LogOut } from 'lucide-react'

const links = [
  { href: '/admin', icon: Layout, label: 'Dashboard' },
  { href: '/admin/products', icon: ShoppingCart, label: 'Products' },
  { href: '/admin/categories', icon: Package, label: 'Categories' },
  { href: '/admin/orders', icon: FileText, label: 'Orders' },
  { href: '/admin/system-health', icon: FileText, label: 'System health' },
  { href: '/admin/settings', icon: FileText, label: 'Settings' },
  { href: '/admin/audit-log', icon: FileText, label: 'Audit log' },
]

export function AdminShell({ user, children }: { user: { email: string; role: string }; children: React.ReactNode }) {
  const router = useRouter()
  const [pathname] = useState(typeof window !== 'undefined' ? window.location.pathname : '/admin')

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
  }

  return (
    <div className="flex h-screen bg-brand-navy text-brand-light overflow-hidden">
      <aside className="w-64 border-r border-brand-navy/30 flex-shrink-0">
        <div className="p-5 flex items-center gap-2">
          <span className="bg-brand-yellow text-brand-navy-dark font-bold px-2 py-0.5 rounded text-xs">M&O</span>
          <span className="font-bold text-sm text-white tracking-tight">MALIK &amp; OTB</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => { if (l.href === '/auth/logout') e.preventDefault() }}
               className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${pathname === l.href ? 'bg-brand-navy/50 text-white' : 'text-brand-primary hover:bg-brand-navy/20'}`} aria-current={pathname === l.href ? 'page' : undefined}>
              <l.icon className="w-5 h-5" aria-hidden="true" />
              {l.label}
            </a>
          ))}
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-brand-primary hover:bg-brand-navy/20 transition">
            <LogOut className="w-5 h-5" aria-hidden="true" />
            Sign out
          </button>
        </nav>
        <div className="mt-auto p-4 border-t border-brand-navy/30">
          <p className="text-xs text-brand-primary">{user.email}</p>
          <p className="text-[10px] text-brand-navy/30 text-center">{user.role}</p>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-brand-warm-white">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
