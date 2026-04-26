'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type {
  Category,
  CreateCategoryPayload,
  CreateTagPayload,
  Tag,
  UpdateCategoryPayload,
  UpdateTagPayload,
} from '@/types/taxonomy'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCategoryPayload) => {
      try {
        let imageUrl = typeof payload.image === 'string' ? payload.image : undefined

        if (payload.image instanceof File) {
          const form = new FormData()
          form.append('file', payload.image)
          form.append('folder', 'Categories')
          const { data: uploadData } = await api.post<ApiItemResponse<{ url: string }>>(
            '/admin/media/upload',
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          imageUrl = uploadData.data.url
        }

        const { data } = await api.post<ApiItemResponse<Category>>('/admin/categories', {
          ...payload,
          image: imageUrl,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo danh mục'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) => {
      try {
        let imageUrl = typeof payload.image === 'string' ? payload.image : undefined

        if (payload.image instanceof File) {
          const form = new FormData()
          form.append('file', payload.image)
          form.append('folder', 'Categories')
          const { data: uploadData } = await api.post<ApiItemResponse<{ url: string }>>(
            '/admin/media/upload',
            form,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          imageUrl = uploadData.data.url
        }

        const { data } = await api.put<ApiItemResponse<Category>>(`/admin/categories/${id}`, {
          ...payload,
          image: imageUrl,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật danh mục'))
      }
    },
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/categories/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa danh mục'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTagPayload) => {
      try {
        const { data } = await api.post<ApiItemResponse<Tag>>('/admin/tags', payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo thẻ'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo thẻ thành công')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateTagPayload }) => {
      try {
        const { data } = await api.put<ApiItemResponse<Tag>>(`/admin/tags/${id}`, payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật thẻ'))
      }
    },
    onSuccess: () => {
      toast.success('Cập nhật thẻ thành công')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/tags/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa thẻ'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa thẻ thành công')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })
}
