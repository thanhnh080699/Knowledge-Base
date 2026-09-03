"use client"

import { ChevronDown } from "lucide-react"
import type { Tool } from "@/types/tool"
import { ToolListItem } from "./tool-list-item"
import { CategoryIconRenderer } from "./tool-icon-map"

interface ToolCategoryColumnProps {
  category: string
  tools: Tool[]
  onToolClick?: (tool: Tool) => void
  className?: string
}

export function ToolCategoryColumn({
  category,
  tools,
  onToolClick,
  className = "",
}: ToolCategoryColumnProps) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]/60 p-3.5 shadow-xs transition-all hover:border-[var(--color-brand)]/30 hover:bg-[var(--color-surface-soft)] ${className}`}
    >
      {/* Category Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-hairline)]/70 pb-2.5 px-1.5 mb-1.5">
        <div className="flex items-center gap-2">
          <ChevronDown size={15} className="text-[var(--color-muted)]" />
          <div className="flex items-center gap-1.5 font-semibold text-sm text-[var(--color-ink)]">
            <CategoryIconRenderer category={category} size={16} className="text-[var(--color-brand)]" />
            <span>{category}</span>
          </div>
        </div>
        <span className="rounded-full bg-[var(--color-surface-strong)] px-2 py-0.5 text-[11px] font-semibold text-[var(--color-muted)]">
          {tools.length}
        </span>
      </div>

      {/* Tools List in Column */}
      <div className="flex flex-col space-y-0.5">
        {tools.map((tool) => (
          <ToolListItem
            key={tool.id}
            tool={tool}
            onToolClick={onToolClick}
          />
        ))}
      </div>
    </div>
  )
}
