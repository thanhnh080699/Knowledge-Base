"use client"

import Link from "next/link"
import { 
  CalendarClock, 
  KeyRound, 
  Code2, 
  Wrench, 
  ArrowRight, 
  Hash, 
  Type, 
  RefreshCw, 
  Binary
} from "lucide-react"
import type { Tool } from "@/types/tool"

interface ToolCardProps {
  tool: Tool
  onToolClick?: (tool: Tool) => void
  isRecent?: boolean
}

// Icon mapping per category or slug
const getToolIcon = (category: string, slug: string) => {
  if (slug.includes("cron") || slug.includes("timestamp") || slug.includes("date")) return CalendarClock
  if (slug.includes("bcrypt") || slug.includes("crypto") || slug.includes("password") || slug.includes("jwt") || slug.includes("token")) return KeyRound
  if (slug.includes("uuid") || slug.includes("hash") || slug.includes("hmac")) return Hash
  if (slug.includes("json") || slug.includes("sql") || slug.includes("xml") || slug.includes("chmod")) return Code2
  if (slug.includes("base64") || slug.includes("url") || slug.includes("html")) return Binary
  if (slug.includes("case") || slug.includes("slug") || slug.includes("lorem")) return Type
  if (slug.includes("color")) return RefreshCw
  
  switch (category) {
    case "Cron & Date Convert": return CalendarClock
    case "Crypto": return KeyRound
    case "Developer": return Code2
    case "Encoder": return Binary
    case "Converter": return RefreshCw
    case "Text": return Type
    default: return Wrench
  }
}

// Pastel badge colors per category
const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case "Cron & Date Convert":
      return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50"
    case "Crypto":
      return "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50"
    case "Developer":
      return "bg-cyan-50 text-cyan-700 border-cyan-200/60 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900/50"
    case "Encoder":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
    case "Converter":
      return "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50"
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
  }
}

export function ToolCard({ tool, onToolClick, isRecent }: ToolCardProps) {
  const IconComponent = getToolIcon(tool.category, tool.slug)
  const badgeClass = getCategoryBadgeClass(tool.category)

  const handleClick = () => {
    if (onToolClick) {
      onToolClick(tool)
    }
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      onClick={handleClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-surface)] hover:shadow-lg hover:shadow-indigo-500/5"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-[var(--color-hairline)] text-[var(--color-brand)] group-hover:scale-105 transition-transform">
            <IconComponent size={20} />
          </div>

          <div className="flex items-center gap-1.5">
            {isRecent && (
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                Gần đây
              </span>
            )}
            {tool.featured && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                Phổ biến
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-4 font-semibold text-base text-[var(--color-ink)] group-hover:text-[var(--color-brand)] transition-colors flex items-center justify-between gap-2">
          <span>{tool.name}</span>
          <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--color-brand)] shrink-0" />
        </h3>

        {tool.description && (
          <p className="mt-2 text-xs leading-5 text-[var(--color-body)] line-clamp-2">
            {tool.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[var(--color-hairline)]/50 flex items-center justify-between text-[11px] text-[var(--color-muted)] font-medium">
        <span className="group-hover:text-[var(--color-ink)] transition-colors">Sử dụng ngay &rarr;</span>
        <span className="font-mono text-[10px] opacity-60">/{tool.slug}</span>
      </div>
    </Link>
  )
}
