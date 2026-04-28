import type { Post } from '@/types/post'

export type CommentStatus = 'PENDING' | 'APPROVED' | 'SPAM'

export interface Comment {
  id: number
  postId: number
  parentId: number | null
  authorName: string
  authorEmail: string
  authorWebsite: string | null
  content: string
  status: CommentStatus
  ipAddress: string | null
  userAgent: string | null
  approvedAt: string | null
  createdAt: string | null
  updatedAt: string | null
  deletedAt: string | null
  post?: Post | null
  parent?: Comment | null
  replies?: Comment[]
}

export interface CommentFilters {
  page?: number
  limit?: number
  search?: string
  status?: CommentStatus | ''
  postId?: number | ''
  trashed?: boolean
}
