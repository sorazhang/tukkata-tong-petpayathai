'use server'

import { cookies } from 'next/headers'
import { adminAuth } from './firebase-admin'

export async function getSessionUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('tkt_session')?.value
    if (!sessionCookie) return null
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
    return decoded.uid
  } catch {
    return null
  }
}
