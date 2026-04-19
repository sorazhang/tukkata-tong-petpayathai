import { getJournalEntries } from '@/lib/journal-actions'
import JournalEntry from '@/components/JournalEntry'

export const dynamic = 'force-dynamic'

export default async function JournalPage() {
  const entries = await getJournalEntries()

  return (
    <main className="max-w-xl mx-auto px-6 py-12">

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
          Kru&apos;s Journal
        </p>
        <h1 className="text-3xl font-bold text-brand-black">What I observed today</h1>
        <p className="text-gray-400 text-sm mt-2">
          Speak or type — no structure needed. Save the thought.
        </p>
      </div>

      {/* Entry form */}
      <div className="border border-gray-200 rounded-xl p-5 mb-10">
        <JournalEntry />
      </div>

      {/* Past entries */}
      {entries.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Previous entries
          </h2>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(entry.createdAt).toLocaleDateString('th-TH', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-sm text-brand-black leading-relaxed whitespace-pre-wrap">
                  {entry.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </main>
  )
}
