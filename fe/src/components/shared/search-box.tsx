"use client"

import { Folder, Search, ChevronRight, X } from "lucide-react"
import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { PostCard } from "@/components/shared/post-card"
import type { Post } from "@/types/post"
import type { Category } from "@/types/category"

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
  const [query, setQuery] = useState(initialQuery)

  // Sync state when initialQuery changes (e.g. from page navigation)
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const currentQ = params.get("q") || ""
      const trimmed = query.trim()

      if (trimmed === currentQ) return

      // Only search if empty (clear) or >= 2 chars (e.g. Go, IP, OS, VM)
      if (trimmed === "" || trimmed.length >= 2) {
        if (trimmed) {
          params.set("q", trimmed)
        } else {
          params.delete("q")
        }
        params.set("page", "1") // Reset to first page on new search
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }
    }, 300) // Snappy 300ms debounce time

    return () => clearTimeout(timer)
  }, [query, pathname, router, searchParams])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return posts
    return posts.filter((post) => {
      const haystack = [post.title, post.excerpt, post.category?.name, ...(post.tags ?? []).map((tag) => tag.name)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [posts, query])

  return (
    <section aria-label="Tìm kiếm tài liệu" className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" size={18} aria-hidden />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm nhanh trong danh sách tài liệu..." className="pl-10 pr-10" />
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

      {!query.trim() && subcategories.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/docs?category=${cat.slug}`}
              className="group flex items-center gap-3 rounded-2xl border border-[var(--color-hairline)] bg-white p-4 transition-all hover:border-[var(--color-hairline-strong)] hover:shadow-[var(--shadow-soft)]"
            >
              <div className="kb-icon size-10 transition-colors">
                <Folder size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-medium text-[var(--color-ink)]">{cat.name}</h3>
                <p className="truncate text-xs text-[var(--color-muted)]">Xem tài liệu</p>
              </div>
              <ChevronRight size={16} className="text-[var(--color-muted)]" />
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length ? filtered.map((post, index) => <PostCard key={post.id} post={post} eager={index === 0} />) : (
          <div className="col-span-full rounded-2xl border border-[var(--color-hairline)] bg-white p-6 text-sm text-[var(--color-body)]">
            Không tìm thấy tài liệu phù hợp.
          </div>
        )}
      </div>
    </section>
  )
}
