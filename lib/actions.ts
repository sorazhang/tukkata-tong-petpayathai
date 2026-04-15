'use server'

import { adminDb, adminStorage } from './firebase-admin'
import { splitChallenge } from './content'

// ─── Save challenge content ───────────────────────────────────────────────────

export async function saveChallenge(
  slug: string,
  situation: string,
  yourTurn: string,
  solution: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    // Rebuild the content string from sections
    let content = ''
    if (situation.trim()) content += `## The Situation\n\n${situation.trim()}\n\n`
    if (yourTurn.trim())  content += `## Your Turn\n\n${yourTurn.trim()}\n\n`
    if (solution.trim())  content += `## Solution\n\n${solution.trim()}\n`

    // One-liner situation = first non-empty line of situation body
    const oneLiner = situation.trim().split('\n').find((l) => l.trim()) ?? ''

    await adminDb.collection('challenges').doc(slug).update({
      content,
      ...(oneLiner && { situation: oneLiner }),
      updatedAt: new Date().toISOString(),
    })

    return { ok: true }
  } catch (err) {
    console.error('saveChallenge error:', err)
    return { ok: false, error: 'Failed to save.' }
  }
}

// ─── Save voice note ──────────────────────────────────────────────────────────

export async function saveVoiceNote(
  slug: string,
  base64Audio: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const bucket    = adminStorage.bucket()
    const fileName  = `voice-notes/${slug}.webm`
    const fileRef   = bucket.file(fileName)
    const buffer    = Buffer.from(base64Audio, 'base64')

    await fileRef.save(buffer, { contentType: 'audio/webm', resumable: false })

    // Make publicly readable
    await fileRef.makePublic()
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

    await adminDb.collection('challenges').doc(slug).update({
      voiceNote:  publicUrl,
      updatedAt:  new Date().toISOString(),
    })

    return { ok: true }
  } catch (err) {
    console.error('saveVoiceNote error:', err)
    return { ok: false, error: 'Failed to save voice note.' }
  }
}

// ─── Save reference video ─────────────────────────────────────────────────────

export async function saveReferenceVideo(
  slug: string,
  url: string,
  note: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('challenges').doc(slug).update({
      referenceVideo:     url.trim() || null,
      referenceVideoNote: note.trim() || null,
      updatedAt:          new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveReferenceVideo error:', err)
    return { ok: false, error: 'Failed to save video link.' }
  }
}

// ─── Save internal note ───────────────────────────────────────────────────────

export async function saveNote(
  slug: string,
  note: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await adminDb.collection('challenges').doc(slug).update({
      note:      note.trim() || null,
      updatedAt: new Date().toISOString(),
    })
    return { ok: true }
  } catch (err) {
    console.error('saveNote error:', err)
    return { ok: false, error: 'Failed to save note.' }
  }
}

// ─── Save illustration ────────────────────────────────────────────────────────

export async function saveIllustration(
  slug: string,
  base64Image: string,
  mimeType: string,
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    const ext      = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg'
    const bucket   = adminStorage.bucket()
    const fileName = `illustrations/${slug}.${ext}`
    const fileRef  = bucket.file(fileName)
    const buffer   = Buffer.from(base64Image, 'base64')

    await fileRef.save(buffer, { contentType: mimeType, resumable: false })
    await fileRef.makePublic()
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

    await adminDb.collection('challenges').doc(slug).update({
      illustration: publicUrl,
      updatedAt:    new Date().toISOString(),
    })

    return { ok: true, url: publicUrl }
  } catch (err) {
    console.error('saveIllustration error:', err)
    return { ok: false, error: 'Failed to save illustration.' }
  }
}

// ─── Split helper (re-export for convenience) ─────────────────────────────────
export { splitChallenge }
