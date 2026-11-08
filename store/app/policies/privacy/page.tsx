export default function PrivacyPage() {
  return (
    <div className="px-3 py-10 md:px-4 md:py-16 lg:px-0 flex-grow">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold brand-navy mb-4">Privacy notice</h1>
        <p className="text-brand-navy/70 mb-6 leading-relaxed">
          We collect the personal data you provide at checkout (name, email, shipping address) solely to
          process and ship your order, and to communicate with you about it. Payment card details are
          handled by Stripe; MALIK & OTB does not store card numbers.
        </p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Data we share</h2>
        <p className="text-brand-navy/70 mb-4">Order data is shared with Stripe for payments and with our shipping carrier for delivery. We do not sell personal data.</p>
        <h2 className="text-xl font-bold brand-navy mt-8 mb-2">Your rights</h2>
        <p className="text-brand-navy/70 mb-4">You may request access to, correction of, or deletion of your data by emailing <a href="mailto:piratespizza999@gmail.com" className="underline underline-offset-2 hover:text-brand-navy-dark">piratespizza999@gmail.com</a>.</p>
      </div>
    </div>
  )
}
