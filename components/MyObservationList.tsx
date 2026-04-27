'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMyObservation } from '@/lib/my-observation-actions'
import { submitConfusion } from '@/lib/confusion-actions'
import { generalizeChallenge } from '@/lib/ai-journal-actions'
import type { MyObservation } from '@/lib/my-observation-actions'

function MyObservationRow({
  observation,
  canAskKru,
}: {
  observation: MyObservation
  canAskKru: boolean
}) {
  const router = useRouter()
  const [expanded, setExpanded]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition]      = useTransition()
  const [askStatus, setAskStatus]         = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const dateLabel = new Date(observation.createdAt).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteMyObservation(observation.id)
      if (res.ok) router.refresh()
    })
  }

  async function handleAskKru() {
    setAskStatus('loading')
    const gen = await generalizeChallenge(observation.title, observation.situation)
    const text = gen.ok && gen.generalizedText
      ? gen.generalizedText
      : `${observation.title}\n\n${observation.situation}`
    const res = await submitConfusion('Student', text, 'other')
    setAskStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-black">{observation.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{dateLabel}</p>
        </div>
        <span
          className="text-gray-300 text-lg leading-none shrink-0 mt-0.5"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
        >›</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Situation</p>
            <p className="text-sm text-brand-black leading-relaxed">{observation.situation}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Your turn</p>
            <p className="text-sm text-brand-black leading-relaxed">{observation.yourTurn}</p>
          </div>
          <div className="flex items-center gap-4 pt-1 flex-wrap">
            {canAskKru ? (
              askStatus === 'sent' ? (
                <span className="text-xs font-semibold text-green-600">✓ Sent to Kru</span>
              ) : askStatus === 'error' ? (
                <span className="text-xs text-red-400">Failed — try again</span>
              ) : (
                <button
                  onClick={handleAskKru}
                  disabled={askStatus === 'loading'}
                  className="text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors disabled:opacity-40"
                >
                  {askStatus === 'loading' ? 'Sending…' : 'Ask Kru →'}
                </button>
              )
            ) : (
              <span className="text-xs text-gray-300 flex items-center gap-1">
                🔒 <span>Ask Kru — Gold only</span>
              </span>
            )}

            <span className="text-gray-200 text-xs">·</span>

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

export default function MyObservationList({
  observations,
  canAskKru = false,
}: {
  observations: MyObservation[]
  canAskKru?: boolean
}) {
  if (observations.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-gray-400">No observations saved yet.</p>
        <p className="text-xs text-gray-300 mt-1">Draft one from a journal entry.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {observations.map((o) => (
        <MyObservationRow key={o.id} observation={o} canAskKru={canAskKru} />
      ))}
    </div>
  )
}
