import Link from 'next/link'
import { getChallenges, getCultureStories } from '@/lib/content'
import ChallengeCard from '@/components/ChallengeCard'

export default async function Home() {
  const [challenges, stories] = await Promise.all([
    getChallenges(),
    getCultureStories(),
  ])

  const featured = challenges.slice(0, 3)
  const featuredStories = stories.slice(0, 2)

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-brand-black text-white py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-medium uppercase tracking-widest mb-3">
            Lumpinee Stadium Champion · Channel 7 World Title Holder
          </p>
          <p className="font-thai text-gray-400 text-lg mb-6" lang="th">
            ตุ๊กกะต้อง เพชรพยาไทย
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            The art<br />behind the art.
          </h1>
          <p className="text-gray-300 text-xl leading-relaxed max-w-xl mb-10">
            Not technique lists. Not highlight reels. Real problems from the
            ring — with a real challenge that builds real understanding.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/challenges"
              className="bg-brand-red text-white px-7 py-3.5 rounded font-medium hover:bg-brand-red-dark transition-colors"
            >
              See the Challenges
            </Link>
            <Link
              href="/culture"
              className="border border-gray-600 text-gray-300 px-7 py-3.5 rounded font-medium hover:border-white hover:text-white transition-colors"
            >
              Read the Stories
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-14 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                title: 'The Situation',
                body: 'A real problem from the ring. Specific, short, something you will recognise from your own training.',
              },
              {
                step: '02',
                title: 'Your Turn',
                body: 'Go train it. Try to figure it out with your own body. Come back when you are stuck.',
              },
              {
                step: '03',
                title: 'The Solution',
                body: "What Tukkatatong actually does. Why it works. The detail most coaches never explain.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="text-5xl font-bold text-gray-100 mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-brand-black text-lg mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Challenges ── */}
      {featured.length > 0 && (
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-brand-black">
                Recent Challenges
              </h2>
              <Link
                href="/challenges"
                className="text-brand-red text-sm hover:underline font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((c) => (
                <ChallengeCard key={c.slug} challenge={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Culture teaser ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-brand-black mb-2">
                Muay Thai is more than fighting
              </h2>
              <p className="text-gray-500 max-w-xl leading-relaxed">
                Stories about the Wai Kru, the Mongkol, the music, the gyms of
                Isaan. The art behind the violence.
              </p>
            </div>
            <Link
              href="/culture"
              className="hidden md:block text-brand-red text-sm hover:underline font-medium shrink-0"
            >
              Read the stories →
            </Link>
          </div>

          {featuredStories.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {featuredStories.map((s) => (
                <Link
                  key={s.slug}
                  href={`/culture/${s.slug}`}
                  className="block group"
                >
                  <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <h3 className="font-semibold text-brand-black text-lg mb-2 group-hover:text-brand-red transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {s.excerpt}
                    </p>
                    <p className="text-brand-red text-sm font-medium mt-4">
                      Read →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="md:hidden mt-6">
            <Link
              href="/culture"
              className="text-brand-red text-sm hover:underline font-medium"
            >
              Read all stories →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 1-on-1 CTA ── */}
      <section className="py-20 px-6 bg-brand-black text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-red text-xs font-medium uppercase tracking-widest mb-4">
            Direct Access
          </p>
          <h2 className="text-3xl font-bold mb-4">
            Stuck on something specific?
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto">
            Book a 1-on-1 session. Bring your footage, your questions, your
            problem. We work through it together.
          </p>
          <Link
            href="/book"
            className="bg-brand-red text-white px-8 py-3.5 rounded font-medium hover:bg-brand-red-dark transition-colors inline-block"
          >
            Book a Session
          </Link>
        </div>
      </section>
    </main>
  )
}
