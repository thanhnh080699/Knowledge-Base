"use client"
import { BookOpen, ChevronDown, ChevronRight, Folder } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { Category } from "@/types/category"

function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

function CategoryItem({ category, level, activeCategory }: { category: Category; level: number; activeCategory?: string }) {
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = category.children && category.children.length > 0
  const isActive = activeCategory === category.slug

  return (
    <div className="flex flex-col">
      <div
        className={classNames(
          "flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-[var(--color-surface-strong)] text-[var(--color-ink)]" : "text-[var(--color-body)] hover:bg-[var(--color-surface-soft)]",
          level === 0 ? "mt-1 font-semibold" : ""
        )}
        style={{ paddingLeft: `${(level + 1) * 0.75}rem` }}
      >
        <div className="flex flex-1 items-center gap-2">
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex size-5 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-strong)]"
              aria-label="Toggle category"
            >
              {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
            </button>
          ) : (
            <span className="w-5" />
          )}
          {level === 0 ? <Folder size={16} className={isActive ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"} /> : <BookOpen size={14} className={isActive ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"} />}
          <Link href={`/docs?category=${category.slug}`} className="flex-1 truncate hover:text-[var(--color-ink)]">
            {category.name}
          </Link>
        </div>
      </div>
      {hasChildren && isOpen && (
        <div className="flex flex-col mt-1">
          {category.children!.map((child) => (
            <CategoryItem key={child.slug} category={child} level={level + 1} activeCategory={activeCategory} />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ categories, activeCategory }: { categories: Category[]; activeCategory?: string }) {
  return (
    <aside className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-[var(--color-hairline)] bg-white p-4 md:sticky md:top-20">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">Danh mục tài liệu</p>
      <nav className="flex flex-col gap-1" aria-label="Danh mục tài liệu">
        {categories.length > 0 ? (
          categories.map((item) => (
            <CategoryItem key={item.slug} category={item} level={0} activeCategory={activeCategory} />
          ))
        ) : (
          <p className="px-3 text-sm text-[var(--color-muted)]">Chưa có danh mục</p>
        )}
      </nav>
    </aside>
  )
}
