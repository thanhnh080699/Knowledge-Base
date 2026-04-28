import type { ReactNode } from "react"

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{children}</p>
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-bold text-slate-950 md:text-3xl">{children}</h2>
}

export function MutedText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm leading-6 text-slate-600 ${className}`}>{children}</p>
}
