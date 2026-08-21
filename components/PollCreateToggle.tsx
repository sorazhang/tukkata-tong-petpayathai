'use client'

import { useState } from 'react'

export default function PollCreateToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          + New poll
        </span>
        <span className="text-gray-300 text-lg leading-none transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'none' }}>›</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </section>
  )
}
