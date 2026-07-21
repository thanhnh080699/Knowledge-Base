"use client"

import { useEffect, useRef } from "react"
import { Search, X, Command } from "lucide-react"

interface CategoryCount {
  name: string
  count: number
}

interface ToolSearchFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategorySelect: (category: string) => void
  categories: CategoryCount[]
  totalTools: number
}

export function ToolSearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  totalTools,
}: ToolSearchFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for Cmd+K / Ctrl+K / '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      } else if (e.key === "/" && document.activeElement !== inputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--color-muted)]">
          <Search size={18} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm công cụ (vd: Base64, JSON, Bcrypt, Timestamp)..."
          className="w-full rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] py-3.5 pl-11 pr-24 text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)] shadow-xs transition-all focus:border-[var(--color-brand)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[var(--color-brand)]/10"
        />
        <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="flex h-6 w-6 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-ink)] transition-colors"
              title="Xóa tìm kiếm"
            >
              <X size={14} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-muted)]">
            <Command size={10} /> K
          </kbd>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => onCategorySelect("ALL")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === "ALL"
              ? "bg-[var(--color-ink)] text-white shadow-sm"
              : "bg-[var(--color-surface-soft)] text-[var(--color-body)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)]/30 hover:bg-[var(--color-surface)]"
          }`}
        >
          <span>Tất cả</span>
          <span
            className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
              selectedCategory === "ALL"
                ? "bg-white/20 text-white"
                : "bg-[var(--color-surface-strong)] text-[var(--color-muted)]"
            }`}
          >
            {totalTools}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name
          return (
            <button
              key={cat.name}
              onClick={() => onCategorySelect(cat.name)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[var(--color-brand)] text-white shadow-sm"
                  : "bg-[var(--color-surface-soft)] text-[var(--color-body)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)]/30 hover:bg-[var(--color-surface)]"
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-[var(--color-surface-strong)] text-[var(--color-muted)]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
