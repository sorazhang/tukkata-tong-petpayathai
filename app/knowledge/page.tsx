import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Knowledge',
  description:
    'Everything you can understand without physically doing it. Fight breakdowns, opponent patterns, scoring, culture, and principles.',
}

const sections = [
  {
    href: '/real-fights',
    label: 'Real Fights',
    question: 'What was actually happening in that moment?',
    description:
      'Specific moments from professional fights broken down from the inside. Not highlights — the decisions, the reads, the things that do not show on camera.',
    status: 'live' as const,
  },
  {
    href: '/opponents',
    label: 'Opponent Types',
    question: 'How do I handle this kind of fighter?',
    description:
      'Every fighter has patterns. How they move, what they want, where they are vulnerable. Know the type before you meet them.',
    status: 'live' as const,
  },
  {
    href: '/scoring',
    label: 'Scoring Game',
    question: 'How does Muay Thai judging actually work?',
    description:
      'Fights are won and lost on the cards as much as in the ring. What judges look for, and why winning the exchanges is not always the same as winning the round.',
    status: 'live' as const,
  },
  {
    href: '/culture',
    label: 'Culture',
    question: 'What does this tradition mean?',
    description:
      'The Wai Kru, the Mongkol, the music, the gyms of Isaan. Muay Thai carries a history in every ritual. This is where it lives.',
    status: 'live' as const,
  },
  {
    href: '/principles',
    label: 'Principles',
    question: 'Why do things work the way they do?',
    description:
      'Deep single-topic pieces. Why the teep controls the ring. What the clinch is really for. The understanding underneath the technique.',
    status: 'coming' as const,
  },
]

export default function KnowledgePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-brand-black text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Knowledge</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
            Things you can understand without physically doing them. Read, watch,
            think. Then bring it to the gym.
          </p>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {sections.map(({ href, label, question, description, status }) => {
            const card = (
              <div
                className={`border rounded-lg p-8 transition-all duration-200 ${
                  status === 'coming'
                    ? 'border-gray-100 bg-gray-50'
                    : 'border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5 group'
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2
                        className={`text-xl font-bold transition-colors ${
                          status === 'coming'
                            ? 'text-gray-400'
                            : 'text-brand-black group-hover:text-brand-red'
                        }`}
                      >
                        {label}
                      </h2>
                      {status === 'coming' && (
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded font-medium">
                          Coming
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium mb-3 ${
                        status === 'coming' ? 'text-gray-400' : 'text-brand-red'
                      }`}
                    >
                      {question}
                    </p>
                    <p
                      className={`text-sm leading-relaxed ${
                        status === 'coming' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                  {status === 'live' && (
                    <span className="text-brand-red text-xl shrink-0 mt-1 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  )}
                </div>
              </div>
            )

            return status === 'live' ? (
              <Link key={href} href={href} className="block">
                {card}
              </Link>
            ) : (
              <div key={href}>{card}</div>
            )
          })}
        </div>
      </section>

      {/* ── Separator ── */}
      <section className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-400 leading-relaxed">
            Looking for something to actively try?{' '}
            <Link
              href="/challenges"
              className="text-brand-red hover:underline font-medium"
            >
              Challenges →
            </Link>{' '}
            are things your body has to figure out. These are things your mind
            can understand.
          </p>
        </div>
      </section>
    </main>
  )
}
