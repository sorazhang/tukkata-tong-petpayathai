import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getChallenge, getChallenges, splitChallenge } from '@/lib/content'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const challenges = await getChallenges()
  return challenges.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const challenge = await getChallenge(slug)
  if (!challenge) return {}
  return {
    title: challenge.title,
    description: challenge.situation,
  }
}

export default async function ChallengePage({ params }: Props) {
  const { slug } = await params
  const challenge = await getChallenge(slug)
  if (!challenge) notFound()

  const { free, solution } = splitChallenge(challenge.content)
  const isLocked = !challenge.isFree && solution !== null

  const formattedDate = new Date(challenge.publishedAt).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )

  return (
    <main>
      {/* Back */}
      <div className="border-b border-gray-100 bg-white px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/challenges"
            className="text-sm text-gray-400 hover:text-brand-red transition-colors"
          >
            ← All Challenges
          </Link>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-14">
        {/* Meta */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-brand-red uppercase tracking-widest">
              {challenge.category}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400 capitalize">
              {challenge.difficulty}
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black leading-tight">
            {challenge.title}
          </h1>
        </div>

        {/* Free content: Situation + Homework */}
        <div className="prose prose-lg max-w-none">
          <MDXRemote source={free} />
        </div>

        {/* Solution */}
        {solution && (
          <div className="mt-14">
            {isLocked ? (
              /* ── Gated state ── */
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                {/* Blurred preview */}
                <div className="blur-sm pointer-events-none select-none p-8 opacity-60">
                  <div className="prose prose-lg max-w-none">
                    <MDXRemote source={solution} />
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white via-white/90 to-transparent">
                  <div className="text-center px-8 py-10 max-w-sm">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-bold text-brand-black text-xl mb-2">
                      Did you try the homework?
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      The solution means more after you have spent time in
                      training trying to figure it out yourself.
                    </p>
                    <button className="w-full bg-brand-red text-white py-3 rounded font-medium hover:bg-brand-red-dark transition-colors">
                      Unlock the Solution
                    </button>
                    <p className="text-gray-400 text-xs mt-3">
                      Payments launching soon — free during beta.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* ── Unlocked state ── */
              <div className="border-t-2 border-brand-red pt-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-0.5 flex-1 bg-brand-red/20" />
                  <span className="text-brand-red text-xs font-medium uppercase tracking-widest px-2">
                    Solution
                  </span>
                  <div className="h-0.5 flex-1 bg-brand-red/20" />
                </div>
                <div className="prose prose-lg max-w-none">
                  <MDXRemote source={solution} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
          <Link
            href="/challenges"
            className="text-sm text-gray-400 hover:text-brand-red transition-colors"
          >
            ← All Challenges
          </Link>
          <Link
            href="/book"
            className="text-sm text-brand-red font-medium hover:underline"
          >
            Work 1-on-1 with Tukkatatong →
          </Link>
        </div>
      </article>
    </main>
  )
}
