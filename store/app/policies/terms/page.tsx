export default function TermsPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-4">Terms of service</h1>
        <p className="text-brand-navy/70 mb-6 leading-relaxed">
          These terms govern purchases made on this store, operated by MALIK & OTB INC, California, USA.
          Prices are in USD. All products shown are subject to availability; draft items are not for sale.
        </p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Orders</h2>
        <p className="text-brand-navy/70 mb-4">An order is confirmed only when payment is successfully authorized by Stripe. Order confirmation on screen alone is not proof of payment.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Pricing</h2>
        <p className="text-brand-navy/70 mb-4">Prices include applicable taxes only where shown at checkout. We do not use artificial urgency, fake discounts, or fabricated reviews.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Questions</h2>
        <p className="text-brand-navy/70 mb-4"><a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-brand-navy-dark">piratespizza999@gmail.com</a></p>
      </div>
    </div>
  )
}
