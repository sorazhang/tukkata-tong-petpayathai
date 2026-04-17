'use server'

import { adminDb, adminStorage } from './firebase-admin'
import type { PollOption } from './polls'

export async function createPoll(
  question: string,
  description: string,
  options: PollOption[],
): Promise<{ ok: boolean; slug?: string; error?: string }> {
  try {
    const slug = question
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60)
      + '-' + Date.now().toString(36)

    await adminDb.collection('polls').doc(slug).set({
      question:    question.trim(),
      description: description.trim() || null,
      options,
      answer:      null,
      createdAt:   new Date().toISOString(),
    })

    return { ok: true, slug }
  } catch (err) {
    console.error('createPoll error:', err)
    return { ok: false, error: 'Failed to create poll.' }
  }
}

export async function savePollAnswer(
  slug: string,
  optionId: string,
  customText?: string,
  customImageBase64?: string,
  customImageMime?: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    let customImageUrl: string | undefined

    if (customImageBase64 && customImageMime) {
      const ext      = customImageMime.split('/')[1] ?? 'jpg'
      const fileName = `poll-answers/${slug}.${ext}`
      const fileRef  = adminStorage.bucket().file(fileName)
      const buffer   = Buffer.from(customImageBase64, 'base64')
      await fileRef.save(buffer, { contentType: customImageMime, resumable: false })
      await fileRef.makePublic()
      customImageUrl = `https://storage.googleapis.com/${adminStorage.bucket().name}/${fileName}`
    }

    await adminDb.collection('polls').doc(slug).update({
      answer: {
        optionId,
        ...(customText      && { customText }),
        ...(customImageUrl  && { customImageUrl }),
        savedAt: new Date().toISOString(),
      },
    })

    return { ok: true }
  } catch (err) {
    console.error('savePollAnswer error:', err)
    return { ok: false, error: 'Failed to save answer.' }
  }
}
