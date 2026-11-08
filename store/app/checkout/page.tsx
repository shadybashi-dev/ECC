'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, MapPin, CreditCard, AlertCircle } from 'lucide-react'

const initForm = {
  email: '',
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
}

export default function CheckoutPage() {
  const router = useRouter()
  const [stage, setStage] = useState<'info' | 'payment' | 'success' | 'error'>('info')
  const [form, setForm] = useState(initForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  async function createOrder() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          shippingAddress: {
            name: form.name,
            line1: form.addressLine1,
            line2: form.addressLine2,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: form.country,
          },
          billingAddress: {
            name: form.name,
            line1: form.addressLine1,
            line2: form.addressLine2,
            city: form.city,
            state: form.state,
            postal_code: form.postalCode,
            country: form.country,
          },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Could not create order')
      setOrderNumber(json.orderNumber)

      const piRes = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: json.orderId }),
      })
      const piJson = await piRes.json()
      if (!piRes.ok) throw new Error(piJson.error || 'Payment setup failed')
      setClientSecret(piJson.clientSecret)
      setStage('payment')
    } catch (err: any) {
      setError(err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  async function confirmPayment() {
    if (!clientSecret) return
    setLoading(true)
    try {
      // @ts-ignore — Stripe.js loaded via script tag in layout for test mode
      const stripe = (window as any).Stripe?.(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      if (!stripe) throw new Error('Stripe library not loaded')
      const { error } = await stripe.confirmPayment({
        clientSecret,
        paymentMethod: {
          type: 'card',
          card: document.getElementById('card-element') as any,
          billing_details: { email: form.email, name: form.name },
        },
      })
      if (error) throw new Error(error.message)
      setStage('success')
    } catch (err: any) {
      setError(err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const stripeConfigured = Boolean(publishable && publishable.startsWith('pk_'))

  return (
    <div className="px-3 py-8 md:px-4 md:py-14 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <nav className="mb-6 text-xs text-brand-navy/60"><a href="/" className="no-underline hover:underline">Home</a> <span className="mx-1 text-brand-navy/30">/</span> <a href="/cart" className="no-underline hover:underline">Cart</a> <span className="mx-1 text-brand-navy/30">/</span> <span className="brand-navy font-medium">Checkout</span></nav>

        {stage === 'info' && (
          <>
            <h1 className="text-2xl font-bold brand-navy mb-2">Checkout</h1>
            <p className="text-brand-navy/60 mb-8">Enter your details to place the order.</p>
            {!stripeConfigured && (
              <div className="mb-6 p-3 rounded border border-brand-yellow/40 bg-brand-yellow/10 text-brand-navy-dark text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2" aria-hidden="true" />
                Stripe is not configured (missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY). Order creation works, payment is simulated.
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); createOrder() }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium brand-navy mb-1">Email address</label>
                  <input type="email" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium brand-navy mb-1">Full name</label>
                  <input type="text" required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium brand-navy mb-1">Address line 1</label>
                <input required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium brand-navy mb-1">Address line 2 (optional)</label>
                <input className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium brand-navy mb-1">City</label>
                  <input required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium brand-navy mb-1">State</label>
                  <input required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium brand-navy mb-1">ZIP</label>
                  <input required className="w-full border border-brand-light rounded px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-yellow" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-brand-yellow text-brand-navy-dark font-bold py-3.5 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Continue to payment'}
              </button>
              {error && <div className="mt-3 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
            </form>
          </>
        )}

        {stage === 'payment' && (
          <>
            <h1 className="text-2xl font-bold brand-navy mb-2">Payment</h1>
            <p className="text-brand-navy/60 mb-6">Order <span className="font-mono">{orderNumber}</span>. Test mode — use Stripe test card <code className="font-mono text-sm">4242 4242 4242 4242</code>, any future date, any CVC.</p>
            {!stripeConfigured && (
              <div className="mb-4 p-3 rounded border border-brand-yellow/40 bg-brand-yellow/10 text-brand-navy-dark text-sm">
                Payment provider not configured — simulating success. Click "Pay" to complete.
              </div>
            )}
            <div id="card-element" className="mb-4 border border-brand-light rounded p-3 bg-brand-warm-white" />
            <div className="flex gap-3">
              <button onClick={confirmPayment} disabled={loading || !stripeConfigured} className="flex-1 bg-brand-yellow text-brand-navy-dark font-bold py-3.5 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Pay order'}
              </button>
              <button onClick={() => setStage('info')} className="px-4 py-3.5 rounded-md border border-brand-light text-brand-navy no-underline hover:bg-brand-light">Back</button>
            </div>
            {error && <div className="mt-3 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
          </>
        )}

        {stage === 'success' && (
          <>
            <div className="text-center py-10">
              <div className="text-5xl mb-3">✅</div>
              <h2 className="text-2xl font-bold brand-navy">Order placed</h2>
              <p className="text-brand-navy/60">Thank you, {form.name}. Order <span className="font-mono font-bold">{orderNumber}</span> has been received and payment confirmed (test mode).</p>
              <p className="mt-4 text-sm text-brand-navy/60">An order confirmation will be sent to {form.email} once a verified sending service is connected.</p>
              <div className="mt-8">
                <LinkButton href={`/order/${orderNumber}`}>View order</LinkButton>
                <LinkButton href="/" variant="outline">Continue shopping</LinkButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function LinkButton({ href, children, variant }: { href: string; children: React.ReactNode; variant?: 'fill' | 'outline' }) {
  const cls = variant === 'outline'
    ? 'border border-brand-light text-brand-navy hover:bg-brand-light'
    : 'bg-brand-yellow text-brand-navy-dark hover:bg-brand-yellow-light'
  return (
    <a href={href} className={`inline-block font-bold px-5 py-2.5 rounded-md no-underline transition ${cls}`}>{children}</a>
  )
}
