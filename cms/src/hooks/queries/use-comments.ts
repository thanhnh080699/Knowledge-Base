'use client'

import type { PaginatedResponse } from '@/types/common'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Comment, CommentFilters } from '@/types/comment'


export function useComments(filters: CommentFilters = {}) {
  return useQuery({
    queryKey: ['comments', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Comment>>('/admin/comments', {
        params: { ...filters, sort: 'id' },
      })
      return data
    },
  })
}
