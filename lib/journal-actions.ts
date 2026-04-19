'use server'

import { adminDb } from './firebase-admin'

export async function saveJournalEntry(
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('journal').add({
      text:      text.trim(),
      createdAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveJournalEntry error:', err)
    return { ok: false, error: 'Failed to save.' }
  }
}

export async function getJournalEntries(): Promise<{ id: string; text: string; createdAt: string }[]> {
  const snap = await adminDb
    .collection('journal')
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map((d) => ({
    id:        d.id,
    text:      d.data().text ?? '',
    createdAt: d.data().createdAt ?? '',
  }))
}
