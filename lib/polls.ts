import { adminDb, adminStorage } from './firebase-admin'

export interface PollOption {
  id: string
  label: string
  imageUrl?: string
}

export interface PollAnswer {
  optionId: string       // option id, or 'custom'
  customText?: string
  customImageUrl?: string
  savedAt: string
}

export interface Poll {
  slug: string
  question: string
  description?: string
  options: PollOption[]
  answer?: PollAnswer
  createdAt: string
}

function docToPoll(slug: string, d: FirebaseFirestore.DocumentData): Poll {
  return {
    slug,
    question:    d.question ?? '',
    description: d.description ?? undefined,
    options:     d.options ?? [],
    answer:      d.answer ?? undefined,
    createdAt:   d.createdAt ?? '',
  }
}

export async function getPolls(): Promise<Poll[]> {
  const snap = await adminDb.collection('polls').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => docToPoll(d.id, d.data()))
}

export async function getPoll(slug: string): Promise<Poll | null> {
  const doc = await adminDb.collection('polls').doc(slug).get()
  if (!doc.exists) return null
  return docToPoll(doc.id, doc.data()!)
}
