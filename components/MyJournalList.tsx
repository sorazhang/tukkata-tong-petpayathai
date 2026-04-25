'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateMyEntry, deleteMyEntry } from '@/lib/my-journal-actions'
import type { MyEntry, JournalTag } from '@/lib/my-journal-actions'

const TAG_STYLES: Record<JournalTag, string> = {
  footwork: 'bg-blue-50 text-blue-600',
  striking: 'bg-red-50 text-red-600',
  clinch:   'bg-orange-50 text-orange-600',
  mental:   'bg-purple-50 text-purple-600',
  other:    'bg-gray-100 text-gray-500',
}

const TAGS: { id: JournalTag; label: string }[] = [
  { id: 'footwork', label: 'Footwork' },
  { id: 'striking', label: 'Striking' },
  { id: 'clinch',   label: 'Clinch' },
  { id: 'mental',   label: 'Mental' },
  { id: 'other',    label: 'Other' },
]

function MyJournalRow({ entry }: { entry: MyEntry }) {
  const router = useRouter()
  const [expanded, setExpanded]     = useState(false)
  const [editing, setEditing]       = useState(false)
  const [editText, setEditText]     = useState(entry.text)
  const [editTag, setEditTag]       = useState<JournalTag>(entry.tag)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  const date = new Date(entry.createdAt)
  const dateLabel = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const timeLabel = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  function handleSaveEdit() {
    if (!editText.trim()) return
    startTransition(async () => {
      const res = await updateMyEntry(entry.id, editText, editTag)
      if (res.ok) { setEditing(false); router.refresh() }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteMyEntry(entry.id)
      if (res.ok) router.refresh()
    })
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => { if (!editing) setExpanded((v) => !v) }}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${TAG_STYLES[entry.tag]}`}>
            {entry.tag}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-black">{dateLabel}</p>
            {!expanded && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{entry.text}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400">{timeLabel}</span>
          <span className="text-gray-300 text-lg leading-none"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {editing ? (
            <div className="pt-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {TAGS.map((t) => (
                  <button key={t.id} type="button" onClick={() => setEditTag(t.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${editTag === t.id ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={5} autoFocus
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-brand-red"
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} disabled={isPending || !editText.trim()}
                  className="px-4 py-2 bg-brand-red text-white text-xs font-semibold rounded-lg disabled:opacity-40">
                  {isPending ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => { setEditing(false); setEditText(entry.text); setEditTag(entry.tag) }}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3">
              <p className="text-sm text-brand-black leading-relaxed whitespace-pre-wrap">{entry.text}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-brand-black transition-colors">Edit</button>
                {confirmDelete ? (
                  <span className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Delete?</span>
                    <button onClick={handleDelete} disabled={isPending} className="text-red-500 font-semibold hover:text-red-700">Yes</button>
                    <button onClick={() => setConfirmDelete(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
                  </span>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Delete</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MyJournalList({ entries }: { entries: MyEntry[] }) {
  const [filterTag, setFilterTag] = useState<JournalTag | 'all'>('all')

  if (entries.length === 0) return null

  const counts = TAGS.reduce((acc, t) => {
    acc[t.id] = entries.filter((e) => e.tag === t.id).length
    return acc
  }, {} as Record<JournalTag, number>)

  const filtered = filterTag === 'all' ? entries : entries.filter((e) => e.tag === filterTag)

  return (
    <section>
      {/* Tag filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterTag('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterTag === 'all' ? 'bg-brand-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          All ({entries.length})
        </button>
        {TAGS.filter((t) => counts[t.id] > 0).map((t) => (
          <button key={t.id} onClick={() => setFilterTag(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filterTag === t.id ? 'bg-brand-black text-white' : `${TAG_STYLES[t.id]} hover:opacity-80`}`}
          >
            {t.label} ({counts[t.id]})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((entry) => <MyJournalRow key={entry.id} entry={entry} />)}
      </div>
    </section>
  )
}
