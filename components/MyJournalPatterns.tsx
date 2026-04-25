'use client'

import { useState } from 'react'
import { surfacePatterns } from '@/lib/ai-journal-actions'
import type { PatternResult } from '@/lib/ai-journal-actions'
import { saveMyAnalysis } from '@/lib/my-analysis-actions'
import { useRouter } from 'next/navigation'

export default function MyJournalPatterns() {
  const router = useRouter()
  const [result, setResult]   = useState<PatternResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [entryCount, setEntryCount] = useState(0)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  async function handleFind() {
    setResult(null)
    setError(null)
    setSaved(false)
    setLoading(true)
    const res = await surfacePatterns()
    setLoading(false)
    if (res.ok && res.result) {
      setResult(res.result)
      setEntryCount(res.entryCount ?? 0)
    } else {
      setError(res.error ?? 'Something went wrong.')
    }
  }

  async function handleSave() {
    if (!result) return
    setSaving(true)
    const res = await saveMyAnalysis(result, entryCount)
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    }
  }

  return (
    <div className="border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-0.5">AI Analysis</p>
          <p className="text-sm font-semibold text-brand-black">Pattern surface</p>
          <p className="text-xs text-gray-400 mt-0.5">What is your training really about lately?</p>
        </div>
        <button
          onClick={handleFind}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40"
        >
          {loading ? <span className="animate-pulse">Analysing…</span> : <>✦ Find patterns</>}
        </button>
      </div>

      {error && <p className="text-sm text-gray-400">{error}</p>}

      {result && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            {result.themes.map((theme, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-brand-red font-bold text-sm mt-0.5">→</span>
                <div>
                  <p className="text-sm font-semibold text-brand-black">{theme.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{theme.description}</p>
                </div>
              </div>
            ))}
          </div>

          {result.progress && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Progress</p>
              <p className="text-sm text-brand-black leading-relaxed">{result.progress}</p>
            </div>
          )}

          <div className="p-3 bg-brand-red/5 rounded-lg border border-brand-red/10">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-1">Next session focus</p>
            <p className="text-sm text-brand-black leading-relaxed">{result.suggestion}</p>
          </div>

          <div className="pt-1">
            {saved ? (
              <p className="text-xs font-semibold text-green-600">✓ Saved to Insights</p>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-xs font-semibold text-brand-red hover:text-brand-red-dark transition-colors disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save to Insights'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
