export default function OutOfStockPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-2">An item is out of stock</h1>
        <p className="text-brand-navy/70 mb-6 leading-relaxed">
          We track inventory in real time and block checkout when stock is insufficient, so you cannot
          buy something we cannot ship (no overselling). When stock returns, the item becomes purchasable again.
        </p>
        <p className="mt-4 text-sm text-brand-navy/60">Want to know when a specific item returns? <a href="/contact" className="underline underline-offset-2 hover:text-brand-navy-dark">Contact us</a>.</p>
      </div>
    </div>
  )
}
