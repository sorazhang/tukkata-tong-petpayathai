'use server'

import Anthropic from '@anthropic-ai/sdk'
import { getChallengesFromFirestore } from './content-firestore'
import { getMyEntries } from './my-journal-actions'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Match entry to existing challenges ───────────────────────────────────────

export interface ChallengeMatch {
  slug: string
  title: string
  reason: string
}

export async function matchEntryToChallenges(
  entryText: string,
): Promise<{ ok: boolean; matches?: ChallengeMatch[]; error?: string }> {
  try {
    const challenges = await getChallengesFromFirestore()
    const challengeList = challenges
      .slice(0, 60)
      .map((c) => `- slug: ${c.slug}\n  title: ${c.title}\n  situation: ${c.situation?.slice(0, 120) ?? ''}`)
      .join('\n')

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      thinking: { type: 'adaptive' },
      messages: [
        {
          role: 'user',
          content: `You help a Muay Thai student find existing platform challenges related to their training observation.

Training observation:
"""
${entryText}
"""

Available challenges:
${challengeList}

Return the top 2-3 most relevant challenges as JSON. Format:
[{"slug":"...","title":"...","reason":"one short sentence why it matches"}]

Only return valid JSON, no markdown, no explanation.`,
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return { ok: false, error: 'No response' }

    const raw = textBlock.text.trim()
    const jsonStr = raw.startsWith('[') ? raw : raw.slice(raw.indexOf('['))
    const matches: ChallengeMatch[] = JSON.parse(jsonStr)
    return { ok: true, matches }
  } catch (err) {
    console.error('matchEntryToChallenges error:', err)
    return { ok: false, error: 'Failed to match.' }
  }
}

// ─── Surface patterns from last N entries ─────────────────────────────────────

export interface PatternResult {
  themes: { label: string; description: string }[]
  suggestion: string
}

export async function surfacePatterns(): Promise<{ ok: boolean; result?: PatternResult; entryCount?: number; error?: string }> {
  try {
    const entries = await getMyEntries()
    const recent = entries.slice(0, 20)

    if (recent.length < 3) {
      return { ok: false, error: 'Add at least 3 entries to surface patterns.' }
    }

    const entryList = recent
      .map((e, i) => `Entry ${i + 1} [${e.tag}] ${new Date(e.createdAt).toLocaleDateString()}:\n${e.text}`)
      .join('\n\n')

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 768,
      thinking: { type: 'adaptive' },
      messages: [
        {
          role: 'user',
          content: `You are analyzing a Muay Thai student's training journal to find recurring patterns.

Recent journal entries (newest first):
${entryList}

Identify 2-4 recurring themes or patterns. Also give one short actionable suggestion.

Return JSON only:
{
  "themes": [
    {"label": "short label", "description": "1-2 sentences about this recurring theme"}
  ],
  "suggestion": "One concrete thing to focus on in next training session"
}`,
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return { ok: false, error: 'No response' }

    const raw = textBlock.text.trim()
    const jsonStr = raw.startsWith('{') ? raw : raw.slice(raw.indexOf('{'))
    const result: PatternResult = JSON.parse(jsonStr)
    return { ok: true, result, entryCount: recent.length }
  } catch (err) {
    console.error('surfacePatterns error:', err)
    return { ok: false, error: 'Failed to analyze patterns.' }
  }
}

// ─── Draft entry as a student challenge ───────────────────────────────────────

export interface ChallengeDraft {
  title: string
  situation: string
  yourTurn: string
}

export async function draftAsChallenge(
  entryText: string,
): Promise<{ ok: boolean; draft?: ChallengeDraft; error?: string }> {
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      thinking: { type: 'adaptive' },
      messages: [
        {
          role: 'user',
          content: `You help frame raw Muay Thai training observations as structured student challenges on a learning platform.

The platform style:
- Title: short, specific, second-person ("Your jab pulls short when you step in")
- Situation: 2-3 sentences describing what a student experiences in training — concrete, physical, non-judgmental
- Your Turn: 1-2 sentences telling the student what to try next practice — a specific drill or awareness task

Raw observation:
"""
${entryText}
"""

Return JSON only:
{"title":"...","situation":"...","yourTurn":"..."}`,
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') return { ok: false, error: 'No response' }

    const raw = textBlock.text.trim()
    const jsonStr = raw.startsWith('{') ? raw : raw.slice(raw.indexOf('{'))
    const draft: ChallengeDraft = JSON.parse(jsonStr)
    return { ok: true, draft }
  } catch (err) {
    console.error('draftAsChallenge error:', err)
    return { ok: false, error: 'Failed to draft challenge.' }
  }
}
