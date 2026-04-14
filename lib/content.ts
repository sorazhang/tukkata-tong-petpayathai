import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface TrackMembership {
  name: string
  order: number
}

export interface Challenge {
  slug: string
  title: string
  category: string
  difficulty: Difficulty
  /** One-sentence summary shown on cards */
  situation: string
  publishedAt: string
  /** true = full content visible; false = solution section is gated */
  isFree: boolean
  /** Raw MDX string — split on "## Solution" for gating */
  content: string
  /** All tracks this challenge belongs to, each with its own position */
  tracks: TrackMembership[]
}

export interface Track {
  name: string
  challenges: Challenge[]
}

/** Group challenges into tracks. A challenge may appear in multiple tracks. Pure — no I/O. */
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

export interface CultureStory {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  content: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SITUATION_MARKER = '## The Situation'
const YOUR_TURN_MARKER = '## Your Turn'
const SOLUTION_MARKER = '## Solution'

/** Extract body text after a section heading, up to the next heading. */
function extractSection(
  content: string,
  marker: string,
  until?: string,
): string | null {
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

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
}

// ─── Challenges ───────────────────────────────────────────────────────────────

const challengesDir = path.join(process.cwd(), 'content/challenges')

export async function getChallenges(): Promise<Challenge[]> {
  const files = readDir(challengesDir)

  const challenges = files.map((file) => {
    const slug = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(challengesDir, file), 'utf8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title as string,
      category: data.category as string,
      difficulty: (data.difficulty ?? 'intermediate') as Difficulty,
      situation: data.situation as string,
      publishedAt: data.publishedAt as string,
      isFree: (data.isFree as boolean) ?? false,
      content,
      tracks: (data.tracks ?? []) as TrackMembership[],
    } satisfies Challenge
  })

  return challenges.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function getChallenge(slug: string): Promise<Challenge | null> {
  const filePath = path.join(challengesDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    category: data.category as string,
    difficulty: (data.difficulty ?? 'intermediate') as Difficulty,
    situation: data.situation as string,
    publishedAt: data.publishedAt as string,
    isFree: (data.isFree as boolean) ?? false,
    content,
    tracks: (data.tracks ?? []) as TrackMembership[],
  }
}

// ─── Culture Stories ──────────────────────────────────────────────────────────

const cultureDir = path.join(process.cwd(), 'content/culture')

export async function getCultureStories(): Promise<CultureStory[]> {
  const files = readDir(cultureDir)

  const stories = files.map((file) => {
    const slug = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(cultureDir, file), 'utf8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      publishedAt: data.publishedAt as string,
      content,
    } satisfies CultureStory
  })

  return stories.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}

export async function getCultureStory(
  slug: string,
): Promise<CultureStory | null> {
  const filePath = path.join(cultureDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    publishedAt: data.publishedAt as string,
    content,
  }
}
