import type { Metadata } from 'next'
import Link from 'next/link'
import { getChallenges, getTracks } from '@/lib/content'
import ChallengesFilter from '@/components/ChallengesFilter'

export const metadata: Metadata = {
  title: 'Challenges',
  description:
    'Real problems from the ring. Try Your Turn first. Unlock the solution when you are ready.',
}

export default async function ChallengesPage() {
  const challenges = await getChallenges()
  const tracks = getTracks(challenges)
  const freeCount = challenges.filter((c) => c.isFree).length

  // Strip content field — client component only needs display data
  const challengeItems = challenges.map(
    ({ slug, title, category, difficulty, situation, isFree }) => ({
      slug,
      title,
      category,
      difficulty,
      situation,
      isFree,
    })
  )

  // Featured entry point: first free beginner challenge
  const startHere =
    challenges.find((c) => c.isFree && c.difficulty === 'beginner') ?? challenges[0]

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-brand-black text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Challenges</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-10">
            Real problems from the ring. Read the situation, go try it yourself,
            come back for the solution when you have felt it.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <span className="text-white font-bold text-3xl">{freeCount}</span>
              <span className="text-gray-400 text-sm ml-2">free to start</span>
            </div>
            <div className="w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-white font-bold text-3xl">{challenges.length}</span>
              <span className="text-gray-400 text-sm ml-2">total challenges</span>
            </div>
            <div className="w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-white font-bold text-3xl">4</span>
              <span className="text-gray-400 text-sm ml-2">disciplines</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Start Here ── */}
      {startHere && (
        <section className="py-16 px-6 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-3">
              Start Here
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-black mb-4 leading-snug">
              {startHere.title}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-2 max-w-2xl">
              {startHere.situation}
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Read it. Go to training. Try it yourself. Then come back for the answer.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href={`/challenges/${startHere.slug}`}
                className="inline-block bg-brand-red text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-red-dark transition-colors"
              >
                Take the challenge →
              </Link>
              <span className="text-sm text-gray-400">Free · Beginner</span>
            </div>
          </div>
        </section>
      )}

      {/* ── Learning Paths (Tracks) ── */}
      {tracks.map((track) => (
        <section
          key={track.name}
          className="py-16 px-6 bg-gray-50 border-b border-gray-100"
        >
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-2">
              Learning Path
            </p>
            <h2 className="text-2xl font-bold text-brand-black mb-1">{track.name}</h2>
            <p className="text-gray-500 text-sm mb-10">
              {track.challenges.length} challenges in sequence — each one builds on the one before.
            </p>

            <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-0">
              {track.challenges.map((c, i) => (
                <div key={c.slug} className="flex items-center flex-1 min-w-0">
                  <Link
                    href={`/challenges/${c.slug}`}
                    className="flex-1 min-w-0 block group h-full"
                  >
                    <article
                      className={`rounded-lg p-6 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                        i === 0
                          ? 'border-2 border-brand-red bg-white'
                          : 'border border-gray-200 bg-white'
                      }`}
                    >
                      <div className="text-3xl font-bold text-gray-100 mb-3 leading-none">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {i === 0 && (
                        <span className="inline-block text-xs font-semibold text-brand-red bg-red-50 px-2 py-0.5 rounded mb-3">
                          Start here
                        </span>
                      )}
                      <h3 className="font-semibold text-brand-black text-base leading-snug mb-3 group-hover:text-brand-red transition-colors">
                        {c.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="capitalize text-gray-400">{c.difficulty}</span>
                        {c.isFree ? (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-green-600 font-medium">Free</span>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-300">·</span>
                            <span className="text-gray-400">Solution locked</span>
                          </>
                        )}
                      </div>
                    </article>
                  </Link>

                  {i < track.challenges.length - 1 && (
                    <div className="hidden md:block w-10 text-center text-gray-300 text-xl shrink-0 select-none">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── Explore All ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-2">
            Explore
          </p>
          <h2 className="text-2xl font-bold text-brand-black mb-2">All Challenges</h2>
          <p className="text-gray-500 text-sm mb-10">
            Filter by what you are working on. Each discipline runs beginner through
            to advanced — work your level, then push to the next.
          </p>
          <ChallengesFilter challenges={challengeItems} />
        </div>
      </section>
    </main>
  )
}
