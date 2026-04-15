import { adminDb } from './firebase-admin'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type SectionId = 'challenges' | 'real-fights' | 'opponents' | 'scoring'

export const SECTION_META: Record<SectionId, { title: string; description: string }> = {
  challenges: {
    title: 'Challenges',
    description:
      'Real problems from the ring. Read the situation, take Your Turn in training, come back for the solution when you are ready.',
  },
  'real-fights': {
    title: 'Real Fights',
    description:
      'Real fights broken down from the inside. What was seen, what was decided, and why — round by round.',
  },
  opponents: {
    title: 'Opponent Types',
    description:
      'Every fighter has a type. Learn how to read them before the first bell.',
  },
  scoring: {
    title: 'Scoring Game',
    description:
      'Fights are won and lost on the cards. Learn what the judges actually watch.',
  },
}

export interface TrackMembership {
  name: string
  order: number
}

export interface Challenge {
  slug: string
  title: string
  category: string
  difficulty: Difficulty
  situation: string
  publishedAt: string
  isFree: boolean
  content: string
  tracks: TrackMembership[]
  note?: string
  voiceNote?: string
  referenceVideo?: string
  referenceVideoNote?: string
  illustration?: string
}

export interface Track {
  name: string
  challenges: Challenge[]
}

export interface CultureStory {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  content: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getTracks(challenges: Challenge[]): Track[] {
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

const SITUATION_MARKER = '## The Situation'
const YOUR_TURN_MARKER = '## Your Turn'
const SOLUTION_MARKER  = '## Solution'

function extractSection(content: string, marker: string, until?: string): string | null {
  const idx = content.indexOf(marker)
  if (idx === -1) return null
  const after = content.slice(idx + marker.length).replace(/^\n+/, '')
  if (until) {
    const end = after.indexOf(until)
    return end === -1 ? after.trim() : after.slice(0, end).trim()
  }
  return after.trim()
}

export function splitChallenge(content: string): {
  situation: string
  yourTurn: string | null
  solution: string | null
} {
  return {
    situation:
      extractSection(content, SITUATION_MARKER, YOUR_TURN_MARKER) ??
      extractSection(content, SITUATION_MARKER, SOLUTION_MARKER) ??
      content.trim(),
    yourTurn: extractSection(content, YOUR_TURN_MARKER, SOLUTION_MARKER),
    solution: extractSection(content, SOLUTION_MARKER),
  }
}

// ─── Challenges ───────────────────────────────────────────────────────────────

function docToChallenge(slug: string, d: FirebaseFirestore.DocumentData): Challenge {
  return {
    slug,
    title:              d.title              ?? '',
    category:           d.category           ?? '',
    difficulty:         (d.difficulty        ?? 'beginner') as Difficulty,
    situation:          d.situation          ?? '',
    publishedAt:        d.publishedAt        ?? '',
    isFree:             d.isFree             ?? false,
    content:            d.content            ?? '',
    tracks:             (d.tracks            ?? []) as TrackMembership[],
    note:               d.note               ?? '',
    voiceNote:          d.voiceNote          ?? '',
    referenceVideo:     d.referenceVideo     ?? '',
    referenceVideoNote: d.referenceVideoNote ?? '',
    illustration:       d.illustration       ?? '',
  }
}

export async function getChallenges(): Promise<Challenge[]> {
  const snapshot = await adminDb.collection('challenges').get()
  const challenges = snapshot.docs.map((doc) => docToChallenge(doc.id, doc.data()))
  return challenges.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function getChallenge(slug: string): Promise<Challenge | null> {
  const doc = await adminDb.collection('challenges').doc(slug).get()
  if (!doc.exists) return null
  return docToChallenge(doc.id, doc.data()!)
}

// Keep these for any code that calls getArticles/getArticle directly
export async function getArticles(_section?: SectionId): Promise<Challenge[]> {
  return getChallenges()
}
export async function getArticle(_section: SectionId, slug: string): Promise<Challenge | null> {
  return getChallenge(slug)
}

// ─── Culture Stories ──────────────────────────────────────────────────────────

export async function getCultureStories(): Promise<CultureStory[]> {
  const snapshot = await adminDb.collection('culture').get()
  const stories = snapshot.docs.map((doc) => {
    const d = doc.data()
    return {
      slug:        doc.id,
      title:       d.title       ?? '',
      excerpt:     d.excerpt     ?? '',
      publishedAt: d.publishedAt ?? '',
      content:     d.content     ?? '',
    } satisfies CultureStory
  })
  return stories.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function getCultureStory(slug: string): Promise<CultureStory | null> {
  const doc = await adminDb.collection('culture').doc(slug).get()
  if (!doc.exists) return null
  const d = doc.data()!
  return {
    slug:        doc.id,
    title:       d.title       ?? '',
    excerpt:     d.excerpt     ?? '',
    publishedAt: d.publishedAt ?? '',
    content:     d.content     ?? '',
  }
}
