import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-black text-gray-400 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="text-white font-semibold mb-1">Tukkatatong Petpayathai</p>
            <p className="font-thai text-gray-500 text-sm mb-3" lang="th">ตุ๊กกะต้อง เพชรพยาไทย</p>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Lumpinee Stadium champion. Channel 7 World title holder.
              Sharing the knowledge that took 30 years to build.
            </p>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed mt-4">
              We speak to someone who trains — who has felt confusion in sparring,
              who has thrown a kick that didn&apos;t land right and didn&apos;t know why,
              who has been told to relax under pressure and had no idea how to do that.
            </p>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed mt-3">
              We do not explain at them. We point at something and ask them to go
              find it themselves.
            </p>
          </div>

          <nav className="flex gap-12">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Challenges</p>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <Link href="/challenges" className="text-sm text-gray-400 hover:text-white transition-colors">
                    All Challenges
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Book a Session
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Knowledge</p>
              <ul className="space-y-2 list-none p-0 m-0">
                <li>
                  <Link href="/real-fights" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Real Fights
                  </Link>
                </li>
                <li>
                  <Link href="/opponents" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Opponent Types
                  </Link>
                </li>
                <li>
                  <Link href="/scoring" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Scoring Game
                  </Link>
                </li>
                <li>
                  <Link href="/culture" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Culture
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-gray-600">
          © 2025 Tukkatatong Petpayathai — Muay Thai Wisdom
        </div>
      </div>
    </footer>
  )
}
