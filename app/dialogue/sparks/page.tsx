import Link from 'next/link'
import { getAllSparks, type DialogueTurn } from '@/lib/dialogue-actions'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Sparks' }

function Line({ t, muted }: { t: DialogueTurn; muted?: boolean }) {
  const isKru = t.speaker === 'kru'
  return (
    <div className={muted ? 'text-gray-400' : 'text-brand-black'}>
      <span className="text-[11px] font-bold uppercase tracking-wider mr-2">{isKru ? 'Kru' : 'Me'}</span>
      {t.text ? (
        <>
          <span className={isKru ? 'font-thai' : ''} lang={isKru ? 'th' : 'en'}>{t.text}</span>
          {isKru && t.translation && <span className="block italic text-sm mt-0.5 text-gray-500">{t.translation}</span>}
        </>
      ) : (
        <span className="italic text-gray-400">moment marked, no note</span>
      )}
    </div>
  )
}

export default async function SparksPage() {
  const sparks = await getAllSparks()

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/dialogue" className="text-xs text-gray-400 hover:text-brand-black">← All conversations</Link>
      <p className="text-xs font-bold uppercase tracking-widest text-brand-gold-dim mt-6 mb-1">⚡ Sparks</p>
      <h1 className="text-3xl font-bold text-brand-black">Moments that clicked</h1>
      <p className="text-gray-500 text-sm mt-2">
        Every spark from every session, with the lines just before it for context.
      </p>

      <ul className="mt-10 space-y-6 list-none p-0">
        {sparks.length === 0 && (
          <li className="py-16 text-center text-sm text-gray-400">
            No sparks yet. Hit ⚡ Spark during a session when something clicks.
          </li>
        )}
        {sparks.map(({ dialogueId, dialogueTitle, turn, context }) => (
          <li key={`${dialogueId}-${turn.id}`} className="border-l-4 border-brand-gold pl-4 space-y-2 text-sm leading-relaxed">
            <Link href={`/dialogue/${dialogueId}`} className="block text-xs text-gray-400 hover:text-brand-black">
              {dialogueTitle} · {new Date(turn.at).toLocaleString()}
            </Link>
            {context.map((c) => <Line key={c.id} t={c} muted />)}
            <Line t={turn} />
          </li>
        ))}
      </ul>
    </main>
  )
}
