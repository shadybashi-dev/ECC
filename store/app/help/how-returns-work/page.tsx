export default function HowReturnsWorkPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-2">How returns work</h1>
        <ol className="mt-6 space-y-4 list-decimal list-inside text-brand-navy/70 leading-relaxed">
          <li>Email us at <a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-brand-navy-dark">piratespizza999@gmail.com</a> with your order number.</li>
          <li>We review eligibility and reply with return instructions.</li>
          <li>Ship the item back; once received and inspected, we issue the refund to your original payment method via Stripe.</li>
        </ol>
        <p className="mt-8 text-sm text-brand-navy/60">See the full <a href="/policies/returns" className="underline underline-offset-2 hover:text-brand-navy-dark">Returns &amp; refunds policy</a>.</p>
      </div>
    </div>
  )
}
