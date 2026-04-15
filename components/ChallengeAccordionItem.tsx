'use client'

import { useState } from 'react'
import ChallengeEditor from './ChallengeEditor'
import type { ChallengeStatus } from '@/lib/content'

interface Props {
  slug: string
  title: string
  situation: string
  initialStatus: ChallengeStatus
  initialSituation: string
  initialYourTurn: string
  initialSolution: string
  initialNote: string
  initialVoiceNote: string
  initialReferenceVideo: string
  initialReferenceVideoNote: string
  initialIllustration: string
}

export default function ChallengeAccordionItem({
  slug,
  title,
  situation,
  initialStatus,
  initialSituation,
  initialYourTurn,
  initialSolution,
  initialNote,
  initialVoiceNote,
  initialReferenceVideo,
  initialReferenceVideoNote,
  initialIllustration,
}: Props) {
  const [status, setStatus] = useState<ChallengeStatus>(initialStatus)

  return (
    <details className="group border border-gray-200 rounded-xl overflow-hidden">
      <summary className="flex items-start justify-between gap-4 p-5 cursor-pointer [&::-webkit-details-marker]:hidden [&::marker]:hidden select-none hover:bg-gray-50 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-black text-sm leading-snug">{title}</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">{situation}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-0.5">
          {status === 'complete' && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
              Complete
            </span>
          )}
          {status === 'pending_review' && (
            <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
              Pending review
            </span>
          )}
          {status === 'needs_answer' && (
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
              Needs answer
            </span>
          )}
          <span className="text-gray-300 group-open:rotate-90 transition-transform duration-200 text-lg leading-none">
            ›
          </span>
        </div>
      </summary>

      <ChallengeEditor
        slug={slug}
        initialSituation={initialSituation}
        initialYourTurn={initialYourTurn}
        initialSolution={initialSolution}
        initialNote={initialNote}
        initialVoiceNote={initialVoiceNote}
        initialReferenceVideo={initialReferenceVideo}
        initialReferenceVideoNote={initialReferenceVideoNote}
        initialIllustration={initialIllustration}
        initialStatus={status}
        onStatusChange={setStatus}
      />
    </details>
  )
}
