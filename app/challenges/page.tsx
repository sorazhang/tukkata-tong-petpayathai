import type { Metadata } from 'next'
import Link from 'next/link'
import { getChallenges, getTracks } from '@/lib/content'
import ChallengesGrouped from '@/components/ChallengesGrouped'
import SurveyWidget from '@/components/SurveyWidget'

export const metadata: Metadata = {
  title: 'Challenges',
  description:
    'Real problems from the ring. Try Your Turn first. Unlock the solution when you are ready.',
}

export default async function ChallengesPage() {
  const challenges = await getChallenges()
  const tracks = getTracks(challenges)
  const freeCount = challenges.filter((c) => c.isFree).length
  const startHere = challenges.find((c) => c.isFree && c.difficulty === 'beginner')

  const challengeItems = challenges.map(
    ({ slug, title, situation, category, difficulty, isFree }) => ({
      slug, title, situation, category, difficulty, isFree,
    })
  )

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-brand-black text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Challenges</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-10">
            Real problems from the ring. Find the one that matches where you are.
            Read it, go try it, come back for the answer.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-white font-bold text-2xl">{freeCount}</span>
              <span className="text-gray-400 ml-2">free to start</span>
            </div>
            <div className="w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-white font-bold text-2xl">{challenges.length}</span>
              <span className="text-gray-400 ml-2">total challenges</span>
            </div>
            <div className="w-px bg-gray-700 hidden sm:block" />
            <div>
              <span className="text-white font-bold text-2xl">5</span>
              <span className="text-gray-400 ml-2">disciplines</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Start Here ── */}
      {startHere && (
        <section className="border-b border-gray-100 px-6 py-5 bg-red-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 flex-wrap">
            <span className="text-xs font-semibold text-brand-red uppercase tracking-widest">
              New here?
            </span>
            <Link
              href={`/challenges/${startHere.slug}`}
              className="text-sm font-medium text-brand-black hover:text-brand-red transition-colors"
            >
              Start with: {startHere.title} →
            </Link>
            <span className="text-xs text-gray-400">Free · Beginner</span>
          </div>
        </section>
      )}

      {/* ── Survey ── */}
      <section className="py-14 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 text-center">
            Not sure where to start?
          </p>
          <h2 className="text-xl font-bold text-brand-black mb-6 text-center">
            Three questions. One clear starting point.
          </h2>
          <SurveyWidget challenges={challengeItems.map(({ slug, title }) => ({ slug, title }))} />
        </div>
      </section>

      {/* ── Find Your Problem ── */}
      <section className="py-16 px-6 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-2">
            Find Your Problem
          </p>
          <h2 className="text-2xl font-bold text-brand-black mb-2">
            Pick the discipline. Pick your level.
          </h2>
          <p className="text-gray-500 text-sm mb-10">
            Each discipline opens into Beginner, Intermediate, and Advanced.
            Find the title that sounds like what you are dealing with.
          </p>
          <ChallengesGrouped challenges={challengeItems} />
        </div>
      </section>

      {/* ── Learning Series ── */}
      {tracks.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-2">
              Learning Series
            </p>
            <h2 className="text-2xl font-bold text-brand-black mb-2">
              Structured Paths
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Challenges designed to be done in order. Each one builds on the last.
            </p>
            <div className="space-y-4">
              {tracks.map((track) => (
                <Link
                  key={track.name}
                  href={`/challenges/${track.challenges[0].slug}`}
                  className="block group"
                >
                  <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-brand-black group-hover:text-brand-red transition-colors mb-1">
                          {track.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {track.challenges.length} challenges · Start with:{' '}
                          <span className="text-gray-700">{track.challenges[0].title}</span>
                        </p>
                      </div>
                      <span className="text-brand-red text-xl shrink-0 ml-6">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
