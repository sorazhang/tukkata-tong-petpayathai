'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Confusion } from '@/lib/confusion-actions'
import type { Challenge } from '@/lib/content'
import type { Poll } from '@/lib/polls'
import type { KruNote } from '@/lib/kru-notes-actions'
import KruNoteEntry from './KruNoteEntry'
import KruNoteList from './KruNoteList'

type Tab = 'vote' | 'questions' | 'challenges' | 'notes'

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  )
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="ml-1.5 text-xs bg-brand-red text-white px-1.5 py-0.5 rounded-full align-middle">
      {count}
    </span>
  )
}

export default function KruDashboard({
  openQuestions,
  needsAnswer,
  pendingPolls,
  notes,
}: {
  openQuestions: Confusion[]
  needsAnswer: Challenge[]
  pendingPolls: Poll[]
  notes: KruNote[]
}) {
  const [tab, setTab] = useState<Tab>('vote')

  const totalPending = openQuestions.length + needsAnswer.length + pendingPolls.length

  return (
    <main className="max-w-2xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">Kru</p>
        <h1 className="text-3xl font-bold text-brand-black">
          {totalPending > 0 ? `${totalPending} items waiting` : 'All caught up'}
        </h1>
        <p className="text-gray-400 text-sm mt-2">
          {totalPending > 0
            ? 'These need your input before students can move forward.'
            : 'Nothing pending right now.'}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8">
        {([
          { key: 'vote',       label: 'Vote',       count: pendingPolls.length   },
          { key: 'questions',  label: 'Questions',  count: openQuestions.length  },
          { key: 'challenges', label: 'Challenges', count: needsAnswer.length    },
          { key: 'notes',      label: 'Notes',      count: 0                     },
        ] as { key: Tab; label: string; count: number }[]).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {label}
            <Badge count={count} />
          </button>
        ))}
      </div>

      {/* Vote */}
      {tab === 'vote' && (
        pendingPolls.length === 0 ? (
          <EmptyState message="No votes waiting." />
        ) : (
          <div className="space-y-2">
            {pendingPolls.map((p) => (
              <Link
                key={p.slug}
                href={`/vote/${p.slug}`}
                className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl px-5 py-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-brand-black">{p.question}</p>
                  {p.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                  Waiting
                </span>
              </Link>
            ))}
          </div>
        )
      )}

      {/* Questions */}
      {tab === 'questions' && (
        openQuestions.length === 0 ? (
          <EmptyState message="No open questions." />
        ) : (
          <div className="space-y-2">
            {openQuestions.map((q) => (
              <div
                key={q.id}
                className="border border-gray-200 rounded-xl px-5 py-4"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-brand-black">{q.name}</span>
                    <span className="text-gray-200 text-xs">·</span>
                    <span className="text-xs text-gray-400 capitalize">{q.tag}</span>
                    <span className="text-gray-200 text-xs">·</span>
                    <span className="text-xs text-gray-400">
                      {new Date(q.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-brand-red bg-red-50 px-2 py-0.5 rounded shrink-0">
                    Open
                  </span>
                </div>
                <p className="text-sm text-brand-black leading-relaxed">{q.text}</p>
              </div>
            ))}
            <div className="pt-2 text-right">
              <Link href="/confusions" className="text-xs text-brand-red font-semibold hover:underline">
                Manage all questions →
              </Link>
            </div>
          </div>
        )
      )}

      {/* Challenges */}
      {tab === 'challenges' && (
        needsAnswer.length === 0 ? (
          <EmptyState message="All challenges have an answer." />
        ) : (
          <div className="space-y-2">
            {needsAnswer.map((c) => (
              <Link
                key={c.slug}
                href={`/review/${c.slug}`}
                className="flex items-center justify-between gap-4 border border-gray-200 rounded-xl px-5 py-4 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-brand-black">{c.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{c.category} · {c.difficulty}</p>
                </div>
                <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded shrink-0">
                  Needs answer
                </span>
              </Link>
            ))}
            <div className="pt-2 text-right">
              <Link href="/review" className="text-xs text-brand-red font-semibold hover:underline">
                Full review →
              </Link>
            </div>
          </div>
        )
      )}

      {/* Notes */}
      {tab === 'notes' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-xl p-5">
            <KruNoteEntry />
          </div>
          {notes.length > 0 && <KruNoteList notes={notes} />}
        </div>
      )}

    </main>
  )
}
