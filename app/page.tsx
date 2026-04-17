import Link from 'next/link'
import { getChallenges, getCultureStories } from '@/lib/content'
import ChallengeCard from '@/components/ChallengeCard'
import SurveyWidget from '@/components/SurveyWidget'

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
            ตุ๊กตาทอง เพชรพญาไท
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            The art<br />behind the art.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-4">
            This is for someone who trains — who has felt confusion in sparring,
            who has thrown a kick that didn&apos;t land right and didn&apos;t know why,
            who has been told to relax under pressure and had no idea how to do that.
          </p>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            Not explained at. Pointed at something and asked to go find it themselves.
          </p>
        </div>
      </section>

      {/* ── Two ways to learn ── */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-2 text-center">
            Two ways to learn
          </h2>
          <p className="text-center text-gray-400 text-sm mb-14">
            One requires your body. One requires your mind.
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Challenges */}
            <div className="border-2 border-brand-black rounded-xl p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
                Challenges
              </p>
              <h3 className="text-xl font-bold text-brand-black mb-2">
                Your body has to figure it out.
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                You cannot get the answer by reading. You have to move, feel,
                and try. The answer arrives through your body, not through words.
              </p>
              <div className="space-y-5 mb-8">
                {[
                  {
                    step: '01',
                    title: 'The Situation',
                    body: 'A problem you recognise from your own training. Specific enough that you feel it when you read it.',
                  },
                  {
                    step: '02',
                    title: 'Your Turn',
                    body: 'Go try it. In the gym, on the bag, in sparring. Come back when your body has felt something.',
                  },
                  {
                    step: '03',
                    title: 'The Solution',
                    body: "What Tukkatatong actually does. Why it works. The understanding most coaches never put into words.",
                  },
                ].map(({ step, title, body }) => (
                  <div key={step} className="flex gap-4">
                    <span className="text-2xl font-bold text-gray-100 leading-none shrink-0 w-8">
                      {step}
                    </span>
                    <div>
                      <p className="font-semibold text-brand-black text-sm mb-0.5">{title}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/challenges"
                className="inline-block bg-brand-red text-white px-5 py-2.5 rounded font-medium text-sm hover:bg-brand-red-dark transition-colors"
              >
                See the Challenges →
              </Link>
            </div>

            {/* Knowledge */}
            <div className="border border-gray-200 rounded-xl p-8 bg-gray-50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Knowledge
              </p>
              <h3 className="text-xl font-bold text-brand-black mb-2">
                Your mind understands it.
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Things you can understand without physically doing them. Read,
                watch, think. Then bring it to the gym.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  {
                    label: 'Real Fights',
                    body: 'What was actually happening in that specific moment.',
                  },
                  {
                    label: 'Opponent Types',
                    body: 'How this kind of fighter thinks, moves, and where they are vulnerable.',
                  },
                  {
                    label: 'Scoring Game',
                    body: 'What Muay Thai judges look for. How fights are won on the cards.',
                  },
                  {
                    label: 'Culture',
                    body: 'The Wai Kru, the Mongkol, the meaning behind the art.',
                  },
                ].map(({ label, body }) => (
                  <li key={label} className="flex gap-3">
                    <span className="text-gray-300 mt-0.5 shrink-0">→</span>
                    <div>
                      <p className="font-semibold text-brand-black text-sm mb-0.5">{label}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/knowledge"
                className="inline-block border border-gray-300 text-gray-700 px-5 py-2.5 rounded font-medium text-sm hover:border-brand-black transition-colors"
              >
                Explore Knowledge →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Survey ── */}
      <section className="py-16 px-6 bg-gray-50 border-b border-gray-100 hover:bg-white transition-colors duration-500 group/survey">
        <div className="max-w-xl mx-auto group-hover/survey:-translate-y-0.5 transition-transform duration-300">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 text-center flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-red animate-pulse shrink-0" />
            Not sure where to start?
            <span className="inline-block w-2 h-2 rounded-full bg-brand-red animate-pulse shrink-0" />
          </p>
          <h2 className="text-2xl font-bold text-brand-black mb-8 text-center">
            Tell us where you are.
          </h2>
          <SurveyWidget challenges={challenges.map(({ slug, title }) => ({ slug, title }))} />
        </div>
      </section>

      {/* ── Featured Challenges ── */}
      {featured.length > 0 && (
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
                  Challenges
                </p>
                <h2 className="text-2xl font-bold text-brand-black">
                  Try one. See what your body finds.
                </h2>
              </div>
              <Link
                href="/challenges"
                className="text-brand-red text-sm hover:underline font-medium shrink-0 ml-6"
              >
                All challenges →
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
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Knowledge — Culture
              </p>
              <h2 className="text-2xl font-bold text-brand-black mb-2">
                Muay Thai is more than fighting
              </h2>
              <p className="text-gray-500 max-w-xl leading-relaxed">
                The Wai Kru, the Mongkol, the music, the gyms of Isaan.
                Things you understand by reading, not by drilling.
              </p>
            </div>
            <Link
              href="/knowledge"
              className="hidden md:block text-brand-red text-sm hover:underline font-medium shrink-0"
            >
              All Knowledge →
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
