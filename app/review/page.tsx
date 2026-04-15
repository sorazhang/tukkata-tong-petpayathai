import { getChallenges, splitChallenge } from '@/lib/content'
import ChallengeAccordionItem from '@/components/ChallengeAccordionItem'

export const metadata = { title: 'Content Review — Kru' }

const CATEGORY_ORDER = ['Striking', 'Defense', 'Footwork', 'Clinch', 'Ring IQ']
const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'] as const
const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}
const CATEGORY_COLORS: Record<string, string> = {
  Striking: '#dc2626',
  Defense: '#15803d',
  Footwork: '#c2410c',
  Clinch: '#1d4ed8',
  'Ring IQ': '#7e22ce',
}

export default async function ReviewPage() {
  const challenges = await getChallenges()

  const withContent = challenges.map((c) => ({
    ...c,
    sections: splitChallenge(c.content),
  }))

  const done         = withContent.filter((c) => c.status === 'complete').length
  const pending      = withContent.filter((c) => c.status === 'pending_review').length
  const placeholders = withContent.filter((c) => c.status === 'needs_answer').length

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    byDifficulty: DIFFICULTY_ORDER.map((diff) => ({
      difficulty: diff,
      items: withContent.filter(
        (c) => c.category === cat && c.difficulty === diff,
      ),
    })).filter((g) => g.items.length > 0),
  })).filter((g) => g.byDifficulty.some((d) => d.items.length > 0))

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
          Internal Review
        </p>
        <h1 className="text-3xl font-bold text-brand-black mb-4">
          All Challenges — Kru Review
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl">
          Click any challenge to expand it. Type, record, or paste a video link — hit Save and it writes immediately.
          Orange badges show which ones still need your answer.
        </p>

        {/* Summary */}
        <div className="flex gap-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <p className="text-2xl font-bold text-brand-black">{challenges.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{done}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Complete</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">{pending}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Pending review</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-500">{placeholders}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Need answer</p>
          </div>
        </div>
      </div>

      {/* Challenges by category */}
      <div className="space-y-14">
        {grouped.map(({ category, byDifficulty }) => (
          <section key={category}>
            <h2
              className="text-sm font-bold uppercase tracking-widest mb-6 pb-3 border-b-2"
              style={{
                color: CATEGORY_COLORS[category] ?? '#6b7280',
                borderColor: CATEGORY_COLORS[category] ?? '#e5e7eb',
              }}
            >
              {category}
            </h2>

            <div className="space-y-8">
              {byDifficulty.map(({ difficulty, items }) => (
                <div key={difficulty}>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
                    {DIFFICULTY_LABELS[difficulty]}
                  </p>
                  <div className="space-y-3">
                    {items.map((c) => {
                      return (
                        <ChallengeAccordionItem
                          key={c.slug}
                          slug={c.slug}
                          title={c.title}
                          situation={c.situation}
                          initialStatus={c.status}
                          initialSituation={c.sections.situation ?? ''}
                          initialYourTurn={c.sections.yourTurn ?? ''}
                          initialSolution={c.sections.solution ?? ''}
                          initialNote={c.note ?? ''}
                          initialVoiceNote={c.voiceNote ?? ''}
                          initialReferenceVideo={c.referenceVideo ?? ''}
                          initialReferenceVideoNote={c.referenceVideoNote ?? ''}
                          initialIllustration={c.illustration ?? ''}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
