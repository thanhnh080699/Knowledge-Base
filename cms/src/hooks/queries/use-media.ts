'use client'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse } from '@/types/common'
import type { MediaAsset, MediaFilters, MediaList } from '@/types/media'

async function fetchMediaPage(filters: MediaFilters, offset: number) {
  const { data } = await api.get<ApiItemResponse<MediaList>>('/admin/media', { params: { ...filters, offset } })
  return data.data
}

export function useMediaPage(filters: MediaFilters & { offset: number; search: string }) {
  return useQuery({
    queryKey: ['media', 'page', filters],
    queryFn: async () => {
      const { search, offset, ...params } = filters
      // The CDN has no search endpoint; search the complete folder metadata,
      // then paginate matches rather than filtering only the current page.
      const result = await fetchMediaPage({ ...params, limit: search ? 0 : params.limit }, search ? 0 : offset)
      if (!search) return result
      const files = result.files.filter(file => [file.original_name, file.file_name, file.path, file.mime_type].some(value => value.toLowerCase().includes(search.toLowerCase())))
      return { ...result, total: files.length, files: files.slice(offset, offset + (params.limit ?? 20)) }
    },
  })
}

export function useMedia(filters: MediaFilters) {
  return useInfiniteQuery({
    queryKey: ['media', filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      return fetchMediaPage(filters, pageParam)
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
