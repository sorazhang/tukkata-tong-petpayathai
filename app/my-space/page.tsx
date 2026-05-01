import { getMyEntries } from '@/lib/my-journal-actions'
import { getMyObservations } from '@/lib/my-observation-actions'
import { getMyAnalyses } from '@/lib/my-analysis-actions'
import MySpace from '@/components/MySpace'

export const dynamic = 'force-dynamic'

export default async function MySpacePage() {
  const [entries, observations, analyses] = await Promise.all([
    getMyEntries(),
    getMyObservations(),
    getMyAnalyses(),
  ])

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
          My Space
        </p>
        <h1 className="text-3xl font-bold text-brand-black">Training hub</h1>
        <p className="text-gray-400 text-sm mt-2">
          Journal entries, patterns, and observations — all in one place.
        </p>
      </div>

      <MySpace entries={entries} observations={observations} analyses={analyses} />
    </main>
  )
}
