import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin area
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('session')?.value
    if (!token) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    // Light touch: full validation happens in API routes. Keep middleware cheap.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
