/**
 * Firestore-backed content layer.
 * Replaces the MDX file reads in lib/content.ts once Firebase is live.
 */

import { adminDb } from './firebase-admin'
import type { Challenge, CultureStory, Track, TrackMembership, Difficulty } from './content'

// ─── Challenges ───────────────────────────────────────────────────────────────

export async function getChallengesFromFirestore(): Promise<Challenge[]> {
  const snapshot = await adminDb.collection('challenges').get()
  const challenges = snapshot.docs.map((doc) => {
    const d = doc.data()
    return {
      slug:               doc.id,
      title:              d.title ?? '',
      category:           d.category ?? '',
      difficulty:         (d.difficulty ?? 'beginner') as Difficulty,
      situation:          d.situation ?? '',
      publishedAt:        d.publishedAt ?? '',
      isFree:             d.isFree ?? false,
      content:            d.content ?? '',
      tracks:             (d.tracks ?? []) as TrackMembership[],
      note:               d.note ?? '',
      voiceNote:          d.voiceNote ?? '',
      referenceVideo:     d.referenceVideo ?? '',
      referenceVideoNote: d.referenceVideoNote ?? '',
    } satisfies Challenge
  })

  return challenges.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function getChallengeFromFirestore(
  slug: string,
): Promise<Challenge | null> {
  const doc = await adminDb.collection('challenges').doc(slug).get()
  if (!doc.exists) return null
  const d = doc.data()!
  return {
    slug:               doc.id,
    title:              d.title ?? '',
    category:           d.category ?? '',
    difficulty:         (d.difficulty ?? 'beginner') as Difficulty,
    situation:          d.situation ?? '',
    publishedAt:        d.publishedAt ?? '',
    isFree:             d.isFree ?? false,
    content:            d.content ?? '',
    tracks:             (d.tracks ?? []) as TrackMembership[],
    note:               d.note ?? '',
    voiceNote:          d.voiceNote ?? '',
    referenceVideo:     d.referenceVideo ?? '',
    referenceVideoNote: d.referenceVideoNote ?? '',
  }
}

// ─── Culture Stories ──────────────────────────────────────────────────────────

export async function getCultureStoriesFromFirestore(): Promise<CultureStory[]> {
  const snapshot = await adminDb.collection('culture').get()
  const stories = snapshot.docs.map((doc) => {
    const d = doc.data()
    return {
      slug:        doc.id,
      title:       d.title ?? '',
      excerpt:     d.excerpt ?? '',
      publishedAt: d.publishedAt ?? '',
      content:     d.content ?? '',
    } satisfies CultureStory
  })
  return stories.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function getCultureStoryFromFirestore(
  slug: string,
): Promise<CultureStory | null> {
  const doc = await adminDb.collection('culture').doc(slug).get()
  if (!doc.exists) return null
  const d = doc.data()!
  return {
    slug:        doc.id,
    title:       d.title ?? '',
    excerpt:     d.excerpt ?? '',
    publishedAt: d.publishedAt ?? '',
    content:     d.content ?? '',
  }
}

// ─── Tracks ───────────────────────────────────────────────────────────────────

export function getTracksFromChallenges(challenges: Challenge[]): Track[] {
  const map = new Map<string, { challenge: Challenge; order: number }[]>()
  for (const c of challenges) {
    for (const t of c.tracks) {
      if (!map.has(t.name)) map.set(t.name, [])
      map.get(t.name)!.push({ challenge: c, order: t.order })
    }
  }
  return Array.from(map.entries()).map(([name, items]) => ({
    name,
    challenges: items.sort((a, b) => a.order - b.order).map((i) => i.challenge),
  }))
}
