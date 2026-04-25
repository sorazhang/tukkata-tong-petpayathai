'use server'

import { adminDb } from './firebase-admin'

export interface MyChallenge {
  id: string
  title: string
  situation: string
  yourTurn: string
  fromEntryId?: string
  createdAt: string
}

export async function saveMyChallenge(
  title: string,
  situation: string,
  yourTurn: string,
  fromEntryId?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('my-challenges').add({
      title,
      situation,
      yourTurn,
      fromEntryId: fromEntryId ?? null,
      createdAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveMyChallenge error:', err)
    return { ok: false, error: 'Failed to save.' }
  }
}

export async function getMyChallenges(): Promise<MyChallenge[]> {
  const snap = await adminDb
    .collection('my-challenges')
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map((d) => ({
    id:          d.id,
    title:       d.data().title ?? '',
    situation:   d.data().situation ?? '',
    yourTurn:    d.data().yourTurn ?? '',
    fromEntryId: d.data().fromEntryId ?? undefined,
    createdAt:   d.data().createdAt ?? '',
  }))
}

export async function deleteMyChallenge(id: string): Promise<{ ok: boolean }> {
  try {
    await adminDb.collection('my-challenges').doc(id).delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteMyChallenge error:', err)
    return { ok: false }
  }
}
