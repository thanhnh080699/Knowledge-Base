"use client"

import Link from "next/link"
import { ChevronRight, Flame } from "lucide-react"
import type { Tool } from "@/types/tool"
import { ToolIconRenderer } from "./tool-icon-map"

interface ToolListItemProps {
  tool: Tool
  isActive?: boolean
  onToolClick?: (tool: Tool) => void
  showCategoryBadge?: boolean
  className?: string
}

export function ToolListItem({
  tool,
  isActive = false,
  onToolClick,
  showCategoryBadge = false,
  className = "",
}: ToolListItemProps) {
  const handleClick = () => {
    if (onToolClick) {
      onToolClick(tool)
    }
  }

  return (
    <Link
      href={`/tools/${tool.slug}`}
      onClick={handleClick}
      className={`group flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 cursor-pointer ${
        isActive
          ? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-medium"
          : "text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-brand)]"
      } ${className}`}
      title={tool.description || tool.name}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
            isActive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-slate-400 dark:text-slate-400 group-hover:text-[var(--color-brand)]"
          }`}
        >
          <ToolIconRenderer
            slug={tool.slug}
            category={tool.category}
            size={17}
            strokeWidth={isActive ? 2.2 : 1.8}
          />
        </span>
        <span className="truncate text-[13.5px] leading-tight font-medium">
          {tool.name}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {showCategoryBadge && (
          <span className="rounded-md bg-[var(--color-surface-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)] border border-[var(--color-hairline)]">
            {tool.category}
          </span>
        )}
        {Boolean(tool.featured) && !showCategoryBadge ? (
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 dark:text-amber-400 group-hover:scale-110 transition-transform"
            title="Nổi bật (Featured)"
          >
            <Flame size={13} className="fill-amber-500 text-amber-500" />
          </span>
        ) : null}
        <ChevronRight
          size={14}
          className="text-[var(--color-muted)] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
        />
      </div>
    </Link>
  )
}
