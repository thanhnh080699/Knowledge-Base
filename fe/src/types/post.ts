import type { Category } from "./category"
import type { Tag } from "./tag"

export interface Post {
  id: number
  wordpressId?: number | null
  title: string
  slug: string
  content: string
  excerpt: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  focusKeyword?: string | null
  canonicalUrl?: string | null
  coverImage?: string | null
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  views?: number
  categoryId?: number | null
  seriesId?: number | null
  category?: Category | null
  tags?: Tag[]
  publishedAt: string | null
  createdAt?: string
  updatedAt?: string
}

export interface PaginatedResponse<T> {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
  data: T[]
}
