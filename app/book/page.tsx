import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Book a Session',
  description:
    'Book a 1-on-1 session with Tukkatatong Petpayathai. Bring your footage, your questions, your problem.',
}

const sessionTypes = [
  {
    name: 'Technique Review',
    duration: '45 min',
    description:
      'Send footage of your sparring or pad work beforehand. We watch it together and identify the two or three things that matter most — not a list of everything wrong.',
    ideal: 'Fighters preparing for a fight or wanting an honest assessment.',
  },
  {
    name: 'Problem Solving',
    duration: '45 min',
    description:
      'Bring one specific problem — a technique you cannot land, a pattern that keeps getting you hurt, a situation you do not know how to handle. We work only on that.',
    ideal: 'Anyone stuck on a specific technical or tactical problem.',
  },
  {
    name: 'Fight Preparation',
    duration: '60 min',
    description:
      'Share your opponent\'s footage if you have it. We build a specific strategy — what to attack, what to avoid, how to manage the first round. Concrete, not generic.',
    ideal: 'Fighters with a fight coming up in the next 4-8 weeks.',
  },
]

export default function BookPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-brand-black text-white py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book a Session
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
            One hour. One problem. Thirty years of experience applied directly
            to your training.
          </p>
        </div>
      </section>

      {/* Session types */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-10">
            Session Types
          </h2>

          <div className="space-y-6">
            {sessionTypes.map((s) => (
              <div
                key={s.name}
                className="border border-gray-200 rounded-lg p-7"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-brand-black text-xl">
                    {s.name}
                  </h3>
                  <span className="text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {s.duration}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  {s.description}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-gray-500">
                    Ideal for:
                  </span>{' '}
                  {s.ideal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-black mb-4">
            Ready to book?
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed max-w-lg mx-auto">
            Booking and payment will be available here shortly. In the meantime,
            reach out directly to arrange a session.
          </p>

          {/* Placeholder — replace with Cal.com embed when live */}
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl py-20 px-8 mb-8">
            <p className="text-gray-400 text-sm">
              Cal.com booking widget — coming soon
            </p>
          </div>

          <p className="text-sm text-gray-400">
            Questions?{' '}
            <Link
              href="/about"
              className="text-brand-red hover:underline"
            >
              Read more about Tukkatatong
            </Link>{' '}
            or explore the{' '}
            <Link
              href="/challenges"
              className="text-brand-red hover:underline"
            >
              free challenges
            </Link>{' '}
            first.
          </p>
        </div>
      </section>
    </main>
  )
}
