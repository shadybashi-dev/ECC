export default function ShippingReturnsPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-2">Shipping &amp; returns explained</h1>
        <p className="text-brand-navy/60 mb-8">Clear, verifiable information — no invented delivery promises.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Shipping</h2>
        <p className="text-brand-navy/70 mb-4">We ship within the United States. Estimated delivery times are provided by the carrier at checkout — we do not invent delivery dates.</p>
        <p className="text-brand-navy/70 mb-4">Shipping rates are shown on the product page and calculated at checkout once a product and destination are selected.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Delays and exceptions</h2>
        <p className="text-brand-navy/70 mb-4">If a shipment is delayed or an exception occurs, we contact the customer at the email on file and update the order status in their account.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Returns</h2>
        <p className="text-brand-navy/70 mb-4">Returns are accepted per the terms on each product page. Refunds are issued to the original payment method through Stripe once the returned item is received and inspected.</p>
        <p className="text-brand-navy/70 mb-4">Refund timing depends on your bank or card issuer; we do not control that schedule.</p>
        <p className="text-brand-navy/70 mb-4">Products marked non-returnable (e.g. for hygiene or safety reasons) cannot be returned unless damaged or defective on arrival.</p>
        <p className="mt-6 text-sm text-brand-navy/60">Full policies: <a href="/policies/shipping" className="underline underline-offset-2 hover:text-brand-navy-dark">Shipping</a> · <a href="/policies/returns" className="underline underline-offset-2 hover:text-brand-navy-dark">Returns</a></p>
      </div>
    </div>
  )
}
