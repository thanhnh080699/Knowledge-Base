'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@/lib/axios'
import { handleApiError } from '@/lib/error-handler'
import type { ApiItemResponse } from '@/types/common'
import type { Comment, CommentStatus } from '@/types/comment'

export function useUpdateCommentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: CommentStatus }) => {
      try {
        const { data } = await api.patch<ApiItemResponse<Comment>>(`/admin/comments/${id}/status`, {
          status,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể cập nhật trạng thái bình luận'))
      }
    },
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái bình luận')
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

export function useReplyComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      try {
        const { data } = await api.post<ApiItemResponse<Comment>>(`/admin/comments/${id}/reply`, {
          content,
        })
        return data.data
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể trả lời bình luận'))
      }
    },
    onSuccess: () => {
      toast.success('Đã gửi trả lời')
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

export function useDeleteComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`/admin/comments/${id}`)
      } catch (error) {
        throw new Error(handleApiError(error, 'Không thể xóa bình luận'))
      }
    },
    onSuccess: () => {
      toast.success('Đã chuyển bình luận vào thùng rác')
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
