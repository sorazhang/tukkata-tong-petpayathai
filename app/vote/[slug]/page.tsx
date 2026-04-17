import { getPoll } from '@/lib/polls'
import PollVote from '@/components/PollVote'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PollPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const poll = await getPoll(slug)
  if (!poll) notFound()

  return (
    <main className="max-w-lg mx-auto px-6 py-12">
      <Link
        href="/vote"
        className="text-xs text-gray-400 hover:text-brand-red uppercase tracking-widest font-bold mb-8 inline-block transition-colors"
      >
        ← All polls
      </Link>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
          Kru&apos;s choice
        </p>
        <h1 className="text-2xl font-bold text-brand-black leading-snug">
          {poll.question}
        </h1>
        {poll.description && (
          <p className="text-gray-500 text-sm mt-2">{poll.description}</p>
        )}
      </div>

      <PollVote poll={poll} />
    </main>
  )
}
