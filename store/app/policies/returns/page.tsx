export default function ReturnsPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-4">Returns &amp; refunds</h1>
        <p className="text-brand-navy/70 mb-6 leading-relaxed">
          Returns are accepted per the terms on each product page. Refunds are issued to the original
          payment method through Stripe once the returned item is received and inspected. Refund timing
          depends on your bank or card issuer; we do not control that schedule.
        </p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">How to request a return</h2>
        <p className="text-brand-navy/70 mb-4">Contact us at <a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-brand-navy-dark">piratespizza999@gmail.com</a> with your order number. We will review eligibility and reply with instructions.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Non-returnable items</h2>
        <p className="text-brand-navy/70 mb-4">Products marked non-returnable on their product page (e.g. for hygiene or safety reasons) cannot be returned unless damaged or defective on arrival.</p>
      </div>
    </div>
  )
}
