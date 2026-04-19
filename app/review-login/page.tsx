'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/review-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
            Internal
          </p>
          <h1 className="text-2xl font-bold text-brand-black">Kru Review</h1>
          <p className="text-gray-400 text-sm mt-2">Enter the password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-brand-red text-white py-3 rounded-lg text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  )
}
