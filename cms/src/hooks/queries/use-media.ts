'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse } from '@/types/common'
import type { MediaAsset, MediaFilters, MediaList } from '@/types/media'

export function useMedia(filters: MediaFilters) {
  return useInfiniteQuery({
    queryKey: ['media', filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<ApiItemResponse<MediaList>>('/admin/media', {
        params: {
          ...filters,
          offset: pageParam,
        },
      })
      return data.data
    },
    getNextPageParam: (lastPage) => (lastPage.has_more ? lastPage.next_offset : undefined),
    select: (data) => {
      const firstPage = data.pages[0]
      return {
        ...firstPage,
        folders: firstPage?.folders ?? [],
        files: data.pages.flatMap((page) => page.files ?? []),
        total: firstPage?.total ?? data.pages.reduce((count, page) => count + (page.files?.length ?? 0), 0),
        has_more: data.pages.at(-1)?.has_more ?? false,
        next_offset: data.pages.at(-1)?.next_offset,
      }
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
