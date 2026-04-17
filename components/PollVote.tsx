'use client'

import { useState, useTransition, useRef } from 'react'
import { savePollAnswer } from '@/lib/poll-actions'
import type { Poll } from '@/lib/polls'

export default function PollVote({ poll }: { poll: Poll }) {
  const existingAnswer = poll.answer

  const [selected, setSelected]         = useState<string>(existingAnswer?.optionId ?? '')
  const [customText, setCustomText]      = useState(existingAnswer?.customText ?? '')
  const [customImage, setCustomImage]    = useState<string | null>(existingAnswer?.customImageUrl ?? null)
  const [customImageFile, setCustomImageFile] = useState<File | null>(null)
  const [saveState, setSaveState]        = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isPending, startTransition]     = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)

  const isCustom = selected === 'custom'
  const answered = !!existingAnswer

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCustomImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setCustomImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (!selected) return
    startTransition(async () => {
      setSaveState('saving')

      let base64: string | undefined
      let mime: string | undefined
      if (customImageFile) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(customImageFile)
        })
        mime   = dataUrl.split(';')[0].split(':')[1]
        base64 = dataUrl.split(',')[1]
      }

      const res = await savePollAnswer(
        poll.slug,
        selected,
        isCustom ? customText : undefined,
        base64,
        mime,
      )

      setSaveState(res.ok ? 'saved' : 'error')
    })
  }

  return (
    <div className="space-y-3">

      {/* Regular options */}
      {poll.options.map((opt) => {
        const active = selected === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => { setSelected(opt.id); setSaveState('idle') }}
            className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
              active
                ? 'border-brand-red bg-red-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            {opt.imageUrl && (
              <img
                src={opt.imageUrl}
                alt={opt.label}
                className="w-full rounded-lg mb-3 object-cover max-h-56"
              />
            )}
            <p className={`text-sm font-semibold ${active ? 'text-brand-red' : 'text-brand-black'}`}>
              {active ? '● ' : '○ '}{opt.label}
            </p>
          </button>
        )
      })}

      {/* Custom / none of above option */}
      <button
        onClick={() => { setSelected('custom'); setSaveState('idle') }}
        className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
          isCustom
            ? 'border-brand-red bg-red-50'
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <p className={`text-sm font-semibold ${isCustom ? 'text-brand-red' : 'text-brand-black'}`}>
          {isCustom ? '● ' : '○ '}I don&apos;t like any of these — here&apos;s what I want
        </p>
      </button>

      {/* Custom input — expands when selected */}
      {isCustom && (
        <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
          <textarea
            value={customText}
            onChange={(e) => { setCustomText(e.target.value); setSaveState('idle') }}
            placeholder="Describe what you have in mind…"
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-brand-red"
          />

          {/* Image upload */}
          <div>
            {customImage ? (
              <div className="relative">
                <img
                  src={customImage}
                  alt="Reference"
                  className="w-full rounded-lg object-cover max-h-56"
                />
                <button
                  onClick={() => { setCustomImage(null); setCustomImageFile(null); setSaveState('idle') }}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded hover:bg-black/80"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs text-gray-400 hover:text-brand-red border border-dashed border-gray-300 hover:border-brand-red rounded-lg px-4 py-3 w-full transition-colors"
              >
                + Attach a photo as reference
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      )}

      {/* Previous answer note */}
      {answered && saveState === 'idle' && (
        <p className="text-xs text-gray-400">
          Previously answered · {new Date(existingAnswer!.savedAt).toLocaleDateString()}
        </p>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!selected || isPending}
        className="w-full bg-brand-red text-white py-3 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-40"
      >
        {saveState === 'saving' ? 'Saving…'
          : saveState === 'saved' ? '✓ Saved'
          : saveState === 'error' ? 'Error — try again'
          : 'Save answer'}
      </button>
    </div>
  )
}
