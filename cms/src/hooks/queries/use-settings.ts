'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse } from '@/types/common'
import type { SettingsGroup } from '@/types/settings'

export function useSettingsGroup(group: string) {
  return useQuery({
    queryKey: ['settings', group],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<SettingsGroup>>(`/admin/settings/${group}`)
      return data.data
    },
    enabled: !!group,
  })
}
