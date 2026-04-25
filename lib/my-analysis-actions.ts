'use server'

import { adminDb } from './firebase-admin'
import type { PatternResult } from './ai-journal-actions'

export interface MyAnalysis {
  id: string
  themes: { label: string; description: string }[]
  suggestion: string
  progress?: string
  entryCount: number
  createdAt: string
}

export async function saveMyAnalysis(
  result: PatternResult,
  entryCount: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('my-analyses').add({
      themes:     result.themes,
      suggestion: result.suggestion,
      progress:   result.progress ?? null,
      entryCount,
      createdAt:  new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveMyAnalysis error:', err)
    return { ok: false, error: 'Failed to save.' }
  }
}

export async function getMyAnalyses(): Promise<MyAnalysis[]> {
  const snap = await adminDb
    .collection('my-analyses')
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map((d) => ({
    id:         d.id,
    themes:     d.data().themes ?? [],
    suggestion: d.data().suggestion ?? '',
    progress:   d.data().progress ?? undefined,
    entryCount: d.data().entryCount ?? 0,
    createdAt:  d.data().createdAt ?? '',
  }))
}

export async function deleteMyAnalysis(id: string): Promise<{ ok: boolean }> {
  try {
    await adminDb.collection('my-analyses').doc(id).delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteMyAnalysis error:', err)
    return { ok: false }
  }
}
