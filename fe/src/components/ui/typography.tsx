import type { ReactNode } from "react"

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="kb-eyebrow">{children}</p>
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="kb-display-lg">{children}</h2>
}

export function MutedText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm leading-6 text-[var(--color-body)] ${className}`}>{children}</p>
}
