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
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700"
  }

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}
