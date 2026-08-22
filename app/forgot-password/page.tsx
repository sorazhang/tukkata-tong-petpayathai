'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        // Don't reveal whether the email exists — always show success
        setSent(true)
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
        <h1 className="text-2xl font-bold text-brand-black mb-1">Reset your password</h1>
        <p className="text-sm text-gray-500 mb-8">
          <Link href="/login" className="text-brand-red hover:underline">← Back to log in</Link>
        </p>

        {sent ? (
          <div className="border border-gray-200 rounded-lg p-6 text-center space-y-2">
            <p className="text-sm font-semibold text-brand-black">Check your email</p>
            <p className="text-sm text-gray-500">
              If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
            </p>
          </div>
        ) : (
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

            {error && (
              <p className="text-sm text-brand-red">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-black py-3 rounded-lg font-semibold text-sm hover:bg-brand-gold-dim transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
