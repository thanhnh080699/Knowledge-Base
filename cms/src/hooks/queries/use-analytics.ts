'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { ApiItemResponse } from '@/types/common'

export type AnalyticsOverview = {
  users: string
  sessions: string
  pageViews: string
  bounceRate: string
  avgSessionDuration: string
}

export type AnalyticsChartItem = {
  date: string
  users: number
  views: number
}

export type AnalyticsPageItem = {
  path: string
  title: string
  views: string
}

export type AnalyticsSourceItem = {
  source: string
  users: string
}

export type AnalyticsDashboardData = {
  overview: AnalyticsOverview
  chart: AnalyticsChartItem[]
  pages: AnalyticsPageItem[]
  sources: AnalyticsSourceItem[]
}

export type RealtimeData = {
  activeUsers: string
}

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<AnalyticsDashboardData>>('/admin/google-analytics/dashboard')
      return data.data
    },
    retry: false,
  })
}

export function useAnalyticsRealtime() {
  return useQuery({
    queryKey: ['analytics', 'realtime'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<RealtimeData>>('/admin/google-analytics/realtime')
      return data.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}
