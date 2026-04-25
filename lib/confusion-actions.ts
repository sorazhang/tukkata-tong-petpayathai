'use server'

import { adminDb } from './firebase-admin'

export type ConfusionTag = 'footwork' | 'striking' | 'clinch' | 'mental' | 'other'
export type ConfusionStatus = 'open' | 'answered'

export interface Confusion {
  id: string
  name: string
  text: string
  tag: ConfusionTag
  status: ConfusionStatus
  challengeSlug?: string
  createdAt: string
}

export async function submitConfusion(
  name: string,
  text: string,
  tag: ConfusionTag,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('confusions').add({
      name:      name.trim() || 'Anonymous',
      text:      text.trim(),
      tag,
      status:    'open',
      createdAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('submitConfusion error:', err)
    return { ok: false, error: 'Failed to submit.' }
  }
}

export async function getConfusions(): Promise<Confusion[]> {
  const snap = await adminDb
    .collection('confusions')
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map((d) => ({
    id:           d.id,
    name:         d.data().name ?? 'Anonymous',
    text:         d.data().text ?? '',
    tag:          d.data().tag ?? 'other',
    status:       d.data().status ?? 'open',
    challengeSlug: d.data().challengeSlug ?? undefined,
    createdAt:    d.data().createdAt ?? '',
  }))
}

export async function markConfusionAnswered(
  id: string,
  challengeSlug?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('confusions').doc(id).update({
      status: 'answered',
      ...(challengeSlug && { challengeSlug }),
    })
    return { ok: true }
  } catch (err) {
    console.error('markConfusionAnswered error:', err)
    return { ok: false, error: 'Failed to update.' }
  }
}

export async function deleteConfusion(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('confusions').doc(id).delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteConfusion error:', err)
    return { ok: false, error: 'Failed to delete.' }
  }
}
