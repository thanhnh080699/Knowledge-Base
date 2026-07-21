"use client"

import { useState, useEffect, useMemo } from "react"
import { History, Sparkles, Inbox, Trash2 } from "lucide-react"
import type { Tool } from "@/types/tool"
import { ToolCard } from "./tool-card"
import { ToolSearchFilter } from "./tool-search-filter"
import { HomeReveal } from "@/components/shared/home-motion"

interface ToolsCatalogProps {
  initialTools: Tool[]
}

const RECENT_TOOLS_KEY = "kb_recently_used_tools"

export function ToolsCatalog({ initialTools }: ToolsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [recentSlugs, setRecentSlugs] = useState<string[]>([])

  // Load recently used tool slugs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_TOOLS_KEY)
      if (stored) {
        setRecentSlugs(JSON.parse(stored))
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
      "Cron & Date Convert",
      "Crypto",
      "Developer",
      "Encoder",
      "Converter",
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
      "Cron & Date Convert",
      "Crypto",
      "Developer",
      "Encoder",
      "Converter",
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
    <div className="space-y-10">
      {/* Search & Category Filter Header */}
      <ToolSearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        categories={categoryCounts}
        totalTools={normalizedTools.length}
      />

      {/* Recently Used Tools Section */}
      {recentTools.length > 0 && !searchQuery && selectedCategory === "ALL" && (
        <HomeReveal className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-sm text-blue-900 dark:text-blue-200">
              <History size={18} className="text-blue-600 dark:text-blue-400" />
              <span>Đã sử dụng gần đây ({recentTools.length})</span>
            </div>
            <button
              onClick={clearRecent}
              className="flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-red-600 transition-colors"
            >
              <Trash2 size={13} />
              <span>Xóa lịch sử</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <ToolCard
                key={`recent-${tool.id}`}
                tool={tool}
                onToolClick={handleToolClick}
                isRecent={true}
              />
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
            className="mt-5 rounded-xl bg-[var(--color-brand)] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
          >
            Xóa bộ lọc &amp; tìm kiếm
          </button>
        </div>
      ) : searchQuery || selectedCategory !== "ALL" ? (
        /* Flat Grid when filtering or searching */
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-muted)]">
              Tìm thấy <span className="font-bold text-[var(--color-ink)]">{filteredTools.length}</span> công cụ
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onToolClick={handleToolClick}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Categorized Group Grid by default */
        <div className="space-y-12">
          {toolsByCategory.map(({ category, tools: categoryTools }, groupIndex) => (
            <HomeReveal key={category} delay={Math.min(groupIndex * 0.04, 0.16)}>
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="kb-display-sm">{category}</h2>
                  <span className="rounded-full bg-[var(--color-surface-strong)] px-2 py-0.5 text-xs font-semibold text-[var(--color-muted)]">
                    {categoryTools.length}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onToolClick={handleToolClick}
                    />
                  ))}
                </div>
              </div>
            </HomeReveal>
          ))}
        </div>
      )}
    </div>
  )
}
