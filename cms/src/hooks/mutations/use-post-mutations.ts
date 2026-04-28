'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import { normalizeCdnPath } from '@/lib/utils'
import type { ApiItemResponse } from '@/types/common'
import type { CreatePostPayload, Post, UpdatePostPayload } from '@/types/post'

async function uploadCoverImage(image: string | File | undefined) {
  if (!image || typeof image === 'string') {
    return normalizeCdnPath(image)
  }

  const form = new FormData()
  form.append('file', image)
  form.append('folder', 'Posts')

  const { data } = await api.post<ApiItemResponse<{ path: string; url: string }>>('/admin/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return normalizeCdnPath(data.data.path || data.data.url)
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePostPayload) => {
      try {
        const coverImage = await uploadCoverImage(payload.coverImage)
        const { data } = await api.post<ApiItemResponse<Post>>('/admin/posts', {
          ...payload,
          coverImage,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo bài viết'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdatePostPayload }) => {
      try {
        const coverImage = await uploadCoverImage(payload.coverImage)
        const { data } = await api.put<ApiItemResponse<Post>>(`/admin/posts/${id}`, {
          ...payload,
          coverImage,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật bài viết'))
      }
    },
    onSuccess: (_data, variables) => {
      toast.success('Cập nhật bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts', variables.id] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/posts/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể chuyển bài viết vào thùng rác'))
      }
    },
    onSuccess: () => {
      toast.success('Đã chuyển bài viết vào thùng rác')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useRestorePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        const { data } = await api.post<ApiItemResponse<Post>>(`/admin/posts/${id}/restore`)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể khôi phục bài viết'))
      }
    },
    onSuccess: () => {
      toast.success('Khôi phục bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useForceDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/posts/${id}/force`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa vĩnh viễn bài viết'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa vĩnh viễn bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
