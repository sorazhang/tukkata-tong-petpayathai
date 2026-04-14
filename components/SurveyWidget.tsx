'use client'

import { useState } from 'react'
import Link from 'next/link'
import { recommend, type Duration, type Sparring, type Problem } from '@/lib/recommend'

interface ChallengeRef {
  slug: string
  title: string
}

const QUESTIONS = {
  duration: {
    label: 'How long have you been training?',
    options: [
      { value: 'just-starting' as Duration, label: 'Less than 6 months' },
      { value: 'building'      as Duration, label: '6 months to 2 years' },
      { value: 'experienced'   as Duration, label: 'More than 2 years' },
    ],
  },
  sparring: {
    label: 'Are you sparring yet?',
    options: [
      { value: 'not-yet'      as Sparring, label: 'Not yet' },
      { value: 'just-started' as Sparring, label: 'Just started' },
      { value: 'regularly'    as Sparring, label: 'Yes, regularly' },
    ],
  },
  problem: {
    label: "What's giving you the most trouble?",
    options: [
      { value: 'striking'  as Problem, label: 'My striking' },
      { value: 'defense'   as Problem, label: 'My defense' },
      { value: 'footwork'  as Problem, label: 'My footwork' },
      { value: 'clinch'    as Problem, label: 'The clinch' },
      { value: 'tactics'   as Problem, label: 'Reading the fight' },
      { value: 'unsure'    as Problem, label: "I'm not sure yet" },
    ],
  },
}

type Step = 'duration' | 'sparring' | 'problem' | 'result'
const STEPS: Step[] = ['duration', 'sparring', 'problem', 'result']

export default function SurveyWidget({
  challenges,
}: {
  challenges: ChallengeRef[]
}) {
  const [step, setStep]         = useState<Step>('duration')
  const [duration, setDuration] = useState<Duration | null>(null)
  const [sparring, setSparring] = useState<Sparring | null>(null)
  const [problem, setProblem]   = useState<Problem | null>(null)

  const stepIndex = STEPS.indexOf(step)

  function reset() {
    setStep('duration')
    setDuration(null)
    setSparring(null)
    setProblem(null)
  }

  function getTitle(slug: string) {
    return challenges.find((c) => c.slug === slug)?.title ?? slug
  }

  // ── Result ──────────────────────────────────────────────
  if (step === 'result' && duration && sparring && problem) {
    const rec = recommend(duration, sparring, problem)
    return (
      <div className="bg-brand-black text-white rounded-xl p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red mb-4">
          Your path
        </p>
        <p className="text-gray-300 text-sm leading-relaxed mb-6">
          {rec.message}
        </p>

        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
          Start with
        </p>
        <Link
          href={`/challenges/${rec.start}`}
          className="block group mb-6"
        >
          <p className="text-white font-semibold text-base group-hover:text-brand-red transition-colors leading-snug">
            {getTitle(rec.start)}
          </p>
          <p className="text-brand-red text-xs mt-1">Take this challenge →</p>
        </Link>

        {rec.path.length > 0 && (
          <>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
              Then try
            </p>
            <ul className="space-y-2 mb-6">
              {rec.path.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/challenges/${slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    → {getTitle(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {rec.track && (
          <p className="text-xs text-gray-600 mb-6">
            These are part of the{' '}
            <span className="text-gray-400">{rec.track}</span> series.
          </p>
        )}

        <button
          onClick={reset}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← Start over
        </button>
      </div>
    )
  }

  // ── Questions ────────────────────────────────────────────
  const questionKey = step as 'duration' | 'sparring' | 'problem'
  const question = QUESTIONS[questionKey]

  return (
    <div className="border border-gray-200 rounded-xl p-7 bg-white">
      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {['duration', 'sparring', 'problem'].map((s, i) => (
          <span
            key={s}
            className={`block h-1 rounded-full transition-all duration-300 ${
              i <= stepIndex - 0
                ? 'bg-brand-red w-6'
                : 'bg-gray-200 w-3'
            }`}
          />
        ))}
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        {stepIndex + 1} of 3
      </p>
      <p className="text-base font-semibold text-brand-black mb-5">
        {question.label}
      </p>

      <div className="flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              if (step === 'duration') {
                setDuration(opt.value as Duration)
                setStep('sparring')
              } else if (step === 'sparring') {
                setSparring(opt.value as Sparring)
                setStep('problem')
              } else if (step === 'problem') {
                setProblem(opt.value as Problem)
                setStep('result')
              }
            }}
            className="text-left px-4 py-3 rounded-lg border border-gray-200 text-sm text-brand-black hover:border-brand-red hover:text-brand-red transition-all duration-150 font-medium"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
