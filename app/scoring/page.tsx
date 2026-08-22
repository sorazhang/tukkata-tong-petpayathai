import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Game — Muay Thai Striker',
  description:
    'Camera-detected strikes. Real-time scoring. Play a round, then log what you felt in your journal.',
}

export default function ScoringPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">Training Game</p>
      <h1 className="text-3xl font-bold text-brand-black mb-3">Muay Thai Striker</h1>
      <p className="text-gray-500 leading-relaxed max-w-xl mb-10">
        Camera-detected strikes. Real-time scoring. Play a round, then log what you felt in your journal.
      </p>

      <a
        href="/muay-thai-striker.html"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-brand-gold text-black px-8 py-3.5 rounded font-medium hover:bg-brand-gold-dim transition-colors"
      >
        Launch game →
      </a>

      <div className="mt-16 border-t border-gray-100 pt-10">
        <p className="text-sm text-gray-400 mb-2">Your stats are recorded in your training hub.</p>
        <Link href="/my-space" className="text-brand-red text-sm font-medium hover:underline">
          Go to My Space →
        </Link>
      </div>
    </main>
  )
}
