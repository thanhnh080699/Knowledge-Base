"use client"

import type { ListingSort } from "@/lib/listing"

export function SortBar({ value, onChange, showRoadmap = true }: {
  value: ListingSort
  onChange: (value: ListingSort) => void
  showRoadmap?: boolean
}) {
  const options: { value: ListingSort; label: string }[] = [
    ...(showRoadmap ? [{ value: "roadmap" as const, label: "Theo lộ trình" }] : []),
    { value: "oldest", label: "Cũ → mới" },
    { value: "newest", label: "Mới → cũ" },
    { value: "title", label: "Tên A → Z" },
  ]
  return <nav aria-label="Sắp xếp bài viết" className="flex items-center gap-4 overflow-x-auto border-b border-[var(--color-hairline)] text-xs whitespace-nowrap">
    <span className="shrink-0 py-2 text-[var(--color-body-strong)]">Sắp xếp:</span>
    {options.map(option => <button key={option.value} type="button" aria-pressed={value === option.value}
      onClick={() => onChange(option.value)}
      className={`shrink-0 cursor-pointer border-b-2 py-2 transition-colors hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 ${value === option.value ? "border-[var(--color-primary)] font-medium text-[var(--color-ink)]" : "border-transparent text-[var(--color-muted)]"}`}>
      {option.label}
    </button>)}
  </nav>
}
