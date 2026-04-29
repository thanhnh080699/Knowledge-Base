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
          "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-100",
          level === 0 ? "mt-1 font-semibold" : ""
        )}
        style={{ paddingLeft: `${(level + 1) * 0.75}rem` }}
      >
        <div className="flex flex-1 items-center gap-2">
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex size-5 items-center justify-center rounded hover:bg-slate-200 transition-colors"
              aria-label="Toggle category"
            >
              {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
            </button>
          ) : (
            <span className="w-5" />
          )}
          {level === 0 ? <Folder size={16} className={isActive ? "text-blue-600" : "text-slate-400"} /> : <BookOpen size={14} className={isActive ? "text-blue-600" : "text-slate-400"} />}
          <Link href={`/docs?category=${category.slug}`} className="flex-1 truncate hover:text-blue-600">
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
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-2">Danh mục tài liệu</p>
      <nav className="flex flex-col gap-1" aria-label="Danh mục tài liệu">
        {categories.length > 0 ? (
          categories.map((item) => (
            <CategoryItem key={item.slug} category={item} level={0} activeCategory={activeCategory} />
          ))
        ) : (
          <p className="text-sm text-slate-500 px-3">Chưa có danh mục</p>
        )}
      </nav>
    </aside>
  )
}
