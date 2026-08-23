'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const idToken    = await credential.user.getIdToken()
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      window.location.href = '/my-space'
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Incorrect email or password.')
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.')
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-brand-black mb-1">Log in</h1>
        <p className="text-sm text-gray-500 mb-8">
          No account yet?{' '}
          <Link href="/signup" className="text-brand-red hover:underline">Sign up</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Your password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
            />
          </div>

          {error && (
            <p className="text-sm text-brand-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-black py-3 rounded-lg font-semibold text-sm hover:bg-brand-gold-dim transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <p className="text-center text-xs text-gray-400 pt-1">
            <Link href="/forgot-password" className="hover:text-gray-600 transition-colors">
              Forgot your password?
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
