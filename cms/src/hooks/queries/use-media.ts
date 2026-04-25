'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse } from '@/types/common'
import type { MediaAsset, MediaFilters, MediaList } from '@/types/media'

export function useMedia(filters: MediaFilters) {
  return useQuery({
    queryKey: ['media', filters],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<MediaList>>('/admin/media', {
        params: filters,
      })
      return data.data
    },
  })
}

export function useMediaDetail(path: string) {
  return useQuery({
    queryKey: ['media', 'detail', path],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<MediaAsset>>('/admin/media/detail', {
        params: { path },
      })
      return data.data
    },
    enabled: !!path,
  })
}
