'use client'

import { useState, useTransition } from 'react'
import { saveChallenge } from '@/lib/actions'

interface Props {
  slug: string
  initialSituation: string
  initialYourTurn: string
  initialSolution: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ChallengeEditor({
  slug,
  initialSituation,
  initialYourTurn,
  initialSolution,
}: Props) {
  const [situation, setSituation] = useState(initialSituation)
  const [yourTurn, setYourTurn]   = useState(initialYourTurn)
  const [solution, setSolution]   = useState(initialSolution)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [errorMsg, setErrorMsg]   = useState('')
  const [isPending, startTransition] = useTransition()

  const isDirty =
    situation !== initialSituation ||
    yourTurn  !== initialYourTurn  ||
    solution  !== initialSolution

  function handleSave() {
    setSaveState('saving')
    startTransition(async () => {
      const res = await saveChallenge(slug, situation, yourTurn, solution)
      if (res.ok) {
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 3000)
      } else {
        setSaveState('error')
        setErrorMsg(res.error ?? 'Unknown error')
      }
    })
  }

  return (
    <div className="border-t border-gray-100 divide-y divide-gray-100">
      {/* Situation */}
      <div className="px-5 py-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
          Situation
        </label>
        <textarea
          value={situation}
          onChange={(e) => { setSituation(e.target.value); setSaveState('idle') }}
          rows={5}
          placeholder="Describe the situation a fighter is in — what they feel, what is going wrong…"
          className="w-full text-sm text-gray-800 leading-relaxed border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-brand-red resize-y font-sans"
        />
      </div>

      {/* Your Turn */}
      <div className="px-5 py-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
          Your Turn
        </label>
        <textarea
          value={yourTurn}
          onChange={(e) => { setYourTurn(e.target.value); setSaveState('idle') }}
          rows={5}
          placeholder="What should the fighter go try? Give them a specific drill or observation task…"
          className="w-full text-sm text-gray-800 leading-relaxed border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-brand-red resize-y font-sans"
        />
      </div>

      {/* Solution */}
      <div className="px-5 py-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
          Solution
          {!solution.trim() && (
            <span className="text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded text-xs normal-case tracking-normal font-semibold">
              Needs your answer
            </span>
          )}
        </label>
        <textarea
          value={solution}
          onChange={(e) => { setSolution(e.target.value); setSaveState('idle') }}
          rows={10}
          placeholder="What actually works and why. The understanding most coaches never put into words…"
          className="w-full text-sm text-gray-800 leading-relaxed border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-brand-red resize-y font-sans"
        />
      </div>

      {/* Save bar */}
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between gap-4">
        <div className="text-sm">
          {saveState === 'saved' && (
            <span className="text-green-600 font-medium">Saved.</span>
          )}
          {saveState === 'error' && (
            <span className="text-red-600 font-medium">{errorMsg}</span>
          )}
          {saveState === 'idle' && isDirty && (
            <span className="text-gray-400 text-xs">Unsaved changes</span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending || !isDirty}
          className={`px-5 py-2 rounded text-sm font-semibold transition-all ${
            isPending
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isDirty
              ? 'bg-brand-red text-white hover:bg-brand-red-dark'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
