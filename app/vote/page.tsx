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
        <h1 className="text-3xl font-bold text-brand-bone">Polls</h1>
        <p className="text-brand-muted text-sm mt-2">
          Send Kru a link — he picks an option and saves.
        </p>
      </div>

      {/* Poll list */}
      {polls.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">
            All polls ({polls.length})
          </h2>
          <div className="space-y-2">
            {polls.map((poll) => (
              <Link
                key={poll.slug}
                href={`/vote/${poll.slug}`}
                className="flex items-center justify-between gap-4 border border-brand-card-edge rounded-xl p-4 hover:border-brand-muted hover:bg-brand-card transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-bone truncate">{poll.question}</p>
                  <p className="text-xs text-brand-muted mt-0.5">
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
