export default function HowToOrderPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-2">How to place an order</h1>
        <ol className="mt-6 space-y-4 list-decimal list-inside text-brand-navy/70 leading-relaxed">
          <li>Browse categories and open a product page.</li>
          <li>Select a variant (if available) and quantity, then add to cart.</li>
          <li>Open your cart and proceed to checkout.</li>
          <li>Enter your email and shipping address.</li>
          <li>Pay with Stripe. During development this runs in test mode — no real money moves.</li>
          <li>You receive an order confirmation and can view the order in your account.</li>
        </ol>
        <p className="mt-8 text-sm text-brand-navy/60">Need help? <a href="/contact" className="underline underline-offset-2 hover:text-brand-navy-dark">Contact us</a>.</p>
      </div>
    </div>
  )
}
