'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type { CreatePermissionPayload, Permission, UpdatePermissionPayload } from '@/types/acl'

export function useCreatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePermissionPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<Permission>>('/admin/permissions', payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo permission'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo permission thành công')
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['roles', 'meta'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}

export function useUpdatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdatePermissionPayload }) => {
      try {
        const { data } = await api.put<ApiItemResponse<Permission>>(`/admin/permissions/${id}`, payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật permission'))
      }
    },
    onSuccess: () => {
      toast.success('Cập nhật permission thành công')
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['roles', 'meta'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}

export function useDeletePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/permissions/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa permission'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa permission thành công')
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['roles', 'meta'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}
