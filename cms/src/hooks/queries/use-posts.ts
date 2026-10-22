'use client'

import type { PaginatedResponse } from '@/types/common'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Post, PostFilters } from '@/types/post'


export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>('/admin/posts', {
        params: { ...filters, sort: 'id' },
      })
      return data
    },
  })
}

export function usePost(id: number | string | null) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Post }>(`/admin/posts/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
