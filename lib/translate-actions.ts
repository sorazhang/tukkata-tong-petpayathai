'use server'

import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function translateToThai(text: string): Promise<{ ok: true; translation: string } | { ok: false; error: string }> {
  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Translate the following text to Thai. Return only the Thai translation, nothing else.\n\n${text}`,
        },
      ],
    })

    const translation = message.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()

    return { ok: true, translation }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}
