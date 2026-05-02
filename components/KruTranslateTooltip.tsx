'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { translateToThai } from '@/lib/translate-actions'

const PERSONA_KEY = 'tkt_persona'

export default function KruTranslateTooltip() {
  const [isKru, setIsKru]             = useState(false)
  const [pos, setPos]                 = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState('')
  const [translation, setTranslation] = useState('')
  const [loading, setLoading]         = useState(false)
  const tooltipRef                    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function sync() { setIsKru(localStorage.getItem(PERSONA_KEY) === 'kru') }
    sync()
    window.addEventListener('persona-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('persona-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    if (!isKru) return
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    if (!text || text.length < 2) { setPos(null); return }

    const range = selection!.getRangeAt(0)
    const rect  = range.getBoundingClientRect()
    setSelectedText(text)
    setTranslation('')
    setPos({
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY - 8,
    })
  }, [isKru])

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setPos(null)
        setTranslation('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleTranslate() {
    setLoading(true)
    const result = await translateToThai(selectedText)
    setLoading(false)
    if (result.ok) setTranslation(result.translation)
    else setTranslation('ไม่สามารถแปลได้')
  }

  if (!isKru || !pos) return null

  return (
    <div
      ref={tooltipRef}
      className="absolute z-[9999] -translate-x-1/2 -translate-y-full"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="bg-brand-black text-white rounded-xl shadow-xl px-3 py-2 text-sm max-w-xs">
        {!translation ? (
          <button
            onClick={handleTranslate}
            disabled={loading}
            className="flex items-center gap-1.5 font-semibold text-xs whitespace-nowrap disabled:opacity-50"
          >
            <span>🇹🇭</span>
            {loading ? 'กำลังแปล…' : 'แปล'}
          </button>
        ) : (
          <p className="font-thai leading-relaxed text-xs" lang="th">{translation}</p>
        )}
      </div>
      {/* Arrow */}
      <div className="w-2.5 h-2.5 bg-brand-black rotate-45 mx-auto -mt-1.5 rounded-sm" />
    </div>
  )
}
