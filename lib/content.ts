import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

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
}

export interface CultureStory {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  content: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SOLUTION_MARKER = '## Solution'

export function splitChallenge(content: string): {
  free: string
  solution: string | null
} {
  const idx = content.indexOf(SOLUTION_MARKER)
  if (idx === -1) return { free: content, solution: null }
  return {
    free: content.slice(0, idx).trim(),
    solution: content.slice(idx).trim(),
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
