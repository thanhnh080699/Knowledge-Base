'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse, ApiListResponse } from '@/types/common'
import type { User, UserFilters, UsersMeta } from '@/types/user'

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<User>>('/admin/users', {
        params: filters,
      })
      return data.data
    },
  })
}

export function useUsersMeta() {
  return useQuery({
    queryKey: ['users', 'meta'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<UsersMeta>>('/admin/users/meta')
      return data.data
    },
  })
}
