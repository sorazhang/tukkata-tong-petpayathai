'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const SLIDES = [
  { src: '/IMG-20260911-WA0008.jpg', alt: 'Tukkatatong Petpayathai', position: 'center top' },
  { src: '/IMG-20260911-WA0009.jpg', alt: 'Tukkatatong Petpayathai', position: 'center top' },
  { src: '/IMG-20260911-WA0033.jpg', alt: 'Tukkatatong Petpayathai', position: 'center top' },
  { src: '/IMG-20260911-WA0022.jpg', alt: 'Tukkatatong Petpayathai', position: 'center top' },
  { src: '/IMG-20260911-WA0031.jpg', alt: 'Tukkatatong Petpayathai', position: 'center top' },
  { src: '/IMG-20260911-WA0034.jpg', alt: 'Tukkatatong Petpayathai', position: 'center top' },
  { src: '/IMG-20260911-WA0039.jpg', alt: 'Tukkatatong Petpayathai', position: 'center top' },
]

const INTERVAL_MS = 4500
const SWIPE_THRESHOLD = 50

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const touchStartX = useRef<number | null>(null)

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(advance, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [advance, paused])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (delta > SWIPE_THRESHOLD) advance()
    else if (delta < -SWIPE_THRESHOLD) prev()
    touchStartX.current = null
    setPaused(false)
  }

  return (
    <div
      className="relative w-full h-[85vh] min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== current}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover"
            style={{ objectPosition: slide.position }}
          />
        </div>
      ))}

      {/* Dark overlay — lighter so image detail shows through */}
      <div className="absolute inset-0 bg-brand-black/45 z-10" />

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
