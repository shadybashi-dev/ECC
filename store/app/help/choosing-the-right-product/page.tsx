export default function ChoosingProductPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-2">How to choose the right product</h1>
        <p className="text-brand-navy/60 mb-8">Use specifications and restrictions to decide what fits your needs — and what doesn’t.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Check the specifications first</h2>
        <p className="text-brand-navy/70 mb-4">Every product page lists materials, dimensions, weight, usage, and restrictions. Read these before adding to cart.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Who this product is for</h2>
        <p className="text-brand-navy/70 mb-4">Product pages state the intended use. If your use case isn’t listed, contact us before ordering.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Who this product is NOT for</h2>
        <p className="text-brand-navy/70 mb-4">Restrictions are shown clearly on each product page. If a product is marked unsuitable for your situation, do not purchase it.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Compare variants</h2>
        <p className="text-brand-navy/70 mb-4">If multiple variants exist (size, color, configuration), compare price and stock for each before deciding.</p>
        <p className="mt-8 text-sm text-brand-navy/60">Still unsure? <a href="/contact" className="underline underline-offset-2 hover:text-brand-navy-dark">Contact us</a>.</p>
      </div>
    </div>
  )
}
