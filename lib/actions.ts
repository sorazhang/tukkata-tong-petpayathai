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
