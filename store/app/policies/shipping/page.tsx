export default function ShippingPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-4">Shipping policy</h1>
        <p className="text-brand-navy/70 mb-6 leading-relaxed">
          MALIK & OTB ships within the United States. Shipping rates and delivery windows are shown on
          each product page and calculated at checkout once a product and destination are selected. We do
          not invent delivery promises: estimated times are provided by the carrier at the time of purchase.
        </p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Order processing</h2>
        <p className="text-brand-navy/70 mb-4">Orders are processed after payment is confirmed by Stripe. You will receive an order confirmation email to the address you provided at checkout.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Delays and exceptions</h2>
        <p className="text-brand-navy/70 mb-4">If a shipment is delayed or an exception occurs, we contact the customer at the email on file and update the order status in their account.</p>
        <p className="text-brand-navy/70 mb-6">Questions: <a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-brand-navy-dark">piratespizza999@gmail.com</a></p>
      </div>
    </div>
  )
}
