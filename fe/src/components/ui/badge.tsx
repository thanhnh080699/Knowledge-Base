import type { ReactNode } from "react"

export function Badge({
  children,
  tone = "blue",
  className = ""
}: {
  children: ReactNode
  tone?: "blue" | "slate" | "emerald" | "amber"
  className?: string
}) {
  const tones = {
    blue: "border-[var(--color-hairline)] bg-[var(--color-surface-strong)] text-[var(--color-ink)]",
    slate: "border-[var(--color-hairline)] bg-[var(--color-surface-strong)] text-[var(--color-ink)]",
    emerald: "border-[var(--color-hairline)] bg-[var(--color-surface-strong)] text-[var(--color-ink)]",
    amber: "border-[var(--color-hairline)] bg-[var(--color-surface-strong)] text-[var(--color-ink)]"
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
