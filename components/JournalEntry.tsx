'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveJournalEntry } from '@/lib/journal-actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any

export default function JournalEntry() {
  const router = useRouter()
  const [text, setText]               = useState('')
  const [listening, setListening]     = useState(false)
  const [supported, setSupported]     = useState(true)
  const [saveState, setSaveState]     = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isPending, startTransition]  = useTransition()
  const recognitionRef                = useRef<AnyRecognition>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
    if (!SR) { setSupported(false); return }

    const recognition = new SR()
    recognition.continuous     = true
    recognition.interimResults = true
    recognition.lang           = 'th-TH'

    let finalText = ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finalText += t
        else interim = t
      }
      setText(finalText + interim)
      setSaveState('idle')
    }

    recognition.onend  = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    return () => recognition.abort()
  }, [])

  function toggleListening() {
    const r = recognitionRef.current
    if (!r) return
    if (listening) {
      r.stop()
      setListening(false)
    } else {
      r.start()
      setListening(true)
    }
  }

  function handleSave() {
    if (!text.trim()) return
    startTransition(async () => {
      setSaveState('saving')
      const res = await saveJournalEntry(text)
      if (res.ok) {
        setSaveState('saved')
        setText('')
        if (recognitionRef.current && listening) {
          recognitionRef.current.stop()
          setListening(false)
        }
        router.refresh()
      } else {
        setSaveState('error')
      }
    })
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSaveState('idle') }}
        placeholder="What did you observe today? Speak or type — in Thai or English."
        rows={8}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:border-brand-red"
        lang="th"
      />

      <div className="flex items-center gap-3">
        {supported ? (
          <button
            onClick={toggleListening}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              listening
                ? 'bg-brand-red text-white animate-pulse'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="text-base">{listening ? '⏹' : '🎙'}</span>
            {listening ? 'Stop' : 'Speak'}
          </button>
        ) : (
          <span className="text-xs text-gray-400">Voice not supported on this browser</span>
        )}

        <button
          onClick={handleSave}
          disabled={!text.trim() || isPending}
          className="flex-1 bg-brand-red text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-red-dark transition-colors disabled:opacity-40"
        >
          {saveState === 'saving' ? 'Saving…'
            : saveState === 'saved' ? '✓ Saved'
            : saveState === 'error' ? 'Error — try again'
            : 'Save'}
        </button>
      </div>

      {listening && (
        <p className="text-xs text-brand-red animate-pulse">Listening… speak now</p>
      )}
    </div>
  )
}
