'use client'

import Link from 'next/link'
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Files,
  FileText,
  FolderOpen,
  ShieldAlert,
  Tag as TagIcon,
  Wrench,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  formatFullNumber,
  getSeoIssueLabelVi,
  getSeoScoreGrade,
} from '@/lib/dashboard-utils'
import type { DashboardOverviewData, SeoIssueType } from '@/types/dashboard'

interface ContentSeoTabProps {
  data: DashboardOverviewData
  onOpenSeoModal: (issue: SeoIssueType) => void
}

export function ContentSeoTab({ data, onOpenSeoModal }: ContentSeoTabProps) {
  const { inventory, categoryDistribution, seoHealth } = data.content
  const seoGrade = getSeoScoreGrade(seoHealth.score)

  const inventoryCards = [
    {
      label: 'Bài viết (Posts)',
      total: inventory.posts.total,
      detail: `${inventory.posts.published} xuất bản · ${inventory.posts.draft} nháp · ${inventory.posts.trashed} thùng rác`,
      icon: FileText,
      href: '/posts',
      color: 'bg-[var(--app-info-soft-bg)] text-[var(--app-info-soft-fg)]',
    },
    {
      label: 'Trang tĩnh (Pages)',
      total: inventory.pages.total,
      detail: `${inventory.pages.published} xuất bản · ${inventory.pages.draft} nháp`,
      icon: Files,
      href: '/pages',
      color: 'bg-[var(--app-accent-soft-bg)] text-[var(--app-accent-soft-fg)]',
    },
    {
      label: 'Dự án (Projects)',
      total: inventory.projects.total,
      detail: `${inventory.projects.published} xuất bản · ${inventory.projects.featured} nổi bật`,
      icon: BriefcaseBusiness,
      href: '/projects',
      color: 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]',
    },
    {
      label: 'Công cụ (Tools)',
      total: inventory.tools.total,
      detail: `${inventory.tools.published} xuất bản · ${inventory.tools.featured} nổi bật`,
      icon: Wrench,
      href: undefined,
      color: 'bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)]',
    },
    {
      label: 'Danh mục (Categories)',
      total: inventory.categories.total,
      detail: 'Phân cấp chuyên mục bài viết',
      icon: FolderOpen,
      href: '/categories',
      color: 'bg-[var(--app-info-soft-bg)] text-[var(--app-info-soft-fg)]',
    },
    {
      label: 'Thẻ (Tags)',
      total: inventory.tags.total,
      detail: 'Từ khóa phân loại chủ đề',
      icon: TagIcon,
      href: '/tags',
      color: 'bg-[var(--app-accent-soft-bg)] text-[var(--app-accent-soft-fg)]',
    },
    {
      label: 'Hỏi & Đáp (Q&A)',
      total: inventory.questionAnswers.total,
      detail: `${inventory.questionAnswers.published} hiển thị · ${inventory.questionAnswers.unpublished} ẩn`,
      icon: CircleHelp,
      href: '/question-answers',
      color: 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]',
    },
  ]

  const seoChecks: Array<{
    issue: SeoIssueType
    count: number
    hint: string
  }> = [
    {
      issue: 'missing_meta_description',
      count: seoHealth.issues.missingMetaDescription,
      hint: 'Giúp tăng tỷ lệ nhấp (CTR) trên trang kết quả Google & AI Search.',
    },
    {
      issue: 'missing_focus_keyword',
      count: seoHealth.issues.missingFocusKeyword,
      hint: 'Xác định chủ đề trọng tâm để tối ưu hóa từ khóa mục tiêu.',
    },
    {
      issue: 'missing_cover_image',
      count: seoHealth.issues.missingCoverImage,
      hint: 'Ảnh bìa 16:9 hiển thị trên thẻ bài viết, OpenGraph và mạng xã hội.',
    },
    {
      issue: 'missing_excerpt',
      count: seoHealth.issues.missingExcerpt,
      hint: 'Đoạn tóm tắt mở đầu hiển thị ở danh sách bài viết & RSS.',
    },
    {
      issue: 'missing_canonical',
      count: seoHealth.issues.missingCanonical,
      hint: 'Định danh URL gốc chuẩn tránh trùng lặp nội dung trên công cụ tìm kiếm.',
    },
    {
      issue: 'stale_draft',
      count: seoHealth.issues.staleDrafts,
      hint: 'Bản nháp tạo từ lâu (> 14 ngày) chưa được hoàn thiện hoặc xuất bản.',
    },
  ]

  const chartCategories = categoryDistribution.slice(0, 10)

  if (!data.permissions.canReadPosts) {
    return <p className="py-8 text-center text-sm text-[var(--app-muted)]">Tài khoản không có quyền xem dữ liệu bài viết.</p>
  }

  return (
    <div className="space-y-6">
      {/* Inventory Grid */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-[var(--foreground)]">
          Quy mô kho nội dung toàn hệ thống
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {inventoryCards.map((item) => {
            const Icon = item.icon
            const cardBody = (
              <Card
                className={cn(
                  'h-full transition-all',
                  item.href &&
                    'group-hover:border-[var(--app-border-strong)] group-hover:shadow-sm'
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={cn('rounded-lg p-2', item.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {item.href ? (
                      <ChevronRight className="h-4 w-4 text-[var(--app-muted)] transition-transform group-hover:translate-x-0.5" />
                    ) : null}
                  </div>
                  <p className="mt-3 text-xs font-medium text-[var(--app-muted)]">{item.label}</p>
                  <p className="mt-0.5 text-2xl font-bold text-[var(--foreground)]">
                    {formatFullNumber(item.total)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--app-muted)]">{item.detail}</p>
                </CardContent>
              </Card>
            )

            return item.href ? (
              <Link key={item.label} href={item.href} className="group block">
                {cardBody}
              </Link>
            ) : (
              <div key={item.label}>{cardBody}</div>
            )
          })}
        </div>
      </div>

      {/* SEO Health Audit Center */}
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-[var(--app-link)]" />
              Kiểm toán Chất lượng SEO & Biên tập
            </CardTitle>
            <CardDescription>
              Đánh giá tự động trên toàn bộ {formatFullNumber(seoHealth.totalPublished)} bài viết đã xuất bản. Bấm vào từng thẻ để mở danh sách bài cần tối ưu.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => onOpenSeoModal('all')}>
            Xem tất cả bài thiếu SEO ({formatFullNumber(seoHealth.postsWithIssues)})
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Score Box */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-6 text-center">
            <div className="text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
              {seoHealth.score}
              <span className="text-lg font-medium text-[var(--app-muted)]">/100</span>
            </div>
            <span
              className={cn(
                'mt-2 inline-flex rounded-full px-3 py-0.5 text-xs font-semibold',
                seoGrade.tone === 'excellent' || seoGrade.tone === 'good'
                  ? 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]'
                  : seoGrade.tone === 'warning'
                    ? 'bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)]'
                    : 'bg-[var(--app-danger-soft-bg)] text-[var(--app-danger-soft-fg)]'
              )}
            >
              {seoGrade.label}
            </span>
            <p className="mt-3 text-xs text-[var(--app-muted)]">
              <strong className="text-[var(--foreground)]">
                {formatFullNumber(seoHealth.healthyPosts)}
              </strong>{' '}
              / {formatFullNumber(seoHealth.totalPublished)} bài viết đạt đủ 5/5 tiêu chí metadata SEO.
            </p>
          </div>

          {/* 6 Check Cards */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {seoChecks.map((check) => {
              const hasIssue = check.count > 0
              return (
                <button
                  key={check.issue}
                  type="button"
                  onClick={() => onOpenSeoModal(check.issue)}
                  className="flex flex-col justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 text-left transition-all hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-hover)]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-[var(--foreground)]">
                        {getSeoIssueLabelVi(check.issue)}
                      </span>
                      {hasIssue ? (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-[var(--app-warning-soft-bg)] px-2.5 py-0.5 text-xs font-bold text-[var(--app-warning-soft-fg)]">
                          {formatFullNumber(check.count)} bài
                        </span>
                      ) : (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--app-success-soft-fg)]" />
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--app-muted)]">{check.hint}</p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--app-link)]">
                    {hasIssue ? 'Xem danh sách & chỉnh sửa' : 'Tất cả đạt chuẩn'}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution Chart & Table */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ bài viết & lượt xem theo Danh mục</CardTitle>
            <CardDescription>
              So sánh quy mô bài viết và tổng lượt đọc thu hút được ở từng chuyên mục.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartCategories.length === 0 ? (
              <p className="py-12 text-center text-sm text-[var(--app-muted)]">
                Chưa có danh mục nào.
              </p>
            ) : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartCategories}
                    margin={{ top: 8, right: 12, left: -10, bottom: 24 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--app-muted)' }}
                      interval={0}
                      angle={-18}
                      textAnchor="end"
                    />
                    <YAxis
                      yAxisId="left"
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--app-muted)' }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--app-muted)' }}
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
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                    <Bar
                      yAxisId="left"
                      dataKey="postCount"
                      name="Số bài viết"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="totalViews"
                      name="Tổng lượt xem"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hiệu suất chi tiết từng Danh mục</CardTitle>
            <CardDescription>
              Đánh giá lượt xem trung bình trên mỗi bài viết theo từng chuyên mục.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Danh mục</TableHead>
                  <TableHead className="text-right">Số bài</TableHead>
                  <TableHead className="text-right">Tổng xem</TableHead>
                  <TableHead className="text-right">TB / Bài</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryDistribution.map((cat) => {
                  const avg = cat.postCount > 0 ? Math.round(cat.totalViews / cat.postCount) : 0
                  return (
                    <TableRow key={cat.id}>
                      <TableCell>
                        <Link
                          href={`/categories/${cat.id}`}
                          className="font-medium text-[var(--foreground)] hover:text-[var(--app-link)]"
                        >
                          {cat.name}
                        </Link>
                        <span className="block font-mono text-xs text-[var(--app-muted)]">
                          /{cat.slug}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatFullNumber(cat.postCount)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-[var(--app-link)]">
                        {formatFullNumber(cat.totalViews)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-[var(--app-muted)]">
                        {formatFullNumber(avg)}
                      </TableCell>
                    </TableRow>
                  )
                })}
                {categoryDistribution.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-[var(--app-muted)]">
                      Chưa có dữ liệu danh mục.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
