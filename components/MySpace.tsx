'use client'

import { useState } from 'react'
import MyJournalEntry from './MyJournalEntry'
import MyJournalList from './MyJournalList'
import MyJournalPatterns from './MyJournalPatterns'
import MyChallengeList from './MyChallengeList'
import type { MyEntry } from '@/lib/my-journal-actions'
import type { MyChallenge } from '@/lib/my-challenge-actions'

type Tab = 'journal' | 'challenges'

export default function MySpace({
  entries,
  challenges,
}: {
  entries: MyEntry[]
  challenges: MyChallenge[]
}) {
  const [tab, setTab] = useState<Tab>('journal')

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
          onClick={() => setTab('challenges')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'challenges' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Challenges
          {challenges.length > 0 && (
            <span className="ml-1.5 text-xs bg-brand-red text-white px-1.5 py-0.5 rounded-full align-middle">
              {challenges.length}
            </span>
          )}
        </button>
      </div>

      {tab === 'journal' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <MyJournalEntry />
          </div>
          <MyJournalPatterns />
          {entries.length > 0 && <MyJournalList entries={entries} />}
        </div>
      )}

      {tab === 'challenges' && (
        <MyChallengeList challenges={challenges} />
      )}
    </div>
  )
}
