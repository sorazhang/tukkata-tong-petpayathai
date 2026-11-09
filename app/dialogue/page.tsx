import Link from 'next/link'
import { createDialogue, getDialogues } from '@/lib/dialogue-actions'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Dialogue with Kru' }

export default async function DialogueIndexPage() {
  const sessions = await getDialogues()

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">Dialogue</p>
      <h1 className="text-3xl font-bold text-brand-black">Conversations with Kru</h1>
      <p className="text-gray-500 text-sm mt-2">
        Ask in English, Kru answers in Thai. Every turn is captured as text — with an English
        translation of Kru&apos;s answers — so it can be mined for key ideas later.
      </p>

      <Link
        href="/dialogue/sparks"
        className="inline-block mt-6 text-sm font-semibold text-brand-gold-dim hover:text-brand-black"
      >
        ⚡ All sparks →
      </Link>

      <form action={createDialogue} className="mt-6 flex gap-2">
        <input
          name="title"
          placeholder="Topic (optional), e.g. Clinch entries"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red"
        />
        <button
          type="submit"
          className="bg-brand-red text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors"
        >
          Start conversation
        </button>
      </form>

      <ul className="mt-10 divide-y divide-gray-100 list-none p-0">
        {sessions.length === 0 && (
          <li className="py-16 text-center text-sm text-gray-400">No conversations yet.</li>
        )}
        {sessions.map((s) => (
          <li key={s.id}>
            <Link
              href={`/dialogue/${s.id}`}
              className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors"
            >
              <div>
                <p className="font-semibold text-brand-black">{s.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}
                </p>
              </div>
              <span className="text-xs text-gray-400 text-right">
                {s.turnCount} turns
                {s.sparkCount > 0 && <span className="block text-brand-gold font-semibold">⚡ {s.sparkCount}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
