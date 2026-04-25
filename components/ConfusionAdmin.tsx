'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markConfusionAnswered, deleteConfusion } from '@/lib/confusion-actions'
import type { Confusion, ConfusionTag } from '@/lib/confusion-actions'

const TAG_STYLES: Record<ConfusionTag, string> = {
  footwork: 'bg-blue-50 text-blue-600',
  striking: 'bg-red-50 text-red-600',
  clinch:   'bg-orange-50 text-orange-600',
  mental:   'bg-purple-50 text-purple-600',
  other:    'bg-gray-100 text-gray-500',
}

const TAGS: ConfusionTag[] = ['footwork', 'striking', 'clinch', 'mental', 'other']

function ConfusionRow({ c }: { c: Confusion }) {
  const router = useRouter()
  const [expanded, setExpanded]   = useState(false)
  const [slug, setSlug]           = useState('')
  const [isPending, startTransition] = useTransition()

  function handleAnswer() {
    startTransition(async () => {
      await markConfusionAnswered(c.id, slug || undefined)
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteConfusion(c.id)
      router.refresh()
    })
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${c.status === 'answered' ? 'border-green-100 opacity-60' : 'border-gray-200'}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TAG_STYLES[c.tag]}`}>{c.tag}</span>
            <span className="text-xs text-gray-400">{c.name}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
          </div>
          <p className={`text-sm font-medium text-brand-black ${!expanded ? 'truncate' : ''}`}>{c.text}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {c.status === 'answered' && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">Answered</span>
          )}
          <span className="text-gray-300 text-lg leading-none"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <p className="text-sm text-brand-black leading-relaxed whitespace-pre-wrap">{c.text}</p>

          {c.status === 'open' && (
            <div className="flex gap-2 items-center flex-wrap">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Challenge slug (optional)"
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-brand-red flex-1 min-w-0"
              />
              <button
                onClick={handleAnswer}
                disabled={isPending}
                className="px-4 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg disabled:opacity-40"
              >
                Mark answered
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          )}

          {c.challengeSlug && (
            <p className="text-xs text-gray-400">
              Linked to: <a href={`/review/${c.challengeSlug}`} className="text-brand-red hover:underline">{c.challengeSlug}</a>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function ConfusionAdmin({ confusions }: { confusions: Confusion[] }) {
  const [filter, setFilter] = useState<ConfusionTag | 'all' | 'open'>('open')

  const open     = confusions.filter((c) => c.status === 'open')
  const answered = confusions.filter((c) => c.status === 'answered')

  const filtered = filter === 'all' ? confusions
    : filter === 'open' ? open
    : confusions.filter((c) => c.tag === filter)

  const tagCounts = TAGS.reduce((acc, t) => {
    acc[t] = open.filter((c) => c.tag === t).length
    return acc
  }, {} as Record<ConfusionTag, number>)

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8 p-5 border border-gray-100 rounded-xl">
        <div>
          <p className="text-2xl font-bold text-brand-black">{confusions.length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Total</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-orange-500">{open.length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Open</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">{answered.length}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">Answered</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {([['open', `Open (${open.length})`], ['all', 'All']] as [string, string][]).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id as typeof filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === id ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
            {label}
          </button>
        ))}
        {TAGS.filter((t) => tagCounts[t] > 0).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === t ? 'bg-brand-black text-white' : `${TAG_STYLES[t]} hover:opacity-80`}`}>
            {t} ({tagCounts[t]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No confusions yet.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => <ConfusionRow key={c.id} c={c} />)}
        </div>
      )}
    </div>
  )
}
