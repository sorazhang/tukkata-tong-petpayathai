import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// Password-protected: lets Sora check whether/when the review page was opened,
// without exposing it publicly. Reuses the same REVIEW_PASSWORD as /api/review-auth.
export async function GET(request: NextRequest) {
  const pw = request.nextUrl.searchParams.get('pw')
  if (!pw || pw !== process.env.REVIEW_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const snap = await adminDb
    .collection('reviewPings')
    .orderBy('at', 'desc')
    .limit(50)
    .get()

  const pings = snap.docs.map((d) => d.data())
  return NextResponse.json({ count: pings.length, pings })
}
