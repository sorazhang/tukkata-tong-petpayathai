'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const PERSONA_KEY = 'tkt_persona'
const STUDENT_KEY = 'tkt_student'

const studentLinks = [
  { href: '/my-space',      label: 'My Space'         },
  { href: '/videos',        label: 'Videos'           },
  { href: '/scoring',       label: 'Game'             },
  { href: '/knowledge',     label: 'Knowledge'        },
  { href: '/about',         label: 'About'            },
]

const kruLinks = [
  { href: '/kru', label: 'Dashboard' },
]

export default function Nav() {
  const [open, setOpen]           = useState(false)
  const [isKru, setIsKru]         = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname                  = usePathname()

  useEffect(() => {
    function syncKru() {
      setIsKru(localStorage.getItem(PERSONA_KEY) === 'kru')
    }
    syncKru()
    window.addEventListener('storage', syncKru)
    window.addEventListener('persona-change', syncKru)
    return () => {
      window.removeEventListener('storage', syncKru)
      window.removeEventListener('persona-change', syncKru)
    }
  }, [])

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null)
    })
  }, [])

  async function handleSignOut() {
    await signOut(auth)
    await fetch('/api/auth/session', { method: 'DELETE' })
    localStorage.removeItem(STUDENT_KEY)
    setOpen(false)
    window.location.href = '/'
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
            src="/logo-transparent.png"
            alt="Tukkatatong logo"
            className="h-9 w-auto shrink-0"
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
          ) : userEmail ? (
            <li className="flex items-center gap-3">
              <span className="text-gray-400 text-xs truncate max-w-[140px]">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                Log out
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Log in
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="bg-brand-gold text-black px-4 py-2 rounded text-sm font-medium hover:bg-brand-gold-dim transition-colors"
                >
                  Sign up
                </Link>
              </li>
            </>
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
            ) : userEmail ? (
              <li className="pt-3 flex items-center justify-between">
                <span className="text-gray-400 text-sm truncate max-w-[180px]">{userEmail}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Log out
                </button>
              </li>
            ) : (
              <>
                <li className="pt-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base text-gray-400 hover:text-white transition-colors border-b border-gray-800"
                  >
                    Log in
                  </Link>
                </li>
                <li className="pt-1">
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block w-full text-center bg-brand-gold text-black px-4 py-3 rounded text-sm font-medium hover:bg-brand-gold-dim transition-colors"
                  >
                    Sign up
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
