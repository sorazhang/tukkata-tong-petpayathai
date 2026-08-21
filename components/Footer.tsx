import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-muted py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="text-white font-semibold mb-1">Tukkatatong Petpayathai</p>
            <p className="font-thai text-brand-bone-dim text-sm mb-3" lang="th">ตุ๊กตาทอง เพชรพญาไท</p>
            <p className="text-sm text-brand-bone-dim max-w-xs leading-relaxed">
              Sharing the knowledge that took 30 years to build.
            </p>
            <p className="text-sm text-brand-bone-dim max-w-xs leading-relaxed mt-4">
              This is for someone who trains — who has felt confusion in sparring,
              who has thrown a kick that didn&apos;t land right and didn&apos;t know why,
              who has been told to relax under pressure and had no idea how to do that.
            </p>
            <p className="text-sm text-brand-bone-dim max-w-xs leading-relaxed mt-3">
              Not explained at. Pointed toward something and asked to go find it.
            </p>
          </div>

          <nav className="flex gap-12">
            <div>
              <p className="text-xs text-brand-bone-dim uppercase tracking-widest mb-3">Challenges</p>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <Link href="/challenges" className="text-sm text-brand-muted hover:text-white transition-colors">
                    All Challenges
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="text-sm text-brand-muted hover:text-white transition-colors">
                    Book a Session
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs text-brand-bone-dim uppercase tracking-widest mb-3">Knowledge</p>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <Link href="/real-fights" className="text-sm text-brand-muted hover:text-white transition-colors">
                    Real Fights
                  </Link>
                </li>
                <li>
                  <Link href="/opponents" className="text-sm text-brand-muted hover:text-white transition-colors">
                    Opponent Types
                  </Link>
                </li>
                <li>
                  <Link href="/scoring" className="text-sm text-brand-muted hover:text-white transition-colors">
                    Scoring Game
                  </Link>
                </li>
                <li>
                  <Link href="/culture" className="text-sm text-brand-muted hover:text-white transition-colors">
                    Culture
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-brand-muted hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="border-t border-brand-void mt-10 pt-6 text-xs text-brand-bone-dim flex justify-between items-center">
          <span>© 2025 Tukkatatong Petpayathai — Muay Thai Wisdom</span>
          <Link href="/review-login" className="text-brand-bone hover:text-brand-bone-dim transition-colors" aria-label="Kru login">
            ครู
          </Link>
        </div>
      </div>
    </footer>
  )
}
