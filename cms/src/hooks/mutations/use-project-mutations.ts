'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import { normalizeCdnPath } from '@/lib/utils'
import type { ApiItemResponse } from '@/types/common'
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '@/types/project'

async function uploadThumbnail(image: string | File | undefined) {
  if (!image || typeof image === 'string') {
    return normalizeCdnPath(image)
  }

  const form = new FormData()
  form.append('file', image)
  form.append('folder', 'Projects/content')

  const { data } = await api.post<ApiItemResponse<{ path: string; url: string }>>('/admin/media/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return normalizeCdnPath(data.data.path || data.data.url)
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      try {
        const thumbnailUrl = await uploadThumbnail(payload.thumbnailUrl)
        const { data } = await api.post<ApiItemResponse<Project>>('/admin/projects', {
          ...payload,
          thumbnailUrl,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể tạo project'))
      }
    },
    onSuccess: () => {
      toast.success('Tạo project thành công')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateProjectPayload }) => {
      try {
        const thumbnailUrl = await uploadThumbnail(payload.thumbnailUrl)
        const { data } = await api.put<ApiItemResponse<Project>>(`/admin/projects/${id}`, {
          ...payload,
          thumbnailUrl,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật project'))
      }
    },
    onSuccess: (_data, variables) => {
      toast.success('Cập nhật project thành công')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/projects/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa project'))
      }
    },
    onSuccess: () => {
      toast.success('Đã xóa project')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
