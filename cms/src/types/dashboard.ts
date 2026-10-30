export type DashboardRange = '7d' | '30d' | '90d' | '365d' | 'all'

export type DashboardTab = 'overview' | 'traffic' | 'content' | 'system'

export type SeoIssueType =
  | 'all'
  | 'missing_meta_description'
  | 'missing_focus_keyword'
  | 'missing_cover_image'
  | 'missing_excerpt'
  | 'missing_canonical'
  | 'stale_draft'

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

export interface DashboardKpis {
  views: {
    allTimeTotal: number
    trackedInRange: number
    previousRange: number | null
    growthPercent: number | null
    uniqueIpsInRange: number
  }
  posts: {
    total: number
    published: number
    draft: number
    archived: number
    trashed: number
    publishedInRange: number
    growthPercent: number | null
  }
  seo: {
    score: number
    healthyPosts: number
    postsWithIssues: number
    staleDrafts: number
  }
  engagement: {
    pendingComments: number
    pendingContacts: number
    totalComments: number
    totalContacts: number
    totalNewsletters: number
    newInteractionsInRange: number
    growthPercent: number | null
  }
  ai: {
    allowed: boolean
    totalTokens: number
    inputTokens: number
    outputTokens: number
    activeProviders: number
    totalProviders: number
  }
}

export interface DashboardTimelinePoint {
  key: string
  label: string
  views: number
  uniqueVisitors: number
  publishedPosts: number
  comments: number
  contacts: number
}

export interface DashboardBreakdownItem {
  name: string
  count: number
  percentage: number
}

export interface DashboardReferrerItem {
  source: string
  count: number
  percentage: number
}

export interface DashboardLocationItem {
  country: string | null
  city: string | null
  label: string
  count: number
  percentage: number
}

export interface DashboardTopPostRangeItem {
  id: number
  title: string
  slug: string
  categoryName: string | null
  periodViews: number
  totalViews: number
  publishedAt: string | null
  coverImage: string | null
}

export interface DashboardTopPostAllTimeItem {
  id: number
  title: string
  slug: string
  categoryName: string | null
  totalViews: number
  publishedAt: string | null
  coverImage: string | null
}

export interface DashboardTrafficSection {
  allowed: boolean
  summary: {
    trackedViews: number
    previousTrackedViews: number | null
    growthPercent: number | null
    uniqueIps: number
  }
  devices: DashboardBreakdownItem[]
  browsers: DashboardBreakdownItem[]
  operatingSystems: DashboardBreakdownItem[]
  referrers: DashboardReferrerItem[]
  locations: DashboardLocationItem[]
  topPostsInRange: DashboardTopPostRangeItem[]
  topPostsAllTime: DashboardTopPostAllTimeItem[]
}

export interface StatusCountBreakdown {
  total: number
  published: number
  draft: number
  archived: number
}

export interface DashboardContentInventory {
  posts: StatusCountBreakdown & { trashed: number }
  pages: StatusCountBreakdown
  projects: StatusCountBreakdown & { featured: number }
  tools: StatusCountBreakdown & { featured: number }
  categories: { total: number }
  tags: { total: number }
  questionAnswers: {
    total: number
    published: number
    unpublished: number
  }
}

export interface DashboardCategoryDistItem {
  id: number
  name: string
  slug: string
  postCount: number
  totalViews: number
}

export interface DashboardSeoHealth {
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

export interface DashboardRecentPostItem {
  id: number
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  views: number
  categoryName: string | null
  coverImage: string | null
  publishedAt: string | null
  updatedAt: string | null
  seoChecksPassed: number
  seoChecksTotal: number
  missingSeoFields: SeoIssueType[]
}

export interface DashboardContentSection {
  inventory: DashboardContentInventory
  categoryDistribution: DashboardCategoryDistItem[]
  seoHealth: DashboardSeoHealth
  recentPosts: DashboardRecentPostItem[]
}

export interface DashboardEngagementSection {
  combinedGrowthPercent: number | null
  comments: {
    allowed: boolean
    total: number
    pending: number
    approved: number
    spam: number
    newInRange: number
    previousRange: number | null
    recentItems: Array<{
      id: number
      postId: number
      postTitle: string | null
      authorName: string
      contentPreview: string
      status: 'PENDING' | 'APPROVED' | 'SPAM'
      createdAt: string | null
    }>
  }
  contacts: {
    allowed: boolean
    total: number
    pending: number
    replied: number
    archived: number
    newInRange: number
    previousRange: number | null
    recentItems: Array<{
      id: number
      name: string
      email: string
      subject: string | null
      messagePreview: string
      status: 'PENDING' | 'REPLIED' | 'ARCHIVED'
      createdAt: string | null
    }>
  }
  newsletters: {
    allowed: boolean
    total: number
    newInRange: number
    previousRange: number | null
    recentItems: Array<{
      id: number
      email: string
      createdAt: string | null
    }>
  }
}

export interface DashboardSystemSection {
  llm: {
    allowed: boolean
    totalCount: number
    activeCount: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    providers: Array<{
      id: number
      name: string
      driver: string
      modelName: string
      isActive: boolean
      inputTokens: number
      outputTokens: number
      totalTokens: number
      tasks: string[]
    }>
  }
  apiTokens: {
    allowed: boolean
    total: number
    active: number
    expired: number
    usedLast7Days: number
    items: Array<{
      id: number
      name: string
      permissionsCount: number
      isExpired: boolean
      expiresAt: string | null
      lastUsedAt: string | null
      createdAt: string | null
    }>
  }
  users: {
    allowed: boolean
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    totalRoles: number
    totalPermissions: number
  }
  media: {
    allowed: boolean
    available: boolean
    rootFolders: number
    rootFiles: number
    rootSizeBytes: number
  }
}

export interface DashboardOverviewData {
  range: DashboardRange
  generatedAt: string
  permissions: DashboardPermissions
  kpis: DashboardKpis
  timeline: DashboardTimelinePoint[]
  traffic: DashboardTrafficSection
  content: DashboardContentSection
  engagement: DashboardEngagementSection
  system: DashboardSystemSection
}

export interface DashboardViewsFilter {
  page?: number
  limit?: number
  range?: DashboardRange
  postId?: number
  postTitle?: string
  device?: string
  browser?: string
  os?: string
  country?: string
  referrer?: string
  search?: string
}

export interface GlobalPostViewItem {
  id: number
  postId: number
  postTitle: string
  postSlug: string
  ip: string | null
  country: string | null
  region: string | null
  city: string | null
  browser: string
  os: string
  device: string
  referrer: string | null
  createdAt: string | null
}

export interface SeoIssuePostItem {
  id: number
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  views: number
  categoryName: string | null
  publishedAt: string | null
  updatedAt: string | null
  issues: SeoIssueType[]
}
