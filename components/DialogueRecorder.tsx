'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  saveDialogue,
  deleteDialogue,
  translateKruTurn,
  type Dialogue,
  type DialogueTurn,
  type Speaker,
} from '@/lib/dialogue-actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any

const LANG: Record<Speaker, string> = { me: 'en-US', kru: 'th-TH' }
const LABEL: Record<Speaker, string> = { me: 'Me', kru: 'Kru' }

interface LiveTurn {
  speaker: Speaker
  at: string
  final: string
  interim: string
}

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function offset(at: string, start: string | undefined) {
  if (!start) return '00:00'
  const s = Math.max(0, Math.round((new Date(at).getTime() - new Date(start).getTime()) / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mmss = `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return h > 0 ? `${h}:${mmss}` : mmss
}

function toMarkdown(title: string, createdAt: string, turns: DialogueTurn[]) {
  const start = turns[0]?.at
  const lines = [
    `# ${title}`,
    '',
    `- Date: ${createdAt ? new Date(createdAt).toLocaleString() : ''}`,
    `- Participants: Me (English), Kru (Thai)`,
    `- Turns: ${turns.length}`,
    '',
    '---',
    '',
  ]
  for (const t of turns) {
    const tag = t.speaker === 'kru' ? 'Kru (TH)' : 'Me (EN)'
    lines.push(`**[${offset(t.at, start)}] ${tag}:** ${t.text}`)
    if (t.speaker === 'kru' && t.translation) lines.push(`> EN: ${t.translation}`)
    lines.push('')
  }
  return lines.join('\n')
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'dialogue'
}

export default function DialogueRecorder({ initial }: { initial: Dialogue }) {
  const router = useRouter()
  const [title, setTitle]         = useState(initial.title)
  const [turns, setTurns]         = useState<DialogueTurn[]>(initial.turns)
  const [live, setLive]           = useState<LiveTurn | null>(null)
  const [supported, setSupported] = useState(true)
  const [micError, setMicError]   = useState<string | null>(null)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [translating, setTranslating] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText]   = useState('')
  const [typed, setTyped]         = useState('')
  const [copied, setCopied]       = useState(false)

  const recRef     = useRef<AnyRecognition>(null)
  const liveRef    = useRef<LiveTurn | null>(null)
  const tokenRef   = useRef(0)
  const turnsRef   = useRef(turns)
  const wakeRef    = useRef<AnyRecognition>(null)
  const firstRun   = useRef(true)
  const bottomRef  = useRef<HTMLDivElement>(null)

  turnsRef.current = turns

  // ── Speech support ────────────────────────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    if (!(w.SpeechRecognition ?? w.webkitSpeechRecognition)) setSupported(false)
    return () => { tokenRef.current++; recRef.current?.abort() }
  }, [])

  // ── Autosave (debounced) + local backup ──────────────────────────────────
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    try {
      localStorage.setItem(`tkt_dialogue_${initial.id}`, JSON.stringify({ title, turns }))
    } catch { /* storage unavailable */ }
    setSaveState('saving')
    const t = setTimeout(async () => {
      const res = await saveDialogue(initial.id, { title, turns })
      setSaveState(res.ok ? 'saved' : 'error')
    }, 800)
    return () => clearTimeout(t)
  }, [title, turns, initial.id])

  // Keep the newest turn in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns.length, live?.speaker])

  // ── Translation ──────────────────────────────────────────────────────────
  const translate = useCallback(async (turnId: string) => {
    const list = turnsRef.current
    const idx  = list.findIndex((t) => t.id === turnId)
    if (idx < 0) return
    const turn = list[idx]
    const prevQ = [...list.slice(0, idx)].reverse().find((t) => t.speaker === 'me')?.text
    setTranslating((s) => new Set(s).add(turnId))
    const res = await translateKruTurn(turn.text, prevQ)
    setTranslating((s) => { const n = new Set(s); n.delete(turnId); return n })
    if (res.ok) {
      setTurns((ts) => ts.map((t) => (t.id === turnId ? { ...t, translation: res.translation } : t)))
    }
  }, [])

  // ── Recording ────────────────────────────────────────────────────────────
  const commitLive = useCallback(() => {
    const l = liveRef.current
    liveRef.current = null
    setLive(null)
    if (!l) return
    const text = `${l.final} ${l.interim}`.replace(/\s+/g, ' ').trim()
    if (!text) return
    const turn: DialogueTurn = {
      id: newId(), speaker: l.speaker, lang: LANG[l.speaker], text, translation: null, at: l.at,
    }
    turnsRef.current = [...turnsRef.current, turn]
    setTurns(turnsRef.current)
    if (turn.speaker === 'kru') translate(turn.id)
  }, [translate])

  const stopListening = useCallback(() => {
    tokenRef.current++               // ignore any late events from the old recogniser
    try { recRef.current?.abort() } catch { /* noop */ }
    recRef.current = null
    commitLive()
    wakeRef.current?.release?.().catch(() => {})
    wakeRef.current = null
  }, [commitLive])

  const startListening = useCallback((speaker: Speaker) => {
    // Tapping the active speaker again ends their turn
    if (liveRef.current?.speaker === speaker) { stopListening(); return }
    // Switching speaker: close the current turn first
    if (liveRef.current) stopListening()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition
    if (!SR) return

    setMicError(null)
    const token = ++tokenRef.current
    const rec   = new SR()
    rec.lang            = LANG[speaker]
    rec.continuous      = true
    rec.interimResults  = true
    recRef.current      = rec

    const l: LiveTurn = { speaker, at: new Date().toISOString(), final: '', interim: '' }
    liveRef.current = l
    setLive({ ...l })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      if (token !== tokenRef.current || !liveRef.current) return
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) liveRef.current.final += (liveRef.current.final ? ' ' : '') + t.trim()
        else interim += t
      }
      liveRef.current.interim = interim
      setLive({ ...liveRef.current })
    }
    // Browsers stop after silence — keep listening until the user ends the turn
    rec.onend = () => {
      if (token !== tokenRef.current) return
      if (liveRef.current) {
        liveRef.current.final = `${liveRef.current.final} ${liveRef.current.interim}`.trim()
        liveRef.current.interim = ''
      }
      try { rec.start() } catch { stopListening() }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (e: any) => {
      if (token !== tokenRef.current) return
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setMicError('Microphone access was blocked. Allow the mic for this site and try again.')
        stopListening()
      } else if (e.error === 'language-not-supported') {
        setMicError(`This browser can't recognise ${speaker === 'kru' ? 'Thai' : 'English'}. Try Chrome.`)
        stopListening()
      }
      // 'no-speech' / 'network' / 'aborted': onend will restart
    }

    try { rec.start() } catch { /* already started */ }

    // Keep the phone screen awake while recording
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nav = navigator as any
    if (!wakeRef.current && nav.wakeLock) {
      nav.wakeLock.request('screen').then((lock: AnyRecognition) => { wakeRef.current = lock }).catch(() => {})
    }
  }, [stopListening])

  // ── Turn editing ─────────────────────────────────────────────────────────
  function addTyped(speaker: Speaker) {
    const text = typed.trim()
    if (!text) return
    const turn: DialogueTurn = {
      id: newId(), speaker, lang: LANG[speaker], text, translation: null, at: new Date().toISOString(),
    }
    turnsRef.current = [...turnsRef.current, turn]
    setTurns(turnsRef.current)
    setTyped('')
    if (speaker === 'kru') translate(turn.id)
  }

  function saveEdit(id: string) {
    const text = editText.trim()
    setEditingId(null)
    if (!text) return
    const before = turnsRef.current.find((t) => t.id === id)
    turnsRef.current = turnsRef.current.map((t) =>
      t.id === id ? { ...t, text, translation: t.text === text ? t.translation : null } : t,
    )
    setTurns(turnsRef.current)
    if (before?.speaker === 'kru' && before.text !== text) translate(id)
  }

  function swapSpeaker(id: string) {
    turnsRef.current = turnsRef.current.map((t) => {
      if (t.id !== id) return t
      const speaker: Speaker = t.speaker === 'me' ? 'kru' : 'me'
      return { ...t, speaker, lang: LANG[speaker], translation: null }
    })
    setTurns(turnsRef.current)
    if (turnsRef.current.find((t) => t.id === id)?.speaker === 'kru') translate(id)
  }

  function removeTurn(id: string) {
    if (!confirm('Delete this turn?')) return
    setTurns((ts) => ts.filter((t) => t.id !== id))
  }

  async function handleDeleteSession() {
    if (!confirm('Delete this whole conversation? This cannot be undone.')) return
    stopListening()
    const res = await deleteDialogue(initial.id)
    if (res.ok) {
      try { localStorage.removeItem(`tkt_dialogue_${initial.id}`) } catch { /* noop */ }
      router.push('/dialogue')
      router.refresh()
    }
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(toMarkdown(title, initial.createdAt, turns))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const start = turns[0]?.at ?? live?.at
  const untranslated = turns.filter((t) => t.speaker === 'kru' && !t.translation && !translating.has(t.id))

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-64">
      <div className="flex items-center justify-between text-xs mb-3">
        <Link href="/dialogue" className="text-gray-400 hover:text-brand-black">← All conversations</Link>
        <span className={saveState === 'error' ? 'text-brand-red' : 'text-gray-400'}>
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? '✓ Saved' : saveState === 'error' ? 'Save failed — kept on this device' : ''}
        </span>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-2xl font-bold text-brand-black bg-transparent border-b border-transparent focus:border-gray-200 focus:outline-none pb-1"
      />
      <p className="text-xs text-gray-400 mt-1">
        {initial.createdAt ? new Date(initial.createdAt).toLocaleString() : ''} · {turns.length} turns
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={copyMarkdown} disabled={!turns.length} className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-40">
          {copied ? '✓ Copied' : 'Copy transcript'}
        </button>
        <button onClick={() => download(`${slug(title)}.md`, toMarkdown(title, initial.createdAt, turns), 'text/markdown')} disabled={!turns.length} className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-40">
          Download .md
        </button>
        <button onClick={() => download(`${slug(title)}.json`, JSON.stringify({ title, createdAt: initial.createdAt, turns }, null, 2), 'application/json')} disabled={!turns.length} className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-40">
          Download .json
        </button>
        {untranslated.length > 0 && (
          <button onClick={() => untranslated.forEach((t) => translate(t.id))} className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 hover:bg-gray-200">
            Translate {untranslated.length} missing
          </button>
        )}
        <button onClick={handleDeleteSession} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-brand-red ml-auto">
          Delete
        </button>
      </div>

      {/* Transcript */}
      <ol className="mt-8 space-y-4 list-none p-0">
        {turns.length === 0 && !live && (
          <li className="py-12 text-center text-sm text-gray-400">
            Tap <b>Me</b> before you ask, tap <b>Kru</b> when he answers. Tap the active button again to pause.
          </li>
        )}

        {turns.map((t) => {
          const isKru = t.speaker === 'kru'
          return (
            <li key={t.id} className={`flex ${isKru ? 'justify-start' : 'justify-end'}`}>
              <div className={`group max-w-[85%] rounded-2xl px-4 py-3 ${isKru ? 'bg-gray-100 rounded-tl-sm' : 'bg-brand-black text-white rounded-tr-sm'}`}>
                <div className={`flex items-center gap-2 text-[11px] mb-1 ${isKru ? 'text-gray-400' : 'text-gray-400'}`}>
                  <span className="font-bold uppercase tracking-wider">{LABEL[t.speaker]}</span>
                  <span>{offset(t.at, start)}</span>
                </div>

                {editingId === t.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      autoFocus
                      lang={isKru ? 'th' : 'en'}
                      className={`w-full rounded-lg px-2 py-1 text-sm text-brand-black border border-gray-300 focus:outline-none ${isKru ? 'font-thai' : ''}`}
                    />
                    <div className="flex gap-3 text-xs">
                      <button onClick={() => saveEdit(t.id)} className="font-semibold text-brand-red">Save</button>
                      <button onClick={() => setEditingId(null)} className="opacity-60">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isKru ? 'font-thai text-brand-black' : ''}`} lang={isKru ? 'th' : 'en'}>
                    {t.text}
                  </p>
                )}

                {isKru && editingId !== t.id && (
                  <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200 italic">
                    {translating.has(t.id) ? 'Translating…' : t.translation ?? (
                      <button onClick={() => translate(t.id)} className="not-italic text-xs font-semibold text-brand-red">Translate</button>
                    )}
                  </p>
                )}

                {editingId !== t.id && (
                  <div className="flex gap-3 mt-2 text-[11px] opacity-50 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(t.id); setEditText(t.text) }}>Edit</button>
                    <button onClick={() => swapSpeaker(t.id)}>Switch to {isKru ? 'Me' : 'Kru'}</button>
                    <button onClick={() => removeTurn(t.id)}>Delete</button>
                  </div>
                )}
              </div>
            </li>
          )
        })}

        {live && (
          <li className={`flex ${live.speaker === 'kru' ? 'justify-start' : 'justify-end'}`}>
            <div className="max-w-[85%] rounded-2xl px-4 py-3 border-2 border-dashed border-brand-red bg-white">
              <div className="flex items-center gap-2 text-[11px] mb-1 text-brand-red">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span className="font-bold uppercase tracking-wider">{LABEL[live.speaker]} speaking</span>
                <span>{live.speaker === 'kru' ? 'ไทย' : 'English'}</span>
              </div>
              <p className={`text-sm leading-relaxed ${live.speaker === 'kru' ? 'font-thai' : ''}`} lang={live.speaker === 'kru' ? 'th' : 'en'}>
                {live.final}
                <span className="text-gray-400"> {live.interim}</span>
                {!live.final && !live.interim && <span className="text-gray-400">Listening…</span>}
              </p>
            </div>
          </li>
        )}
      </ol>
      <div ref={bottomRef} />

      {/* Controls — fixed to bottom for one-handed phone use */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-gray-200 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 space-y-3">
          {micError && <p className="text-xs text-brand-red">{micError}</p>}

          {supported ? (
            <div className="grid grid-cols-2 gap-3">
              {(['me', 'kru'] as Speaker[]).map((sp) => {
                const active = live?.speaker === sp
                return (
                  <button
                    key={sp}
                    onClick={() => startListening(sp)}
                    className={`py-4 rounded-2xl font-semibold transition-all ${
                      active
                        ? 'bg-brand-red text-white shadow-lg ring-4 ring-brand-red/20'
                        : sp === 'me' ? 'bg-brand-black text-white' : 'bg-gray-100 text-brand-black'
                    }`}
                  >
                    <span className="block text-lg">{active ? '⏸' : '🎙'} {LABEL[sp]}</span>
                    <span className={`block text-xs font-normal ${sp === 'kru' ? 'font-thai' : ''} opacity-70`}>
                      {active ? 'tap to pause' : sp === 'me' ? 'English' : 'ภาษาไทย'}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Voice capture isn&apos;t supported in this browser — use Chrome (Android/desktop) or Safari (iOS). You can still type turns below.
            </p>
          )}

          <div className="flex gap-2">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addTyped('me') }}
              placeholder="Or type a turn…"
              className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
            />
            <button onClick={() => addTyped('me')} disabled={!typed.trim()} className="px-3 rounded-xl bg-gray-100 text-xs font-semibold disabled:opacity-40">+ Me</button>
            <button onClick={() => addTyped('kru')} disabled={!typed.trim()} className="px-3 rounded-xl bg-gray-100 text-xs font-semibold disabled:opacity-40">+ Kru</button>
          </div>
        </div>
      </div>
    </main>
  )
}
