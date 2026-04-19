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

export async function updateJournalEntry(
  id: string,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('journal').doc(id).update({
      text:      text.trim(),
      updatedAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('updateJournalEntry error:', err)
    return { ok: false, error: 'Failed to update.' }
  }
}

export async function deleteJournalEntry(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('journal').doc(id).delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteJournalEntry error:', err)
    return { ok: false, error: 'Failed to delete.' }
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
