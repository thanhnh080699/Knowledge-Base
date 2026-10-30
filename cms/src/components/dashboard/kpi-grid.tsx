'use client'

import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  ChevronRight,
  Eye,
  FileText,
  MessageSquareText,
  Minus,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  formatCompactNumber,
  formatFullNumber,
  formatGrowthBadge,
  getRangeLabelVi,
  getSeoScoreGrade,
} from '@/lib/dashboard-utils'
import type { DashboardKpis, DashboardPermissions, DashboardRange } from '@/types/dashboard'

interface KpiGridProps {
  kpis: DashboardKpis
  permissions: DashboardPermissions
  range: DashboardRange
  onInspectViews: () => void
  onInspectPosts: () => void
  onInspectSeo: () => void
  onInspectEngagement: () => void
  onInspectAi: () => void
}

export function KpiGrid({
  kpis,
  permissions,
  range,
  onInspectViews,
  onInspectPosts,
  onInspectSeo,
  onInspectEngagement,
  onInspectAi,
}: KpiGridProps) {
  const rangeLabel = getRangeLabelVi(range)
  const viewsGrowth = formatGrowthBadge(kpis.views.growthPercent)
  const postsGrowth = formatGrowthBadge(kpis.posts.growthPercent)
  const engagementGrowth = formatGrowthBadge(kpis.engagement.growthPercent)
  const seoGrade = getSeoScoreGrade(kpis.seo.score)

  const cards = [
    {
      id: 'views',
      title: `Lượt xem (${rangeLabel})`,
      value: formatFullNumber(kpis.views.trackedInRange),
      subValue: `Tổng tích lũy: ${formatFullNumber(kpis.views.allTimeTotal)} · ${formatFullNumber(
        kpis.views.uniqueIpsInRange
      )} IP duy nhất`,
      badgeText: viewsGrowth.text,
      badgeTone: viewsGrowth.tone,
      icon: Eye,
      iconClass: 'bg-[var(--app-info-soft-bg)] text-[var(--app-info-soft-fg)]',
      actionLabel: permissions.canManagePosts ? 'Xem nhật ký người đọc' : 'Xem phân tích lưu lượng',
      onClick: onInspectViews,
    },
    {
      id: 'posts',
      title: 'Bài viết đã xuất bản',
      value: `${formatFullNumber(kpis.posts.published)} / ${formatFullNumber(kpis.posts.total)}`,
      subValue: `+${formatFullNumber(kpis.posts.publishedInRange)} xuất bản mới · ${formatFullNumber(
        kpis.posts.draft
      )} bản nháp`,
      badgeText: postsGrowth.text,
      badgeTone: postsGrowth.tone,
      icon: FileText,
      iconClass: 'bg-[var(--app-accent-soft-bg)] text-[var(--app-accent-soft-fg)]',
      actionLabel: 'Xem kho nội dung',
      onClick: onInspectPosts,
    },
    {
      id: 'seo',
      title: 'Điểm Sức khỏe SEO',
      value: `${kpis.seo.score}/100`,
      subValue: `${formatFullNumber(kpis.seo.healthyPosts)} bài đạt chuẩn · ${formatFullNumber(
        kpis.seo.postsWithIssues
      )} bài thiếu SEO`,
      badgeText: seoGrade.label,
      badgeTone:
        seoGrade.tone === 'excellent' || seoGrade.tone === 'good'
          ? ('positive' as const)
          : seoGrade.tone === 'warning'
            ? ('neutral' as const)
            : ('negative' as const),
      icon: ShieldCheck,
      iconClass: 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]',
      actionLabel: 'Kiểm tra chi tiết SEO',
      onClick: onInspectSeo,
    },
    {
      id: 'engagement',
      title: 'Tương tác & Bản tin',
      value: formatFullNumber(kpis.engagement.newInteractionsInRange),
      subValue: `${formatFullNumber(kpis.engagement.pendingComments)} bình luận chờ · ${formatFullNumber(
        kpis.engagement.pendingContacts
      )} liên hệ chờ · ${formatFullNumber(kpis.engagement.totalNewsletters)} sub`,
      badgeText: engagementGrowth.text,
      badgeTone: engagementGrowth.tone,
      icon: MessageSquareText,
      iconClass: 'bg-[var(--app-warning-soft-bg)] text-[var(--app-warning-soft-fg)]',
      actionLabel: 'Xem tương tác độc giả',
      onClick: onInspectEngagement,
    },
  ]

  if (kpis.ai.allowed) {
    cards.push({
      id: 'ai',
      title: 'Tiêu thụ Token AI / LLM',
      value: formatCompactNumber(kpis.ai.totalTokens),
      subValue: `In: ${formatCompactNumber(kpis.ai.inputTokens)} · Out: ${formatCompactNumber(
        kpis.ai.outputTokens
      )}`,
      badgeText: `${kpis.ai.activeProviders}/${kpis.ai.totalProviders} bật`,
      badgeTone: kpis.ai.activeProviders > 0 ? ('positive' as const) : ('neutral' as const),
      icon: Bot,
      iconClass: 'bg-[var(--app-accent-soft-bg)] text-[var(--app-accent-soft-fg)]',
      actionLabel: 'Chi tiết LLM & Hệ thống',
      onClick: onInspectAi,
    })
  }

  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2',
        kpis.ai.allowed ? 'xl:grid-cols-5' : 'lg:grid-cols-4'
      )}
    >
      {cards.filter((card) => permissions.canReadPosts || !['views', 'posts', 'seo'].includes(card.id)).map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
          >
            <Card
              role="button"
              tabIndex={0}
              onClick={card.onClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  card.onClick()
                }
              }}
              className="group h-full cursor-pointer transition-all hover:border-[var(--app-border-strong)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-ring)]"
            >
              <CardContent className="flex h-full flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className={cn('rounded-lg p-2.5', card.iconClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                        card.badgeTone === 'positive' &&
                          'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]',
                        card.badgeTone === 'negative' &&
                          'bg-[var(--app-danger-soft-bg)] text-[var(--app-danger-soft-fg)]',
                        card.badgeTone === 'neutral' &&
                          'bg-[var(--app-surface-strong)] text-[var(--app-muted-strong)]'
                      )}
                    >
                      {card.badgeTone === 'positive' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : card.badgeTone === 'negative' ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      {card.badgeText}
                    </span>
                  </div>

                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[var(--app-muted)]">
                    {card.title}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-[var(--foreground)]">
                    {card.value}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-xs text-[var(--app-muted)]">
                    {card.subValue}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--app-border)] pt-3 text-xs font-medium text-[var(--app-link)]">
                  <span>{card.actionLabel}</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
