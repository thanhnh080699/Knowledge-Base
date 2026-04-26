'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type { SettingsGroup, UpdateSettingsGroupPayload } from '@/types/settings'

export function useUpdateSettingsGroup(group: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateSettingsGroupPayload) => {
      try {
        const { data } = await api.put<ApiItemResponse<SettingsGroup>>(`/admin/settings/${group}`, payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật cài đặt'))
      }
    },
    onSuccess: () => {
      toast.success('Cập nhật cài đặt thành công')
      queryClient.invalidateQueries({ queryKey: ['settings', group] })
    },
  })
}
