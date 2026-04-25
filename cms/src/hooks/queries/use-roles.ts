'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse, ApiListResponse } from '@/types/common'
import type { AclRole, RoleFilters, RoleMeta } from '@/types/acl'

export function useRoles(filters: RoleFilters) {
  return useQuery({
    queryKey: ['roles', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<AclRole>>('/admin/roles', {
        params: filters,
      })
      return data.data
    },
  })
}

export function useRolesMeta() {
  return useQuery({
    queryKey: ['roles', 'meta'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<RoleMeta>>('/admin/roles/meta')
      return data.data
    },
  })
}
