import type { Category, Tag } from '@/types/taxonomy'

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Series {
  id: number
  name: string
  slug: string
  description: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Post {
  id: number
  wordpressId: number | null
  title: string
  slug: string
  content: string
  excerpt: string | null
  metaTitle: string | null
  metaDescription: string | null
  focusKeyword: string | null
  canonicalUrl: string | null
  coverImage: string | null
  status: PostStatus
  views: number
  categoryId: number | null
  seriesId: number | null
  publishedAt: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  category?: Category | null
  tags?: Tag[]
  series?: Series | null
}

export interface PostFilters {
  page?: number
  limit?: number
  search?: string
  status?: PostStatus | ''
  categoryId?: number | ''
  tagId?: number | ''
  trashed?: boolean
}

export interface CreatePostPayload {
  title: string
  slug: string
  wordpressId?: number
  content: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  canonicalUrl?: string
  coverImage?: string | File
  status?: PostStatus
  views?: number
  categoryId?: number
  seriesId?: number
  tagIds?: number[]
  publishedAt?: string
}

export type UpdatePostPayload = Partial<CreatePostPayload>
