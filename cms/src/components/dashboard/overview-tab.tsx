'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Eye,
  FileEdit,
  Globe,
  Image as ImageIcon,
  KeyRound,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tag } from '@/components/ui/tag'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  formatDateTimeVi,
  formatFullNumber,
  getRangeLabelVi,
} from '@/lib/dashboard-utils'
import type {
  DashboardOverviewData,
  DashboardTab,
  SeoIssueType,
} from '@/types/dashboard'
import type { useExternalAnalyticsSummary } from '@/hooks/queries/use-dashboard'

interface OverviewTabProps {
  data: DashboardOverviewData
  external: ReturnType<typeof useExternalAnalyticsSummary>
  onSwitchTab: (tab: DashboardTab) => void
  onOpenGlobalViews: () => void
  onOpenPostViews: (post: { id: number; title: string }) => void
  onOpenSeoModal: (issue?: SeoIssueType) => void
}

export function OverviewTab({
  data,
  external,
  onSwitchTab,
  onOpenGlobalViews,
  onOpenPostViews,
  onOpenSeoModal,
}: OverviewTabProps) {
  const [chartMode, setChartMode] = useState<'traffic' | 'activity'>('traffic')
  const [postListMode, setPostListMode] = useState<'trending' | 'recent'>('trending')

  const rangeLabel = getRangeLabelVi(data.range)

  const actionItems: Array<{
    id: string
    label: string
    count: number
    description: string
    tone: 'danger' | 'warning' | 'info'
    href?: string
    onClick?: () => void
  }> = []

  if (data.permissions.canViewComments && data.engagement.comments.pending > 0) {
    actionItems.push({
      id: 'pending-comments',
      label: 'Bình luận chờ kiểm duyệt',
      count: data.engagement.comments.pending,
      description: 'Cần phê duyệt hoặc đánh dấu spam để hiển thị an toàn.',
      tone: 'danger',
      href: '/comments',
    })
  }

  if (data.permissions.canViewContacts && data.engagement.contacts.pending > 0) {
    actionItems.push({
      id: 'pending-contacts',
      label: 'Yêu cầu liên hệ chưa phản hồi',
      count: data.engagement.contacts.pending,
      description: 'Khách truy cập đã gửi biểu mẫu liên hệ đang chờ xử lý.',
      tone: 'danger',
      href: '/contacts',
    })
  }

  if (data.content.seoHealth.postsWithIssues > 0) {
    actionItems.push({
      id: 'seo-issues',
      label: 'Bài xuất bản chưa đủ chuẩn SEO',
      count: data.content.seoHealth.postsWithIssues,
      description: 'Thiếu Meta Description, Từ khóa, Ảnh bìa, Excerpt hoặc Canonical.',
      tone: 'warning',
      onClick: () => onOpenSeoModal('all'),
    })
  }

  if (data.content.seoHealth.issues.staleDrafts > 0) {
    actionItems.push({
      id: 'stale-drafts',
      label: 'Bản nháp tồn đọng quá 14 ngày',
      count: data.content.seoHealth.issues.staleDrafts,
      description: 'Các bài viết nháp chưa được biên tập tiếp hoặc xuất bản.',
      tone: 'info',
      onClick: () => onOpenSeoModal('stale_draft'),
    })
  }

  if (data.permissions.canViewApiTokens && data.system.apiTokens.expired > 0) {
    actionItems.push({
      id: 'expired-tokens',
      label: 'API Access Token đã hết hạn',
      count: data.system.apiTokens.expired,
      description: 'Kiểm tra hoặc thu hồi các token tự động hóa không còn hiệu lực.',
      tone: 'warning',
      href: '/settings/api-tokens',
    })
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Main Trend Chart + Action Center */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Biểu đồ xu hướng ({data.range === 'all' ? '12 tháng gần nhất' : rangeLabel})</CardTitle>
              <CardDescription>
                {chartMode === 'traffic'
                  ? 'Đối chiếu số lượt xem bài viết được ghi nhận và số địa chỉ IP duy nhất theo thời gian.'
                  : 'Tần suất xuất bản bài viết mới, bình luận và liên hệ phát sinh theo thời gian.'}
              </CardDescription>
            </div>
            <div className="inline-flex rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-1">
              <button
                type="button"
                onClick={() => setChartMode('traffic')}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  chartMode === 'traffic'
                    ? 'bg-[var(--app-surface)] text-[var(--app-link)] shadow-xs'
                    : 'text-[var(--app-muted)] hover:text-[var(--foreground)]'
                )}
              >
                Lưu lượng đọc
              </button>
              <button
                type="button"
                onClick={() => setChartMode('activity')}
                className={cn(
                  'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                  chartMode === 'activity'
                    ? 'bg-[var(--app-surface)] text-[var(--app-link)] shadow-xs'
                    : 'text-[var(--app-muted)] hover:text-[var(--foreground)]'
                )}
              >
                Xuất bản & Tương tác
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'traffic' ? (
                  <AreaChart data={data.timeline} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashViewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.24} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dashVisitorsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--app-muted)' }}
                      minTickGap={18}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--app-muted)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--app-surface)',
                        color: 'var(--foreground)',
                        borderRadius: '10px',
                        border: '1px solid var(--app-border)',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Lượt xem"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#dashViewsGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="uniqueVisitors"
                      name="IP duy nhất"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#dashVisitorsGrad)"
                    />
                  </AreaChart>
                ) : (
                  <ComposedChart data={data.timeline} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--app-muted)' }}
                      minTickGap={18}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'var(--app-muted)' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--app-surface)',
                        color: 'var(--foreground)',
                        borderRadius: '10px',
                        border: '1px solid var(--app-border)',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar
                      dataKey="publishedPosts"
                      name="Bài xuất bản"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      name="Bình luận mới"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="contacts"
                      name="Liên hệ mới"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Center */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[var(--app-warning-soft-fg)]" />
              Hạng mục cần chú ý
            </CardTitle>
            <CardDescription>
              Tự động phát hiện các tác vụ biên tập, tương tác và hệ thống cần xử lý.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {actionItems.length === 0 ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)] p-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-[var(--app-success-soft-fg)]" />
                <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                  Hệ thống vận hành hoàn hảo!
                </p>
                <p className="mt-1 text-xs text-[var(--app-muted)]">
                  Không có bình luận chờ duyệt, liên hệ tồn đọng hay lỗi SEO nghiêm trọng.
                </p>
              </div>
            ) : (
              actionItems.map((item) => {
                const badgeClass =
                  item.tone === 'danger'
                    ? 'bg-[var(--app-danger-soft-bg)] text-[var(--app-danger-soft-fg)] border-[var(--app-danger-soft-border)]'
                    : item.tone === 'warning'
                      ? 'bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)] border-[var(--app-warning-soft-border)]'
                      : 'bg-[var(--app-info-soft-bg)] text-[var(--app-info-soft-fg)] border-[var(--app-info-soft-border)]'

                const inner = (
                  <div className="flex items-start justify-between gap-3 rounded-lg border border-[var(--app-border)] p-3.5 transition-colors hover:bg-[var(--app-surface-hover)]">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                      <p className="mt-0.5 text-xs text-[var(--app-muted)]">{item.description}</p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-bold',
                        badgeClass
                      )}
                    >
                      {formatFullNumber(item.count)}
                    </span>
                  </div>
                )

                if (item.href) {
                  return (
                    <Link key={item.id} href={item.href} className="block">
                      {inner}
                    </Link>
                  )
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.onClick}
                    className="block w-full text-left"
                  >
                    {inner}
                  </button>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Top / Recent Posts Table + Quick Actions & External Integrations */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>
                {postListMode === 'trending'
                  ? `Bài viết được đọc nhiều (${rangeLabel})`
                  : 'Bài viết cập nhật gần đây'}
              </CardTitle>
              <CardDescription>
                Bấm vào số lượt xem để tra cứu chi tiết IP, vị trí và thiết bị người đọc bài viết đó.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-1">
                <button
                  type="button"
                  onClick={() => setPostListMode('trending')}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    postListMode === 'trending'
                      ? 'bg-[var(--app-surface)] text-[var(--app-link)] shadow-xs'
                      : 'text-[var(--app-muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  Xu hướng
                </button>
                <button
                  type="button"
                  onClick={() => setPostListMode('recent')}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    postListMode === 'recent'
                      ? 'bg-[var(--app-surface)] text-[var(--app-link)] shadow-xs'
                      : 'text-[var(--app-muted)] hover:text-[var(--foreground)]'
                  )}
                >
                  Mới cập nhật
                </button>
              </div>
              {data.permissions.canManagePosts ? (
                <Button variant="outline" size="sm" onClick={onOpenGlobalViews} className="h-8 text-xs">
                  Nhật ký lượt xem
                </Button>
              ) : null}
              <Link
                href="/posts"
                className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-[var(--app-link)] hover:bg-[var(--app-surface-hover)]"
              >
                Tất cả bài viết
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {postListMode === 'trending' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài viết</TableHead>
                    <TableHead className="hidden md:table-cell">Danh mục</TableHead>
                    <TableHead className="text-right">Trong kỳ</TableHead>
                    <TableHead className="text-right">Tổng xem</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.traffic.topPostsInRange.length > 0
                    ? data.traffic.topPostsInRange
                    : data.traffic.topPostsAllTime.map((item) => ({
                        ...item,
                        periodViews: 0,
                      }))
                  )
                    .slice(0, 7)
                    .map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="max-w-[260px]">
                          <div className="truncate font-medium text-[var(--foreground)]">
                            {post.title}
                          </div>
                          <div className="truncate font-mono text-xs text-[var(--app-muted)]">
                            /{post.slug}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-[var(--app-muted)]">
                          {post.categoryName || 'Chưa phân loại'}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[var(--app-link)]">
                          +{formatFullNumber(post.periodViews)}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.permissions.canManagePosts ? (
                            <button
                              type="button"
                              onClick={() => onOpenPostViews({ id: post.id, title: post.title })}
                              className="inline-flex items-center gap-1 font-medium text-[var(--foreground)] underline-offset-4 hover:text-[var(--app-link)] hover:underline"
                              title="Xem chi tiết lịch sử người đọc bài viết này"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              {formatFullNumber(post.totalViews)}
                            </button>
                          ) : (
                            <span>{formatFullNumber(post.totalViews)}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/posts/${post.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--foreground)]"
                            title="Chỉnh sửa bài viết"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  {data.traffic.topPostsInRange.length === 0 &&
                  data.traffic.topPostsAllTime.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-[var(--app-muted)]">
                        Chưa có dữ liệu bài viết xuất bản.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài viết</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="hidden sm:table-cell">Chuẩn SEO</TableHead>
                    <TableHead className="hidden md:table-cell">Cập nhật</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.content.recentPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="max-w-[240px]">
                        <div className="truncate font-medium text-[var(--foreground)]">
                          #{post.id} · {post.title}
                        </div>
                        <div className="truncate text-xs text-[var(--app-muted)]">
                          {post.categoryName || 'Chưa phân loại'} · {formatFullNumber(post.views)} lượt xem
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tag
                          variant={
                            post.status === 'PUBLISHED'
                              ? 'success'
                              : post.status === 'ARCHIVED'
                                ? 'secondary'
                                : 'warning'
                          }
                        >
                          {post.status === 'PUBLISHED'
                            ? 'Xuất bản'
                            : post.status === 'DRAFT'
                              ? 'Bản nháp'
                              : 'Lưu trữ'}
                        </Tag>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                            post.seoChecksPassed === post.seoChecksTotal
                              ? 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]'
                              : 'bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)]'
                          )}
                        >
                          {post.seoChecksPassed}/{post.seoChecksTotal} mục
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-[var(--app-muted)]">
                        {formatDateTimeVi(post.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          {data.permissions.canManagePosts ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onOpenPostViews({ id: post.id, title: post.title })}
                              title="Xem lịch sử lượt xem"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : null}
                          <Link
                            href={`/posts/${post.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--foreground)]"
                            title="Chỉnh sửa bài viết"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.content.recentPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-[var(--app-muted)]">
                        Chưa có bài viết nào.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Right column: External GA4 / GSC Snapshot + Quick Actions */}
        <div className="space-y-6">
          {data.permissions.canManageSettings ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Google Analytics & Search</span>
                  <button
                    type="button"
                    onClick={() => onSwitchTab('system')}
                    className="text-xs font-medium text-[var(--app-link)] hover:underline"
                  >
                    Chi tiết
                  </button>
                </CardTitle>
                <CardDescription>
                  Tóm tắt nhanh dữ liệu kết nối từ Google (30 ngày gần nhất).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* GA4 Summary Box */}
                <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
                      <Globe className="h-3.5 w-3.5 text-[var(--app-link)]" />
                      Google Analytics 4
                    </span>
                    <Link
                      href="/settings/others/google-analytics"
                      className="text-xs text-[var(--app-link)] hover:underline"
                    >
                      {external.ga.enabled ? 'Mở GA4' : 'Cấu hình'}
                    </Link>
                  </div>
                  {external.ga.enabled && external.ga.data ? (
                    <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded bg-[var(--app-surface)] p-2">
                        <div className="text-[11px] text-[var(--app-muted)]">Online</div>
                        <div className="text-sm font-bold text-[var(--app-success-soft-fg)]">
                          {external.ga.activeUsers ?? '0'}
                        </div>
                      </div>
                      <div className="rounded bg-[var(--app-surface)] p-2">
                        <div className="text-[11px] text-[var(--app-muted)]">Users</div>
                        <div className="text-sm font-bold text-[var(--foreground)]">
                          {external.ga.data.overview.users}
                        </div>
                      </div>
                      <div className="rounded bg-[var(--app-surface)] p-2">
                        <div className="text-[11px] text-[var(--app-muted)]">Pageviews</div>
                        <div className="text-sm font-bold text-[var(--foreground)]">
                          {external.ga.data.overview.pageViews}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1.5 text-xs text-[var(--app-muted)]">
                      {external.ga.isLoading
                        ? 'Đang đồng bộ GA4...'
                        : external.ga.hasError
                          ? 'Chưa thể tải dữ liệu GA4 (kiểm tra Service Account).'
                          : 'Chưa bật kết nối báo cáo GA4.'}
                    </p>
                  )}
                </div>

                {/* GSC Summary Box */}
                <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)]">
                      <Search className="h-3.5 w-3.5 text-[var(--app-accent-soft-fg)]" />
                      Google Search Console
                    </span>
                    <Link
                      href="/settings/others/google-search-console"
                      className="text-xs text-[var(--app-link)] hover:underline"
                    >
                      {external.gsc.connected ? 'Mở GSC' : 'Kết nối'}
                    </Link>
                  </div>
                  {external.gsc.connected && external.gsc.data ? (
                    <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded bg-[var(--app-surface)] p-2">
                        <div className="text-[11px] text-[var(--app-muted)]">Clicks</div>
                        <div className="text-sm font-bold text-[var(--foreground)]">
                          {formatFullNumber(external.gsc.data.overview.clicks)}
                        </div>
                      </div>
                      <div className="rounded bg-[var(--app-surface)] p-2">
                        <div className="text-[11px] text-[var(--app-muted)]">Hiển thị</div>
                        <div className="text-sm font-bold text-[var(--foreground)]">
                          {formatFullNumber(external.gsc.data.overview.impressions)}
                        </div>
                      </div>
                      <div className="rounded bg-[var(--app-surface)] p-2">
                        <div className="text-[11px] text-[var(--app-muted)]">Vị trí TB</div>
                        <div className="text-sm font-bold text-[var(--app-link)]">
                          #{external.gsc.data.overview.position}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1.5 text-xs text-[var(--app-muted)]">
                      {external.gsc.isLoading
                        ? 'Đang kiểm tra kết nối GSC...'
                        : external.gsc.hasError
                          ? 'Không tải được dữ liệu Search Console.'
                          : 'Chưa liên kết tài khoản Google Search Console.'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Real Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lối tắt quản trị nhanh</CardTitle>
              <CardDescription>Truy cập trực tiếp các phân hệ thường dùng.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2.5">
              <Link
                href="/posts/create"
                className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                <Plus className="h-4 w-4 text-[var(--app-link)]" />
                <span>Viết bài mới</span>
              </Link>
              <Link
                href="/media"
                className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                <ImageIcon className="h-4 w-4 text-[var(--app-accent-soft-fg)]" />
                <span>Thư viện Media</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                <BriefcaseBusiness className="h-4 w-4 text-[var(--app-success-soft-fg)]" />
                <span>Dự án (Projects)</span>
              </Link>
              <Link
                href="/pages"
                className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                <FileEdit className="h-4 w-4 text-[var(--app-warning-soft-fg)]" />
                <span>Trang tĩnh</span>
              </Link>
              {data.permissions.canViewComments ? (
                <Link
                  href="/comments"
                  className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
                >
                  <MessageSquare className="h-4 w-4 text-[var(--app-info-soft-fg)]" />
                  <span>Bình luận</span>
                </Link>
              ) : null}
              {data.permissions.canViewContacts ? (
                <Link
                  href="/contacts"
                  className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
                >
                  <Mail className="h-4 w-4 text-[var(--app-danger-soft-fg)]" />
                  <span>Liên hệ & Sub</span>
                </Link>
              ) : null}
              {data.permissions.canManageSettings ? (
                <Link
                  href="/settings/llm"
                  className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
                >
                  <Bot className="h-4 w-4 text-[var(--app-accent-soft-fg)]" />
                  <span>Cấu hình LLM</span>
                </Link>
              ) : null}
              {data.permissions.canViewUsers ? (
                <Link
                  href="/users"
                  className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
                >
                  <Users className="h-4 w-4 text-[var(--app-muted-strong)]" />
                  <span>Người dùng</span>
                </Link>
              ) : null}
              {data.permissions.canViewApiTokens ? (
                <Link
                  href="/settings/api-tokens"
                  className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
                >
                  <KeyRound className="h-4 w-4 text-[var(--app-warning-soft-fg)]" />
                  <span>API Tokens</span>
                </Link>
              ) : null}
              <button
                type="button"
                onClick={() => onSwitchTab('traffic')}
                className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-left text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                <Activity className="h-4 w-4 text-[var(--app-link)]" />
                <span>Phân tích độc giả</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenSeoModal('all')}
                className="flex items-center gap-2 rounded-lg border border-[var(--app-border)] p-2.5 text-left text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                <Clock className="h-4 w-4 text-[var(--app-success-soft-fg)]" />
                <span>Kiểm toán SEO</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
