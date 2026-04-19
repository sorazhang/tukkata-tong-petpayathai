import { getPolls } from '@/lib/polls'
import PollCreate from '@/components/PollCreate'
import PollCreateToggle from '@/components/PollCreateToggle'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function VotePage() {
  const polls = await getPolls()

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
          Internal
        </p>
        <h1 className="text-3xl font-bold text-brand-black">Polls</h1>
        <p className="text-gray-400 text-sm mt-2">
          Send Kru a link — he picks an option and saves.
        </p>
      </div>

      {/* Poll list */}
      {polls.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            All polls ({polls.length})
          </h2>
          <div className="space-y-2">
            {polls.map((poll) => (
              <Link
                key={poll.slug}
                href={`/vote/${poll.slug}`}
                className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-black truncate">{poll.question}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {poll.answer ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded shrink-0">
                    Answered
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                    Waiting
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* New poll — collapsed by default */}
      <PollCreateToggle>
        <PollCreate />
      </PollCreateToggle>
    </main>
  )
}
