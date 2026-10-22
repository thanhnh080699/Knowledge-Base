'use client'

import type { PaginatedResponse } from '@/types/common'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Project, ProjectFilters } from '@/types/project'


export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Project>>('/admin/projects', {
        params: {
          sort: 'id',
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
