'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type { MediaAsset, MoveMediaPayload, UploadMediaPayload } from '@/types/media'

export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadMediaPayload) => {
      try {
        const form = new FormData()
        form.append('file', payload.file)
        if (payload.folder) form.append('folder', payload.folder)
        if (payload.width) form.append('width', payload.width)
        if (payload.height) form.append('height', payload.height)

        const { data } = await api.post<ApiItemResponse<MediaAsset>>('/admin/media/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể upload media'))
      }
    },
    onSuccess: () => {
      toast.success('Upload media thành công')
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (path: string) => {
      try {
        await api.delete('/admin/media', { params: { path } })
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa media'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa media thành công')
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}

export function useMoveMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: MoveMediaPayload) => {
      try {
        const { data } = await api.put<ApiItemResponse<MediaAsset>>('/admin/media/move', payload)
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể di chuyển media'))
      }
    },
    onSuccess: (_, payload) => {
      toast.success('Di chuyển media thành công')
      queryClient.invalidateQueries({ queryKey: ['media'] })
      queryClient.invalidateQueries({ queryKey: ['media', 'detail', payload.path] })
    },
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (path: string) => {
      try {
        await api.post('/admin/media/folders', { path })
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo thư mục'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo thư mục thành công')
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}

export function useRenameFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ oldPath, newPath }: { oldPath: string; newPath: string }) => {
      try {
        await api.put('/admin/media/folders', { oldPath, newPath })
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể đổi tên thư mục'))
      }
    },
    onSuccess: () => {
      toast.success('Đổi tên thư mục thành công')
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (path: string) => {
      try {
        await api.delete('/admin/media/folders', { data: { path } })
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa thư mục'))
      }
    },
    onSuccess: () => {
      toast.success('Xóa thư mục thành công')
      queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })
}
