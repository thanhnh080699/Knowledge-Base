import type { Post } from "@/types/post"
import { lessonNumber } from "./reading"

export type ListingSort = "roadmap" | "newest" | "oldest" | "title"
export function listingSort(value?: string, category?: string): ListingSort {
  if (["roadmap", "newest", "oldest", "title"].includes(value ?? "")) return value as ListingSort
  return ["lpi-linux-essentials", "lpi-security-essentials", "lpi-web-development-essentials", "lpi-open-source-essentials"].includes(category ?? "") ? "roadmap" : "newest"
}

export function orderPosts(posts: Post[], sort: ListingSort) {
  const timestamp = (post: Post) => Date.parse(post.publishedAt ?? post.createdAt ?? "") || 0
  return [...posts].sort((a, b) => {
    if (sort === "roadmap") {
      const an = lessonNumber(a), bn = lessonNumber(b)
      if (an !== bn) return an === undefined ? 1 : bn === undefined ? -1 : an - bn
    }
    if (sort === "title") return a.title.localeCompare(b.title, "vi", { numeric: true }) || a.id - b.id
    return sort === "oldest" ? timestamp(a) - timestamp(b) || a.id - b.id : timestamp(b) - timestamp(a) || b.id - a.id
  })
}

export function safeListingUrl(raw: string | null): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw, "https://thanhnh.id.vn")
    if (url.origin !== "https://thanhnh.id.vn" || !(url.pathname === "/docs" || /^\/docs\/categories\/[a-z0-9-]+$/.test(url.pathname))) return null
    return url.pathname + url.search
  } catch { return null }
}

export function listingStorageKey(pathname: string, query: string) {
  const params = new URLSearchParams(query)
  return "docs_listing_v1:" + pathname + ":" + JSON.stringify([params.get("category"), params.get("tag"), params.get("q")])
}
export const LAST_LISTING_KEY = "docs_last_listing_v1"
