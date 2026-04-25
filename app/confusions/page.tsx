import { getConfusions } from '@/lib/confusion-actions'
import ConfusionAdmin from '@/components/ConfusionAdmin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ConfusionsPage() {
  const confusions = await getConfusions()

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">Admin</p>
          <h1 className="text-3xl font-bold text-brand-black">Student confusions</h1>
          <p className="text-gray-400 text-sm mt-1">What students are stuck on. Most common = answer first.</p>
        </div>
        <Link
          href="/ask"
          target="_blank"
          className="text-xs text-gray-400 hover:text-brand-red border border-gray-200 px-3 py-2 rounded-lg transition-colors shrink-0"
        >
          View student page ↗
        </Link>
      </div>

      <ConfusionAdmin confusions={confusions} />
    </main>
  )
}
