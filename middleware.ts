import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/review') || pathname.startsWith('/vote') || pathname.startsWith('/journal') || pathname.startsWith('/confusions')) {
    const cookie = request.cookies.get('review_auth')?.value
    if (cookie === process.env.REVIEW_PASSWORD) return NextResponse.next()

    // Check basic auth header (for programmatic access)
    const auth = request.headers.get('authorization')
    if (auth) {
      const [, b64] = auth.split(' ')
      const [, pass] = Buffer.from(b64, 'base64').toString().split(':')
      if (pass === process.env.REVIEW_PASSWORD) return NextResponse.next()
    }

    // Redirect to login
    return NextResponse.redirect(new URL('/review-login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/review/:path*', '/vote/:path*', '/vote', '/journal', '/confusions'],
}
