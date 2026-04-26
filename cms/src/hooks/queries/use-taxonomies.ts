'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse, ApiListResponse } from '@/types/common'
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

export function useCategory(id: number | string | null) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<Category>>(`/admin/categories/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

export function useTag(id: number | string | null) {
  return useQuery({
    queryKey: ['tags', id],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<Tag>>(`/admin/tags/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
