import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Separate password from the rest of /review, just for the Muay Khao seminar
// review page — so people who know the site-wide review password can't see it too.
export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.MUAY_KHAO_REVIEW_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('mks_auth', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return response
}
