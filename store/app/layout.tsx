import type { Metadata } from 'next'
import './globals.css'
import { Navbar, Footer } from '@/components/navbar'

export const metadata: Metadata = {
  title: {
    template: '%s — MALIK & OTB',
    default: 'MALIK & OTB',
  },
  description: 'MALIK & OTB — independent store. California, USA. English · USD · America/Los_Angeles.',
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'MALIK & OTB',
    title: 'MALIK & OTB',
    description: 'Independent store based in California, USA. English · USD.',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col text-brand-navy bg-brand-warm-white antialiased">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
