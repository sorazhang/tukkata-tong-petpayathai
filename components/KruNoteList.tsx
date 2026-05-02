'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateKruNote, deleteKruNote } from '@/lib/kru-notes-actions'
import type { KruNote } from '@/lib/kru-notes-actions'

function KruNoteRow({ note }: { note: KruNote }) {
  const router = useRouter()
  const [expanded, setExpanded]         = useState(false)
  const [editing, setEditing]           = useState(false)
  const [editText, setEditText]         = useState(note.text)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isPending, startTransition]    = useTransition()

  const date = new Date(note.createdAt)
  const dateLabel = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const timeLabel = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  function handleSaveEdit() {
    if (!editText.trim()) return
    startTransition(async () => {
      const res = await updateKruNote(note.id, editText)
      if (res.ok) { setEditing(false); router.refresh() }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const res = await deleteKruNote(note.id)
      if (res.ok) router.refresh()
    })
  }

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => { if (!editing) setExpanded((v) => !v) }}
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-black">{dateLabel}</p>
          {!expanded && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{note.text}</p>
          )}
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
                <button onClick={() => { setEditing(false); setEditText(note.text) }}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-3">
              <p className="text-sm text-brand-black leading-relaxed whitespace-pre-wrap">{note.text}</p>
              <div className="flex gap-3 mt-4 items-center">
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

export default function KruNoteList({ notes }: { notes: KruNote[] }) {
  if (notes.length === 0) return null

  return (
    <section className="space-y-2">
      {notes.map((note) => <KruNoteRow key={note.id} note={note} />)}
    </section>
  )
}
