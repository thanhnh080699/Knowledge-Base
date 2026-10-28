"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Menu, X } from "lucide-react"

export function MobileNavigation({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    if (!open) return
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", escape)
    }
  }, [open])

  return (
    <div ref={container} className="lg:hidden">
      <button
        ref={trigger}
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
        className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--color-hairline-strong)] text-[var(--color-ink)] transition-colors hover:bg-white"
      >
        {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
      </button>
      <div
        id="mobile-navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-[var(--color-hairline)] bg-[var(--color-surface)] p-4 shadow-lg"
        onClick={(event) => {
          if ((event.target as Element).closest("a")) setOpen(false)
        }}
      >
        {children}
      </div>
    </div>
  )
}
