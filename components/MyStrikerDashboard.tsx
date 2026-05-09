'use client'

import { useState, useEffect } from 'react'

type Strike = {
  type: string
  power: number
  combo: number
  t: number
}

type Session = {
  date: string
  score: number
  outcome: 'win' | 'loss'
  rounds: number
  durationMs: number
  strikes: Strike[]
  bestCombo: number
  totalStrikes: number
}

const STRIKE_LABELS: Record<string, string> = {
  jab: 'Jab',
  cross: 'Cross',
  left_kick: 'L.Kick',
  right_kick: 'R.Kick',
  knee: 'Knee',
}

const STRIKE_COLORS: Record<string, string> = {
  jab: 'bg-blue-400',
  cross: 'bg-brand-red',
  left_kick: 'bg-orange-400',
  right_kick: 'bg-amber-400',
  knee: 'bg-purple-400',
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-brand-black">{value}</p>
      <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{label}</p>
    </div>
  )
}

function PowerBar({ sessions }: { sessions: Session[] }) {
  const recent = sessions.slice(0, 10).reverse()
  const maxPower = 100
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Power Trend (last 10)</p>
      <div className="flex items-end gap-1.5 h-16">
        {recent.map((s, i) => {
          const avg = s.strikes.length > 0
            ? s.strikes.reduce((a, b) => a + (b.power || 0), 0) / s.strikes.length
            : 0
          const pct = Math.round((avg / maxPower) * 100)
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center" style={{ height: '52px' }}>
                <div
                  className={`w-full rounded-t ${s.outcome === 'win' ? 'bg-brand-red' : 'bg-gray-200'}`}
                  style={{ height: `${Math.max(4, pct * 0.52)}px` }}
                />
              </div>
              <span className="text-gray-300 text-center" style={{ fontSize: '7px' }}>
                {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric' })}
              </span>
            </div>
          )
        })}
        {recent.length === 0 && (
          <p className="text-xs text-gray-300 w-full text-center">No data yet</p>
        )}
      </div>
      <p className="text-xs text-gray-300 mt-2">Red = win &middot; Grey = loss</p>
    </div>
  )
}

export default function MyStrikerDashboard() {
  const [sessions, setSessions] = useState<Session[] | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('tkt_muay_sessions')
      setSessions(raw ? JSON.parse(raw) : [])
    } catch {
      setSessions([])
    }
  }, [])

  if (sessions === null) return null

  if (sessions.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-4xl">🥊</p>
        <p className="text-sm font-semibold text-brand-black">No sessions yet</p>
        <p className="text-xs text-gray-400">Play Muay Thai Striker and your stats will appear here.</p>
        <a
          href="/muay-thai-striker.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-3 bg-brand-red text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors"
        >
          Launch Game →
        </a>
      </div>
    )
  }

  const allStrikes = sessions.flatMap(s => s.strikes)
  const strikeCounts: Record<string, number> = {}
  let totalPower = 0
  allStrikes.forEach(s => {
    const k = s.type
    strikeCounts[k] = (strikeCounts[k] || 0) + 1
    totalPower += s.power || 0
  })

  const maxCount = Math.max(...Object.values(strikeCounts), 1)
  const bestScore = Math.max(...sessions.map(s => s.score))
  const bestCombo = Math.max(...sessions.map(s => s.bestCombo))
  const avgPower = allStrikes.length > 0 ? Math.round(totalPower / allStrikes.length) : 0
  const wins = sessions.filter(s => s.outcome === 'win').length
  const winRate = Math.round((wins / sessions.length) * 100)

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Sessions" value={sessions.length} />
        <StatCard label="Win Rate" value={`${winRate}%`} />
        <StatCard label="Best Score" value={bestScore.toLocaleString()} />
        <StatCard label="Best Combo" value={`${bestCombo}×`} />
      </div>

      {/* Power trend */}
      <PowerBar sessions={sessions} />

      {/* Strike breakdown */}
      <div className="border border-gray-100 rounded-xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
          Strike Breakdown — all sessions
        </p>
        <div className="space-y-3">
          {(['jab', 'cross', 'left_kick', 'right_kick', 'knee'] as const).map(type => {
            const count = strikeCounts[type] || 0
            const pct = Math.round((count / maxCount) * 100)
            return (
              <div key={type} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-14 shrink-0">{STRIKE_LABELS[type]}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${STRIKE_COLORS[type]}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-600 w-8 text-right">{count}</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Avg power: <span className="font-semibold text-gray-600">{avgPower}</span>
          &nbsp;&middot;&nbsp;
          Total strikes: <span className="font-semibold text-gray-600">{allStrikes.length}</span>
        </p>
      </div>

      {/* Session history */}
      <div className="border border-gray-100 rounded-xl p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Session History</p>
        <div className="space-y-0">
          {sessions.slice(0, 15).map((s, i) => {
            const d = new Date(s.date)
            const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            const sessionAvgPower = s.strikes.length > 0
              ? Math.round(s.strikes.reduce((a, b) => a + (b.power || 0), 0) / s.strikes.length)
              : 0
            return (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className={`text-xs font-bold w-8 shrink-0 ${s.outcome === 'win' ? 'text-green-500' : 'text-red-400'}`}>
                  {s.outcome === 'win' ? 'WIN' : 'KO'}
                </span>
                <span className="text-xs text-gray-400 w-24 shrink-0">{dateStr} {timeStr}</span>
                <div className="flex flex-1 gap-3 text-xs text-gray-400">
                  <span>{s.totalStrikes} hits</span>
                  <span>×{s.bestCombo} combo</span>
                  <span>pwr {sessionAvgPower}</span>
                </div>
                <span className="text-sm font-bold text-brand-black tabular-nums">{s.score.toLocaleString()}</span>
              </div>
            )
          })}
        </div>
      </div>

      <a
        href="/muay-thai-striker.html"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center py-3 bg-brand-black text-white text-sm font-bold rounded-xl hover:bg-gray-900 transition-colors"
      >
        Play Another Round →
      </a>
    </div>
  )
}
