'use client'

import { useState, useEffect } from 'react'
import KruNoteEntry from './KruNoteEntry'

const PERSONA_KEY = 'tkt_persona'

export default function KruQuickCapture() {
  const [isKru, setIsKru]       = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    function sync() {
      setIsKru(localStorage.getItem(PERSONA_KEY) === 'kru')
    }
    sync()
    setHydrated(true)
    window.addEventListener('persona-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('persona-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (!hydrated || !isKru) return null

  return (
    <div className="bg-brand-card border-b border-brand-card-edge">
      <div className="max-w-2xl mx-auto px-6 py-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
          Quick note
        </p>
        <KruNoteEntry />
      </div>
    </div>
  )
}
