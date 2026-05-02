'use server'

import { adminDb } from './firebase-admin'

export interface KruNote {
  id: string
  text: string
  createdAt: string
}

export async function saveKruNote(
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('kru-notes').add({
      text:      text.trim(),
      createdAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveKruNote error:', err)
    return { ok: false, error: 'Failed to save.' }
  }
}

export async function updateKruNote(
  id: string,
  text: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('kru-notes').doc(id).update({
      text, updatedAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('updateKruNote error:', err)
    return { ok: false, error: 'Failed to update.' }
  }
}

export async function deleteKruNote(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('kru-notes').doc(id).delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteKruNote error:', err)
    return { ok: false, error: 'Failed to delete.' }
  }
}

export async function getKruNotes(): Promise<KruNote[]> {
  const snap = await adminDb
    .collection('kru-notes')
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map((d) => ({
    id:        d.id,
    text:      d.data().text ?? '',
    createdAt: d.data().createdAt ?? '',
  }))
}
