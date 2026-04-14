import Link from 'next/link'

interface ChallengeItem {
  slug: string
  title: string
  situation: string
  category: string
  difficulty: string
  isFree: boolean
}

const CATEGORY_ORDER = ['Striking', 'Defense', 'Footwork', 'Clinch', 'Ring IQ']
const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'] as const
const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}
const CATEGORY_COLORS: Record<string, string> = {
  Striking: 'text-red-600',
  Defense: 'text-green-700',
  Footwork: 'text-orange-700',
  Clinch: 'text-blue-700',
  'Ring IQ': 'text-purple-700',
}

export default function ChallengesGrouped({
  challenges,
}: {
  challenges: ChallengeItem[]
}) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    total: challenges.filter((c) => c.category === cat).length,
    byDifficulty: DIFFICULTY_ORDER.map((diff) => ({
      difficulty: diff,
      items: challenges.filter((c) => c.category === cat && c.difficulty === diff),
    })).filter((g) => g.items.length > 0),
  })).filter((g) => g.total > 0)

  return (
    <div className="divide-y divide-gray-100 border-t border-gray-100">
      {grouped.map(({ category, total, byDifficulty }) => (
        <details key={category} className="group">
          <summary className="flex items-center justify-between py-5 cursor-pointer [&::-webkit-details-marker]:hidden [&::marker]:hidden select-none">
            <div className="flex items-center gap-4">
              <span
                className={`text-sm font-bold uppercase tracking-widest ${CATEGORY_COLORS[category] ?? 'text-gray-500'}`}
              >
                {category}
              </span>
              <span className="text-xs text-gray-400">
                {total} challenge{total !== 1 ? 's' : ''}
              </span>
            </div>
            <span className="text-gray-400 transition-transform duration-200 group-open:rotate-90 text-lg leading-none">
              ›
            </span>
          </summary>

          <div className="pb-8 space-y-8">
            {byDifficulty.map(({ difficulty, items }) => (
              <div key={difficulty}>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-medium">
                  {DIFFICULTY_LABELS[difficulty]}
                </p>
                <ul className="space-y-2">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/challenges/${c.slug}`}
                        className="block px-4 py-4 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50 group/item transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Drill label */}
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-medium">
                              Try this
                            </p>
                            {/* Title */}
                            <p className="text-sm font-semibold text-brand-black group-hover/item:text-brand-red transition-colors leading-snug mb-1.5">
                              {c.title}
                            </p>
                            {/* Situation hint */}
                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                              {c.situation}
                            </p>
                          </div>
                          {/* Status */}
                          <span
                            className={`text-xs shrink-0 font-medium mt-5 ${
                              c.isFree ? 'text-green-600' : 'text-gray-300'
                            }`}
                          >
                            {c.isFree ? 'Free' : 'Locked'}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  )
}
