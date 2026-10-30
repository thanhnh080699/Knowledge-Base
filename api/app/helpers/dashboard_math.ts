import { DateTime } from 'luxon'
import type { DashboardRange, SeoIssueType } from '#validators/dashboard'

export interface DashboardPermissions {
  canReadPosts: boolean
  canManagePosts: boolean
  canViewComments: boolean
  canViewContacts: boolean
  canViewNewsletters: boolean
  canManageSettings: boolean
  canViewUsers: boolean
  canViewApiTokens: boolean
  canViewMedia: boolean
}

export interface DateWindow {
  range: DashboardRange
  granularity: 'day' | 'month'
  bucketCount: number
  currentStart: DateTime | null
  currentEnd: DateTime
  previousStart: DateTime | null
  previousEnd: DateTime | null
}

export interface TimelineBucket {
  key: string
  label: string
  views: number
  uniqueVisitors: number
  publishedPosts: number
  comments: number
  contacts: number
}

export interface BreakdownItem {
  name: string
  count: number
  percentage: number
}

export interface SeoHealthSummary {
  score: number
  totalPublished: number
  healthyPosts: number
  postsWithIssues: number
  issues: {
    missingMetaDescription: number
    missingFocusKeyword: number
    missingCoverImage: number
    missingExcerpt: number
    missingCanonical: number
    staleDrafts: number
  }
}

export const DIRECT_REFERRER_LABEL = 'Trực tiếp (Direct)'
export const UNKNOWN_LABEL = 'Không xác định'

export function resolvePermissions(slugs: string[]): DashboardPermissions {
  const set = new Set(slugs)
  const hasAny = (items: string[]) => items.some((slug) => set.has(slug))

  return {
    canReadPosts: hasAny(['posts.read', 'posts.manage']),
    canManagePosts: hasAny(['posts.manage']),
    canViewComments: hasAny(['comments.read', 'comments.manage']),
    canViewContacts: hasAny(['contacts.read', 'contacts.manage']),
    canViewNewsletters: hasAny(['newsletters.read', 'newsletters.manage']),
    canManageSettings: hasAny(['settings.manage']),
    canViewUsers: hasAny(['users.read', 'users.manage']),
    canViewApiTokens: hasAny(['api_tokens.read', 'api_tokens.manage']),
    canViewMedia: hasAny(['media.read', 'media.manage']),
  }
}

export function calculateGrowthPercent(current: number, previous: number | null): number | null {
  if (previous === null) return null
  if (previous === 0) {
    return current > 0 ? null : 0
  }
  return Math.round(((current - previous) / previous) * 1000) / 10
}

export function resolveDateWindows(
  range: DashboardRange,
  now: DateTime = DateTime.utc()
): DateWindow {
  const end = now.toUTC()

  if (range === 'all') {
    return {
      range,
      granularity: 'month',
      bucketCount: 12,
      currentStart: null,
      currentEnd: end,
      previousStart: null,
      previousEnd: null,
    }
  }

  if (range === '365d') {
    // Match the 12 displayed calendar-month buckets, including the current month.
    const currentStart = end.startOf('month').minus({ months: 11 })
    const previousEnd = currentStart
    const previousStart = previousEnd.minus({ months: 12 })
    return {
      range,
      granularity: 'month',
      bucketCount: 12,
      currentStart,
      currentEnd: end,
      previousStart,
      previousEnd,
    }
  }

  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30
  const currentStart = end.minus({ days: days - 1 }).startOf('day')
  const previousEnd = currentStart
  const previousStart = previousEnd.minus({ days })

  return {
    range,
    granularity: 'day',
    bucketCount: days,
    currentStart,
    currentEnd: end,
    previousStart,
    previousEnd,
  }
}

export function buildZeroFilledBuckets(window: DateWindow): TimelineBucket[] {
  const buckets: TimelineBucket[] = []
  const end = window.currentEnd

  if (window.granularity === 'month') {
    const startMonth = end.startOf('month').minus({ months: window.bucketCount - 1 })
    for (let i = 0; i < window.bucketCount; i++) {
      const point = startMonth.plus({ months: i })
      buckets.push({
        key: point.toFormat('yyyy-MM'),
        label: point.toFormat('MM/yyyy'),
        views: 0,
        uniqueVisitors: 0,
        publishedPosts: 0,
        comments: 0,
        contacts: 0,
      })
    }
    return buckets
  }

  const startDay = window.currentStart ?? end.minus({ days: window.bucketCount - 1 }).startOf('day')
  for (let i = 0; i < window.bucketCount; i++) {
    const point = startDay.plus({ days: i })
    buckets.push({
      key: point.toFormat('yyyy-MM-dd'),
      label: point.toFormat('dd/MM'),
      views: 0,
      uniqueVisitors: 0,
      publishedPosts: 0,
      comments: 0,
      contacts: 0,
    })
  }
  return buckets
}

export function evaluatePostSeoMissingFields(post: {
  meta_description?: string | null
  focus_keyword?: string | null
  cover_image?: string | null
  excerpt?: string | null
  canonical_url?: string | null
}): SeoIssueType[] {
  const issues: SeoIssueType[] = []
  if (!post.meta_description || !String(post.meta_description).trim()) {
    issues.push('missing_meta_description')
  }
  if (!post.focus_keyword || !String(post.focus_keyword).trim()) {
    issues.push('missing_focus_keyword')
  }
  if (!post.cover_image || !String(post.cover_image).trim()) {
    issues.push('missing_cover_image')
  }
  if (!post.excerpt || !String(post.excerpt).trim()) {
    issues.push('missing_excerpt')
  }
  if (!post.canonical_url || !String(post.canonical_url).trim()) {
    issues.push('missing_canonical')
  }
  return issues
}

export function toBreakdown(
  rows: Array<{ name: string | null; count: number }>,
  total: number
): BreakdownItem[] {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const name = row.name && String(row.name).trim() ? String(row.name).trim() : UNKNOWN_LABEL
    const count = Number(row.count) || 0
    counts.set(name, (counts.get(name) ?? 0) + count)
  }
  return [...counts].map(([name, count]) => {
    return {
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
    }
  })
}
