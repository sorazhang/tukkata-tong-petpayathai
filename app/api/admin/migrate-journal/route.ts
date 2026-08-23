export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getSessionUserId } from '@/lib/session'

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  }

  try {
    const snap = await adminDb
      .collection('my-journal')
      .where('userId', '==', null)
      .get()

    // Also catch docs that simply have no userId field
    const allSnap = await adminDb.collection('my-journal').get()
    const docsToMigrate = allSnap.docs.filter((d) => !d.data().userId)

    if (docsToMigrate.length === 0) {
      return NextResponse.json({ ok: true, migrated: 0 })
    }

    const batch = adminDb.batch()
    for (const doc of docsToMigrate) {
      batch.update(doc.ref, { userId })
    }
    await batch.commit()

    return NextResponse.json({ ok: true, migrated: docsToMigrate.length })
  } catch (err) {
    console.error('migrate-journal error:', err)
    return NextResponse.json({ error: 'Migration failed.' }, { status: 500 })
  }
}
