'use client'

import Link from 'next/link'
import {
  Activity,
  Cpu,
  FileSearch,
  LayoutDashboard,
  Plus,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DASHBOARD_RANGE_OPTIONS, formatDateTimeVi } from '@/lib/dashboard-utils'
import type { DashboardRange, DashboardTab } from '@/types/dashboard'

interface DashboardHeaderProps {
  userName?: string | null
  range: DashboardRange
  onRangeChange: (range: DashboardRange) => void
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  onRefresh: () => void
  isFetching: boolean
  generatedAt?: string
  seoIssuesBadge: number
  pendingEngagementBadge: number
}

export function DashboardHeader({
  userName,
  range,
  onRangeChange,
  activeTab,
  onTabChange,
  onRefresh,
  isFetching,
  generatedAt,
  seoIssuesBadge,
  pendingEngagementBadge,
}: DashboardHeaderProps) {
  const tabs: Array<{
    id: DashboardTab
    label: string
    icon: typeof LayoutDashboard
    badge?: number
    badgeTone?: 'warning' | 'danger'
  }> = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: LayoutDashboard,
    },
    {
      id: 'traffic',
      label: 'Lưu lượng & Người đọc',
      icon: Activity,
    },
    {
      id: 'content',
      label: 'Nội dung & SEO',
      icon: FileSearch,
      badge: seoIssuesBadge > 0 ? seoIssuesBadge : undefined,
      badgeTone: 'warning',
    },
    {
      id: 'system',
      label: 'Tương tác, Hệ thống & AI',
      icon: Cpu,
      badge: pendingEngagementBadge > 0 ? pendingEngagementBadge : undefined,
      badgeTone: 'danger',
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Bảng điều khiển thống kê
          </h1>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            {userName ? `Xin chào ${userName} · ` : ''}
            Theo dõi toàn diện lưu lượng, chất lượng nội dung, tương tác và tài nguyên hệ thống
            {generatedAt ? ` (Cập nhật: ${formatDateTimeVi(generatedAt)})` : ''}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div
            role="group"
            aria-label="Chọn khoảng thời gian thống kê"
            className="inline-flex flex-wrap items-center rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-1 shadow-xs"
          >
            {DASHBOARD_RANGE_OPTIONS.map((option) => {
              const selected = option.value === range
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onRangeChange(option.value)}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-medium transition-all sm:px-3',
                    selected
                      ? 'bg-[var(--foreground)] text-[var(--app-surface)] shadow-xs'
                      : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--foreground)]'
                  )}
                >
                  {option.shortLabel}
                </button>
              )
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu thống kê"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>

          <Link
            href="/posts/create"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-[var(--foreground)] px-3.5 text-xs font-medium text-[var(--app-surface)] shadow-xs transition-opacity hover:opacity-90 sm:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Viết bài mới</span>
          </Link>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="overflow-x-auto border-b border-[var(--app-border)]">
        <nav className="-mb-px flex min-w-max items-center gap-1" aria-label="Phân khu thống kê">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-[var(--app-link)] text-[var(--app-link)]'
                    : 'border-transparent text-[var(--app-muted)] hover:border-[var(--app-border-strong)] hover:text-[var(--foreground)]'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge ? (
                  <span
                    className={cn(
                      'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
                      tab.badgeTone === 'danger'
                        ? 'bg-[var(--app-danger-soft-bg)] text-[var(--app-danger-soft-fg)]'
                        : 'bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)]'
                    )}
                  >
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
