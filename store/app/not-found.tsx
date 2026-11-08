import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="px-3 py-12 md:px-4 md:py-20 flex-grow">
      <div className="container text-center">
        <h1 className="text-3xl font-bold brand-navy mb-2">Page not found</h1>
        <p className="text-brand-navy/60 mb-6">The page you’re looking for doesn’t exist or has been removed.</p>
        <Link href="/" className="bg-brand-yellow text-brand-navy-dark font-bold px-5 py-2.5 rounded-md no-underline hover:bg-brand-yellow-light transition">Go home</Link>
      </div>
    </div>
  )
}
