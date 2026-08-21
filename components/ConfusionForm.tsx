'use client'

import { useState, useTransition } from 'react'
import { submitConfusion } from '@/lib/confusion-actions'
import type { ConfusionTag } from '@/lib/confusion-actions'

const TAGS: { id: ConfusionTag; label: string; description: string }[] = [
  { id: 'footwork', label: 'Footwork',  description: 'Movement, angles, distance' },
  { id: 'striking', label: 'Striking',  description: 'Punches, kicks, timing' },
  { id: 'clinch',   label: 'Clinch',    description: 'Inside range, knees, control' },
  { id: 'mental',   label: 'Mental',    description: 'Pressure, nerves, strategy' },
  { id: 'other',    label: 'Other',     description: 'Anything else' },
]

export default function ConfusionForm() {
  const [name, setName]       = useState('')
  const [text, setText]       = useState('')
  const [tag, setTag]         = useState<ConfusionTag>('other')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]     = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    startTransition(async () => {
      const res = await submitConfusion(name, text, tag)
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError(res.error ?? 'Something went wrong.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <p className="text-3xl mb-4">🙏</p>
        <h2 className="text-xl font-bold text-brand-black mb-2">Got it.</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Kru will see this. If enough students share the same confusion, it becomes the next challenge he answers.
        </p>
        <button
          onClick={() => { setSubmitted(false); setText(''); setName('') }}
          className="mt-6 text-xs text-gray-400 hover:text-brand-red transition-colors"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Name */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
          Your name <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="How Kru knows you"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
        />
      </div>

      {/* Tag */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
          What area?
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTag(t.id)}
              className={`text-left px-3 py-2.5 rounded-xl border-2 transition-all ${
                tag === t.id
                  ? 'border-brand-red bg-red-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <p className={`text-xs font-bold ${tag === t.id ? 'text-brand-red' : 'text-brand-black'}`}>{t.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Confusion */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
          What is confusing you?
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the situation. When does it happen? What do you try? What goes wrong?"
          rows={6}
          autoFocus
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:border-brand-red"
        />
        <p className="text-xs text-gray-400 mt-1">The more specific, the more useful Kru&apos;s answer will be.</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!text.trim() || isPending}
        className="w-full bg-brand-red text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-40"
      >
        {isPending ? 'Submitting…' : 'Submit to Kru'}
      </button>
    </form>
  )
}
