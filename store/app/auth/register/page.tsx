'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Registration failed')
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Registration failed')
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
        <h1 className="text-brand-navy/60 text-sm mb-8">Create an account</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium brand-navy mb-1">Full name</label>
            <input type="text" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium brand-navy mb-1">Email address</label>
            <input type="email" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium brand-navy mb-1">Password</label>
            <input type="password" required minLength={8} className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <p className="mt-1 text-xs text-brand-navy/50">At least 8 characters.</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-brand-yellow text-brand-navy-dark font-bold py-3 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50">
            {loading ? <ArrowRight className="w-4 h-4 mr-2 animate-spin" /> : 'Create account'}
          </button>
          {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
        </form>
        <p className="mt-6 text-center text-sm text-brand-navy/60">
          Already have an account?{' '}
          <a href="/auth/login" className="text-brand-navy no-underline hover:underline font-medium">Sign in</a>
        </p>
      </div>
    </div>
  )
}
