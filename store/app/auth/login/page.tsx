'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Login failed')
      router.push(next)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-3 py-10 md:px-4 lg:px-0 flex-grow">
      <div className="container max-w-md mx-auto">
        <div className="flex items-center gap-2 brand-navy font-bold text-xl mb-1">
          <span className="bg-brand-yellow px-2 py-0.5 rounded text-brand-navy-dark font-bold text-xs">M&O</span>
          MALIK &amp; OTB
        </div>
        <h1 className="text-brand-navy/60 text-sm mb-8">Sign in to your account</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium brand-navy mb-1">Email address</label>
            <input type="email" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium brand-navy mb-1">Password</label>
            <input type="password" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-yellow text-brand-navy-dark font-bold py-3 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50">
            {loading ? <ArrowRight className="w-4 h-4 mr-2 animate-spin" /> : 'Sign in'}
          </button>
          {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
        </form>
        <p className="mt-6 text-center text-sm text-brand-navy/60">
          Don't have an account?{' '}
          <a href="/auth/register" className="text-brand-navy no-underline hover:underline font-medium">Create account</a>
        </p>
      </div>
    </div>
  )
}
