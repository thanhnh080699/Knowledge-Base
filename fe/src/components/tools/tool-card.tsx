"use client"

import Link from "next/link"
import { ArrowRight, Flame } from "lucide-react"
import type { Tool } from "@/types/tool"
import { ToolIconRenderer } from "./tool-icon-map"

interface ToolCardProps {
  tool: Tool
  onToolClick?: (tool: Tool) => void
  isRecent?: boolean
}

export function ToolCard({ tool, onToolClick, isRecent }: ToolCardProps) {
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
            <ToolIconRenderer slug={tool.slug} category={tool.category} size={20} />
          </div>

          <div className="flex items-center gap-1.5">
            {isRecent && (
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                Gần đây
              </span>
            )}
            {Boolean(tool.featured) ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                <Flame size={12} className="fill-amber-500 text-amber-500" />
                <span>Nổi bật</span>
              </span>
            ) : null}
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
