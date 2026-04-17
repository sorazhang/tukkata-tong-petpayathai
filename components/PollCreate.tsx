'use client'

import { useState, useTransition } from 'react'
import { createPoll } from '@/lib/poll-actions'
import { useRouter } from 'next/navigation'
import type { PollOption } from '@/lib/polls'

export default function PollCreate() {
  const router = useRouter()
  const [question, setQuestion]     = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions]       = useState<PollOption[]>([
    { id: crypto.randomUUID(), label: '', imageUrl: '' },
    { id: crypto.randomUUID(), label: '', imageUrl: '' },
  ])
  const [isPending, startTransition] = useTransition()
  const [error, setError]           = useState('')

  function addOption() {
    setOptions((prev) => [...prev, { id: crypto.randomUUID(), label: '', imageUrl: '' }])
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id))
  }

  function updateOption(id: string, field: 'label' | 'imageUrl', value: string) {
    setOptions((prev) => prev.map((o) => o.id === id ? { ...o, [field]: value } : o))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    const validOptions = options.filter((o) => o.label.trim())
    if (validOptions.length < 2) { setError('Add at least 2 options.'); return }
    setError('')

    startTransition(async () => {
      const cleaned = validOptions.map((o) => ({
        id:       o.id,
        label:    o.label.trim(),
        ...(o.imageUrl?.trim() && { imageUrl: o.imageUrl.trim() }),
      }))
      const res = await createPoll(question, description, cleaned)
      if (res.ok && res.slug) {
        router.push(`/vote/${res.slug}`)
        router.refresh()
      } else {
        setError(res.error ?? 'Failed.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
          Question
        </label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Which logo do you prefer?"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
        />
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
          Description <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any context for Kru…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
        />
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
          Options
        </label>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <div key={opt.id} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1">
                <input
                  value={opt.label}
                  onChange={(e) => updateOption(opt.id, 'label', e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                />
                <input
                  value={opt.imageUrl ?? ''}
                  onChange={(e) => updateOption(opt.id, 'imageUrl', e.target.value)}
                  placeholder="Image URL (optional)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 focus:outline-none focus:border-brand-red"
                />
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(opt.id)}
                  className="text-gray-300 hover:text-red-400 text-lg leading-none mt-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          className="mt-2 text-xs text-gray-400 hover:text-brand-red transition-colors"
        >
          + Add option
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !question.trim()}
        className="w-full bg-brand-red text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-40"
      >
        {isPending ? 'Creating…' : 'Create poll & copy link'}
      </button>
    </form>
  )
}
