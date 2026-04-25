'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiListResponse } from '@/types/common'
import type { Permission, PermissionFilters } from '@/types/acl'

export function usePermissions(filters: PermissionFilters) {
  return useQuery({
    queryKey: ['permissions', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<Permission>>('/admin/permissions', {
        params: filters,
      })
      return data.data
    },
  })
}
