'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, AlertCircle, CheckCircle2, Mail } from 'lucide-react'

type CartItem = {
  id: string
  variantId: string
  quantity: number
  variant: { sku: string; name: string; priceAdjCents: number; stock: number; active: boolean }
  product: { id: string; slug: string; name: string; basePriceCents: number; status: string; testData: boolean }
  unitPriceCents: number
  lineTotalCents: number
}

type Cart = { id: string; items: CartItem[]; subtotalCents: number; itemCount: number }

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    const res = await fetch('/api/cart', { cache: 'no-store', headers: { Accept: 'application/json' } })
    const json = await res.json()
    setCart(json.cart || null)
    setLoading(false)
  }

  async function updateQty(itemId: string, delta: number) {
    const item = cart?.items.find((i) => i.id === itemId)
    if (!item) return
    const nextQty = Math.max(0, Math.min(99, item.quantity + delta))
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: nextQty }),
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error || 'Could not update quantity')
      return
    }
    setError(null)
    loadCart()
  }

  async function removeItem(itemId: string) {
    await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' })
    loadCart()
  }

  async function checkout() {
    if (!cart || cart.itemCount === 0) return
    router.push('/checkout')
  }

  if (loading) return (
    <div className="px-3 py-12 md:px-4 flex-grow"><div className="container text-center text-brand-navy/60">Loading cart…</div></div>
  )
  if (!cart) return (
    <div className="px-3 py-12 md:px-4 flex-grow"><div className="container text-center text-brand-navy/60">Failed to load cart.</div></div>
  )

  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container">
        <nav className="mb-6 text-xs text-brand-navy/60"><a href="/" className="no-underline hover:underline">Home</a> <span className="mx-1 text-brand-navy/30">/</span> <span className="brand-navy font-medium">Cart</span></nav>
        <h1 className="text-2xl font-bold brand-navy mb-2">Your cart</h1>
        <p className="text-brand-navy/60 mb-8">Review your items before checkout.</p>

        {error && <div className="mb-6 p-3 rounded border border-brand-yellow/40 bg-brand-yellow/10 text-brand-navy-dark text-sm">{error}</div>}

        {cart.itemCount === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🛒</div>
            <h2 className="font-bold brand-navy">Your cart is empty</h2>
            <p className="text-brand-navy/60 mb-6">Add products to get started.</p>
            <a href="/categories" className="bg-brand-yellow text-brand-navy-dark font-bold px-6 py-2.5 rounded-md no-underline hover:bg-brand-yellow-light transition">Browse categories</a>
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-12 mb-8">
              <div className="lg:col-span-7">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-brand-light text-sm text-brand-navy/60">
                      <th className="pb-3">Product</th><th className="pb-3 text-right">Price</th><th className="pb-3 text-right">Qty</th><th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.items.map((item) => (
                      <tr key={item.id} className="border-b border-brand-light/50">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm">{item.product.name}</span>
                            <span className="text-xs text-brand-navy/50 block">{item.variant.sku} — {item.variant.name}</span>
                            {!item.variant.active || item.product.status !== 'ACTIVE' || item.product.testData && (
                              <span className="text-xs border border-brand-navy/30 text-brand-navy/50 px-2 py-0.5 rounded ml-2">Not purchasable</span>
                            )}
                          </div>
                          {item.product.testData && <span className="text-xs text-brand-navy/40">Test data</span>}
                          {!item.variant.active && <span className="text-xs text-red-500">Variant inactive</span>}
                        </td>
                        <td className="py-4 text-right text-brand-navy">${(item.unitPriceCents / 100).toFixed(2)}</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded border border-brand-light flex items-center justify-center text-brand-navy hover:bg-brand-light" disabled={item.quantity <= 1} aria-label="Decrease"><Minus className="w-3 h-3" /></button>
                            <span className="w-8 text-right font-mono">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded border border-brand-light flex items-center justify-center text-brand-navy hover:bg-brand-light" aria-label="Increase"><Plus className="w-3 h-3" /></button>
                          </div>
                        </td>
                        <td className="py-4 text-right text-brand-navy">${(item.lineTotalCents / 100).toFixed(2)}</td>
                        <td className="py-4 text-right"><button onClick={() => removeItem(item.id)} className="text-brand-navy/50 hover:text-brand-red-600 no-underline" aria-label="Remove"><Trash2 className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="lg:col-span-5">
                <div className="bg-brand-warm-white border border-brand-light rounded-lg p-6">
                  <div className="flex justify-between mb-2"><span className="text-brand-navy/60">Subtotal</span><span className="font-bold brand-navy">${(cart.subtotalCents / 100).toFixed(2)}</span></div>
                  <div className="flex justify-between mb-2"><span className="text-brand-navy/60 text-sm">Shipping</span><span className="text-brand-navy/60 text-sm">Calculated at checkout</span></div>
                  <div className="flex justify-between mb-6 pt-3 border-t border-brand-light"><span className="font-bold brand-navy">Total</span><span className="font-bold text-xl brand-navy-dark">${(cart.subtotalCents / 100).toFixed(2)}</span></div>
                  <button onClick={checkout} disabled={cart.itemCount === 0} className="w-full bg-brand-yellow text-brand-navy-dark font-bold py-3 rounded-md no-underline hover:bg-brand-yellow-light transition disabled:opacity-50 disabled:cursor-not-allowed">Proceed to checkout</button>
                  <p className="mt-4 text-xs text-brand-navy/50">No card details are stored by us. Payments are processed by Stripe in test mode.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
