'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, User, LogOut, Mail } from 'lucide-react'

const CATEGORIES = ['all', 'featured']

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [auth, setAuth] = useState<{ user: { id: string; email: string; name: string | null; role: string } | null } | 'loading'>('loading')
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setAuth(data.user ? { user: data.user } : { user: null }))
      .catch(() => setAuth({ user: null }))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuth({ user: null })
    router.push('/')
  }

  const isAuthPage = pathname.startsWith('/auth')
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-warm-white/95 backdrop-sm supports-[backdrop-filter]:bg-brand-warm-white/75 border-b border-brand-light">
        <div className="container flex items-center justify-between px-3 py-3 md:px-4 lg:px-0">
          <Link href="/" className="flex items-center gap-2 brand-navy font-bold text-xl tracking-tight no-underline" aria-label="MALIK & OTB — homepage">
            <span className="bg-brand-yellow px-2 py-0.5 rounded text-brand-navy-dark font-bold text-xs">M&O</span>
            MALIK &amp; OTB
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={`no-underline px-3 py-2 rounded-md transition ${pathname === '/' ? 'bg-brand-navy text-white' : 'text-brand-navy hover:bg-brand-light'}`} aria-current={pathname === '/' ? 'page' : undefined}>Home</Link>
            <Link href="/categories" className="no-underline px-3 py-2 rounded-md transition text-brand-navy hover:bg-brand-light">Categories</Link>
            <Link href="/about" className="no-underline px-3 py-2 rounded-md transition text-brand-navy hover:bg-brand-light">About</Link>
            <Link href="/contact" className="no-underline px-3 py-2 rounded-md transition text-brand-navy hover:bg-brand-light">Contact</Link>
            <Link href="/help" className="no-underline px-3 py-2 rounded-md transition text-brand-navy hover:bg-brand-light">Help Center</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="relative no-underline p-2 text-brand-navy hover:bg-brand-light rounded-md" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            </Link>
            {auth === 'loading' ? null : auth.user ? (
              <div className="flex items-center gap-3">
                <button onClick={handleLogout} className="text-xs font-medium text-brand-yellow no-underline hover:underline px-3 py-1.5 rounded-md hover:bg-brand-navy/5">Sign out</button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-xs font-medium text-brand-navy no-underline hover:underline px-3 py-1.5 rounded-md hover:bg-brand-light">Sign in</Link>
                <Link href="/auth/register" className="text-xs font-bold text-brand-navy-dark no-underline underline decoration-brand-yellow decoration-2 px-3 py-1.5 rounded-md bg-brand-yellow/10 hover:bg-brand-yellow">Create account</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-brand-navy hover:bg-brand-light rounded-md" onClick={() => setMenuOpen(!menuOpen)} aria-label="Main menu" aria-expanded={menuOpen}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-brand-warm-white border-b border-brand-light">
            <div className="container px-3 py-3 space-y-2">
              <Link href="/" className="block px-3 py-2 rounded-md text-brand-navy no-underline hover:bg-brand-light" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/categories" className="block px-3 py-2 rounded-md text-brand-navy no-underline hover:bg-brand-light" onClick={() => setMenuOpen(false)}>Categories</Link>
              <Link href="/about" className="block px-3 py-2 rounded-md text-brand-navy no-underline hover:bg-brand-light" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="/contact" className="block px-3 py-2 rounded-md text-brand-navy no-underline hover:bg-brand-light" onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link href="/help" className="block px-3 py-2 rounded-md text-brand-navy no-underline hover:bg-brand-light" onClick={() => setMenuOpen(false)}>Help Center</Link>
              <hr className="my-3 border-brand-light" />
              {auth === 'loading' ? null : auth.user ? (
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-brand-yellow font-medium no-underline hover:bg-brand-navy/5">Sign out</button>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-3 py-2 rounded-md text-brand-navy no-underline hover:bg-brand-light" onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link href="/auth/register" className="block px-3 py-2 rounded-md text-brand-navy font-medium no-underline hover:bg-brand-light" onClick={() => setMenuOpen(false)}>Create account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-brand-light bg-brand-navy mt-auto">
      <div className="container px-3 py-8 md:px-4">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="col-span-full md:col-span-1">
            <div className="flex items-center gap-2 brand-yellow font-bold text-xl tracking-tight mb-3">
              <span className="bg-brand-yellow px-2 py-0.5 rounded text-brand-navy-dark font-bold text-xs">M&O</span>
              MALIK &amp; OTB
            </div>
            <p className="text-brand-primary text-sm max-w-xs">Independent store · California, USA · English · USD</p>
            <p className="mt-3 text-brand-light text-sm">
              Contact: <a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-white">piratespizza999@gmail.com</a>
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-brand-primary text-sm">
              <li><a href="/" className="no-underline hover:text-brand-yellow">Home</a></li>
              <li><a href="/categories" className="no-underline hover:text-brand-yellow">Categories</a></li>
              <li><a href="/cart" className="no-underline hover:text-brand-yellow">Cart</a></li>
              <li><a href="/about" className="no-underline hover:text-brand-yellow">About us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Policies</h3>
            <ul className="space-y-2 text-brand-primary text-sm">
              <li><a href="/policies/shipping" className="no-underline hover:text-brand-yellow">Shipping</a></li>
              <li><a href="/policies/returns" className="no-underline hover:text-brand-yellow">Returns</a></li>
              <li><a href="/policies/privacy" className="no-underline hover:text-brand-yellow">Privacy</a></li>
              <li><a href="/policies/terms" className="no-underline hover:text-brand-yellow">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Help</h3>
            <ul className="space-y-2 text-brand-primary text-sm">
              <li><a href="/help" className="no-underline hover:text-brand-yellow">Help center</a></li>
              <li><a href="/contact" className="no-underline hover:text-brand-yellow">Contact us</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-6 border-brand-navy/30" />
        <p className="text-brand-light text-xs text-center">MALIK & OTB INC — California, USA. All rights reserved.</p>
      </div>
    </footer>
  )
}
