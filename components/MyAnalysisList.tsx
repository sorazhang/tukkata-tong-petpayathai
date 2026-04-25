'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMyAnalysis } from '@/lib/my-analysis-actions'
import type { MyAnalysis } from '@/lib/my-analysis-actions'

function MyAnalysisRow({ analysis }: { analysis: MyAnalysis }) {
  const router = useRouter()
  const [expanded, setExpanded]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition]      = useTransition()

  const date = new Date(analysis.createdAt)
  const dateLabel = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteMyAnalysis(analysis.id)
      if (res.ok) router.refresh()
    })
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-black">{dateLabel}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {analysis.themes.map((t) => t.label).join(' · ')}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-300">{analysis.entryCount} entries</span>
          <span
            className="text-gray-300 text-lg leading-none"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
          >›</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">
          <div className="space-y-3">
            {analysis.themes.map((theme, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-brand-red font-bold text-sm mt-0.5">→</span>
                <div>
                  <p className="text-sm font-semibold text-brand-black">{theme.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-brand-red/5 rounded-lg border border-brand-red/10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">Focus</p>
            <p className="text-sm text-brand-black leading-relaxed">{analysis.suggestion}</p>
          </div>

          <div className="flex gap-3 pt-1">
            {confirmDelete ? (
              <span className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">Delete?</span>
                <button onClick={handleDelete} disabled={isPending} className="text-red-500 font-semibold hover:text-red-700">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MyAnalysisList({ analyses }: { analyses: MyAnalysis[] }) {
  if (analyses.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-400">No insights saved yet.</p>
        <p className="text-xs text-gray-300 mt-1">Run "Find patterns" in the Journal tab and save the result.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {analyses.map((a) => (
        <MyAnalysisRow key={a.id} analysis={a} />
      ))}
    </div>
  )
}
