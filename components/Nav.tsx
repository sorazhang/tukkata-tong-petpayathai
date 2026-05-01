'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const PERSONA_KEY = 'tkt_persona'
const STUDENT_KEY = 'tkt_student'

const studentLinks = [
  { href: '/my-space',   label: 'My Space'    },
  { href: '/challenges', label: 'Challenges'  },
  { href: '/knowledge',  label: 'Knowledge'   },
  { href: '/about',      label: 'About'       },
]

const kruLinks = [
  { href: '/kru', label: 'Dashboard' },
]

export default function Nav() {
  const [open, setOpen]             = useState(false)
  const [isKru, setIsKru]           = useState(false)
  const [studentName, setStudentName] = useState<string | null>(null)
  const pathname                    = usePathname()

  useEffect(() => {
    function sync() {
      setIsKru(localStorage.getItem(PERSONA_KEY) === 'kru')
      try {
        const raw = localStorage.getItem(STUDENT_KEY)
        const parsed = raw ? JSON.parse(raw) : null
        setStudentName(parsed?.name ?? null)
      } catch {
        setStudentName(null)
      }
    }
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('persona-change', sync)
    window.addEventListener('student-change', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('persona-change', sync)
      window.removeEventListener('student-change', sync)
    }
  }, [])

  function handleStudentLogout() {
    localStorage.removeItem(STUDENT_KEY)
    window.dispatchEvent(new Event('student-change'))
    setOpen(false)
  }

  const links = isKru ? kruLinks : studentLinks

  return (
    <header className="bg-brand-black sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo3.png"
            alt="Tukkatatong logo"
            className="h-9 w-auto shrink-0"
            style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-semibold text-base tracking-tight">
              Tukkatatong Petpayathai
            </span>
            <span className="font-thai text-gray-500 text-xs" lang="th">
              ตุ๊กตาทอง เพชรพญาไท
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`transition-colors text-sm ${
                  pathname.startsWith(href) ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {!isKru && (
            <li>
              <Link
                href="/review-login"
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
              >
                Kru
              </Link>
            </li>
          )}

          {isKru ? (
            <li>
              <button
                onClick={async () => {
                  await fetch('/api/review-signout', { method: 'POST' })
                  localStorage.setItem(PERSONA_KEY, 'student')
                  window.dispatchEvent(new Event('persona-change'))
                  window.location.href = '/'
                }}
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                Sign out
              </button>
            </li>
          ) : studentName ? (
            <li className="flex items-center gap-3">
              <span className="text-gray-400 text-xs">{studentName}</span>
              <button
                onClick={handleStudentLogout}
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                Log out
              </button>
            </li>
          ) : (
            <li>
              <Link
                href="/book"
                className="bg-brand-red text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-red-dark transition-colors"
              >
                Book a Session
              </Link>
            </li>
          )}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
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
                    pathname.startsWith(href) ? 'text-white font-medium' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            {isKru ? (
              <li className="pt-3">
                <button
                  onClick={async () => {
                    await fetch('/api/review-signout', { method: 'POST' })
                    localStorage.setItem(PERSONA_KEY, 'student')
                    window.dispatchEvent(new Event('persona-change'))
                    window.location.href = '/'
                  }}
                  className="block py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </li>
            ) : studentName ? (
              <li className="pt-3 flex items-center justify-between">
                <span className="text-gray-400 text-sm">{studentName}</span>
                <button
                  onClick={handleStudentLogout}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Log out
                </button>
              </li>
            ) : (
              <>
                <li className="pt-2">
                  <Link
                    href="/review-login"
                    onClick={() => setOpen(false)}
                    className="block py-2 text-sm text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    Kru
                  </Link>
                </li>
                <li className="pt-1">
                  <Link
                    href="/book"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center bg-brand-red text-white px-4 py-3 rounded text-sm font-medium hover:bg-brand-red-dark transition-colors"
                  >
                    Book a Session
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
