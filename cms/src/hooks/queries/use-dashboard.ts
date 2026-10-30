'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'
import type { ApiItemResponse, PaginatedResponse } from '@/types/common'
import type {
  DashboardOverviewData,
  DashboardRange,
  DashboardViewsFilter,
  GlobalPostViewItem,
  SeoIssuePostItem,
  SeoIssueType,
} from '@/types/dashboard'
import type { AnalyticsDashboardData, RealtimeData } from '@/hooks/queries/use-analytics'
import type { SearchConsoleDashboardData } from '@/hooks/queries/use-search-console'
import type { SettingsGroup } from '@/types/settings'

export function useDashboardOverview(range: DashboardRange) {
  const userId = useAuthStore((state) => state.user?.id)
  return useQuery({
    queryKey: ['dashboard', userId, 'overview', range],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<DashboardOverviewData>>('/admin/dashboard', {
        params: { range },
      })
      return data.data
    },
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === userId ? previousData : undefined,
    enabled: Boolean(userId),
    staleTime: 30_000,
  })
}

export function useDashboardViewsLog(filters: DashboardViewsFilter, enabled = true) {
  const userId = useAuthStore((state) => state.user?.id)
  return useQuery({
    queryKey: ['dashboard', userId, 'views', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<GlobalPostViewItem>>(
        '/admin/dashboard/views',
        {
          params: {
            page: filters.page ?? 1,
            limit: filters.limit ?? 15,
            range: filters.range ?? '30d',
            postId: filters.postId,
            device: filters.device || undefined,
            browser: filters.browser || undefined,
            os: filters.os || undefined,
            country: filters.country || undefined,
            referrer: filters.referrer || undefined,
            search: filters.search?.trim() || undefined,
          },
        }
      )
      return data
    },
    enabled: enabled && Boolean(userId),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === userId ? previousData : undefined,
  })
}

export function useDashboardSeoIssues(
  params: {
    page?: number
    limit?: number
    issue?: SeoIssueType
    search?: string
  },
  enabled = true
) {
  const userId = useAuthStore((state) => state.user?.id)
  return useQuery({
    queryKey: ['dashboard', userId, 'seo-issues', params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<SeoIssuePostItem>>(
        '/admin/dashboard/seo-issues',
        {
          params: {
            page: params.page ?? 1,
            limit: params.limit ?? 15,
            issue: params.issue ?? 'all',
            search: params.search?.trim() || undefined,
          },
        }
      )
      return data
    },
    enabled: enabled && Boolean(userId),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === userId ? previousData : undefined,
  })
}

export function useExternalAnalyticsSummary(canManageSettings: boolean) {
  const userId = useAuthStore((state) => state.user?.id)
  const gaSettingsQuery = useQuery({
    queryKey: ['dashboard-external', userId, 'ga-settings'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<SettingsGroup>>(
        '/admin/settings/google_analytics'
      )
      return data.data
    },
    enabled: Boolean(userId) && canManageSettings,
    retry: false,
    staleTime: 60_000,
  })

  const gaEnabled = canManageSettings && gaSettingsQuery.data?.values?.google_analytics_enabled === true

  const gaDashboardQuery = useQuery({
    queryKey: ['dashboard-external', userId, 'ga-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<AnalyticsDashboardData>>(
        '/admin/google-analytics/dashboard'
      )
      return data.data
    },
    enabled: Boolean(userId) && canManageSettings && gaEnabled,
    retry: false,
    staleTime: 60_000,
  })

  const gaRealtimeQuery = useQuery({
    queryKey: ['dashboard-external', userId, 'ga-realtime'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<RealtimeData>>(
        '/admin/google-analytics/realtime'
      )
      return data.data
    },
    enabled: Boolean(userId) && canManageSettings && gaEnabled,
    retry: false,
    refetchInterval: 30_000,
  })

  const gscStatusQuery = useQuery({
    queryKey: ['dashboard-external', userId, 'gsc-status'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<{ connected: boolean }>>(
        '/admin/google-search-console/status'
      )
      return data.data
    },
    enabled: Boolean(userId) && canManageSettings,
    retry: false,
    staleTime: 60_000,
  })

  const gscConnected = canManageSettings && gscStatusQuery.data?.connected === true

  const gscDashboardQuery = useQuery({
    queryKey: ['dashboard-external', userId, 'gsc-dashboard'],
    queryFn: async () => {
      const { data } = await api.get<ApiItemResponse<SearchConsoleDashboardData>>(
        '/admin/google-search-console/dashboard'
      )
      return data.data
    },
    enabled: Boolean(userId) && canManageSettings && gscConnected,
    retry: false,
    staleTime: 60_000,
  })

  return {
    ga: {
      enabled: gaEnabled,
      isLoading: gaSettingsQuery.isLoading || (gaEnabled && gaDashboardQuery.isLoading),
      hasError: Boolean(gaDashboardQuery.error),
      data: canManageSettings ? gaDashboardQuery.data : undefined,
      activeUsers: canManageSettings ? gaRealtimeQuery.data?.activeUsers ?? null : null,
    },
    gsc: {
      connected: gscConnected,
      isLoading: gscStatusQuery.isLoading || (gscConnected && gscDashboardQuery.isLoading),
      hasError: Boolean(gscDashboardQuery.error),
      data: canManageSettings ? gscDashboardQuery.data : undefined,
    },
  }
}
