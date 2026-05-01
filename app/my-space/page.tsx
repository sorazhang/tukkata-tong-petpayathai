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
<MySpace entries={entries} observations={observations} analyses={analyses} />
    </main>
  )
}
