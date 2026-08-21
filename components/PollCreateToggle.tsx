'use client'

import { useState } from 'react'

export default function PollCreateToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="border border-brand-card-edge rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-brand-card transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted">
          + New poll
        </span>
        <span className="text-brand-bone-dim text-lg leading-none transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-brand-card-edge">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </section>
  )
}
