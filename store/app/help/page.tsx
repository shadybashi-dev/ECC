import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-3xl">
        <h1 className="text-2xl font-bold brand-navy mb-2">Help center</h1>
        <p className="text-brand-navy/60 mb-8">Guides for buying with us.</p>
        <div className="space-y-4">
          <Link href="/help/how-to-order" className="block p-4 rounded border border-brand-light hover:bg-brand-light no-underline transition">
            <h3 className="font-bold brand-navy">How to place an order</h3>
            <p className="text-sm text-brand-navy/60 mt-1">Add items to your cart, checkout, and pay with Stripe (test mode during development).</p>
          </Link>
          <Link href="/help/how-returns-work" className="block p-4 rounded border border-brand-light hover:bg-brand-light no-underline transition">
            <h3 className="font-bold brand-navy">How returns work</h3>
            <p className="text-sm text-brand-navy/60 mt-1">Eligibility, process, and refund timing.</p>
          </Link>
          <Link href="/help/out-of-stock" className="block p-4 rounded border border-brand-light hover:bg-brand-light no-underline transition">
            <h3 className="font-bold brand-navy">An item is out of stock</h3>
            <p className="text-sm text-brand-navy/60 mt-1">What happens and how we prevent overselling.</p>
          </Link>
        </div>
        <p className="mt-8 text-sm text-brand-navy/60">Still need help? <a href="/contact" className="underline underline-offset-2 hover:text-brand-navy-dark">Contact us</a>.</p>
      </div>
    </div>
  )
}
