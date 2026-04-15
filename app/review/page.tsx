import { getChallenges, splitChallenge } from '@/lib/content'

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

// ChallengeEditor uses server actions — only load in dev (not static export)
const isStaticExport = process.env.STATIC_EXPORT === 'true'

export default async function ReviewPage() {
  const challenges = await getChallenges()

  const withContent = challenges.map((c) => ({
    ...c,
    sections: splitChallenge(c.content),
  }))

  const done         = withContent.filter((c) => c.sections.solution).length
  const placeholders = withContent.length - done

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    byDifficulty: DIFFICULTY_ORDER.map((diff) => ({
      difficulty: diff,
      items: withContent.filter(
        (c) => c.category === cat && c.difficulty === diff,
      ),
    })).filter((g) => g.items.length > 0),
  })).filter((g) => g.byDifficulty.some((d) => d.items.length > 0))

  // Dynamically import editor only when server actions are available
  const ChallengeEditor = isStaticExport
    ? null
    : (await import('@/components/ChallengeEditor')).default

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
        {isStaticExport ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <p className="text-sm text-amber-700 font-medium">
              Read-only mode. Run <code className="bg-amber-100 px-1 rounded">npm run dev</code> locally to enable editing.
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xl">
            Click any challenge to expand it. Type, record, or paste a video link — hit Save and it writes immediately.
            Orange badges show which ones still need your answer.
          </p>
        )}

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
                      const isPlaceholder = !c.sections.solution
                      return (
                        <details
                          key={c.slug}
                          className="group border border-gray-200 rounded-xl overflow-hidden"
                        >
                          <summary className="flex items-start justify-between gap-4 p-5 cursor-pointer [&::-webkit-details-marker]:hidden [&::marker]:hidden select-none hover:bg-gray-50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-brand-black text-sm leading-snug">
                                {c.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                                {c.situation}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 mt-0.5">
                              {isPlaceholder ? (
                                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                                  Needs answer
                                </span>
                              ) : (
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                  Complete
                                </span>
                              )}
                              <span className="text-gray-300 group-open:rotate-90 transition-transform duration-200 text-lg leading-none">
                                ›
                              </span>
                            </div>
                          </summary>

                          {/* Editor (dev) or read-only (static) */}
                          {ChallengeEditor ? (
                            <ChallengeEditor
                              slug={c.slug}
                              initialSituation={c.sections.situation ?? ''}
                              initialYourTurn={c.sections.yourTurn ?? ''}
                              initialSolution={c.sections.solution ?? ''}
                              initialNote={c.note ?? ''}
                              initialVoiceNote={c.voiceNote ?? ''}
                              initialReferenceVideo={c.referenceVideo ?? ''}
                              initialReferenceVideoNote={c.referenceVideoNote ?? ''}
                            />
                          ) : (
                            <div className="border-t border-gray-100 divide-y divide-gray-100">
                              {[
                                { label: 'Situation', text: c.sections.situation },
                                { label: 'Your Turn', text: c.sections.yourTurn },
                                { label: 'Solution',  text: c.sections.solution },
                              ].map(({ label, text }) => (
                                <div key={label} className="px-5 py-4">
                                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{label}</p>
                                  {text ? (
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{text}</p>
                                  ) : (
                                    <p className="text-sm text-gray-300 italic">Not written yet.</p>
                                  )}
                                </div>
                              ))}
                              <div className="px-5 py-3 bg-gray-50">
                                <p className="text-xs text-gray-300 font-mono">
                                  {c.slug} · {c.isFree ? 'Free' : 'Locked'} · {c.difficulty}
                                </p>
                              </div>
                            </div>
                          )}
                        </details>
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
