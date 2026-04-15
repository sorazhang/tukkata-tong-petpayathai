'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export async function saveChallenge(
  slug: string,
  situation: string,
  yourTurn: string,
  solution: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const filePath = path.join(
      process.cwd(),
      'content',
      'challenges',
      `${slug}.mdx`,
    )

    if (!fs.existsSync(filePath)) {
      return { ok: false, error: 'Challenge file not found.' }
    }

    const raw = fs.readFileSync(filePath, 'utf8')

    // Extract the raw frontmatter block exactly as-is so we don't mangle it
    const closingDash = raw.indexOf('\n---', 4)
    if (closingDash === -1) {
      return { ok: false, error: 'Could not parse frontmatter.' }
    }
    const frontmatter = raw.slice(0, closingDash + 4) // keep up to and including \n---

    // Re-parse to get the data object (so we can update `situation` one-liner too)
    const { data } = matter(raw)

    // Update the short situation one-liner in frontmatter if the body situation changed
    // We use the first non-empty line of the body situation as the one-liner
    const oneLiner = situation.trim().split('\n').find((l) => l.trim()) ?? data.situation
    const updatedFrontmatter = frontmatter.replace(
      /^situation:.*$/m,
      `situation: ${JSON.stringify(oneLiner)}`,
    )

    // Build the body content from the three sections
    let body = '\n'

    if (situation.trim()) {
      body += `## The Situation\n\n${situation.trim()}\n\n`
    }

    if (yourTurn.trim()) {
      body += `## Your Turn\n\n${yourTurn.trim()}\n\n`
    }

    if (solution.trim()) {
      body += `## Solution\n\n${solution.trim()}\n`
    }

    fs.writeFileSync(filePath, updatedFrontmatter + body, 'utf8')

    return { ok: true }
  } catch (err) {
    console.error('saveChallenge error:', err)
    return { ok: false, error: 'Failed to save. Check the server console.' }
  }
}

export async function saveVoiceNote(
  slug: string,
  base64Audio: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const recordingsDir = path.join(process.cwd(), 'public', 'recordings')
    fs.mkdirSync(recordingsDir, { recursive: true })

    const audioBuffer = Buffer.from(base64Audio, 'base64')
    const fileName = `${slug}.webm`
    fs.writeFileSync(path.join(recordingsDir, fileName), audioBuffer)

    // Update frontmatter to reference the saved file
    const filePath = path.join(process.cwd(), 'content', 'challenges', `${slug}.mdx`)
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    data.voiceNote = `recordings/${fileName}`
    fs.writeFileSync(filePath, matter.stringify(content, data), 'utf8')

    return { ok: true }
  } catch (err) {
    console.error('saveVoiceNote error:', err)
    return { ok: false, error: 'Failed to save voice note.' }
  }
}

export async function saveReferenceVideo(
  slug: string,
  url: string,
  note: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'challenges', `${slug}.mdx`)
    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)
    data.referenceVideo = url.trim() || undefined
    data.referenceVideoNote = note.trim() || undefined
    fs.writeFileSync(filePath, matter.stringify(content, data), 'utf8')
    return { ok: true }
  } catch (err) {
    console.error('saveReferenceVideo error:', err)
    return { ok: false, error: 'Failed to save video link.' }
  }
}

export async function saveNote(
  slug: string,
  note: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const filePath = path.join(
      process.cwd(),
      'content',
      'challenges',
      `${slug}.mdx`,
    )

    if (!fs.existsSync(filePath)) {
      return { ok: false, error: 'Challenge file not found.' }
    }

    const raw = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(raw)

    // Update or add the note field in frontmatter
    data.note = note.trim() || undefined

    const updated = matter.stringify(content, data)
    fs.writeFileSync(filePath, updated, 'utf8')

    return { ok: true }
  } catch (err) {
    console.error('saveNote error:', err)
    return { ok: false, error: 'Failed to save note.' }
  }
}
