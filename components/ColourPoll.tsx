'use client'

import { useState, useTransition } from 'react'
import { savePollAnswer } from '@/lib/poll-actions'

const SLUG = 'colour-direction'

const themes = [
  {
    id: 'current',
    label: 'Current',
    hero: '#1a1a1a',
    accent: '#d32f2f',
    cards: '#f9fafb',
    card: '#fff',
    cardBorder: '#e5e7eb',
    tagBg: '#fef2f2',
    tagText: '#b91c1c',
  },
  {
    id: 'gold',
    label: 'Championship Gold',
    hero: '#1a1710',
    accent: '#C9A015',
    cards: '#f7f4ed',
    card: '#fff',
    cardBorder: '#e8e2d4',
    tagBg: '#fdf8e7',
    tagText: '#92740a',
  },
  {
    id: 'crimson',
    label: 'Deep Crimson',
    hero: '#140f0f',
    accent: '#c0392b',
    cards: '#faf7f7',
    card: '#fff',
    cardBorder: '#e8dede',
    tagBg: '#fdf2f2',
    tagText: '#7F1D1D',
  },
  {
    id: 'night',
    label: 'Night Fight',
    hero: '#0D1117',
    accent: '#D97706',
    cards: '#f6f8fa',
    card: '#fff',
    cardBorder: '#e1e4e8',
    tagBg: '#fffbeb',
    tagText: '#b45309',
  },
  {
    id: 'cream',
    label: 'Warm Cream',
    hero: '#1c1917',
    accent: '#d32f2f',
    cards: '#F5F0E8',
    card: '#fdfaf5',
    cardBorder: '#e8e0d4',
    tagBg: '#fef2f2',
    tagText: '#b91c1c',
  },
]

export default function ColourPoll() {
  const [selected, setSelected]   = useState<string>('')
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (!selected) return
    startTransition(async () => {
      setSaveState('saving')
      const res = await savePollAnswer(SLUG, selected)
      setSaveState(res.ok ? 'saved' : 'error')
    })
  }

  return (
    <div className="space-y-4">
      {themes.map((t) => {
        const active = selected === t.id
        return (
          <button
            key={t.id}
            onClick={() => { setSelected(t.id); setSaveState('idle') }}
            className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all ${
              active ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Mini mockup preview */}
            <div style={{ background: t.hero, padding: '16px 20px 12px' }}>
              <p style={{ color: t.accent, fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                Lumpinee Stadium Champion
              </p>
              <p style={{ color: '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>
                The art<br />behind the art.
              </p>
              <span style={{ background: t.accent, color: t.id === 'gold' ? t.hero : '#fff', fontSize: 10, fontWeight: 600, padding: '4px 12px', borderRadius: 4, display: 'inline-block' }}>
                See the Challenges
              </span>
            </div>
            <div style={{ background: t.cards, padding: '10px 20px', display: 'flex', gap: 8 }}>
              <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 6, padding: '8px 10px', flex: 1 }}>
                <span style={{ background: t.tagBg, color: t.tagText, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 99, display: 'inline-block', marginBottom: 4 }}>
                  Striking
                </span>
                <p style={{ fontSize: 11, fontWeight: 600, color: t.hero, lineHeight: 1.3 }}>Why Do We Throw Two Jabs?</p>
              </div>
              <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 6, padding: '8px 10px', flex: 1 }}>
                <span style={{ background: t.tagBg, color: t.tagText, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 99, display: 'inline-block', marginBottom: 4 }}>
                  Ring IQ
                </span>
                <p style={{ fontSize: 11, fontWeight: 600, color: t.hero, lineHeight: 1.3 }}>I Back Straight Up When Pressured</p>
              </div>
            </div>

            {/* Label row */}
            <div className={`px-4 py-2.5 flex items-center justify-between ${active ? 'bg-red-50' : 'bg-white'}`}>
              <p className={`text-sm font-semibold ${active ? 'text-brand-red' : 'text-brand-black'}`}>
                {active ? '● ' : '○ '}{t.label}
              </p>
              {active && <span className="text-xs text-brand-red font-semibold">Selected</span>}
            </div>
          </button>
        )
      })}

      {/* Custom / none option */}
      <button
        onClick={() => { setSelected('custom'); setSaveState('idle') }}
        className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
          selected === 'custom' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <p className={`text-sm font-semibold ${selected === 'custom' ? 'text-brand-red' : 'text-brand-black'}`}>
          {selected === 'custom' ? '● ' : '○ '}I don&apos;t like any of these — I want something different
        </p>
      </button>

      <button
        onClick={handleSave}
        disabled={!selected || isPending}
        className="w-full bg-brand-red text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-40"
      >
        {saveState === 'saving' ? 'Saving…'
          : saveState === 'saved' ? '✓ Saved'
          : saveState === 'error' ? 'Error — try again'
          : 'Save answer'}
      </button>
    </div>
  )
}
