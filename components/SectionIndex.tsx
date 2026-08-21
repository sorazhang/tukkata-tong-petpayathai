import Link from 'next/link'
import type { Challenge, Track } from '@/lib/content'
import ChallengeCard from '@/components/ChallengeCard'

interface Props {
  articles: Challenge[]
  tracks: Track[]
  title: string
  description: string
  basePath: string
}

export default function SectionIndex({
  articles,
  tracks,
  title,
  description,
  basePath,
}: Props) {
  const standalones = articles.filter((a) => a.tracks.length === 0)

  return (
    <main>
      {/* Header */}
      <section className="bg-brand-black text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </section>

      {/* Tracks */}
      {tracks.map((track) => (
        <section key={track.name} className="py-16 px-6 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <p className="text-xs font-medium text-brand-red uppercase tracking-widest mb-2">
                Track
              </p>
              <h2 className="text-2xl font-bold text-brand-black">{track.name}</h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-0">
              {track.challenges.map((c, i) => (
                <div key={c.slug} className="flex items-center flex-1 min-w-0">
                  <Link
                    href={`${basePath}/${c.slug}`}
                    className="flex-1 min-w-0 block group h-full"
                  >
                    <article className="border border-gray-200 rounded-lg p-6 h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <div className="text-3xl font-bold text-gray-100 mb-4 leading-none">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className="font-semibold text-brand-black text-lg leading-snug mb-3 group-hover:text-brand-red transition-colors">
                        {c.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="capitalize">{c.difficulty}</span>
                        {!c.isFree && (
                          <>
                            <span>·</span>
                            <span>Solution locked</span>
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

      {/* Standalone articles */}
      {standalones.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            {tracks.length > 0 && (
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">
                More
              </h2>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {standalones.map((c) => (
                <ChallengeCard key={c.slug} challenge={c} basePath={basePath} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {articles.length === 0 && (
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-gray-400">Coming soon.</p>
          </div>
        </section>
      )}
    </main>
  )
}
