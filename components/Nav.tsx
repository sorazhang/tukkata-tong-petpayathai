'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/my-space', label: 'Journal' },
  { href: '/challenges', label: 'Challenges' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-brand-black sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex flex-col leading-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-white font-semibold text-base tracking-tight">
            Tukkatatong Petpayathai
          </span>
          <span className="font-thai text-gray-500 text-xs" lang="th">
            ตุ๊กตาทอง เพชรพญาไท
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`transition-colors text-sm ${
                  pathname === href ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
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

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${
              open ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-200 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${
              open ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-800">
          <ul className="list-none m-0 p-0 px-6 py-4 flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-base transition-colors border-b border-gray-800 last:border-0 ${
                    pathname === href ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-brand-red text-white px-4 py-3 rounded text-sm font-medium hover:bg-brand-red-dark transition-colors"
              >
                Book a Session
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
