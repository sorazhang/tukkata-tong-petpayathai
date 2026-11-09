'use server'

import Anthropic from '@anthropic-ai/sdk'
import { redirect } from 'next/navigation'
import { adminDb } from './firebase-admin'

// ── Types ────────────────────────────────────────────────────────────────────

export type Speaker = 'me' | 'kru'

export interface DialogueTurn {
  id: string
  speaker: Speaker
  /** BCP-47 language the speech recogniser was listening in, e.g. 'en-US' / 'th-TH' */
  lang: string
  /** Raw text, exactly as spoken / typed (Kru's turns stay in Thai) */
  text: string
  /** English translation of a Thai turn (null for English turns or not yet translated) */
  translation: string | null
  /** ISO timestamp when the turn started */
  at: string
  /** ⚡ A "spark" — a moment where something clicked */
  spark: boolean
}

export interface Dialogue {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  turns: DialogueTurn[]
}

export interface DialogueSummary {
  id: string
  title: string
  createdAt: string
  turnCount: number
  sparkCount: number
}

export interface SparkItem {
  dialogueId: string
  dialogueTitle: string
  turn: DialogueTurn
  /** Up to two turns before the spark, for context */
  context: DialogueTurn[]
}

const COLLECTION = 'dialogues'

// Firestore rejects `undefined`, so normalise every field explicitly.
function cleanTurn(t: DialogueTurn): DialogueTurn {
  return {
    id:          String(t.id),
    speaker:     t.speaker === 'kru' ? 'kru' : 'me',
    lang:        String(t.lang ?? ''),
    text:        String(t.text ?? ''),
    translation: t.translation ? String(t.translation) : null,
    at:          String(t.at ?? new Date().toISOString()),
    spark:       Boolean(t.spark),
  }
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

/** Form action: creates an empty session and opens it. */
export async function createDialogue(formData: FormData): Promise<void> {
  const now   = new Date()
  const raw   = String(formData.get('title') ?? '').trim()
  const title = raw || `Session ${now.toISOString().slice(0, 10)}`
  const ref = await adminDb.collection(COLLECTION).add({
    title,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    turns:     [],
  })
  redirect(`/dialogue/${ref.id}`)
}

export async function saveDialogue(
  id: string,
  data: { title: string; turns: DialogueTurn[] },
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection(COLLECTION).doc(id).update({
      title:     data.title.trim() || 'Untitled session',
      turns:     data.turns.map(cleanTurn),
      updatedAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveDialogue error:', err)
    return { ok: false, error: 'Failed to save.' }
  }
}

export async function getDialogue(id: string): Promise<Dialogue | null> {
  const doc = await adminDb.collection(COLLECTION).doc(id).get()
  if (!doc.exists) return null
  const d = doc.data()!
  return {
    id:        doc.id,
    title:     d.title ?? 'Untitled session',
    createdAt: d.createdAt ?? '',
    updatedAt: d.updatedAt ?? '',
    turns:     Array.isArray(d.turns) ? d.turns.map(cleanTurn) : [],
  }
}

export async function getDialogues(): Promise<DialogueSummary[]> {
  const snap = await adminDb.collection(COLLECTION).orderBy('createdAt', 'desc').get()
  return snap.docs.map((doc) => {
    const d = doc.data()
    return {
      id:        doc.id,
      title:     d.title ?? 'Untitled session',
      createdAt: d.createdAt ?? '',
      turnCount: Array.isArray(d.turns) ? d.turns.length : 0,
      sparkCount: Array.isArray(d.turns) ? d.turns.filter((t: DialogueTurn) => t.spark).length : 0,
    }
  })
}

export async function getAllSparks(): Promise<SparkItem[]> {
  const snap = await adminDb.collection(COLLECTION).orderBy('createdAt', 'desc').get()
  const out: SparkItem[] = []
  for (const doc of snap.docs) {
    const d = doc.data()
    const turns: DialogueTurn[] = Array.isArray(d.turns) ? d.turns.map(cleanTurn) : []
    turns.forEach((t, i) => {
      if (!t.spark) return
      out.push({
        dialogueId:    doc.id,
        dialogueTitle: d.title ?? 'Untitled session',
        turn:          t,
        context:       turns.slice(Math.max(0, i - 2), i),
      })
    })
  }
  return out
}

export async function deleteDialogue(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection(COLLECTION).doc(id).delete()
    return { ok: true }
  } catch (err) {
    console.error('deleteDialogue error:', err)
    return { ok: false, error: 'Failed to delete.' }
  }
}

// ── Translation (Kru's Thai → English) ───────────────────────────────────────

const client = new Anthropic()

export async function translateKruTurn(
  thaiText: string,
  previousQuestion?: string,
): Promise<{ ok: true; translation: string } | { ok: false; error: string }> {
  if (!thaiText.trim()) return { ok: false, error: 'Empty text' }
  try {
    const context = previousQuestion?.trim()
      ? `The student had just asked (in English): "${previousQuestion.trim()}"\n\n`
      : ''
    const message = await client.messages.create({
      model: 'claude-haiku-5-5',
      max_tokens: 1024,
      system:
        'You translate a Muay Thai teacher (Kru) speaking Thai to his English-speaking student. ' +
        'The Thai comes from browser speech-to-text, so it may contain recognition errors, missing ' +
        'punctuation or filler words — infer the most likely meaning. Translate faithfully and ' +
        'naturally; do not summarise or add advice. Keep Muay Thai terms in romanised Thai with the ' +
        'English in brackets the first time, e.g. "teep (push kick)". Return only the English translation.',
      messages: [
        { role: 'user', content: `${context}Kru said (Thai):\n${thaiText.trim()}` },
      ],
    })
    const translation = message.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
    return { ok: true, translation }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('translateKruTurn error:', msg)
    return { ok: false, error: msg }
  }
}
