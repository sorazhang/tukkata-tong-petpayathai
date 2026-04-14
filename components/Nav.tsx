import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/real-fights', label: 'Real Fights' },
  { href: '/opponents', label: 'Opponent Types' },
  { href: '/scoring', label: 'Scoring Game' },
  { href: '/culture', label: 'Culture' },
]

export default function Nav() {
  return (
    <header className="bg-brand-black sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex flex-col leading-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-white font-semibold text-base tracking-tight">
            Tukkatatong Petpayathai
          </span>
          <span className="font-thai text-gray-500 text-xs" lang="th">
            ตุ๊กกะต้อง เพชรพยาไทย
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/book"
              className="bg-brand-red text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-red-dark transition-colors"
            >
              Book a Session
            </Link>
          </li>
        </ul>

        {/* Mobile nav — simple horizontal scroll for v1 */}
        <ul className="flex md:hidden items-center gap-4 list-none m-0 p-0 overflow-x-auto">
          {links.map(({ href, label }) => (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                className="text-gray-300 hover:text-white transition-colors text-xs"
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="shrink-0">
            <Link
              href="/book"
              className="bg-brand-red text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-brand-red-dark transition-colors"
            >
              Book
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
