import { getChallenge, splitChallenge } from '@/lib/content'
import ChallengeEditor from '@/components/ChallengeEditor'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ReviewChallengePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const challenge = await getChallenge(slug)
  if (!challenge) notFound()

  const sections = splitChallenge(challenge.content)

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">

      {/* Back link */}
      <Link
        href="/review"
        className="text-xs text-gray-400 hover:text-brand-red uppercase tracking-widest font-bold mb-8 inline-block transition-colors"
      >
        ← All challenges
      </Link>

      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            {challenge.category}
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-xs text-gray-400 capitalize">{challenge.difficulty}</span>
        </div>
        <h1 className="text-2xl font-bold text-brand-black leading-snug">
          {challenge.title}
        </h1>
      </div>

      {/* Status badge */}
      <div className="mb-8">
        {challenge.status === 'complete' && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
            Complete
          </span>
        )}
        {challenge.status === 'pending_review' && (
          <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
            Pending review
          </span>
        )}
        {challenge.status === 'needs_answer' && (
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
            Needs answer
          </span>
        )}
      </div>

      {/* Editor */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <ChallengeEditor
          slug={challenge.slug}
          initialSituation={sections.situation || challenge.situation}
          initialYourTurn={sections.yourTurn ?? ''}
          initialSolution={sections.solution ?? ''}
          initialNote={challenge.note ?? ''}
          initialVoiceNote={challenge.voiceNote ?? ''}
          initialReferenceVideo={challenge.referenceVideo ?? ''}
          initialReferenceVideoNote={challenge.referenceVideoNote ?? ''}
          initialIllustration={challenge.illustration ?? ''}
          initialStatus={challenge.status}
        />
      </div>

    </main>
  )
}
