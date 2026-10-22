/**
 * Type definitions for blog-publisher automation scripts.
 * Matches AdonisJS Lucid models, VineJS validators, and Next.js CMS models.
 */

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Category {
  id: number
  name: string
  slug: string
  parentId?: number | null
  description?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  image?: string | null
  icon?: string | null
  sortOrder?: number
  children?: Category[]
}

export interface Tag {
  id: number
  name: string
  slug: string
  description?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
}

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  focusKeyword?: string | null
  canonicalUrl?: string | null
  coverImage?: string | null
  status: PostStatus
  views: number
  categoryId?: number | null
  seriesId?: number | null
  publishedAt?: string | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  category?: Category | null
  tags?: Tag[]
}

export interface CreatePostPayload {
  title: string
  slug: string
  content: string
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  canonicalUrl?: string
  coverImage?: string
  status?: PostStatus
  views?: number
  categoryId?: number
  seriesId?: number
  tagIds?: number[]
  publishedAt?: string
}

export type UpdatePostPayload = Partial<CreatePostPayload>

export interface MediaUploadItem {
  original_name: string
  file_name: string
  path: string
  url: string
  size: number
  mime_type: string
}

export interface MediaUploadResponse {
  message: string
  data: MediaUploadItem
}

export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

export interface PaginatedResponse<T> {
  meta: PaginationMeta
  data: T[]
}

export interface SingleResponse<T> {
  data: T
}

export interface ImageAssetSpec {
  id: string // e.g. "cover", "flowchart", "tech-illustration"
  localPath: string
  folder?: string
  alt: string
  caption?: string
  isCover?: boolean
}

export interface ArticleDraftSpec {
  title: string
  slug: string
  content: string // HTML or Markdown that will be converted to HTML
  excerpt?: string
  metaTitle?: string
  metaDescription?: string
  focusKeyword?: string
  canonicalUrl?: string
  categorySlug?: string
  categoryId?: number
  tagSlugs?: string[]
  tagIds?: number[]
  status?: PostStatus
  publishedAt?: string
  images?: ImageAssetSpec[]
}

export interface QAReport {
  slug: string
  title: string
  wordCount: number
  hasH1InBody: boolean
  headingsCount: { h2: number; h3: number; h4: number }
  missingTocTargets: string[]
  emDashCount: number
  forbiddenAIPhrases: string[]
  images: {
    id: string
    hasAlt: boolean
    hasCaption: boolean
    isAbsoluteCdnUrl: boolean
    url: string
  }[]
  internalLinks: { text: string; url: string; isValid: boolean }[]
  seo: {
    metaTitleLength: number
    metaDescriptionLength: number
    focusKeywordInTitle: boolean
    focusKeywordInDescription: boolean
    focusKeywordInSlug: boolean
  }
  isReadyForDraft: boolean
  isReadyForPublish: boolean
}
