import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Lumpinee Stadium champion, Channel 7 World title holder, and 20+ years of coaching experience.',
}

export default function AboutPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-brand-black text-white py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-medium uppercase tracking-widest mb-4">
            About
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Tukkatatong Petpayathai
          </h1>
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
            Lumpinee Stadium title at 108 lbs in early 1990. Multiple Channel 7
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

          <h2>Why I Share This</h2>
          <p>
            When I started coaching, I noticed something. Students would copy
            what I showed them — the mechanics, the pattern — but they could not
            use it in sparring. The technique was right but the understanding was
            missing.
          </p>
          <p>
            The problem is how most Muay Thai is taught. You learn movements, not
            principles. You learn what to do, not when, not why, not what it
            feels like when it is about to work.
          </p>
          <p>
            I spent three decades building this understanding. It would be a
            waste to take it to the grave.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-gray-100">
          <Link
            href="/challenges"
            className="bg-brand-red text-white px-6 py-3 rounded font-medium hover:bg-brand-red-dark transition-colors"
          >
            See the Challenges
          </Link>
          <Link
            href="/book"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:border-gray-500 transition-colors"
          >
            Book a Session
          </Link>
        </div>
      </article>
    </main>
  )
}
