"use client"

import { useState, useEffect, useMemo } from "react"
import { History, Inbox, Trash2 } from "lucide-react"
import type { Tool } from "@/types/tool"
import { ToolSearchFilter } from "./tool-search-filter"
import { ToolListItem } from "./tool-list-item"
import { ToolCategoryColumn } from "./tool-category-column"
import { HomeReveal } from "@/components/shared/home-motion"

interface ToolsCatalogProps {
  initialTools: Tool[]
}

const RECENT_TOOLS_KEY = "kb_recently_used_tools"

export function ToolsCatalog({ initialTools }: ToolsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [recentSlugs, setRecentSlugs] = useState<string[]>([])

  // Load recently used tool slugs from localStorage on mount (async to avoid lint warning)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_TOOLS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        queueMicrotask(() => {
          setRecentSlugs(parsed)
        })
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Handle saving clicked tool to recently used list
  const handleToolClick = (tool: Tool) => {
    try {
      const updated = [tool.slug, ...recentSlugs.filter((s) => s !== tool.slug)].slice(0, 6)
      setRecentSlugs(updated)
      localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated))
    } catch {
      // Ignore localStorage errors
    }
  }

  // Clear recently used history
  const clearRecent = () => {
    setRecentSlugs([])
    try {
      localStorage.removeItem(RECENT_TOOLS_KEY)
    } catch {
      // Ignore errors
    }
  }

  // Map categories and normalize "Generator" category to "Crypto"
  const normalizedTools = useMemo(() => {
    return initialTools.map((t) => ({
      ...t,
      category: t.category === "Generator" ? "Crypto" : t.category,
    }))
  }, [initialTools])

  // Get recently used Tool objects
  const recentTools = useMemo(() => {
    return recentSlugs
      .map((slug) => normalizedTools.find((t) => t.slug === slug))
      .filter((t): t is Tool => Boolean(t))
  }, [recentSlugs, normalizedTools])

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>()
    normalizedTools.forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + 1)
    })

    const preferredOrder = [
      "Network",
      "Developer",
      "Crypto",
      "Encoder",
      "Converter",
      "Cron & Date Convert",
      "Text",
    ]

    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        const indexA = preferredOrder.indexOf(a.name)
        const indexB = preferredOrder.indexOf(b.name)
        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1
        return 0
      })
  }, [normalizedTools])

  // Filter tools by search query and category
  const filteredTools = useMemo(() => {
    return normalizedTools.filter((tool) => {
      const matchesCategory =
        selectedCategory === "ALL" || tool.category === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.slug.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        (tool.description && tool.description.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [normalizedTools, selectedCategory, searchQuery])

  // Group filtered tools by category
  const toolsByCategory = useMemo(() => {
    const map = new Map<string, Tool[]>()
    filteredTools.forEach((tool) => {
      const list = map.get(tool.category) || []
      list.push(tool)
      map.set(tool.category, list)
    })

    const preferredOrder = [
      "Network",
      "Developer",
      "Crypto",
      "Encoder",
      "Converter",
      "Cron & Date Convert",
      "Text",
    ]

    return Array.from(map.entries())
      .map(([category, tools]) => ({ category, tools }))
      .sort((a, b) => {
        const indexA = preferredOrder.indexOf(a.category)
        const indexB = preferredOrder.indexOf(b.category)
        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1
        return 0
      })
  }, [filteredTools])

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Header */}
      <ToolSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categories={categoryCounts}
        totalTools={normalizedTools.length}
      />

      {/* Recently Used Tools Section (Compact Pill / Row Layout) */}
      {recentTools.length > 0 && !searchQuery && selectedCategory === "ALL" && (
        <HomeReveal className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 font-semibold text-xs text-[var(--color-ink)]">
              <History size={15} className="text-amber-600" />
              <span>Đã sử dụng gần đây</span>
              <span className="rounded-full bg-[var(--color-surface-strong)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-muted)]">
                {recentTools.length}
              </span>
            </div>
            <button
              onClick={clearRecent}
              className="flex items-center gap-1 text-[11px] text-[var(--color-muted)] hover:text-red-600 transition-colors cursor-pointer"
            >
              <Trash2 size={12} />
              <span>Xóa lịch sử</span>
            </button>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {recentTools.map((tool) => (
              <div
                key={`recent-${tool.id}`}
                className="rounded-xl border border-[var(--color-hairline)] bg-white p-0.5 shadow-2xs hover:border-[var(--color-brand)]/40 hover:shadow-xs transition-all"
              >
                <ToolListItem
                  tool={tool}
                  onToolClick={handleToolClick}
                />
              </div>
            ))}
          </div>
        </HomeReveal>
      )}

      {/* Main Tools Catalog */}
      {filteredTools.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-hairline)] bg-[var(--color-surface-soft)] py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-strong)] text-[var(--color-muted)] mb-4">
            <Inbox size={24} />
          </div>
          <h3 className="font-semibold text-lg text-[var(--color-ink)]">Không tìm thấy công cụ phù hợp</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)] max-w-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác để xem tất cả công cụ.
          </p>
          <button
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("ALL")
            }}
            className="mt-5 rounded-xl bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
          >
            Xóa bộ lọc &amp; tìm kiếm
          </button>
        </div>
      ) : searchQuery || selectedCategory !== "ALL" ? (
        /* Filtered/Search View: Clean compact multi-column grid */
        <div>
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="text-sm font-medium text-[var(--color-muted)]">
              Tìm thấy <span className="font-bold text-[var(--color-ink)]">{filteredTools.length}</span> công cụ
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-1 shadow-2xs hover:border-[var(--color-brand)]/40 transition-all"
              >
                <ToolListItem
                  tool={tool}
                  onToolClick={handleToolClick}
                  showCategoryBadge={selectedCategory === "ALL"}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Categorized Column Grid (Matching sample image style) */
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-start">
          {toolsByCategory.map(({ category, tools: categoryTools }, groupIndex) => (
            <HomeReveal key={category} delay={Math.min(groupIndex * 0.04, 0.16)}>
              <ToolCategoryColumn
                category={category}
                tools={categoryTools}
                onToolClick={handleToolClick}
              />
            </HomeReveal>
          ))}
        </div>
      )}
    </div>
  )
}

