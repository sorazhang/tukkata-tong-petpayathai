import type { Metadata } from 'next'
import { getChallenges } from '@/lib/content'
import ChallengeCard from '@/components/ChallengeCard'

export const metadata: Metadata = {
  title: 'Challenges',
  description:
    'Real problems from the ring. Try Your Turn first. Unlock the solution when you are ready.',
}

export default async function ChallengesPage() {
  const challenges = await getChallenges()

  const categories = [
    'All',
    ...Array.from(new Set(challenges.map((c) => c.category))),
  ]

  return (
    <main>
      {/* Header */}
      <section className="bg-brand-black text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Challenges</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
            Real problems from the ring. Read the situation, take Your Turn in
            training, come back for the solution when you are ready.
          </p>
        </div>
      </section>

      {/* Category pills — informational for v1, interactive in v2 */}
      <div className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="max-w-5xl mx-auto flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`text-sm px-4 py-1.5 rounded-full border ${
                cat === 'All'
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {challenges.length === 0 ? (
            <p className="text-gray-400 text-center py-20">
              Challenges coming soon.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {challenges.map((c) => (
                <ChallengeCard key={c.slug} challenge={c} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
