'use client'

import { useState } from 'react'

export default function SeminarCaptionBox({ caption }: { caption: string }) {
  const [label, setLabel] = useState('Copy')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(caption)
      setLabel('Copied')
    } catch {
      setLabel("Couldn't copy — select & copy")
    }
    setTimeout(() => setLabel('Copy'), 1600)
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          IG Caption &amp; Hashtags
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-semibold bg-brand-black text-white px-3 py-1 rounded hover:bg-brand-red transition-colors"
        >
          {label}
        </button>
      </div>
      <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 rounded-lg p-3 leading-relaxed">
        {caption}
      </p>
    </div>
  )
}
