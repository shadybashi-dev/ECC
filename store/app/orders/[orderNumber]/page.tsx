export const dynamic = 'force-dynamic'

async function getOrder(orderNumber: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/orders/${encodeURIComponent(orderNumber)}`, { cache: 'no-store', headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  const json = await res.json()
  return json.order || null
}

export default async function OrderPage({ params }: { params: { orderNumber: string } }) {
  const order = await getOrder(params.orderNumber)
  if (!order) {
    return (
      <div className="px-3 py-12 md:px-4 md:py-20 flex-grow">
        <div className="container text-center">
          <h1 className="text-2xl font-bold brand-navy">Order not found</h1>
          <p className="mt-2 text-brand-navy/60">Please sign in to view your orders.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container">
        <nav className="mb-6 text-xs text-brand-navy/60"><a href="/" className="no-underline hover:underline">Home</a> <span className="mx-1 text-brand-navy/30">/</span> <span className="brand-navy font-medium">Order {order.orderNumber}</span></nav>
        <h1 className="text-2xl font-bold brand-navy mb-2">Order {order.orderNumber}</h1>
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="p-3 rounded bg-brand-warm-white border border-brand-light"><div className="text-xs text-brand-navy/40">Status</div><div className="font-bold brand-navy">{order.status}</div></div>
          <div className="p-3 rounded bg-brand-warm-white border border-brand-light"><div className="text-xs text-brand-navy/40">Payment</div><div className="font-bold brand-navy">{order.payment_status}</div></div>
          <div className="p-3 rounded bg-brand-warm-white border border-brand-light"><div className="text-xs text-brand-navy/40">Fulfillment</div><div className="font-bold brand-navy">{order.fulfillment_status}</div></div>
        </div>
        <div className="mb-8">
          <h2 className="font-bold brand-navy mb-2">Items</h2>
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-brand-light text-sm text-brand-navy/60"><th className="pb-3">Product</th><th className="pb-3 text-right">Qty</th><th className="pb-3 text-right">Total</th></tr></thead>
            <tbody>
              {(order.items || []).map((it: any) => (
                <tr key={it.id} className="border-b border-brand-light/50">
                  <td className="py-3">{it.name} <span className="block text-xs text-brand-navy/50">{it.sku}</span></td>
                  <td className="py-3 text-right">{it.quantity}</td>
                  <td className="py-3 text-right">${(it.totalCents / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <div className="text-right">
            <div className="text-sm text-brand-navy/40">Total</div>
            <div className="font-bold text-xl brand-navy-dark">${(order.totalCents / 100).toFixed(2)} {order.currency}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
