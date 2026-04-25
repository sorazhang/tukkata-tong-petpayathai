'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveMyEntry } from '@/lib/my-journal-actions'
import type { JournalTag } from '@/lib/my-journal-actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any

const TAGS: { id: JournalTag; label: string }[] = [
  { id: 'footwork',  label: 'Footwork' },
  { id: 'striking',  label: 'Striking' },
  { id: 'clinch',    label: 'Clinch' },
  { id: 'mental',    label: 'Mental' },
  { id: 'other',     label: 'Other' },
]

export default function MyJournalEntry() {
  const router = useRouter()
  const [text, setText]              = useState('')
  const [tag, setTag]                = useState<JournalTag>('other')
  const [listening, setListening]    = useState(false)
  const [supported, setSupported]    = useState(true)
  const [lang, setLang]              = useState<'th-TH' | 'en-US'>('en-US')
  const [saveState, setSaveState]    = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()
  const recognitionRef               = useRef<AnyRecognition>(null)
  const finalTextRef                 = useRef<string>('')

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }
    recognitionRef.current = new SR()
    recognitionRef.current.continuous     = true
    recognitionRef.current.interimResults = true
    return () => recognitionRef.current?.abort()
  }, [])

  function startListening() {
    const r = recognitionRef.current
    if (!r) return
    r.abort()
    finalTextRef.current = text
    r.lang = lang
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalTextRef.current += t
        else interim = t
      }
      setText(finalTextRef.current + interim)
      setSaveState('idle')
    }
    r.onend = () => {
      if (r._shouldListen) {
        try { r.start() } catch (_) { setListening(false) }
      } else {
        setListening(false)
      }
    }
    r.onerror = () => { r._shouldListen = false; setListening(false) }
    r._shouldListen = true
    r.start()
    setListening(true)
  }

  function stopListening() {
    if (recognitionRef.current) recognitionRef.current._shouldListen = false
    recognitionRef.current?.stop()
    setListening(false)
  }

  function handleSave() {
    if (!text.trim()) return
    startTransition(async () => {
      setSaveState('saving')
      const res = await saveMyEntry(text, tag)
      if (res.ok) {
        setSaveState('saved')
        setText('')
        finalTextRef.current = ''
        stopListening()
        router.refresh()
      } else {
        setSaveState('error')
      }
    })
  }

  return (
    <div className="space-y-4">

      {/* Tag picker */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Tag</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTag(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                tag === t.id
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); finalTextRef.current = e.target.value; setSaveState('idle') }}
        placeholder="What did you notice today in training?"
        rows={7}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:border-brand-red"
      />

      <div className="flex items-center gap-2">

        {/* Language toggle */}
        {supported && (
          <button
            onClick={() => { if (listening) stopListening(); setLang((l) => l === 'th-TH' ? 'en-US' : 'th-TH') }}
            type="button"
            className="flex items-center gap-1 p-1 rounded-full border border-gray-200 bg-gray-100"
          >
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${lang === 'th-TH' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400'}`}>ไทย</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en-US' ? 'bg-white text-brand-black shadow-sm' : 'text-gray-400'}`}>EN</span>
          </button>
        )}

        {/* Mic */}
        {supported && (
          <button
            onClick={listening ? stopListening : startListening}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              listening ? 'bg-brand-red text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{listening ? '⏹' : '🎙'}</span>
            {listening ? 'Stop' : 'Speak'}
          </button>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!text.trim() || isPending}
          className="flex-1 bg-brand-red text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-40"
        >
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? '✓ Saved' : saveState === 'error' ? 'Error — try again' : 'Save'}
        </button>
      </div>

      {listening && (
        <p className="text-xs text-brand-red animate-pulse">
          Listening in {lang === 'th-TH' ? 'Thai' : 'English'}… speak now
        </p>
      )}
    </div>
  )
}
