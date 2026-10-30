'use client'

import { useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostViews } from '@/components/content/post-views'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { KpiGrid } from '@/components/dashboard/kpi-grid'
import { OverviewTab } from '@/components/dashboard/overview-tab'
import { TrafficTab } from '@/components/dashboard/traffic-tab'
import { ContentSeoTab } from '@/components/dashboard/content-seo-tab'
import { SystemEngagementTab } from '@/components/dashboard/system-engagement-tab'
import { ViewsDrilldownModal } from '@/components/dashboard/views-drilldown-modal'
import { SeoDrilldownModal } from '@/components/dashboard/seo-drilldown-modal'
import {
  useDashboardOverview,
  useExternalAnalyticsSummary,
} from '@/hooks/queries/use-dashboard'
import { useAuthStore } from '@/stores/auth'
import type {
  DashboardRange,
  DashboardTab,
  DashboardViewsFilter,
  SeoIssueType,
} from '@/types/dashboard'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [range, setRange] = useState<DashboardRange>('30d')
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  // Drill-down modal states
  const [selectedPostViews, setSelectedPostViews] = useState<{
    id: number
    title: string
  } | null>(null)
  const [viewsModalFilter, setViewsModalFilter] = useState<DashboardViewsFilter | null>(null)
  const [seoModalIssue, setSeoModalIssue] = useState<SeoIssueType | null>(null)

  const { data, isLoading, isFetching, error, refetch } = useDashboardOverview(range)
  const canManageSettings = data?.permissions.canManageSettings === true
  const external = useExternalAnalyticsSummary(canManageSettings)

  const seoIssuesBadge = data?.content.seoHealth.postsWithIssues ?? 0
  const pendingEngagementBadge =
    (data?.engagement.comments.pending ?? 0) + (data?.engagement.contacts.pending ?? 0)

  function openViewsDrilldown(filter: Partial<DashboardViewsFilter> = {}) {
    if (!data?.permissions.canManagePosts) {
      setActiveTab('traffic')
      return
    }
    setViewsModalFilter({
      range: data?.range ?? range,
      ...filter,
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <DashboardHeader
        userName={user?.fullName}
        range={range}
        onRangeChange={setRange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={() => void refetch()}
        isFetching={isFetching}
        generatedAt={data?.generatedAt}
        seoIssuesBadge={seoIssuesBadge}
        pendingEngagementBadge={pendingEngagementBadge}
      />

      {isLoading && !data ? (
        <DashboardSkeleton />
      ) : error && !data ? (
        <div className="rounded-xl border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] p-10 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-[var(--app-danger-soft-fg)]" />
          <h2 className="mt-3 text-lg font-semibold text-[var(--app-danger-soft-fg)]">
            Không thể tải dữ liệu thống kê Dashboard
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--app-danger-soft-fg)]">
            Vui lòng kiểm tra kết nối máy chủ API hoặc phiên đăng nhập và thử lại.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 gap-2 border-[var(--app-danger-soft-border)] text-[var(--app-danger-soft-fg)] hover:bg-[var(--app-danger-hover-bg)]"
            onClick={() => void refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            Thử tải lại
          </Button>
        </div>
      ) : data ? (
        <>
          <KpiGrid
            kpis={data.kpis}
            permissions={data.permissions}
            range={data.range}
            onInspectViews={() => openViewsDrilldown({})}
            onInspectPosts={() => setActiveTab('content')}
            onInspectSeo={() => setSeoModalIssue('all')}
            onInspectEngagement={() => setActiveTab('system')}
            onInspectAi={() => setActiveTab('system')}
          />

          {activeTab === 'overview' ? (
            <OverviewTab
              data={data}
              external={external}
              onSwitchTab={setActiveTab}
              onOpenGlobalViews={() => openViewsDrilldown({})}
              onOpenPostViews={setSelectedPostViews}
              onOpenSeoModal={(issue = 'all') => setSeoModalIssue(issue)}
            />
          ) : null}

          {activeTab === 'traffic' ? (
            <TrafficTab
              data={data}
              onOpenViewsDrilldown={openViewsDrilldown}
              onOpenPostViews={setSelectedPostViews}
            />
          ) : null}

          {activeTab === 'content' ? (
            <ContentSeoTab
              data={data}
              onOpenSeoModal={(issue) => setSeoModalIssue(issue)}
            />
          ) : null}

          {activeTab === 'system' ? (
            <SystemEngagementTab data={data} external={external} />
          ) : null}
        </>
      ) : null}

      {/* Per-Post Viewer Details Modal */}
      {selectedPostViews ? (
        <PostViews
          key={selectedPostViews.id}
          postId={selectedPostViews.id}
          title={selectedPostViews.title}
          onClose={() => setSelectedPostViews(null)}
        />
      ) : null}

      {/* Global Viewer Log Drill-down Modal */}
      {viewsModalFilter ? (
        <ViewsDrilldownModal
          key={JSON.stringify(viewsModalFilter)}
          isOpen
          initialFilter={viewsModalFilter}
          onClose={() => setViewsModalFilter(null)}
        />
      ) : null}

      {/* SEO Audit Drill-down Modal */}
      {seoModalIssue ? (
        <SeoDrilldownModal
          key={seoModalIssue}
          isOpen
          initialIssue={seoModalIssue}
          onClose={() => setSeoModalIssue(null)}
        />
      ) : null}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Đang tải thống kê">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="h-96 animate-pulse rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] xl:col-span-2" />
        <div className="h-96 animate-pulse rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]" />
      </div>
    </div>
  )
}
