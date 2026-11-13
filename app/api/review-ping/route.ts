import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

// A quiet "read receipt" for the Muay Khao seminar review page (hosted on claude.ai,
// not this site). The page loads this as a 1x1 image, which fires the request
// cross-origin with no CORS setup needed. We log only when it happened and which
// label was pinged — never who, no IP, no identity. Never let logging fail the pixel.
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  'base64'
)

export async function GET(request: NextRequest) {
  try {
    const label = request.nextUrl.searchParams.get('p') || 'review-page'
    await adminDb.collection('reviewPings').add({
      at: new Date().toISOString(),
      label,
    })
  } catch {
    // swallow — the pixel must always return
  }

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
