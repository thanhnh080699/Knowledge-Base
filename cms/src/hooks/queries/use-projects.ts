'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Project, ProjectFilters } from '@/types/project'

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

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Project>>('/admin/projects', {
        params: {
          page: filters.page,
          limit: filters.limit,
          q: filters.search,
          status: filters.status,
          featured: filters.featured,
        },
      })
      return data
    },
  })
}

export function useProject(id: number | string | null) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Project }>(`/admin/projects/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
