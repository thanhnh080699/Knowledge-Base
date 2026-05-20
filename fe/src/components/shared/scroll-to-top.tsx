"use client"

import { ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 flex size-12 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] !text-[var(--color-on-primary)] shadow-[var(--shadow-soft)] transition-all hover:bg-[var(--color-primary-active)] hover:scale-105 active:scale-95"
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  )
}
