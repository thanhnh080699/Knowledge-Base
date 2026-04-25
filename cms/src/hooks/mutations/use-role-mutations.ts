'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type { AclRole, CreateRolePayload, UpdateRolePayload } from '@/types/acl'

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<AclRole>>('/admin/roles', payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo role'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo role thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateRolePayload }) => {
      try {
        const { data } = await api.put<ApiItemResponse<AclRole>>(`/admin/roles/${id}`, payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật role'))
      }
    },
    onSuccess: () => {
      toast.success('Cập nhật role thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete(`/admin/roles/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa role'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa role thành công')
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}
