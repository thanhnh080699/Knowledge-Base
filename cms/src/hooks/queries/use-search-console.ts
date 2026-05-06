'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse } from '@/types/common'

export type SearchConsoleOverview = {
  clicks: number
  impressions: number
  ctr: string
  position: string
}

export type SearchConsoleChartItem = {
  date: string
  clicks: number
  impressions: number
}

export type SearchConsoleQueryItem = {
  query: string
  clicks: number
  impressions: number
  ctr: string
  position: string
}

export type SearchConsolePageItem = {
  page: string
  clicks: number
  impressions: number
  ctr: string
  position: string
}

export type SearchConsoleCountryItem = {
  country: string
  clicks: number
  impressions: number
}

export type SearchConsoleDeviceItem = {
  device: string
  clicks: number
  impressions: number
}

export type SearchConsoleDashboardData = {
  overview: SearchConsoleOverview
  chart: SearchConsoleChartItem[]
  queries: SearchConsoleQueryItem[]
  pages: SearchConsolePageItem[]
  countries: SearchConsoleCountryItem[]
  devices: SearchConsoleDeviceItem[]
}

export function useSearchConsoleDashboard() {
  return useQuery({
    queryKey: ['search-console', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<SearchConsoleDashboardData>>(
        '/admin/google-search-console/dashboard'
      )
      return data.data
    },
    retry: false,
  })
}

export function useSearchConsoleStatus() {
  return useQuery({
    queryKey: ['search-console', 'status'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<{ connected: boolean }>>(
        '/admin/google-search-console/status'
      )
      return data.data
    },
  })
}

export function useSearchConsoleAuthUrl() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<ApiItemResponse<{ url: string }>>(
        '/admin/google-search-console/auth-url'
      )
      return data.data.url
    },
  })
}

export function useSearchConsoleDisconnect() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/admin/google-search-console/disconnect')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-console'] })
    },
  })
}
