import type { Post } from "@/types/post"
import { lessonNumber } from "./reading"

export type ListingSort = "roadmap" | "newest" | "oldest" | "title"
export function listingSort(value?: string, category?: string): ListingSort {
  if (["roadmap", "newest", "oldest", "title"].includes(value ?? "")) return value as ListingSort
  return ["lpi-linux-essentials", "lpi-security-essentials", "lpi-web-development-essentials", "lpi-open-source-essentials"].includes(category ?? "") ? "roadmap" : "newest"
}

export function listingUrl(pathname: string, query: URLSearchParams): string {
  const params = new URLSearchParams(query)
  if (params.has("page")) {
    const page = Number(params.get("page"))
    if (!Number.isSafeInteger(page) || page <= 1) params.delete("page")
    else params.set("page", String(page))
  }
  const category = params.get("category") ?? pathname.split("/").at(-1)
  if (params.has("sort")) {
    const sort = listingSort(params.get("sort") ?? undefined, category)
    if (sort === listingSort(undefined, category)) params.delete("sort")
    else params.set("sort", sort)
  }
  params.sort()
  const search = params.toString()
  return pathname + (search ? `?${search}` : "")
}

export function listingCanonical(pathname: string, query: URLSearchParams): string {
  const params = new URLSearchParams()
  for (const key of ["category", "tag", "q", "page", "sort"]) {
    const value = query.get(key)
    if (value) params.set(key, value)
  }
  return `https://thanhnh.id.vn${listingUrl(pathname, params)}`
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
