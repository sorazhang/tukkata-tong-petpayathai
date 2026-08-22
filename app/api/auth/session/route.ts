export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'tkt_session'
const EXPIRES_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json()
    if (!idToken) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: EXPIRES_MS })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: EXPIRES_MS / 1000,
      path: '/',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  return NextResponse.json({ ok: true })
}
