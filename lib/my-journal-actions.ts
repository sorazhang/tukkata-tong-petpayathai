'use server'

import { adminDb } from './firebase-admin'

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
  try {
    await adminDb.collection('my-journal').add({
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
  try {
    await adminDb.collection('my-journal').doc(id).update({
      text, tag, updatedAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('updateMyEntry error:', err)
    return { ok: false, error: 'Failed to update.' }
  }
}

export async function deleteMyEntry(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('my-journal').doc(id).delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteMyEntry error:', err)
    return { ok: false, error: 'Failed to delete.' }
  }
}

export async function getMyEntries(): Promise<MyEntry[]> {
  const snap = await adminDb
    .collection('my-journal')
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map((d) => ({
    id:        d.id,
    text:      d.data().text ?? '',
    tag:       d.data().tag ?? 'other',
    createdAt: d.data().createdAt ?? '',
  }))
}
