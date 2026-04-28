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
type Tier = 'free' | 'silver' | 'gold' | 'kru'

interface Persona {
  key: string
  name: string
  tier: Tier
  label: string
}

const PERSONAS: Persona[] = [
  { key: 'owen',   name: 'Owen',   tier: 'free',   label: 'Free'   },
  { key: 'jin',    name: 'Jin',    tier: 'silver', label: 'Silver' },
  { key: 'jolynn', name: 'Jolynn', tier: 'gold',   label: 'Gold'   },
  { key: 'kru',    name: 'Kru',    tier: 'kru',    label: 'Kru'    },
]

const STORAGE_KEY = 'tkt_persona'

function LockedFeature({ requiredTier }: { requiredTier: 'silver' | 'gold' }) {
  const tierLabel = requiredTier === 'gold' ? 'Gold' : 'Silver'
  return (
    <div className="py-12 text-center space-y-2">
      <p className="text-2xl">🔒</p>
      <p className="text-sm font-semibold text-brand-black">
        {requiredTier === 'gold' ? 'Gold members only' : 'Silver members and above'}
      </p>
      <p className="text-xs text-gray-400">
        Switch to {tierLabel} or above using the selector at the top to preview this feature.
      </p>
    </div>
  )
}

function PersonaBar({
  active,
  onChange,
}: {
  active: Persona
  onChange: (p: Persona) => void
}) {
  return (
    <div className="flex items-center gap-2 mb-8 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <span className="text-xs text-gray-400 font-medium shrink-0">Training as:</span>
      <div className="flex gap-1 flex-1">
        {PERSONAS.map((p) => {
          const isActive = p.key === active.key
          const tierColor =
            p.tier === 'kru'    ? 'text-brand-red border-brand-red/30 bg-red-50'  :
            p.tier === 'gold'   ? 'text-amber-600 border-amber-300 bg-amber-50'   :
            p.tier === 'silver' ? 'text-gray-600 border-gray-300 bg-white'        :
                                  'text-gray-500 border-gray-200 bg-white'
          const activeColor =
            p.tier === 'kru'    ? 'bg-brand-red text-white border-brand-red'          :
            p.tier === 'gold'   ? 'bg-amber-500 text-white border-amber-500'          :
            p.tier === 'silver' ? 'bg-brand-black text-white border-brand-black'      :
                                  'bg-gray-600 text-white border-gray-600'

          return (
            <button
              key={p.key}
              onClick={() => onChange(p)}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
                isActive ? activeColor : `${tierColor} hover:border-gray-400`
              }`}
            >
              {p.name}
              <span className={`ml-1 font-normal ${isActive ? 'opacity-70' : 'opacity-50'}`}>
                · {p.label}
              </span>
            </button>
          )
        })}
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
  const [tab, setTab]           = useState<Tab>('journal')
  const [persona, setPersona]   = useState<Persona>(PERSONAS[0])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const found = PERSONAS.find((p) => p.key === stored)
    if (found) setPersona(found)
    setHydrated(true)
  }, [])

  function handlePersonaChange(p: Persona) {
    setPersona(p)
    localStorage.setItem(STORAGE_KEY, p.key)
    window.dispatchEvent(new Event('persona-change'))
  }

  const tier = persona.tier
  const canInsights     = tier === 'silver' || tier === 'gold' || tier === 'kru'
  const canObservations = tier === 'silver' || tier === 'gold' || tier === 'kru'
  const canAskKru       = tier === 'gold'   || tier === 'kru'

  if (!hydrated) return null

  return (
    <div>
      <PersonaBar active={persona} onChange={handlePersonaChange} />

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
          {canInsights
            ? <MyJournalPatterns />
            : (
              <div className="border border-gray-100 rounded-xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">
                  AI Pattern Analysis
                </p>
                <LockedFeature requiredTier="silver" />
              </div>
            )
          }
          {entries.length > 0 && <MyJournalList entries={entries} />}
        </div>
      )}

      {tab === 'insights' && (
        canInsights
          ? <MyAnalysisList analyses={analyses} />
          : <LockedFeature requiredTier="silver" />
      )}

      {tab === 'observations' && (
        canObservations
          ? <MyObservationList observations={observations} canAskKru={canAskKru} />
          : <LockedFeature requiredTier="silver" />
      )}
    </div>
  )
}
