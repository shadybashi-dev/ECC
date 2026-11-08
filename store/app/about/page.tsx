export default function AboutPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold brand-navy mb-4">About MALIK & OTB</h1>
        <p className="text-brand-navy/70 mb-6 leading-relaxed">
          MALIK & OTB is an independent store based in California, USA. We sell directly to customers
          in the United States, in English, with prices in USD. The site, database, and content are
          owned outright — no third-party platform runs the core store.
        </p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Who this store is for</h2>
        <p className="text-brand-navy/70 mb-4">Shoppers looking for a straightforward, transparent buying experience with clear policies and real stock information.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Who it is not for</h2>
        <p className="text-brand-navy/70 mb-4">Wholesale buyers, international shoppers outside the United States, or anyone needing same-day delivery — we do not offer those yet.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Contact</h2>
        <p className="text-brand-navy/70 mb-4">Email: <a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-brand-navy-dark">piratespizza999@gmail.com</a></p>
      </div>
    </div>
  )
}
