'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiListResponse } from '@/types/common'
import type { ApiAccessToken } from '@/types/api-access-token'

export function useApiAccessTokens() {
  return useQuery({
    queryKey: ['api-access-tokens'],
    queryFn: async () => {
      const { data } = await api.get<ApiListResponse<ApiAccessToken>>('/admin/api-access-tokens')
      return data.data
    },
  })
}
