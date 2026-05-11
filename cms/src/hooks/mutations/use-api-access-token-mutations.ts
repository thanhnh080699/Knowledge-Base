'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type {
  ApiAccessToken,
  CreateApiAccessTokenPayload,
  CreatedApiAccessToken,
  UpdateApiAccessTokenPayload,
} from '@/types/api-access-token'

export function useCreateApiAccessToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateApiAccessTokenPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<CreatedApiAccessToken>>('/admin/api-access-tokens', payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo access token'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo access token thành công')
      queryClient.invalidateQueries({ queryKey: ['api-access-tokens'] })
    },
  })
}

export function useUpdateApiAccessToken(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateApiAccessTokenPayload) => {
      try {
        const { data } = await api.put<ApiItemResponse<ApiAccessToken>>(`/admin/api-access-tokens/${id}`, payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật access token'))
      }
    },
    onSuccess: () => {
      toast.success('Cập nhật access token thành công')
      queryClient.invalidateQueries({ queryKey: ['api-access-tokens'] })
    },
  })
}

export function useDeleteApiAccessToken() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/api-access-tokens/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa access token'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa access token thành công')
      queryClient.invalidateQueries({ queryKey: ['api-access-tokens'] })
    },
  })
}
