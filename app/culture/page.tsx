import type { Metadata } from 'next'
import Link from 'next/link'
import { getCultureStories } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Culture',
  description:
    'Muay Thai as art — stories about the Wai Kru, the Mongkol, the stadiums, and what this art teaches you about being human.',
}

export default async function CulturePage() {
  const stories = await getCultureStories()

  return (
    <main>
      {/* Header */}
      <section className="bg-brand-black text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Culture</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
            Muay Thai as art. The rituals, the stories, the things you only
            understand after years inside the gym. Not violence — meaning.
          </p>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {stories.length === 0 ? (
            <p className="text-gray-400 text-center py-20">
              Stories coming soon.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {stories.map((s) => (
                <Link
                  key={s.slug}
                  href={`/culture/${s.slug}`}
                  className="block group py-10 first:pt-0"
                >
                  <p className="text-xs text-gray-400 mb-3">
                    {new Date(s.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <h2 className="text-2xl font-bold text-brand-black mb-3 group-hover:text-brand-red transition-colors leading-snug">
                    {s.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed line-clamp-3">
                    {s.excerpt}
                  </p>
                  <span className="inline-block text-brand-red text-sm font-medium mt-4">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
