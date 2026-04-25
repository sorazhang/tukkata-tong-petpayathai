'use server'

import Anthropic from '@anthropic-ai/sdk'
import { getChallengesFromFirestore } from './content-firestore'
import { getMyEntries } from './my-journal-actions'
import { getMyAnalyses } from './my-analysis-actions'

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
      model: 'claude-opus-4-5',
      max_tokens: 16000,
      thinking: { type: 'enabled', budget_tokens: 10000 },
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
  progress?: string
}

export async function surfacePatterns(): Promise<{ ok: boolean; result?: PatternResult; entryCount?: number; error?: string }> {
  try {
    const [entries, pastAnalyses] = await Promise.all([
      getMyEntries(),
      getMyAnalyses(),
    ])
    const recent = entries.slice(0, 20)

    if (recent.length < 3) {
      return { ok: false, error: 'Add at least 3 entries to surface patterns.' }
    }

    const entryList = recent
      .map((e, i) => `Entry ${i + 1} [${e.tag}] ${new Date(e.createdAt).toLocaleDateString()}:\n${e.text}`)
      .join('\n\n')

    const hasPastAnalyses = pastAnalyses.length > 0
    const pastAnalysisBlock = hasPastAnalyses
      ? pastAnalyses
          .slice(0, 5)
          .reverse()
          .map((a) => {
            const date = new Date(a.createdAt).toLocaleDateString()
            const themes = a.themes.map((t) => `  - ${t.label}: ${t.description}`).join('\n')
            return `[${date}]\nThemes:\n${themes}\nFocus: ${a.suggestion}`
          })
          .join('\n\n')
      : null

    const progressInstruction = hasPastAnalyses
      ? `
Previous AI analyses (oldest to newest — use these to assess progress):
${pastAnalysisBlock}

After identifying current themes, write a "progress" note (2-4 sentences) that:
- Honestly compares current journal entries to what was flagged in past analyses
- Notes what seems to be improving, persisting, or newly emerging
- If there is no visible progress on a past focus area, say so plainly and suggest one concrete reason why (e.g. not enough reps, avoiding the drill, focus drifted) and what might help
- Keep it direct, like a coach talking to a student they care about`
      : ''

    const progressField = hasPastAnalyses ? `\n  "progress": "2-4 sentence progress note comparing to past analyses"` : ''

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 16000,
      thinking: { type: 'enabled', budget_tokens: 10000 },
      messages: [
        {
          role: 'user',
          content: `You are analyzing a Muay Thai student's training journal to find recurring patterns and assess their progress over time.

Recent journal entries (newest first):
${entryList}
${progressInstruction}

Identify 2-4 recurring themes from the recent entries. Give one short actionable next-session focus.

Return JSON only:
{
  "themes": [
    {"label": "short label", "description": "1-2 sentences about this recurring theme"}
  ],
  "suggestion": "One concrete thing to focus on in next training session"${progressField}
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
      model: 'claude-opus-4-5',
      max_tokens: 1024,
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
