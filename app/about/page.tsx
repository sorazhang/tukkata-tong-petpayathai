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
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-red text-xs font-medium uppercase tracking-widest mb-4">
            About
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            ตุ๊กตาทอง เพชรพญาไท
          </h1>
          <p className="text-gray-400 text-lg mt-2">Tukkatatong Petpayathai</p>
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

          <h2>What Gets Lost in Teaching</h2>
          <p>
            When you teach punch and kick, the student learns the pose and stops
            there. They focus on the limb — how hard, how fast — and forget it
            is a whole coordination of the entire body. The hip, the shoulder,
            the weight shifting from one foot to the other. A punch is not an arm
            doing something. It is everything arriving at the same moment through
            the arm.
          </p>
          <p>
            The second thing that gets lost is the opponent. The student becomes
            so focused on performing the technique correctly that the other person
            disappears. But the other person is the whole point. Their fear, their
            habits, the way their weight shifts before they throw — all of that is
            information. A fighter who reads this has an answer before the question
            is finished.
          </p>
          <p>
            This is what thirty years built in me. Not just the technique. The
            whole-body coordination, and the reading. Most fighters develop one or
            the other. Very few build both that deep.
          </p>

          <h2>Why Your Turn Comes First</h2>
          <p>
            The knowledge I carry was never learned through words. It came through
            sparring, through mistakes, through watching opponents until the
            patterns became automatic. It lives in my body — in reactions I have
            before I think.
          </p>
          <p>
            That is why every challenge here asks you to go feel it before you
            read the answer. Not because the answer is hidden. Because the answer
            will not land until your body has something to attach it to. You read
            the situation, you go to training, you try it yourself. Then you come
            back. Now the words mean something.
          </p>
          <p>
            That is the only way this kind of knowledge travels. Not from mind
            to mind. From body to body, with words as the bridge.
          </p>
          <p>
            The journal works the same way. When you write down what confused
            you in training, you are not just recording — you are starting to
            see. The pattern you keep running into becomes visible when you put
            it in words. That is when it becomes something you can bring to Kru.
            Not a vague feeling. A specific problem. And a specific problem is
            one that can be answered.
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
            <Link
              href="/challenges"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:border-brand-black transition-colors"
            >
              See the Challenges
            </Link>
            <Link
              href="/book"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:border-brand-black transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}
