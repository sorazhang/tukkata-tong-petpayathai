'use client'

import { useEffect } from 'react'

// Fires once per page load. Same-origin now, so unlike the old claude.ai
// artifact this actually reaches the server — no sandbox in the way.
export default function ReviewViewPing({ label }: { label: string }) {
  useEffect(() => {
    fetch('/api/review-ping?p=' + encodeURIComponent(label)).catch(() => {})
  }, [label])

  return null
}
