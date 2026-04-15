'use client'

import { useState, useTransition, useRef } from 'react'
import { saveChallenge, saveNote, saveVoiceNote, saveReferenceVideo, saveIllustration, markComplete } from '@/lib/actions'
import type { ChallengeStatus } from '@/lib/content'

interface Props {
  slug: string
  initialSituation: string
  initialYourTurn: string
  initialSolution: string
  initialNote: string
  initialVoiceNote: string
  initialReferenceVideo: string
  initialReferenceVideoNote: string
  initialIllustration: string
  initialStatus: ChallengeStatus
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type RecordState = 'idle' | 'recording' | 'recorded' | 'saving' | 'saved'

export default function ChallengeEditor({
  slug,
  initialSituation,
  initialYourTurn,
  initialSolution,
  initialNote,
  initialVoiceNote,
  initialReferenceVideo,
  initialReferenceVideoNote,
  initialIllustration,
  initialStatus,
}: Props) {
  // ── Content fields ───────────────────────────────────────────
  const [situation, setSituation] = useState(initialSituation)
  const [yourTurn, setYourTurn]   = useState(initialYourTurn)
  const [solution, setSolution]   = useState(initialSolution)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [saveError, setSaveError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<ChallengeStatus>(initialStatus)
  const [isCompletePending, startCompleteTransition] = useTransition()

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
        if (solution.trim() && status === 'needs_answer') setStatus('pending_review')
        setTimeout(() => setSaveState('idle'), 3000)
      } else {
        setSaveState('error')
        setSaveError(res.error ?? 'Unknown error')
      }
    })
  }

  // ── Voice recorder ───────────────────────────────────────────
  const [recordState, setRecordState] = useState<RecordState>(
    initialVoiceNote ? 'saved' : 'idle'
  )
  const [voiceNote, setVoiceNote]     = useState(initialVoiceNote)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [audioBlob, setAudioBlob]     = useState<Blob | null>(null)
  const [recordError, setRecordError] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef        = useRef<Blob[]>([])
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isVoicePending, startVoiceTransition] = useTransition()

  async function startRecording() {
    setRecordError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setRecordState('recorded')
        stream.getTracks().forEach((t) => t.stop())
      }
      mr.start()
      setRecordState('recording')
      setRecordSeconds(0)
      timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000)
    } catch {
      setRecordError('Microphone access denied. Please allow microphone in your browser.')
      setRecordState('idle')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function saveRecording() {
    if (!audioBlob) return
    setRecordState('saving')
    startVoiceTransition(async () => {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1]
        const res = await saveVoiceNote(slug, base64)
        if (res.ok) {
          setVoiceNote(`recordings/${slug}.webm`)
          setRecordState('saved')
        } else {
          setRecordError(res.error ?? 'Failed to save.')
          setRecordState('recorded')
        }
      }
      reader.readAsDataURL(audioBlob)
    })
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  // ── Video reference ──────────────────────────────────────────
  const [videoUrl, setVideoUrl]   = useState(initialReferenceVideo)
  const [videoNote, setVideoNote] = useState(initialReferenceVideoNote)
  const [videoSaveState, setVideoSaveState] = useState<SaveState>('idle')
  const [isVideoPending, startVideoTransition] = useTransition()

  const isVideoDirty =
    videoUrl  !== initialReferenceVideo ||
    videoNote !== initialReferenceVideoNote

  function handleVideoSave() {
    setVideoSaveState('saving')
    startVideoTransition(async () => {
      const res = await saveReferenceVideo(slug, videoUrl, videoNote)
      if (res.ok) {
        setVideoSaveState('saved')
        setTimeout(() => setVideoSaveState('idle'), 3000)
      } else {
        setVideoSaveState('error')
      }
    })
  }

  // ── Illustration ─────────────────────────────────────────────
  const [illustrationUrl, setIllustrationUrl] = useState(initialIllustration)
  const [illustrationFile, setIllustrationFile] = useState<File | null>(null)
  const [illustrationPreview, setIllustrationPreview] = useState<string | null>(null)
  const [illustrationSaveState, setIllustrationSaveState] = useState<SaveState>('idle')
  const [illustrationError, setIllustrationError] = useState('')
  const [isIllustrationPending, startIllustrationTransition] = useTransition()

  function handleIllustrationPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIllustrationFile(file)
    setIllustrationSaveState('idle')
    setIllustrationError('')
    const reader = new FileReader()
    reader.onload = () => setIllustrationPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleIllustrationSave() {
    if (!illustrationFile) return
    setIllustrationSaveState('saving')
    startIllustrationTransition(async () => {
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        const base64  = dataUrl.split(',')[1]
        const res = await saveIllustration(slug, base64, illustrationFile.type)
        if (res.ok && res.url) {
          setIllustrationUrl(res.url)
          setIllustrationFile(null)
          setIllustrationPreview(null)
          setIllustrationSaveState('saved')
          setTimeout(() => setIllustrationSaveState('idle'), 3000)
        } else {
          setIllustrationError(res.error ?? 'Failed to save.')
          setIllustrationSaveState('error')
        }
      }
      reader.readAsDataURL(illustrationFile)
    })
  }

  // ── Internal note ────────────────────────────────────────────
  const [note, setNote]                   = useState(initialNote)
  const [noteSaveState, setNoteSaveState] = useState<SaveState>('idle')
  const [isNotePending, startNoteTransition] = useTransition()
  const isNoteDirty = note !== initialNote

  return (
    <div className="border-t border-gray-100 divide-y divide-gray-100">

      {/* ── Situation ── */}
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

      {/* ── Your Turn ── */}
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

      {/* ── Solution (typed) ── */}
      <div className="px-5 py-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
          Solution — Written
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
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 text-sm flex-wrap">
          {saveState === 'saved' && <span className="text-green-600 font-medium">Saved.</span>}
          {saveState === 'error' && <span className="text-red-600 font-medium">{saveError}</span>}
          {saveState === 'idle' && isDirty && <span className="text-gray-400 text-xs">Unsaved changes</span>}

          {/* Status badge */}
          {status === 'needs_answer' && (
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
              Needs answer
            </span>
          )}
          {status === 'pending_review' && (
            <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
              Pending review
            </span>
          )}
          {status === 'complete' && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
              Complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === 'pending_review' && (
            <button
              onClick={() => {
                startCompleteTransition(async () => {
                  const res = await markComplete(slug)
                  if (res.ok) setStatus('complete')
                })
              }}
              disabled={isCompletePending}
              className="px-4 py-2 rounded text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {isCompletePending ? 'Saving…' : 'Mark complete'}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isPending || !isDirty}
            className={`px-5 py-2 rounded text-sm font-semibold transition-all ${
              isPending ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isDirty ? 'bg-brand-red text-white hover:bg-brand-red-dark'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Solution — Voice note ── */}
      <div className="px-5 py-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">
          Solution — Voice Note
        </label>
        <p className="text-xs text-gray-400 mb-4">
          Prefer to speak? Record your answer directly. No editing needed.
        </p>

        {recordError && (
          <p className="text-xs text-red-500 mb-3">{recordError}</p>
        )}

        {/* Existing recording */}
        {voiceNote && recordState === 'saved' && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-1">Current recording</p>
            <audio controls src={`/${voiceNote}`} className="w-full h-10" />
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {recordState === 'idle' && (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded hover:bg-brand-red-dark transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-white inline-block" />
              {voiceNote ? 'Re-record' : 'Record answer'}
            </button>
          )}

          {recordState === 'recording' && (
            <>
              <span className="flex items-center gap-2 text-sm text-brand-red font-medium">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse inline-block" />
                Recording — {formatTime(recordSeconds)}
              </span>
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded hover:bg-black transition-colors"
              >
                Stop
              </button>
            </>
          )}

          {recordState === 'recorded' && audioBlob && (
            <>
              <audio controls src={URL.createObjectURL(audioBlob)} className="h-9" />
              <button
                onClick={saveRecording}
                disabled={isVoicePending}
                className="px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded hover:bg-brand-red-dark transition-colors"
              >
                {isVoicePending ? 'Saving…' : 'Save recording'}
              </button>
              <button
                onClick={() => { setAudioBlob(null); setRecordState(voiceNote ? 'saved' : 'idle') }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Discard
              </button>
            </>
          )}

          {recordState === 'saving' && (
            <span className="text-sm text-gray-400">Saving…</span>
          )}
        </div>
      </div>

      {/* ── Solution — Video reference ── */}
      <div className="px-5 py-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">
          Solution — Video Reference
        </label>
        <p className="text-xs text-gray-400 mb-4">
          Paste a YouTube link or any video that shows the answer. Add a timestamp note if helpful.
        </p>

        <input
          type="url"
          value={videoUrl}
          onChange={(e) => { setVideoUrl(e.target.value); setVideoSaveState('idle') }}
          placeholder="https://youtube.com/watch?v=…"
          className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-brand-red mb-2 font-sans"
        />
        <input
          type="text"
          value={videoNote}
          onChange={(e) => { setVideoNote(e.target.value); setVideoSaveState('idle') }}
          placeholder="e.g. Watch from 1:32 — this is where I shift weight before the kick"
          className="w-full text-sm text-gray-800 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-brand-red font-sans"
        />

        {videoUrl && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Preview link</p>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-red hover:underline break-all"
            >
              {videoUrl}
            </a>
            {videoNote && <p className="text-xs text-gray-500 mt-1">{videoNote}</p>}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="text-xs">
            {videoSaveState === 'saved' && <span className="text-green-600 font-medium">Video link saved.</span>}
            {videoSaveState === 'error'  && <span className="text-red-600 font-medium">Failed to save.</span>}
            {videoSaveState === 'idle' && isVideoDirty && <span className="text-gray-400">Unsaved</span>}
          </div>
          <button
            onClick={handleVideoSave}
            disabled={isVideoPending || !isVideoDirty}
            className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
              isVideoPending ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isVideoDirty ? 'bg-brand-red text-white hover:bg-brand-red-dark'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isVideoPending ? 'Saving…' : 'Save link'}
          </button>
        </div>
      </div>

      {/* ── Illustration ── */}
      <div className="px-5 py-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 block">
          Illustration
        </label>
        <p className="text-xs text-gray-400 mb-4">
          Attach a diagram or sketch. Shows alongside the solution to explain the mechanics visually.
        </p>

        {/* Existing illustration */}
        {illustrationUrl && !illustrationPreview && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Current illustration</p>
            <img
              src={illustrationUrl}
              alt="Challenge illustration"
              className="max-w-full rounded-lg border border-gray-200"
            />
          </div>
        )}

        {/* New file preview */}
        {illustrationPreview && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Preview — not yet saved</p>
            <img
              src={illustrationPreview}
              alt="Preview"
              className="max-w-full rounded-lg border border-gray-200"
            />
          </div>
        )}

        {illustrationError && (
          <p className="text-xs text-red-500 mb-3">{illustrationError}</p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200 transition-colors">
            {illustrationUrl ? 'Replace image' : 'Choose image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIllustrationPick}
            />
          </label>

          {illustrationFile && (
            <>
              <button
                onClick={handleIllustrationSave}
                disabled={isIllustrationPending}
                className="px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded hover:bg-brand-red-dark transition-colors disabled:opacity-50"
              >
                {isIllustrationPending ? 'Saving…' : 'Save illustration'}
              </button>
              <button
                onClick={() => { setIllustrationFile(null); setIllustrationPreview(null) }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Discard
              </button>
            </>
          )}

          {illustrationSaveState === 'saved' && (
            <span className="text-sm text-green-600 font-medium">Saved.</span>
          )}
        </div>
      </div>

      {/* ── Internal notes ── */}
      <div className="px-5 py-4 bg-amber-50 border-t border-amber-100">
        <label className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1 block">
          Internal note — not visible to readers
        </label>
        <p className="text-xs text-amber-500 mb-2">
          Leave a comment, flag a correction, or ask a question. Only you and Kru see this.
        </p>
        <textarea
          value={note}
          onChange={(e) => { setNote(e.target.value); setNoteSaveState('idle') }}
          rows={3}
          placeholder="e.g. Kru — does this situation feel right to you? Or: needs a clearer drill…"
          className="w-full text-sm text-amber-900 leading-relaxed border border-amber-200 rounded-lg p-3 focus:outline-none focus:border-amber-400 resize-y font-sans bg-white placeholder:text-amber-300"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs">
            {noteSaveState === 'saved' && <span className="text-green-600 font-medium">Note saved.</span>}
            {noteSaveState === 'error' && <span className="text-red-600 font-medium">Failed to save note.</span>}
            {noteSaveState === 'idle' && isNoteDirty && <span className="text-amber-400">Unsaved note</span>}
          </div>
          <button
            onClick={() => {
              setNoteSaveState('saving')
              startNoteTransition(async () => {
                const res = await saveNote(slug, note)
                if (res.ok) {
                  setNoteSaveState('saved')
                  setTimeout(() => setNoteSaveState('idle'), 3000)
                } else {
                  setNoteSaveState('error')
                }
              })
            }}
            disabled={isNotePending || !isNoteDirty}
            className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
              isNotePending ? 'bg-amber-100 text-amber-300 cursor-not-allowed'
              : isNoteDirty ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-amber-100 text-amber-300 cursor-not-allowed'
            }`}
          >
            {isNotePending ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </div>

    </div>
  )
}
