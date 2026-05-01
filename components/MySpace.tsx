'use client'

import { useState, useEffect } from 'react'
import MyJournalEntry from './MyJournalEntry'
import MyJournalList from './MyJournalList'
import MyJournalPatterns from './MyJournalPatterns'
import MyObservationList from './MyObservationList'
import MyAnalysisList from './MyAnalysisList'
import type { MyEntry } from '@/lib/my-journal-actions'
import type { MyObservation } from '@/lib/my-observation-actions'
import type { MyAnalysis } from '@/lib/my-analysis-actions'

type Tab = 'journal' | 'insights' | 'observations'
type Tier = 'free' | 'silver' | 'gold'

interface Student {
  key: string
  name: string
  tier: Tier
  tierLabel: string
}

const STUDENTS: Record<string, Student> = {
  owen: { key: 'owen', name: 'Owen', tier: 'free',   tierLabel: 'Free'   },
  jin:  { key: 'jin',  name: 'Jin',  tier: 'silver', tierLabel: 'Silver' },
  alex: { key: 'alex', name: 'Alex', tier: 'gold',   tierLabel: 'Gold'   },
}

const STUDENT_KEY = 'tkt_student'

function LockedFeature({ requiredTier }: { requiredTier: 'silver' | 'gold' }) {
  const tierLabel = requiredTier === 'gold' ? 'Gold' : 'Silver'
  return (
    <div className="py-12 text-center space-y-2">
      <p className="text-2xl">🔒</p>
      <p className="text-sm font-semibold text-brand-black">
        {requiredTier === 'gold' ? 'Gold members only' : 'Silver members and above'}
      </p>
      <p className="text-xs text-gray-400">
        Upgrade to {tierLabel} or above to unlock this feature.
      </p>
    </div>
  )
}

function LoginForm({ onLogin }: { onLogin: (s: Student) => void }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const student = STUDENTS[password.toLowerCase().trim()]
    if (student) {
      onLogin(student)
    } else {
      setError('Incorrect password.')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
            My Space
          </p>
          <h2 className="text-2xl font-bold text-brand-black">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-2">Enter your password to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="Password"
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-red"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={!password}
            className="w-full bg-brand-red text-white py-3 rounded-lg text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-50"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}


export default function MySpace({
  entries,
  observations,
  analyses,
}: {
  entries: MyEntry[]
  observations: MyObservation[]
  analyses: MyAnalysis[]
}) {
  const [tab, setTab]         = useState<Tab>('journal')
  const [student, setStudent] = useState<Student | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    function sync() {
      const raw = localStorage.getItem(STUDENT_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Student
          if (STUDENTS[parsed.key]) { setStudent(parsed); return }
        } catch { /* fall through */ }
      }
      setStudent(null)
    }
    sync()
    setHydrated(true)
    window.addEventListener('student-change', sync)
    return () => window.removeEventListener('student-change', sync)
  }, [])

  function handleLogin(s: Student) {
    localStorage.setItem(STUDENT_KEY, JSON.stringify(s))
    window.dispatchEvent(new Event('student-change'))
    setStudent(s)
  }

  if (!hydrated) return null
  if (!student)  return <LoginForm onLogin={handleLogin} />

  const tier = student.tier
  const canInsights     = tier === 'silver' || tier === 'gold'
  const canObservations = tier === 'silver' || tier === 'gold'
  const canAskKru       = tier === 'gold'

  return (
    <div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8">
        <button
          onClick={() => setTab('journal')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'journal' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Journal
        </button>
        <button
          onClick={() => setTab('insights')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'insights' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Insights
          {canInsights && analyses.length > 0 && (
            <span className="ml-1.5 text-xs bg-brand-red text-white px-1.5 py-0.5 rounded-full align-middle">
              {analyses.length}
            </span>
          )}
          {!canInsights && <span className="ml-1 text-gray-300 text-xs">🔒</span>}
        </button>
        <button
          onClick={() => setTab('observations')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'observations' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Observations
          {canObservations && observations.length > 0 && (
            <span className="ml-1.5 text-xs bg-brand-red text-white px-1.5 py-0.5 rounded-full align-middle">
              {observations.length}
            </span>
          )}
          {!canObservations && <span className="ml-1 text-gray-300 text-xs">🔒</span>}
        </button>
      </div>

      {tab === 'journal' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <MyJournalEntry />
          </div>
          {entries.length > 0 && <MyJournalList entries={entries} />}
        </div>
      )}

      {tab === 'insights' && (
        canInsights
          ? (
            <div className="space-y-6">
              <MyJournalPatterns />
              {analyses.length > 0 && <MyAnalysisList analyses={analyses} />}
            </div>
          )
          : <LockedFeature requiredTier="silver" />
      )}

      {tab === 'observations' && (
        canObservations
          ? <MyObservationList observations={observations} canAskKru={canAskKru} studentName={student.name} />
          : <LockedFeature requiredTier="silver" />
      )}
    </div>
  )
}
