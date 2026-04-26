'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types/user'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<User>>('/admin/users', payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo người dùng'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateUserPayload }) => {
      try {
        const { data } = await api.put<ApiItemResponse<User>>(`/admin/users/${id}`, payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật người dùng'))
      }
    },
    onSuccess: (_, variables) => {
      toast.success('Cập nhật người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/users/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa người dùng'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}

export function useForceDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/users/${id}/force`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa vĩnh viễn người dùng'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa vĩnh viễn người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', 'meta'] })
    },
  })
}
