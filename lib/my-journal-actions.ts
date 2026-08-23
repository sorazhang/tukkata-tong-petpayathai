'use server'

import { adminDb } from './firebase-admin'
import { getSessionUserId } from './session'

export type JournalTag = 'footwork' | 'striking' | 'clinch' | 'mental' | 'other'

export interface MyEntry {
  id: string
  text: string
  tag: JournalTag
  createdAt: string
}

export async function saveMyEntry(
  text: string,
  tag: JournalTag,
): Promise<{ ok: boolean; error?: string }> {
  const userId = await getSessionUserId()
  if (!userId) return { ok: false, error: 'Not signed in.' }
  try {
    await adminDb.collection('my-journal').add({
      userId,
      text:      text.trim(),
      tag,
      createdAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveMyEntry error:', err)
    return { ok: false, error: 'Failed to save.' }
  }
}

export async function updateMyEntry(
  id: string,
  text: string,
  tag: JournalTag,
): Promise<{ ok: boolean; error?: string }> {
  const userId = await getSessionUserId()
  if (!userId) return { ok: false, error: 'Not signed in.' }
  try {
    const ref = adminDb.collection('my-journal').doc(id)
    const doc = await ref.get()
    if (doc.data()?.userId !== userId) return { ok: false, error: 'Forbidden.' }
    await ref.update({ text, tag, updatedAt: new Date().toISOString() })
    return { ok: true }
  } catch (err) {
    console.error('updateMyEntry error:', err)
    return { ok: false, error: 'Failed to update.' }
  }
}

export async function deleteMyEntry(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  const userId = await getSessionUserId()
  if (!userId) return { ok: false, error: 'Not signed in.' }
  try {
    const ref = adminDb.collection('my-journal').doc(id)
    const doc = await ref.get()
    if (doc.data()?.userId !== userId) return { ok: false, error: 'Forbidden.' }
    await ref.delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteMyEntry error:', err)
    return { ok: false, error: 'Failed to delete.' }
  }
}

export async function getMyEntries(): Promise<MyEntry[]> {
  const userId = await getSessionUserId()
  if (!userId) return []

  // Claim any unclaimed entries (one-time migration; no-op once all are stamped)
  const unclaimedSnap = await adminDb
    .collection('my-journal')
    .where('userId', '==', null)
    .get()
  const allSnap = await adminDb.collection('my-journal').get()
  const unclaimed = allSnap.docs.filter((d) => !d.data().userId)
  if (unclaimed.length > 0) {
    const batch = adminDb.batch()
    for (const doc of unclaimed) batch.update(doc.ref, { userId })
    await batch.commit()
  }

  const snap = await adminDb
    .collection('my-journal')
    .where('userId', '==', userId)
    .get()
  return snap.docs
    .map((d) => ({
      id:        d.id,
      text:      d.data().text ?? '',
      tag:       d.data().tag ?? 'other',
      createdAt: d.data().createdAt ?? '',
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
