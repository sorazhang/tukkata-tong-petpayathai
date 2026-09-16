import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Two-time Muay Thai World Champion (240-33-2). Channel 7 Stadium title holder, ONE Championship veteran. Thirty years of understanding that most coaches never put into words.',
}

export default function AboutPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-brand-black text-white py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Circle photo */}
          <div className="shrink-0">
            <img
              src="/bio2.png"
              alt="Tukkatatong Petpayathai"
              className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover object-top border-2 border-gray-700"
            />
          </div>
          {/* Name + record */}
          <div>
            <p className="text-brand-red text-xs font-medium uppercase tracking-widest mb-4">
              About
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              ตุ๊กตาทอง เพชรพญาไท
            </h1>
            <p className="text-gray-400 text-lg mt-2">Tukkatatong Petpayathai</p>
          </div>
        </div>
      </section>

      {/* Bio */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 leading-relaxed">
            My dad was a big Muay Thai fan. He used to watch all the fights on
            television. That is how I got introduced to Muay Thai. I would watch
            the fights with him, and I became a fan. One day, my dad bought some
            gloves and a bag for us to mess around with. As time went by,
            messing around, punching, and kicking, I decided I wanted to give
            Muay Thai a proper go and try fighting.
          </p>

          <p>
            The village I grew up in is like any other small countryside village
            in Thailand — a quiet place where everyone knows each other. My life
            was a normal country kid&apos;s life. I spent my time playing with friends
            and being naughty. I was quite misbehaved as a kid.
          </p>

          <h2>Starting Young</h2>
          <p>
            I started training at home at first, and then moved to a gym nearby
            called Sitkawee. I had my first fight when I was 10 — I was in the
            fourth grade. After fighting for a few years in the provinces, I
            relocated to Bangkok at the age of 13 and moved to the Kiatpetch Gym.
          </p>
          <p>
            The move to the Thai capital helped me take my skills to new levels,
            as I refined my technique and developed my own aggressive style. That
            style took me to my first title — the Channel 7 Stadium World Title —
            and a host of wins over some of the biggest names in the sport.
          </p>
          <p>
            My proudest win would be when I beat Ninmongkon, as he was a top fighter.
          </p>

          <h2>The Hardest Time</h2>
          <p>
            The hardest time of my life was when my family lost all our money.
            My dad was up for re-election for the local government. He spent a
            lot of money on his campaign, but lost the election. We were left
            penniless. It was extremely difficult for everyone.
          </p>
          <p>
            Once my family went bankrupt, I decided I had to return to fight and
            help the family out with money. We got through this hardship by
            fighting and never giving up. Seeing my dad continue to fight and
            refusing to give up taught me that you can overcome anything, as long
            as you keep fighting. I carry this with me today. I refuse to give up.
          </p>

          <h2>The Record</h2>
          <p>
            Two-time Muay Thai World Champion (240-33-2). Multiple Channel 7
            Stadium World Titles. North East Thailand Championship. Andaman League
            Tournament Champion. Over 275 professional fights across three decades.
          </p>
          <p>
            I competed in ONE Championship&apos;s ONE Super Series — the biggest stage
            I have ever fought on — following in the footsteps of teammates
            Sam-A Gaiyanghadao, Nong-O Gaiyanghadao, and Singtongnoi Por Telakun
            at Evolve MMA.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Where to start
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/my-space"
              className="bg-brand-red text-white px-6 py-3 rounded font-medium hover:bg-brand-red-dark transition-colors"
            >
              Start your journal →
            </Link>
            <a
              href="https://www.youtube.com/@TukkatatongPetpayathai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:border-brand-black transition-colors"
            >
              <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.04 0 12 0 12s0 3.96.5 5.81a3.02 3.02 0 0 0 2.12 2.14C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.96 24 12 24 12s0-3.96-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
              </svg>
              YouTube Channel
            </a>
          </div>
        </div>
      </article>
    </main>
  )
}
