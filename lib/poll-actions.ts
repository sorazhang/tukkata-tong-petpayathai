'use server'

import { adminDb, adminStorage } from './firebase-admin'
import type { PollOption } from './polls'

export interface OptionInput {
  id: string
  label: string
  imageBase64?: string
  imageMime?: string
}

export async function createPoll(
  question: string,
  description: string,
  optionInputs: OptionInput[],
): Promise<{ ok: boolean; slug?: string; error?: string }> {
  try {
    const slug = question
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60)
      + '-' + Date.now().toString(36)

    const bucket = adminStorage.bucket()

    const options: PollOption[] = await Promise.all(
      optionInputs.map(async (opt) => {
        let imageUrl: string | undefined
        if (opt.imageBase64 && opt.imageMime) {
          const ext      = opt.imageMime.split('/')[1] ?? 'jpg'
          const fileName = `poll-options/${slug}-${opt.id}.${ext}`
          const fileRef  = bucket.file(fileName)
          const buffer   = Buffer.from(opt.imageBase64, 'base64')
          await fileRef.save(buffer, { contentType: opt.imageMime, resumable: false })
          await fileRef.makePublic()
          imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
        }
        return { id: opt.id, label: opt.label.trim(), ...(imageUrl && { imageUrl }) }
      })
    )

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
