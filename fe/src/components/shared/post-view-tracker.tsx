'use client'

import { useEffect } from 'react'

export function PostViewTracker({ postId }: { postId: number }) {
  useEffect(() => {
    let sent = false
    const record = () => {
      if (sent || document.visibilityState !== 'visible') return
      sent = true
      const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api').replace(/\/$/, '')
      void fetch(`${base}/posts/${postId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referrer: document.referrer }),
        keepalive: true,
      }).catch(() => { /* Analytics must not interrupt reading. */ })
    }
    const timer = window.setTimeout(record, 1000)
    document.addEventListener('visibilitychange', record)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', record)
    }
  }, [postId])
  return null
}
