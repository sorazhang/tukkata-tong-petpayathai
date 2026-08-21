'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateJournalEntry, deleteJournalEntry } from '@/lib/journal-actions'

interface Entry {
  id: string
  text: string
  createdAt: string
}

function JournalRow({ entry }: { entry: Entry }) {
  const router = useRouter()
  const [expanded, setExpanded]   = useState(false)
  const [editing, setEditing]     = useState(false)
  const [editText, setEditText]   = useState(entry.text)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  const date = new Date(entry.createdAt)
  const dateLabel = date.toLocaleDateString('th-TH', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
  const timeLabel = date.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit',
  })

  function handleSaveEdit() {
    if (!editText.trim()) return
    startTransition(async () => {
      const res = await updateJournalEntry(entry.id, editText)
      if (res.ok) { setEditing(false); router.refresh() }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteJournalEntry(entry.id)
      if (res.ok) router.refresh()
    })
  }

  return (
    <div className="border border-brand-card-edge rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => { if (!editing) setExpanded((v) => !v) }}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-4 hover:bg-brand-card transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-bone">{dateLabel}</p>
          {!expanded && (
            <p className="text-xs text-brand-muted mt-0.5 truncate">{entry.text}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-brand-muted">{timeLabel}</span>
          <span className="text-brand-bone-dim text-lg leading-none"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-brand-card-edge">
          {editing ? (
            <div className="pt-3 space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={5}
                autoFocus
                className="w-full text-sm border border-brand-card-edge rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-brand-red"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isPending || !editText.trim()}
                  className="px-4 py-2 bg-brand-red text-white text-xs font-semibold rounded-lg disabled:opacity-40"
                >
                  {isPending ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(false); setEditText(entry.text) }}
                  className="px-4 py-2 text-xs text-brand-muted hover:text-brand-bone-dim"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3">
              <p className="text-sm text-brand-bone leading-relaxed whitespace-pre-wrap">
                {entry.text}
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-brand-muted hover:text-brand-bone transition-colors"
                >
                  Edit
                </button>
                {confirmDelete ? (
                  <span className="flex items-center gap-2 text-xs">
                    <span className="text-brand-muted">Delete this entry?</span>
                    <button
                      onClick={handleDelete}
                      disabled={isPending}
                      className="text-red-500 font-semibold hover:text-red-700"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-brand-muted hover:text-brand-bone-dim"
                    >
                      Cancel
                    </button>
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
      )}
    </div>
  )
}

export default function JournalList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">
        Previous entries ({entries.length})
      </h2>
      <div className="space-y-2">
        {entries.map((entry) => (
          <JournalRow key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  )
}
