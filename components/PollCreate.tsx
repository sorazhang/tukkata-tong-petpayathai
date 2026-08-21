'use client'

import { useState, useTransition, useRef } from 'react'
import { createPoll } from '@/lib/poll-actions'
import { useRouter } from 'next/navigation'

interface OptionDraft {
  id: string
  label: string
  preview: string | null   // data URL for display
  file: File | null
}

function blankOption(): OptionDraft {
  return { id: crypto.randomUUID(), label: '', preview: null, file: null }
}

export default function PollCreate() {
  const router = useRouter()
  const [question, setQuestion]       = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions]         = useState<OptionDraft[]>([blankOption(), blankOption()])
  const [isPending, startTransition]  = useTransition()
  const [error, setError]             = useState('')
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function addOption() {
    setOptions((prev) => [...prev, blankOption()])
  }

  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id))
  }

  function updateLabel(id: string, label: string) {
    setOptions((prev) => prev.map((o) => o.id === id ? { ...o, label } : o))
  }

  function handleImageChange(id: string, file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setOptions((prev) =>
        prev.map((o) => o.id === id ? { ...o, preview: reader.result as string, file } : o)
      )
    }
    reader.readAsDataURL(file)
  }

  function removeImage(id: string) {
    setOptions((prev) => prev.map((o) => o.id === id ? { ...o, preview: null, file: null } : o))
  }

  async function fileToBase64(file: File): Promise<{ base64: string; mime: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        resolve({ base64: dataUrl.split(',')[1], mime: dataUrl.split(';')[0].split(':')[1] })
      }
      reader.readAsDataURL(file)
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    const valid = options.filter((o) => o.label.trim())
    if (valid.length < 2) { setError('Add at least 2 options.'); return }
    setError('')

    startTransition(async () => {
      const optionInputs = await Promise.all(
        valid.map(async (o) => {
          if (o.file) {
            const { base64, mime } = await fileToBase64(o.file)
            return { id: o.id, label: o.label, imageBase64: base64, imageMime: mime }
          }
          return { id: o.id, label: o.label }
        })
      )

      const res = await createPoll(question, description, optionInputs)
      if (res.ok && res.slug) {
        router.push(`/vote/${res.slug}`)
        router.refresh()
      } else {
        setError(res.error ?? 'Failed.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Question */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
          Question
        </label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Which logo do you prefer?"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
          Description <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any context for Kru…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-red"
        />
      </div>

      {/* Options */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-3">
          Options
        </label>
        <div className="space-y-3">
          {options.map((opt, i) => (
            <div key={opt.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-300 w-4 shrink-0">{i + 1}</span>
                <input
                  value={opt.label}
                  onChange={(e) => updateLabel(opt.id, e.target.value)}
                  placeholder={`Option ${i + 1} label`}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(opt.id)}
                    className="text-gray-300 hover:text-red-400 text-xl leading-none"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Image area */}
              {opt.preview ? (
                <div className="relative">
                  <img
                    src={opt.preview}
                    alt="Option preview"
                    className="w-full rounded-lg object-cover max-h-48"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(opt.id)}
                    className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRefs.current[opt.id]?.click()}
                  className="w-full text-xs text-gray-400 hover:text-brand-red border border-dashed border-gray-200 hover:border-brand-red rounded-lg py-3 transition-colors"
                >
                  + Add image (optional)
                </button>
              )}
              <input
                ref={(el) => { fileRefs.current[opt.id] = el }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleImageChange(opt.id, f)
                }}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addOption}
          className="mt-3 text-xs text-gray-400 hover:text-brand-red transition-colors"
        >
          + Add another option
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !question.trim()}
        className="w-full bg-brand-red text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-40"
      >
        {isPending ? 'Creating…' : 'Create poll'}
      </button>
    </form>
  )
}
