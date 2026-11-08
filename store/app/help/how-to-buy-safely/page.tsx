export default function HowToBuySafelyPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-2">How to buy safely online</h1>
        <p className="text-brand-navy/60 mb-8">A practical guide for shoppers — no promises, just verifiable facts.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Before you order</h2>
        <ul className="space-y-3 text-brand-navy/70 list-disc list-inside mb-6">
          <li>Check the product page for specifications, materials, usage, and restrictions.</li>
          <li>Confirm stock availability — we block checkout when stock is insufficient.</li>
          <li>Review the shipping and returns policy for each product.</li>
          <li>Verify the seller identity: MALIK & OTB INC, California, USA.</li>
        </ul>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">During checkout</h2>
        <ul className="space-y-3 text-brand-navy/70 list-disc list-inside mb-6">
          <li>Your order is confirmed only after payment is authorized by Stripe.</li>
          <li>We never store your card details — payments are handled by Stripe.</li>
          <li>Save your order number; you can track it at any time.</li>
        </ul>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">After you order</h2>
        <ul className="space-y-3 text-brand-navy/70 list-disc list-inside mb-6">
          <li>You will receive a confirmation email once a verified sending service is connected.</li>
          <li>Track your order status in your account or via the Track order page.</li>
          <li>If an item is delayed or an exception occurs, we contact you at the email on file.</li>
        </ul>
        <p className="mt-8 text-sm text-brand-navy/60">Questions? <a href="/contact" className="underline underline-offset-2 hover:text-brand-navy-dark">Contact us</a>.</p>
      </div>
    </div>
  )
}
