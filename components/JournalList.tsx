'use client'

import { useState } from 'react'

interface Entry {
  id: string
  text: string
  createdAt: string
}

export default function JournalList({ entries }: { entries: Entry[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (entries.length === 0) return null

  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Previous entries ({entries.length})
      </h2>
      <div className="space-y-2">
        {entries.map((entry) => {
          const isOpen = expanded === entry.id
          const date = new Date(entry.createdAt)
          const dateLabel = date.toLocaleDateString('th-TH', {
            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
          })
          const timeLabel = date.toLocaleTimeString('th-TH', {
            hour: '2-digit', minute: '2-digit',
          })

          return (
            <div key={entry.id} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : entry.id)}
                className="w-full text-left px-4 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-black">{dateLabel}</p>
                  {!isOpen && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.text}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{timeLabel}</span>
                  <span className="text-gray-300 text-lg leading-none transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="text-sm text-brand-black leading-relaxed whitespace-pre-wrap pt-3">
                    {entry.text}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
