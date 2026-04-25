import { getMyEntries } from '@/lib/my-journal-actions'
import MyJournalEntry from '@/components/MyJournalEntry'
import MyJournalList from '@/components/MyJournalList'

export const dynamic = 'force-dynamic'

export default async function MyJournalPage() {
  const entries = await getMyEntries()

  return (
    <main className="max-w-xl mx-auto px-6 py-12">

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
          My Training
        </p>
        <h1 className="text-3xl font-bold text-brand-black">Daily observations</h1>
        <p className="text-gray-400 text-sm mt-2">
          Raw notes from training. Tag what it belongs to. Patterns emerge over time.
        </p>
      </div>

      <div className="border border-gray-200 rounded-xl p-5 mb-10">
        <MyJournalEntry />
      </div>

      <MyJournalList entries={entries} />

    </main>
  )
}
