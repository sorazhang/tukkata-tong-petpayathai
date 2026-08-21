'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ChallengeItem {
  slug: string
  title: string
  category: string
  difficulty: string
  situation: string
  isFree: boolean
}

type Category = 'All' | 'Striking' | 'Defense' | 'Clinch' | 'Ring IQ' | 'Footwork'

const CATEGORIES: Category[] = ['All', 'Striking', 'Defense', 'Clinch', 'Footwork', 'Ring IQ']
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const
const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

const CATEGORY_COLORS: Record<string, string> = {
  Striking: 'text-red-600 bg-red-50',
  Defense: 'text-green-700 bg-green-50',
  Clinch: 'text-blue-700 bg-blue-50',
  Footwork: 'text-orange-700 bg-orange-50',
  'Ring IQ': 'text-purple-700 bg-purple-50',
}

export default function ChallengesFilter({
  challenges,
}: {
  challenges: ChallengeItem[]
}) {
  const [active, setActive] = useState<Category>('All')

  const counts = Object.fromEntries(
    CATEGORIES.slice(1).map((cat) => [
      cat,
      challenges.filter((c) => c.category === cat).length,
    ])
  )

  const filtered =
    active === 'All' ? challenges : challenges.filter((c) => c.category === active)

  const grouped = DIFFICULTIES.map((diff) => ({
    difficulty: diff,
    items: filtered.filter((c) => c.difficulty === diff),
  })).filter((g) => g.items.length > 0)

  const freeInView = filtered.filter((c) => c.isFree).length

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === cat
                ? 'bg-brand-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span
                className={`ml-1.5 text-xs ${active === cat ? 'text-gray-400' : 'text-gray-400'}`}
              >
                {counts[cat]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sub-count */}
      <p className="text-xs text-gray-400 mb-10">
        {filtered.length} challenge{filtered.length !== 1 ? 's' : ''}
        {freeInView > 0 && (
          <> · <span className="text-green-600">{freeInView} free</span></>
        )}
      </p>

      {/* Challenges grouped by difficulty */}
      <div className="space-y-14">
        {grouped.map(({ difficulty, items }) => (
          <div key={difficulty}>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest whitespace-nowrap">
                {DIFFICULTY_LABELS[difficulty]}
              </h3>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {items.length} challenge{items.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((c) => (
                <ChallengeCard key={c.slug} challenge={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChallengeCard({ challenge: c }: { challenge: ChallengeItem }) {
  const colorClass = CATEGORY_COLORS[c.category] ?? 'text-gray-600 bg-gray-100'

  return (
    <Link href={`/challenges/${c.slug}`} className="block group">
      <article className="border border-gray-200 rounded-lg p-5 h-full flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
            {c.category}
          </span>
          {c.isFree ? (
            <span className="text-xs font-semibold text-green-600">Free</span>
          ) : (
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
              Locked
            </span>
          )}
        </div>

        <h3 className="font-semibold text-brand-black text-base leading-snug mb-2 group-hover:text-brand-red transition-colors flex-1">
          {c.title}
        </h3>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-auto pt-2">
          {c.situation}
        </p>
      </article>
    </Link>
  )
}
