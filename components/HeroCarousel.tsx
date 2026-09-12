'use client'

import { useState, useEffect, useCallback } from 'react'

const SLIDES = [
  { src: '/IMG-20260911-WA0008.jpg', alt: 'Tukkatatong Petpayathai', position: 'center center' },
  { src: '/IMG-20260911-WA0009.jpg', alt: 'Tukkatatong Petpayathai', position: 'center center' },
  { src: '/IMG-20260911-WA0011.jpg', alt: 'Tukkatatong Petpayathai', position: 'center center' },
  { src: '/IMG-20260911-WA0022.jpg', alt: 'Tukkatatong Petpayathai', position: 'center center' },
  { src: '/IMG-20260911-WA0031.jpg', alt: 'Tukkatatong Petpayathai', position: 'center center' },
  { src: '/IMG-20260911-WA0034.jpg', alt: 'Tukkatatong Petpayathai', position: 'center center' },
  { src: '/IMG-20260911-WA0039.jpg', alt: 'Tukkatatong Petpayathai', position: 'center center' },
]

const INTERVAL_MS = 4500

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(advance, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [advance, paused])

  return (
    <div
      className="relative w-full h-[85vh] min-h-[560px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
