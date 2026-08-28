import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Lumpinee Stadium champion, Channel 7 World title holder. Thirty years of understanding that most coaches never put into words.',
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
            I started fighting because my family needed the money. That is the
            honest answer. Most Thai fighters from Isaan will tell you the same
            thing.
          </p>

          <p>
            What I did not expect was what the ring would teach me. Not just how
            to fight — but how to think. How to stay calm when everything is
            going wrong. How to read a person before they know what they are
            going to do themselves. These are things that do not have a name in
            Muay Thai, but every champion knows them.
          </p>

          <h2>The Record</h2>
          <p>
            Multiple Channel 7
            Stadium World Titles from 2007. North East Thailand Championship.
            Andaman League Tournament Champion. Over 200 professional fights across
            three decades.
          </p>
          <p>
            In 2018 and 2019 I competed in ONE Championship, bringing Muay Thai to
            the international stage. Different rules, different judges, different
            opponents — but the same art.
          </p>

          <h2>What I Fought</h2>
          <p>
            I came up in the golden era of Thai fighting — the 1990s, when
            Lumpinee and Rajadamnern were the only arenas that mattered and
            every fight card had four or five future champions on it. You learned
            fast or you did not last. There was no internet to study opponents.
            You watched from the corner, you felt things in sparring, and you
            asked your Kru questions until he told you to stop asking and start
            feeling.
          </p>
          <p>
            I fought in small provincial stadiums for 500 baht and in Lumpinee
            for the kind of money that meant my mother did not have to work in
            the fields anymore. Both mattered. Both taught me different things.
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
