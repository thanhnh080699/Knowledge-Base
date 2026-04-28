"use client"

import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { PostCard } from "@/components/shared/post-card"
import type { Post } from "@/types/post"

export function SearchBox({ posts, initialQuery = "" }: { posts: Post[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)

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
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm nhanh trong danh sách tài liệu..." className="pl-10" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length ? filtered.map((post, index) => <PostCard key={post.id} post={post} eager={index === 0} />) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Không tìm thấy tài liệu phù hợp.
          </div>
        )}
      </div>
    </section>
  )
}
