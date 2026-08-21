import { getJournalEntries } from '@/lib/journal-actions'
import JournalEntry from '@/components/JournalEntry'
import JournalList from '@/components/JournalList'

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

      <div className="border border-gray-200 rounded-xl p-5 mb-10">
        <JournalEntry />
      </div>

      <JournalList entries={entries} />

    </main>
  )
}
