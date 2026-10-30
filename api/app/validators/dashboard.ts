import vine from '@vinejs/vine'

export const DASHBOARD_RANGES = ['7d', '30d', '90d', '365d', 'all'] as const
export type DashboardRange = (typeof DASHBOARD_RANGES)[number]

export const SEO_ISSUE_TYPES = [
  'all',
  'missing_meta_description',
  'missing_focus_keyword',
  'missing_cover_image',
  'missing_excerpt',
  'missing_canonical',
  'stale_draft',
] as const
export type SeoIssueType = (typeof SEO_ISSUE_TYPES)[number]

export const dashboardOverviewValidator = vine.compile(
  vine.object({
    range: vine.enum(DASHBOARD_RANGES).optional(),
  })
)

export const dashboardViewsQueryValidator = vine.compile(
  vine.object({
    page: vine.number().withoutDecimals().min(1).max(100000).optional(),
    limit: vine.number().withoutDecimals().min(1).max(50).optional(),
    range: vine.enum(DASHBOARD_RANGES).optional(),
    postId: vine.number().withoutDecimals().min(1).optional(),
    device: vine.string().trim().maxLength(50).optional(),
    browser: vine.string().trim().maxLength(50).optional(),
    os: vine.string().trim().maxLength(50).optional(),
    country: vine.string().trim().maxLength(50).optional(),
    referrer: vine.string().trim().maxLength(255).optional(),
    search: vine.string().trim().maxLength(150).optional(),
  })
)

export const dashboardSeoIssuesValidator = vine.compile(
  vine.object({
    page: vine.number().withoutDecimals().min(1).max(100000).optional(),
    limit: vine.number().withoutDecimals().min(1).max(50).optional(),
    issue: vine.enum(SEO_ISSUE_TYPES).optional(),
    search: vine.string().trim().maxLength(150).optional(),
  })
)
