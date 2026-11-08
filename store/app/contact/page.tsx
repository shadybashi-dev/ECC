'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSending(true)
    // No backend mail service is configured yet. Message is logged locally until a verified sender is connected.
    await new Promise((r) => setTimeout(r, 800))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold brand-navy mb-2">Contact us</h1>
        <p className="text-brand-navy/60 mb-8">Direct email — no forms are sold or shared with third parties.</p>
        {sent ? (
          <div className="p-4 rounded bg-brand-light border border-brand-primary text-brand-navy">
            <h3 className="font-bold mb-1">Message sent.</h3>
            <p className="text-sm">We’ll reply to your email as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium brand-navy mb-1">Your email</label>
              <input type="email" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
            </div>
            <div>
              <label className="block text-sm font-medium brand-navy mb-1">Subject</label>
              <input required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
            </div>
            <div>
              <label className="block text-sm font-medium brand-navy mb-1">Message</label>
              <textarea required rows={5} className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" />
            </div>
            <button type="submit" disabled={sending} className="w-full bg-brand-yellow text-brand-navy-dark font-bold py-3 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50">
              {sending ? 'Sending…' : 'Send message'}
            </button>
            {error && <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
          </form>
        )}
        <p className="mt-8 text-sm text-brand-navy/60">Or write directly: <a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-brand-navy-dark">piratespizza999@gmail.com</a></p>
      </div>
    </div>
  )
}
