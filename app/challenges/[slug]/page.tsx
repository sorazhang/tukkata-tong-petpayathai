import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getChallenge, getChallenges, getTracks, splitChallenge } from '@/lib/content'

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

  const allChallenges = await getChallenges()
  const allTracks = getTracks(allChallenges)

  // For each track this challenge belongs to, find the next challenge in that track
  const nextPerTrack = challenge.tracks.flatMap((membership) => {
    const track = allTracks.find((t) => t.name === membership.name)
    if (!track) return []
    const idx = track.challenges.findIndex((c) => c.slug === slug)
    if (idx < 0 || idx >= track.challenges.length - 1) return []
    return [{ trackName: membership.name, challenge: track.challenges[idx + 1] }]
  })

  const { situation, yourTurn, solution } = splitChallenge(challenge.content)
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

      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Title */}
        <div className="mb-10">
          {challenge.tracks.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
              {challenge.tracks.map((membership) => {
                const track = allTracks.find((t) => t.name === membership.name)
                return (
                  <span key={membership.name} className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-brand-red uppercase tracking-widest">
                      {membership.name}
                    </span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-xs text-gray-400">
                      {membership.order} of {track?.challenges.length ?? '?'}
                    </span>
                  </span>
                )
              })}
            </div>
          )}
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

        {/* ── 01 · The Situation ── */}
        <div className="bg-brand-black rounded-xl p-8 mb-6">
          <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-5">
            01 · The Situation
          </p>
          <div className="prose prose-lg prose-invert max-w-none
            prose-p:text-gray-200 prose-p:leading-relaxed
            prose-strong:text-white prose-em:text-gray-300
            prose-hr:border-gray-700">
            <MDXRemote source={situation} />
          </div>
        </div>

        {/* ── 02 · Your Turn ── */}
        {yourTurn && (
          <div className="border-l-4 border-brand-red bg-gray-50 rounded-r-xl p-8 mb-6">
            <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-5">
              02 · Your Turn
            </p>
            <div className="prose prose-lg max-w-none
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-strong:text-brand-black prose-em:text-gray-500
              prose-ol:text-gray-700 prose-ul:text-gray-700
              prose-hr:border-gray-200">
              <MDXRemote source={yourTurn} />
            </div>
          </div>
        )}

        {/* ── 03 · Solution ── */}
        {solution && (
          <div className="mt-2">
            {isLocked ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                {/* Blurred preview */}
                <div className="blur-sm pointer-events-none select-none p-8 opacity-50">
                  <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-5">
                    03 · Solution
                  </p>
                  <div className="prose prose-lg max-w-none">
                    <MDXRemote source={solution} />
                  </div>
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white via-white/95 to-transparent">
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
                      Did you try Your Turn?
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      The solution lands differently after you have felt the
                      problem in your own body.
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
              <div className="border border-gray-200 rounded-xl p-8">
                <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-5">
                  03 · Solution
                </p>
                <div className="prose prose-lg max-w-none">
                  <MDXRemote source={solution} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          {nextPerTrack.length > 0 && (
            <div className="space-y-3 mb-8">
              {nextPerTrack.map(({ trackName, challenge: next }) => (
                <Link
                  key={`${trackName}-${next.slug}`}
                  href={`/challenges/${next.slug}`}
                  className="block group"
                >
                  <div className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
                      Next in {trackName}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-brand-black group-hover:text-brand-red transition-colors">
                        {next.title}
                      </h3>
                      <span className="text-brand-red shrink-0">→</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {next.situation}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center">
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
        </div>
      </div>
    </main>
  )
}
