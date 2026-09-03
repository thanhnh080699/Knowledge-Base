"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { Tool } from "@/types/tool"
import { ToolIconRenderer, CategoryIconRenderer } from "./tool-icon-map"

interface Props {
  tools: Tool[]
  currentSlug?: string
}

export function ToolSidebar({ tools, currentSlug: propSlug }: Props) {
  const pathname = usePathname()
  const currentSlug = propSlug || pathname?.split("/").pop() || ""
  const toolsByCategory = Array.from(new Set(tools.map(t => t.category === "Generator" ? "Crypto" : t.category)))
    .map(category => {
      const categoryTools = tools.filter(t => 
        ((t.category === category) || (category === "Crypto" && t.category === "Generator")) && 
        t.status === "PUBLISHED"
      )
      
      // Deduplicate by name, preferring slugs with 'crypto-'
      const uniqueToolsMap = new Map<string, Tool>()
      categoryTools.forEach(tool => {
        const existing = uniqueToolsMap.get(tool.name)
        if (!existing || (tool.slug.startsWith('crypto-') && !existing.slug.startsWith('crypto-'))) {
          uniqueToolsMap.set(tool.name, tool)
        }
      })

      return {
        category,
        tools: Array.from(uniqueToolsMap.values())
      }
    })
    .sort((a, b) => {
      const order = ["Crypto", "Developer", "Encoder", "Converter", "Cron & Date Convert", "Text"]
      const indexA = order.indexOf(a.category)
      const indexB = order.indexOf(b.category)
      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      return 0
    })

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(toolsByCategory.map(c => c.category))
  )

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <aside className="w-full flex-shrink-0 lg:w-72">
      <div className="sticky top-20 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] shadow-xs">
        <div className="border-b border-[var(--color-hairline)] px-4 py-3.5 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-[var(--color-ink)]">Danh mục công cụ</h2>
          <span className="text-[11px] text-[var(--color-muted)] font-mono">{tools.length} tools</span>
        </div>
        <nav className="p-2.5 space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto">
          {toolsByCategory.map(({ category, tools: categoryTools }) => {
            const isExpanded = expandedCategories.has(category)
            const hasActiveTool = categoryTools.some(t => t.slug === currentSlug)

            return (
              <div key={category} className="space-y-1">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[var(--color-body)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-[var(--color-muted)]" />
                    ) : (
                      <ChevronRight size={14} className="text-[var(--color-muted)]" />
                    )}
                    <CategoryIconRenderer
                      category={category}
                      size={14}
                      className={hasActiveTool ? "text-[var(--color-brand)]" : "text-slate-400"}
                    />
                    <span className={hasActiveTool ? "font-bold text-[var(--color-ink)]" : ""}>{category}</span>
                  </div>
                  <span className="rounded-full bg-[var(--color-surface-soft)] px-1.5 py-0.2 text-[10px] font-mono text-[var(--color-muted)]">
                    {categoryTools.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="ml-2 pl-2 border-l border-[var(--color-hairline)] space-y-0.5 mt-1">
                    {categoryTools.map((tool) => {
                      const isActive = tool.slug === currentSlug

                      return (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-all duration-150 ${
                            isActive
                              ? "bg-emerald-500/15 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-medium"
                              : "text-[var(--color-body)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-brand)]"
                          }`}
                        >
                          <ToolIconRenderer
                            slug={tool.slug}
                            category={tool.category}
                            size={15}
                            className={`shrink-0 transition-colors ${
                              isActive
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-400 group-hover:text-[var(--color-brand)]"
                            }`}
                          />
                          <span className="truncate">{tool.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
