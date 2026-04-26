'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiListResponse } from '@/types/common'
import type { Category, Tag, TaxonomyFilters } from '@/types/taxonomy'

export function useCategories(filters: TaxonomyFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<Category>>('/admin/categories', {
        params: filters,
      })
      return data.data
    },
    enabled,
  })
}

export function useTags(filters: TaxonomyFilters = {}, enabled = true) {
  return useQuery({
    queryKey: ['tags', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<Tag>>('/admin/tags', {
        params: filters,
      })
      return data.data
    },
    enabled,
  })
}
