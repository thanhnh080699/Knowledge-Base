"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateReadingProgress = () => {
      const currentScroll = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (currentScroll / scrollHeight) * 100)))
      }
    }

    window.addEventListener("scroll", updateReadingProgress, { passive: true })
    updateReadingProgress()

    return () => {
      window.removeEventListener("scroll", updateReadingProgress)
    }
  }, [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-[var(--color-primary)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
