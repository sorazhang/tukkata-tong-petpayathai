'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMyChallenge } from '@/lib/my-challenge-actions'
import { submitConfusion } from '@/lib/confusion-actions'
import { generalizeChallenge } from '@/lib/ai-journal-actions'
import type { MyChallenge } from '@/lib/my-challenge-actions'

function MyChallengeRow({
  challenge,
  canAskKru,
}: {
  challenge: MyChallenge
  canAskKru: boolean
}) {
  const router = useRouter()
  const [expanded, setExpanded]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition]      = useTransition()
  const [askStatus, setAskStatus]         = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  const dateLabel = new Date(challenge.createdAt).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteMyChallenge(challenge.id)
      if (res.ok) router.refresh()
    })
  }

  async function handleAskKru() {
    setAskStatus('loading')
    const gen = await generalizeChallenge(challenge.title, challenge.situation)
    const text = gen.ok && gen.generalizedText
      ? gen.generalizedText
      : `${challenge.title}\n\n${challenge.situation}`
    const res = await submitConfusion('Student', text, 'other')
    setAskStatus(res.ok ? 'sent' : 'error')
  }

  return (
    <div className="border border-brand-card-edge rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-brand-card transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-bone">{challenge.title}</p>
          <p className="text-xs text-brand-muted mt-0.5">{dateLabel}</p>
        </div>
        <span
          className="text-brand-bone-dim text-lg leading-none shrink-0 mt-0.5"
          style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
        >›</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-brand-card-edge pt-3 space-y-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-1">Situation</p>
            <p className="text-sm text-brand-bone leading-relaxed">{challenge.situation}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-1">Your turn</p>
            <p className="text-sm text-brand-bone leading-relaxed">{challenge.yourTurn}</p>
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
              <span className="text-xs text-brand-bone-dim flex items-center gap-1">
                🔒 <span>Ask Kru — Gold only</span>
              </span>
            )}

            <span className="text-brand-bone-dim text-xs">·</span>

            {confirmDelete ? (
              <span className="flex items-center gap-2 text-xs">
                <span className="text-brand-muted">Delete?</span>
                <button onClick={handleDelete} disabled={isPending} className="text-red-500 font-semibold hover:text-red-700">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="text-brand-muted hover:text-brand-bone-dim">Cancel</button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-brand-muted hover:text-red-500 transition-colors"
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

export default function MyChallengeList({
  challenges,
  canAskKru = false,
}: {
  challenges: MyChallenge[]
  canAskKru?: boolean
}) {
  if (challenges.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-brand-muted">No challenges saved yet.</p>
        <p className="text-xs text-brand-bone-dim mt-1">Draft one from a journal entry.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {challenges.map((c) => (
        <MyChallengeRow key={c.id} challenge={c} canAskKru={canAskKru} />
      ))}
    </div>
  )
}
