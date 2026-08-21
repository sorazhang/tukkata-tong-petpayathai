'use client'

import { useState } from 'react'
import MyJournalEntry from './MyJournalEntry'
import MyJournalList from './MyJournalList'
import MyJournalPatterns from './MyJournalPatterns'
import MyChallengeList from './MyChallengeList'
import MyAnalysisList from './MyAnalysisList'
import type { MyEntry } from '@/lib/my-journal-actions'
import type { MyChallenge } from '@/lib/my-challenge-actions'
import type { MyAnalysis } from '@/lib/my-analysis-actions'

type Tab = 'journal' | 'challenges' | 'insights'
type Tier = 'free' | 'silver' | 'gold'

// Mock tier — swap this with real auth session data once auth is wired up
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
}: {
  entries: MyEntry[]
  challenges: MyChallenge[]
  analyses: MyAnalysis[]
}) {
  const [tab, setTab] = useState<Tab>('journal')

  const canAccessInsights = userTier === 'silver' || userTier === 'gold'
  const canAccessChallenges = userTier === 'silver' || userTier === 'gold'
  const canAskKru = userTier === 'gold'

  return (
    <div>
      {/* Tier badge */}
      <div className="flex justify-end mb-4">
        <span className={`text-xs font-semibold uppercase tracking-widest ${TIER_COLORS[userTier]}`}>
          {TIER_LABELS[userTier]} Member
        </span>
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
      </div>

      {tab === 'journal' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <MyJournalEntry />
          </div>
          {canAccessInsights && <MyJournalPatterns />}
          {!canAccessInsights && (
            <div className="border border-gray-100 rounded-xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-2">AI Pattern Analysis</p>
              <LockedFeature label="Unlock AI-powered pattern recognition" requiredTier="silver" />
            </div>
          )}
          {entries.length > 0 && <MyJournalList entries={entries} />}
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
    </div>
  )
}
