'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Post, PostFilters } from '@/types/post'

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

export function usePosts(filters: PostFilters = {}) {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>('/admin/posts', {
        params: filters,
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
