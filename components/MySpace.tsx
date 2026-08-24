'use client'

import { useState } from 'react'
import Link from 'next/link'
import MyJournalEntry from './MyJournalEntry'
import MyJournalList from './MyJournalList'
import MyJournalPatterns from './MyJournalPatterns'
import MyChallengeList from './MyChallengeList'
import MyAnalysisList from './MyAnalysisList'
import MyStrikerDashboard from './MyStrikerDashboard'
import type { MyEntry } from '@/lib/my-journal-actions'
import type { MyChallenge } from '@/lib/my-challenge-actions'
import type { MyAnalysis } from '@/lib/my-analysis-actions'

type Tab = 'journal' | 'challenges' | 'insights' | 'striker'
type Tier = 'free' | 'silver' | 'gold'

const userTier: Tier = 'gold'

const TIER_LABELS: Record<Tier, string> = {
  free: 'Free',
  silver: 'Silver',
  gold: 'Gold',
}

const TIER_COLORS: Record<Tier, string> = {
  free: 'text-gray-400',
  silver: 'text-gray-400',
  gold: 'text-amber-500',
}

function LockedFeature({ label, requiredTier }: { label: string; requiredTier: 'silver' | 'gold' }) {
  return (
    <div className="py-12 text-center space-y-3">
      <div className="text-3xl">🔒</div>
      <p className="text-sm font-semibold text-brand-black">{label}</p>
      <p className="text-xs text-gray-400">
        Available on{' '}
        <span className={requiredTier === 'gold' ? 'text-amber-500 font-semibold' : 'text-gray-600 font-semibold'}>
          {TIER_LABELS[requiredTier]}
        </span>{' '}
        and above.
      </p>
      <button className="mt-2 text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors">
        Upgrade →
      </button>
    </div>
  )
}

export default function MySpace({
  entries,
  challenges,
  analyses,
  user,
}: {
  entries: MyEntry[]
  challenges: MyChallenge[]
  analyses: MyAnalysis[]
  user: { uid: string; email: string | null } | null
}) {
  const [tab, setTab]                   = useState<Tab>('journal')
  const [showAccount, setShowAccount]   = useState(false)

  const isLoggedIn = !!user
  const initial    = user?.email?.[0]?.toUpperCase() ?? 'G'

  const canAccessInsights   = userTier === 'silver' || userTier === 'gold'
  const canAccessChallenges = userTier === 'silver' || userTier === 'gold'
  const canAskKru           = userTier === 'gold'

  return (
    <div>
      {/* Account icon */}
      <div className="relative flex justify-end mb-4">
        <button
          onClick={() => setShowAccount((v) => !v)}
          className="w-8 h-8 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center hover:bg-brand-red/80 transition-colors"
          aria-label="Account"
        >
          {initial}
        </button>

        {showAccount && (
          <div
            className="absolute top-10 right-0 bg-white border border-gray-100 rounded-xl shadow-lg p-4 min-w-[200px] z-10"
            onMouseLeave={() => setShowAccount(false)}
          >
            {isLoggedIn ? (
              <>
                <p className="text-xs text-gray-500 truncate mb-0.5">{user.email}</p>
                <p className={`text-xs font-semibold ${TIER_COLORS[userTier]}`}>
                  {TIER_LABELS[userTier]} Member
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-brand-black mb-1">Guest</p>
                <p className="text-xs text-gray-400 mb-3">
                  Create an account to save your training journal.
                </p>
                <Link
                  href="/signup"
                  className="block text-center text-xs bg-brand-gold text-black px-3 py-2 rounded-lg font-semibold hover:bg-brand-gold-dim transition-colors"
                >
                  Sign up free
                </Link>
                <Link
                  href="/login"
                  className="block text-center text-xs text-gray-400 mt-1.5 hover:text-gray-600 transition-colors"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        )}
      </div>

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
          {canAccessInsights && analyses.length > 0 && (
            <span className="ml-1.5 text-xs bg-brand-red text-white px-1.5 py-0.5 rounded-full align-middle">
              {analyses.length}
            </span>
          )}
          {!canAccessInsights && (
            <span className="ml-1.5 text-xs text-gray-300">🔒</span>
          )}
        </button>
        <button
          onClick={() => setTab('challenges')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'challenges' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Challenges
          {canAccessChallenges && challenges.length > 0 && (
            <span className="ml-1.5 text-xs bg-brand-red text-white px-1.5 py-0.5 rounded-full align-middle">
              {challenges.length}
            </span>
          )}
          {!canAccessChallenges && (
            <span className="ml-1.5 text-xs text-gray-300">🔒</span>
          )}
        </button>
        <button
          onClick={() => setTab('striker')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'striker' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          🥊 Game
        </button>
      </div>

      {tab === 'journal' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <MyJournalEntry isLoggedIn={isLoggedIn} />
          </div>
          {isLoggedIn && canAccessInsights && <MyJournalPatterns />}
          {isLoggedIn && !canAccessInsights && (
            <div className="border border-gray-100 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">AI Pattern Analysis</p>
              <LockedFeature label="Unlock AI-powered pattern recognition" requiredTier="silver" />
            </div>
          )}
          {isLoggedIn && entries.length > 0 && <MyJournalList entries={entries} />}
        </div>
      )}

      {tab === 'insights' && (
        canAccessInsights
          ? <MyAnalysisList analyses={analyses} />
          : <LockedFeature label="AI Insights — saved pattern analyses" requiredTier="silver" />
      )}

      {tab === 'challenges' && (
        canAccessChallenges
          ? <MyChallengeList challenges={challenges} canAskKru={canAskKru} />
          : <LockedFeature label="Personal Challenges — submit &amp; escalate to Kru" requiredTier="silver" />
      )}

      {tab === 'striker' && <MyStrikerDashboard />}
    </div>
  )
}
