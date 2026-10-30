import type { DashboardRange, SeoIssueType } from '@/types/dashboard'

export const DASHBOARD_RANGE_OPTIONS: Array<{
  value: DashboardRange
  label: string
  shortLabel: string
}> = [
  { value: '7d', label: '7 ngày qua', shortLabel: '7 ngày' },
  { value: '30d', label: '30 ngày qua', shortLabel: '30 ngày' },
  { value: '90d', label: '90 ngày qua', shortLabel: '90 ngày' },
  { value: '365d', label: '12 tháng qua', shortLabel: '1 năm' },
  { value: 'all', label: 'Toàn thời gian', shortLabel: 'Tất cả' },
]

export function getRangeLabelVi(range: DashboardRange): string {
  return DASHBOARD_RANGE_OPTIONS.find((item) => item.value === range)?.label ?? '30 ngày qua'
}

export function formatFullNumber(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0'
  return new Intl.NumberFormat('vi-VN').format(Math.round(value))
}

export function formatCompactNumber(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '0'
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  }
  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (abs >= 10_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return formatFullNumber(value)
}

export function formatBytes(bytes: number | null | undefined): string {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1).replace(/\.0$/, '')} ${units[unitIndex]}`
}

export function formatGrowthBadge(growthPercent: number | null | undefined): {
  text: string
  tone: 'positive' | 'negative' | 'neutral'
} {
  if (growthPercent === null || growthPercent === undefined || !Number.isFinite(growthPercent)) {
    return { text: 'Chưa có cơ sở so sánh', tone: 'neutral' }
  }
  if (growthPercent > 0) {
    return { text: `+${growthPercent}%`, tone: 'positive' }
  }
  if (growthPercent < 0) {
    return { text: `${growthPercent}%`, tone: 'negative' }
  }
  return { text: '0%', tone: 'neutral' }
}

export function formatDateTimeVi(value: string | null | undefined): string {
  if (!value) return '--'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '--'
  return parsed.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTimeVi(
  value: string | null | undefined,
  nowMs: number = Date.now()
): string {
  if (!value) return 'Chưa từng'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '--'

  const diffSeconds = Math.floor((nowMs - parsed.getTime()) / 1000)
  if (diffSeconds < 60) return 'Vừa xong'
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes} phút trước`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays} ngày trước`
  return parsed.toLocaleDateString('vi-VN')
}

export function getSeoIssueLabelVi(issue: SeoIssueType): string {
  switch (issue) {
    case 'missing_meta_description':
      return 'Thiếu Meta Description'
    case 'missing_focus_keyword':
      return 'Thiếu Từ khóa trọng tâm'
    case 'missing_cover_image':
      return 'Thiếu Ảnh bìa'
    case 'missing_excerpt':
      return 'Thiếu Tóm tắt (Excerpt)'
    case 'missing_canonical':
      return 'Thiếu Canonical URL'
    case 'stale_draft':
      return 'Bản nháp tồn đọng > 14 ngày'
    case 'all':
    default:
      return 'Tất cả bài viết thiếu SEO'
  }
}

export function getSeoScoreGrade(score: number): {
  label: string
  tone: 'excellent' | 'good' | 'warning' | 'critical'
} {
  if (score >= 90) return { label: 'Xuất sắc', tone: 'excellent' }
  if (score >= 75) return { label: 'Tốt', tone: 'good' }
  if (score >= 50) return { label: 'Cần cải thiện', tone: 'warning' }
  return { label: 'Cần tối ưu gấp', tone: 'critical' }
}

export function getDeviceLabelVi(device: string): string {
  const normalized = device.trim().toLowerCase()
  if (normalized === 'desktop') return 'Máy tính (Desktop)'
  if (normalized === 'mobile') return 'Điện thoại (Mobile)'
  if (normalized === 'tablet') return 'Máy tính bảng (Tablet)'
  if (normalized === 'bot') return 'Trình thu thập (Bot)'
  return device || 'Không xác định'
}
