'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Comment, CommentFilters } from '@/types/comment'

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string | null
    lastPageUrl: string | null
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
}

export function useComments(filters: CommentFilters = {}) {
  return useQuery({
    queryKey: ['comments', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Comment>>('/admin/comments', {
        params: filters,
      })
      return data
    },
  })
}
