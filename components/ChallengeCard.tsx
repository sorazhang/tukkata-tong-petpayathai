import Link from 'next/link'
import type { Challenge } from '@/lib/content'

const categoryColors: Record<string, string> = {
  Striking: 'bg-red-50 text-red-700',
  Clinch: 'bg-blue-50 text-blue-700',
  Defense: 'bg-green-50 text-green-700',
  Footwork: 'bg-orange-50 text-orange-700',
  'Ring IQ': 'bg-purple-50 text-purple-700',
}

const difficultyLabel: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export default function ChallengeCard({
  challenge,
  basePath = '/challenges',
}: {
  challenge: Challenge
  basePath?: string
}) {
  const colorClass =
    categoryColors[challenge.category] ?? 'bg-gray-100 text-gray-600'

  return (
    <Link href={`${basePath}/${challenge.slug}`} className="block group">
      <article className="border border-gray-200 rounded-lg p-6 h-full flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}
          >
            {challenge.category}
          </span>
          <span className="text-xs text-gray-400">
            {difficultyLabel[challenge.difficulty]}
          </span>
        </div>

        <h3 className="font-semibold text-brand-black text-lg mb-3 leading-snug group-hover:text-brand-red transition-colors">
          {challenge.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
          {challenge.situation}
        </p>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <span className="text-brand-red text-sm font-medium group-hover:underline">
            See the challenge
          </span>
          {!challenge.isFree && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg
                className="w-3 h-3"
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
              Solution locked
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}
