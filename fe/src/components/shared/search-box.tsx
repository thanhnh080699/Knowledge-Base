"use client"

import { Folder, Search, ChevronRight, X, LayoutGrid, List } from "lucide-react"
import { useMemo, useState, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { PostCard } from "@/components/shared/post-card"
import { PostListItem } from "@/components/shared/post-list-item"
import type { Category } from "@/types/category"
import type { Post } from "@/types/post"
import { SortBar } from "./sort-bar"
import { listingSort, listingStorageKey, listingUrl, LAST_LISTING_KEY } from "@/lib/listing"

const VIEW_MODE_KEY = "docs_view_mode"
function subscribeViewMode(onChange: () => void) {
  window.addEventListener("storage", onChange)
  return () => window.removeEventListener("storage", onChange)
}
function readViewMode(): "grid" | "list" {
  try {
    return localStorage.getItem(VIEW_MODE_KEY) === "list" ? "list" : "grid"
  } catch {
    return "grid"
  }
}
const defaultViewMode = () => "grid" as const

export function SearchBox({
  posts,
  initialQuery = "",
  subcategories = []
}: {
  posts: Post[]
  initialQuery?: string
  subcategories?: Category[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = listingSort(searchParams.get("sort") ?? undefined, searchParams.get("category") ?? pathname.split("/").at(-1))
  useEffect(() => {
    try {
      const key = listingStorageKey(pathname, searchParams.toString())
      const url = listingUrl(pathname, new URLSearchParams(searchParams.toString()))
      localStorage.setItem(key, url)
      localStorage.setItem(LAST_LISTING_KEY, url)
      sessionStorage.setItem(LAST_LISTING_KEY, url)
    } catch { /* Browsing still works without local storage. */ }
  }, [pathname, searchParams])
  const [queryState, setQueryState] = useState({ source: initialQuery, value: initialQuery })
  if (queryState.source !== initialQuery) {
    setQueryState({ source: initialQuery, value: initialQuery })
  }
  const query = queryState.value
  const setQuery = (value: string) => setQueryState({ source: initialQuery, value })
  const savedViewMode = useSyncExternalStore(subscribeViewMode, readViewMode, defaultViewMode)
  const [selectedViewMode, setSelectedViewMode] = useState<"grid" | "list" | null>(null)
  const viewMode = selectedViewMode ?? savedViewMode

  const handleSetViewMode = (mode: "grid" | "list") => {
    setSelectedViewMode(mode)
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode)
    } catch {
      // Keep the current choice usable even when persistent storage is unavailable.
    }
  }

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const currentQ = params.get("q") || ""
      const trimmed = query.trim()

      if (trimmed === currentQ) return

      if (trimmed === "" || trimmed.length >= 2) {
        if (trimmed) {
          params.set("q", trimmed)
        } else {
          params.delete("q")
        }
        params.set("page", "1")
        router.push(listingUrl(pathname, params), { scroll: false })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, pathname, router, searchParams])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (!needle) return true
      const haystack = [post.title, post.excerpt, post.content, post.category?.name, ...(post.tags ?? []).map((tag) => tag.name)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [posts, query])

  return (
    <section aria-label="Tìm kiếm tài liệu" className="space-y-5">
      {/* Search Input Bar & View Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={18} aria-hidden />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm nhanh trong danh sách tài liệu (vd: Docker, Linux, Nginx...)"
            className="pl-10 pr-10 min-h-11"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors p-1 rounded-full hover:bg-[var(--color-surface-soft)] flex items-center justify-center"
              aria-label="Xóa tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center justify-between sm:justify-start gap-2 border-t border-[var(--color-hairline)] pt-3 sm:border-t-0 sm:pt-0">
          <span className="text-xs font-medium text-[var(--color-muted)] sm:hidden">
            {filtered.length} bài viết
          </span>
          <div className="flex items-center rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-1">
            <button
              type="button"
              onClick={() => handleSetViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-[var(--color-ink)] shadow-xs"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
              title="Chế độ lưới (Grid view)"
            >
              <LayoutGrid size={15} />
              <span className="hidden md:inline">Thẻ bài</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode("list")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-[var(--color-ink)] shadow-xs"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
              title="Chế độ danh sách rút gọn (Compact list view)"
            >
              <List size={15} />
              <span className="hidden md:inline">Rút gọn</span>
            </button>
          </div>
        </div>
      </div>

      <SortBar value={currentSort} showRoadmap={searchParams.has("category") || pathname.startsWith("/docs/categories/")} onChange={sort => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("sort", sort)
        params.set("page", "1")
        params.delete("reading")
        router.push(listingUrl(pathname, params), { scroll: false })
      }} />

      {/* Subcategories (if available) */}
      {!query.trim() && subcategories.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/docs?category=${cat.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 transition-all hover:border-[var(--color-hairline-strong)] hover:shadow-xs"
            >
              <div className="kb-icon size-9 transition-colors">
                <Folder size={18} />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate text-sm font-medium text-[var(--color-ink)]">{cat.name}</h3>
                <p className="truncate text-xs text-[var(--color-muted)]">Xem danh mục</p>
              </div>
              <ChevronRight size={15} className="text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-1">
        <span>Hiển thị <strong>{filtered.length}</strong> bài viết</span>
        {query && (
          <span>Kết quả cho từ khóa &quot;<strong>{query}</strong>&quot;</span>
        )}
      </div>

      {/* Post List Rendering */}
      {viewMode === "grid" ? (
        <div className="docs-post-grid">
          {filtered.length ? (
            filtered.map((post, index) => <PostCard key={post.id} post={post} eager={index === 0} />)
          ) : (
            <div className="col-span-full rounded-2xl border border-[var(--color-hairline)] bg-white p-8 text-center text-sm text-[var(--color-body)]">
              Không tìm thấy tài liệu nào phù hợp với tìm kiếm.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.length ? (
            filtered.map((post) => <PostListItem key={post.id} post={post} />)
          ) : (
            <div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-8 text-center text-sm text-[var(--color-body)]">
              Không tìm thấy tài liệu nào phù hợp với tìm kiếm.
            </div>
          )}
        </div>
      )}
    </section>
  )
}
