import Link from 'next/link'
import { getCultureStories } from '@/lib/content'
import KruQuickCapture from '@/components/KruQuickCapture'

export default async function Home() {
  const stories = await getCultureStories()

  const featuredStories = stories.slice(0, 2)

  return (
    <main>
      <KruQuickCapture />
      {/* ── Hero ── */}
      <section
        className="relative bg-brand-black text-white py-16 md:py-28 px-6"
        style={{ backgroundImage: 'url(/Kru.webp)', backgroundSize: 'cover', backgroundPosition: '20% top' }}
      >
        <div className="absolute inset-0 bg-brand-black/70" />
        <div className="max-w-3xl mx-auto relative z-10">
          <p className="text-brand-red text-xs font-medium uppercase tracking-widest mb-3">
            2x Channel 7 Muay Thai Champion · North East Thailand Champion
          </p>
          <p className="font-thai text-gray-400 text-base md:text-lg mb-4 md:mb-6" lang="th">
            ตุ๊กตาทอง เพชรพญาไท
          </p>
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
            Some fighters improve faster. The difference is the part of Muay Thai your training isn&apos;t giving you.
          </h1>
          <p className="text-gray-300 text-sm md:text-lg leading-relaxed max-w-xl mb-3 md:mb-4">
            You train consistently. You try hard. But the same confusion keeps coming back in sparring —
            the kick that doesn&apos;t land, the pressure that makes you freeze, the situation you
            don&apos;t know how to handle. You&apos;ve been told what to do. Nobody has helped you
            see what your training is actually showing you.
          </p>
          <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-xl mb-8 md:mb-10">
            This platform changes that. A journal to see your own patterns. Challenges your body has to solve before you read Kru&apos;s answer. And when something specific keeps stopping you — knowledge and direct access to thirty years of experience.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/my-space"
              className="bg-brand-gold text-black px-6 py-3 rounded font-medium text-sm hover:bg-brand-gold-dim transition-colors"
            >
              Start your training journal →
            </Link>
          </div>
        </div>
      </section>
      {/* ── How it works ── */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-2 text-center">
            How it works
          </h2>
          <p className="text-center text-gray-400 text-sm mb-14">
            Three steps. One journal. All of it pointing toward understanding.
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Step 1 */}
            <div className="border-2 border-brand-black rounded-xl p-8 flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">
                Step 01
              </p>
              <h3 className="text-xl font-bold text-brand-black mb-4">
                Write
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                A short note after training. What confused you. What clicked. No structure needed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-gray-200 rounded-xl p-8 bg-gray-50 flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Step 02
              </p>
              <h3 className="text-xl font-bold text-brand-black mb-4">
                See your patterns
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                AI surfaces what keeps coming up across your entries. The recurring confusion you may not have named yet.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-gray-200 rounded-xl p-8 bg-gray-50 flex flex-col">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                Step 03
              </p>
              <h3 className="text-xl font-bold text-brand-black mb-4">
                Bring it to Kru
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                Save what matters as an observation. Send your specific struggle directly — thirty years of experience applied to what you keep getting stuck on.
              </p>
              <Link
                href="/my-space"
                className="inline-block mt-6 bg-brand-gold text-black px-5 py-2.5 rounded font-medium text-sm hover:bg-brand-gold-dim transition-colors"
              >
                Start your journal →
              </Link>
            </div>

          </div>
        </div>
      </section>



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

      {/* ── Kru entry ── */}
      <div className="text-center py-6 bg-white border-t border-gray-100">
        <Link
          href="/review-login"
          className="text-xs text-gray-300 hover:text-gray-400 transition-colors"
        >
          Kru? →
        </Link>
      </div>

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
            className="bg-brand-gold text-black px-8 py-3.5 rounded font-medium hover:bg-brand-gold-dim transition-colors inline-block"
          >
            Book a Session
          </Link>
        </div>
      </section>
    </main>
  )
}
