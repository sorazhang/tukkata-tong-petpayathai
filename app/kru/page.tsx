import Link from 'next/link'
import { getConfusions } from '@/lib/confusion-actions'
import { getChallengesFromFirestore } from '@/lib/content-firestore'
import { getPolls } from '@/lib/polls'

export const dynamic = 'force-dynamic'

export default async function KruPage() {
  const [confusions, challenges, polls] = await Promise.all([
    getConfusions(),
    getChallengesFromFirestore(),
    getPolls(),
  ])

  const openQuestions  = confusions.filter((c) => c.status === 'open')
  const needsAnswer    = challenges.filter((c) => c.status === 'needs_answer')
  const pendingPolls   = polls.filter((p) => !p.answer)

  const totalPending = openQuestions.length + needsAnswer.length + pendingPolls.length

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
          Kru
        </p>
        <h1 className="text-3xl font-bold text-brand-black">
          {totalPending > 0 ? `${totalPending} items waiting` : 'All caught up'}
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          {totalPending > 0
            ? 'These need your input before students can move forward.'
            : 'Nothing pending right now. Check back after the next session.'}
        </p>
      </div>

      <div className="space-y-6">

        {/* Student Questions */}
        <section className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-brand-black">Student Questions</h2>
              {openQuestions.length > 0 && (
                <span className="text-xs font-semibold bg-brand-red text-white px-2 py-0.5 rounded-full">
                  {openQuestions.length}
                </span>
              )}
            </div>
            <Link
              href="/confusions"
              className="text-xs text-brand-red font-semibold hover:underline"
            >
              See all →
            </Link>
          </div>

          {openQuestions.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">No open questions.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {openQuestions.slice(0, 4).map((q) => (
                <li key={q.id} className="px-5 py-3">
                  <p className="text-sm text-brand-black leading-relaxed line-clamp-2">{q.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span className="text-gray-200 text-xs">·</span>
                    <span className="text-xs text-gray-400 capitalize">{q.tag}</span>
                  </div>
                </li>
              ))}
              {openQuestions.length > 4 && (
                <li className="px-5 py-3">
                  <Link href="/confusions" className="text-xs text-gray-400 hover:text-brand-red">
                    +{openQuestions.length - 4} more →
                  </Link>
                </li>
              )}
            </ul>
          )}
        </section>

        {/* Challenges needing answers */}
        <section className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-brand-black">Challenges Without an Answer</h2>
              {needsAnswer.length > 0 && (
                <span className="text-xs font-semibold bg-brand-red text-white px-2 py-0.5 rounded-full">
                  {needsAnswer.length}
                </span>
              )}
            </div>
            <Link
              href="/review"
              className="text-xs text-brand-red font-semibold hover:underline"
            >
              Review →
            </Link>
          </div>

          {needsAnswer.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">All challenges have an answer.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {needsAnswer.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/review/${c.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-brand-black">{c.title}</p>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">{c.category} · {c.difficulty}</p>
                    </div>
                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                      Needs answer
                    </span>
                  </Link>
                </li>
              ))}
              {needsAnswer.length > 4 && (
                <li className="px-5 py-3">
                  <Link href="/review" className="text-xs text-gray-400 hover:text-brand-red">
                    +{needsAnswer.length - 4} more →
                  </Link>
                </li>
              )}
            </ul>
          )}
        </section>

        {/* Polls */}
        <section className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-brand-black">Votes</h2>
              {pendingPolls.length > 0 && (
                <span className="text-xs font-semibold bg-brand-red text-white px-2 py-0.5 rounded-full">
                  {pendingPolls.length}
                </span>
              )}
            </div>
            <Link
              href="/vote"
              className="text-xs text-brand-red font-semibold hover:underline"
            >
              See all →
            </Link>
          </div>

          {pendingPolls.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">No votes waiting.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pendingPolls.slice(0, 3).map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/vote/${p.slug}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm text-brand-black">{p.question}</p>
                    <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                      Waiting
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

      </div>
    </main>
  )
}
