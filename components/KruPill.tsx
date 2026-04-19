import Link from 'next/link'

export default function KruPill() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-brand-black/90 backdrop-blur-sm text-white rounded-full px-3 py-2 shadow-lg border border-white/10">
        <Link
          href="/review"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <span>📋</span> Review
        </Link>
        <span className="text-white/20">|</span>
        <Link
          href="/journal"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <span>🎙</span> Journal
        </Link>
        <span className="text-white/20">|</span>
        <Link
          href="/vote"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <span>🗳</span> Polls
        </Link>
      </div>
    </div>
  )
}
