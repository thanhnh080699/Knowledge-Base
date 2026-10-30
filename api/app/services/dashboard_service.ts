import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import type { DatabaseQueryBuilderContract } from '@adonisjs/lucid/types/querybuilder'
import CdnMediaService from '#services/cdn_media_service'
import type { DashboardRange, SeoIssueType } from '#validators/dashboard'
import {
  buildZeroFilledBuckets,
  calculateGrowthPercent,
  DIRECT_REFERRER_LABEL,
  evaluatePostSeoMissingFields,
  resolveDateWindows,
  resolvePermissions,
  toBreakdown,
  UNKNOWN_LABEL,
  type BreakdownItem,
  type DashboardPermissions,
  type DateWindow,
  type SeoHealthSummary,
  type TimelineBucket,
} from '#helpers/dashboard_math'

export {
  buildZeroFilledBuckets,
  calculateGrowthPercent,
  evaluatePostSeoMissingFields,
  resolveDateWindows,
  resolvePermissions,
  toBreakdown,
  type BreakdownItem,
  type DashboardPermissions,
  type DateWindow,
  type SeoHealthSummary,
  type TimelineBucket,
}

export default class DashboardService {
  private cdn = new CdnMediaService()

  private get dialectName(): string {
    return db.connection().dialect.name
  }

  private get isSqlite(): boolean {
    return this.dialectName.toLowerCase().includes('sqlite')
  }

  private applyDateWindow(
    query: DatabaseQueryBuilderContract<any>,
    column: string,
    start: DateTime | null,
    end?: DateTime | null
  ) {
    if (!start && !end) return query

    if (this.isSqlite) {
      const epochExpr = `CASE WHEN typeof(??) IN ('integer', 'real') THEN ?? / 1000.0 ELSE CAST(strftime('%s', ??) AS REAL) END`
      if (start) {
        query.whereRaw(`${epochExpr} >= ?`, [column, column, column, start.toSeconds()])
      }
      if (end) {
        query.whereRaw(`${epochExpr} < ?`, [column, column, column, end.toSeconds()])
      }
      return query
    }

    if (start) {
      query.where(column, '>=', start.toJSDate())
    }
    if (end) {
      query.where(column, '<', end.toJSDate())
    }
    return query
  }

  private bucketExpression(
    column: string,
    granularity: 'day' | 'month'
  ): { sql: string; bindings: string[] } {
    if (this.isSqlite) {
      const fmt = granularity === 'month' ? '%Y-%m' : '%Y-%m-%d'
      return {
        sql: `CASE WHEN typeof(??) IN ('integer', 'real') THEN strftime('${fmt}', ?? / 1000.0, 'unixepoch') ELSE strftime('${fmt}', ??) END`,
        bindings: [column, column, column],
      }
    }

    const fmt = granularity === 'month' ? '%Y-%m' : '%Y-%m-%d'
    return {
      sql: `DATE_FORMAT(??, '${fmt}')`,
      bindings: [column],
    }
  }

  async getOverview(range: DashboardRange, permissionSlugs: string[]) {
    const permissions = resolvePermissions(permissionSlugs)
    const now = DateTime.utc()
    const window = resolveDateWindows(range, now)

    const [contentAndSeo, traffic, timeline, engagement, system] = await Promise.all([
      this.getContentAndSeoSection(window, now, permissions),
      permissions.canReadPosts
        ? this.getTrafficSection(window)
        : Promise.resolve(this.emptyTrafficSection()),
      this.getTimelineSection(window, permissions),
      this.getEngagementSection(window, permissions),
      this.getSystemSection(now, permissions),
    ])

    const kpis = {
      views: {
        allTimeTotal: contentAndSeo.totals.totalViewsAllTime,
        trackedInRange: traffic.summary.trackedViews,
        previousRange: traffic.summary.previousTrackedViews,
        growthPercent: traffic.summary.growthPercent,
        uniqueIpsInRange: traffic.summary.uniqueIps,
      },
      posts: {
        total: contentAndSeo.inventory.posts.total,
        published: contentAndSeo.inventory.posts.published,
        draft: contentAndSeo.inventory.posts.draft,
        archived: contentAndSeo.inventory.posts.archived,
        trashed: contentAndSeo.inventory.posts.trashed,
        publishedInRange: contentAndSeo.totals.publishedInRange,
        growthPercent: contentAndSeo.totals.publishedGrowthPercent,
      },
      seo: {
        score: contentAndSeo.seoHealth.score,
        healthyPosts: contentAndSeo.seoHealth.healthyPosts,
        postsWithIssues: contentAndSeo.seoHealth.postsWithIssues,
        staleDrafts: contentAndSeo.seoHealth.issues.staleDrafts,
      },
      engagement: {
        pendingComments: engagement.comments.pending,
        pendingContacts: engagement.contacts.pending,
        totalComments: engagement.comments.total,
        totalContacts: engagement.contacts.total,
        totalNewsletters: engagement.newsletters.total,
        newInteractionsInRange:
          engagement.comments.newInRange +
          engagement.contacts.newInRange +
          engagement.newsletters.newInRange,
        growthPercent: engagement.combinedGrowthPercent,
      },
      ai: {
        allowed: permissions.canManageSettings,
        totalTokens: system.llm.totalTokens,
        inputTokens: system.llm.inputTokens,
        outputTokens: system.llm.outputTokens,
        activeProviders: system.llm.activeCount,
        totalProviders: system.llm.totalCount,
      },
    }

    return {
      range,
      generatedAt: now.toISO(),
      permissions,
      kpis,
      timeline,
      traffic,
      content: {
        inventory: contentAndSeo.inventory,
        categoryDistribution: contentAndSeo.categoryDistribution,
        seoHealth: contentAndSeo.seoHealth,
        recentPosts: contentAndSeo.recentPosts,
      },
      engagement,
      system,
    }
  }

  private emptyTrafficSection() {
    return {
      allowed: false,
      summary: {
        trackedViews: 0,
        previousTrackedViews: null as number | null,
        growthPercent: null as number | null,
        uniqueIps: 0,
      },
      devices: [] as BreakdownItem[],
      browsers: [] as BreakdownItem[],
      operatingSystems: [] as BreakdownItem[],
      referrers: [] as Array<{ source: string; count: number; percentage: number }>,
      locations: [] as Array<{
        country: string | null
        city: string | null
        label: string
        count: number
        percentage: number
      }>,
      topPostsInRange: [] as Array<{
        id: number
        title: string
        slug: string
        categoryName: string | null
        periodViews: number
        totalViews: number
        publishedAt: string | null
        coverImage: string | null
      }>,
      topPostsAllTime: [] as Array<{
        id: number
        title: string
        slug: string
        categoryName: string | null
        totalViews: number
        publishedAt: string | null
        coverImage: string | null
      }>,
    }
  }

  private async getTrafficSection(window: DateWindow) {
    const currentViewsQuery = db.from('post_views')
    this.applyDateWindow(
      currentViewsQuery,
      'post_views.created_at',
      window.currentStart,
      window.currentEnd
    )

    const uniqueIpsQuery = db.from('post_views').whereNotNull('ip').where('ip', '!=', '')
    this.applyDateWindow(
      uniqueIpsQuery,
      'post_views.created_at',
      window.currentStart,
      window.currentEnd
    )

    const previousViewsPromise =
      window.previousStart && window.previousEnd
        ? (() => {
            const q = db.from('post_views')
            this.applyDateWindow(
              q,
              'post_views.created_at',
              window.previousStart,
              window.previousEnd
            )
            return q.count('* as total').first()
          })()
        : Promise.resolve(null)

    const devicesQuery = db
      .from('post_views')
      .select('device as name')
      .count('* as count')
      .groupBy('device')
      .orderBy('count', 'desc')
    this.applyDateWindow(
      devicesQuery,
      'post_views.created_at',
      window.currentStart,
      window.currentEnd
    )

    const browsersQuery = db
      .from('post_views')
      .select('browser as name')
      .count('* as count')
      .groupBy('browser')
      .orderBy('count', 'desc')
      .limit(8)
    this.applyDateWindow(
      browsersQuery,
      'post_views.created_at',
      window.currentStart,
      window.currentEnd
    )

    const osQuery = db
      .from('post_views')
      .select('os as name')
      .count('* as count')
      .groupBy('os')
      .orderBy('count', 'desc')
      .limit(8)
    this.applyDateWindow(osQuery, 'post_views.created_at', window.currentStart, window.currentEnd)

    const referrersQuery = db
      .from('post_views')
      .select('referrer')
      .count('* as count')
      .groupBy('referrer')
      .orderBy('count', 'desc')
      .limit(10)
    this.applyDateWindow(
      referrersQuery,
      'post_views.created_at',
      window.currentStart,
      window.currentEnd
    )

    const locationsQuery = db
      .from('post_views')
      .select('country', 'city')
      .count('* as count')
      .groupBy('country', 'city')
      .orderBy('count', 'desc')
      .limit(10)
    this.applyDateWindow(
      locationsQuery,
      'post_views.created_at',
      window.currentStart,
      window.currentEnd
    )

    const topInRangeQuery = db
      .from('post_views')
      .innerJoin('posts', 'posts.id', 'post_views.post_id')
      .leftJoin('categories', 'categories.id', 'posts.category_id')
      .whereNull('posts.deleted_at')
      .select(
        'posts.id',
        'posts.title',
        'posts.slug',
        'posts.views as total_views',
        'posts.published_at',
        'posts.cover_image',
        'categories.name as category_name'
      )
      .count('post_views.id as period_views')
      .groupBy(
        'posts.id',
        'posts.title',
        'posts.slug',
        'posts.views',
        'posts.published_at',
        'posts.cover_image',
        'categories.name'
      )
      .orderBy('period_views', 'desc')
      .orderBy('posts.views', 'desc')
      .limit(10)
    this.applyDateWindow(
      topInRangeQuery,
      'post_views.created_at',
      window.currentStart,
      window.currentEnd
    )

    const topAllTimeQuery = db
      .from('posts')
      .leftJoin('categories', 'categories.id', 'posts.category_id')
      .whereNull('posts.deleted_at')
      .where('posts.status', 'PUBLISHED')
      .select(
        'posts.id',
        'posts.title',
        'posts.slug',
        'posts.views as total_views',
        'posts.published_at',
        'posts.cover_image',
        'categories.name as category_name'
      )
      .orderBy('posts.views', 'desc')
      .orderBy('posts.id', 'desc')
      .limit(10)

    const [
      currentTotalRow,
      uniqueIpsRow,
      previousTotalRow,
      deviceRows,
      browserRows,
      osRows,
      referrerRows,
      locationRows,
      topInRangeRows,
      topAllTimeRows,
    ] = await Promise.all([
      currentViewsQuery.count('* as total').first(),
      uniqueIpsQuery.countDistinct('ip as total').first(),
      previousViewsPromise,
      devicesQuery,
      browsersQuery,
      osQuery,
      referrersQuery,
      locationsQuery,
      topInRangeQuery,
      topAllTimeQuery,
    ])

    const trackedViews = Number(currentTotalRow?.total ?? 0)
    const uniqueIps = Number(uniqueIpsRow?.total ?? 0)
    const previousTrackedViews =
      previousTotalRow !== null ? Number(previousTotalRow?.total ?? 0) : null
    const growthPercent = calculateGrowthPercent(trackedViews, previousTrackedViews)

    const referrers = referrerRows.map((row: any) => {
      const count = Number(row.count) || 0
      const source =
        row.referrer && String(row.referrer).trim()
          ? String(row.referrer).trim()
          : DIRECT_REFERRER_LABEL
      return {
        source,
        count,
        percentage: trackedViews > 0 ? Math.round((count / trackedViews) * 1000) / 10 : 0,
      }
    })

    const locations = locationRows.map((row: any) => {
      const count = Number(row.count) || 0
      const country = row.country ? String(row.country).trim() : null
      const city = row.city ? String(row.city).trim() : null
      const label = [city, country].filter(Boolean).join(', ') || UNKNOWN_LABEL
      return {
        country,
        city,
        label,
        count,
        percentage: trackedViews > 0 ? Math.round((count / trackedViews) * 1000) / 10 : 0,
      }
    })

    return {
      allowed: true,
      summary: {
        trackedViews,
        previousTrackedViews,
        growthPercent,
        uniqueIps,
      },
      devices: toBreakdown(deviceRows as any, trackedViews),
      browsers: toBreakdown(browserRows as any, trackedViews),
      operatingSystems: toBreakdown(osRows as any, trackedViews),
      referrers,
      locations,
      topPostsInRange: topInRangeRows.map((row: any) => ({
        id: Number(row.id),
        title: String(row.title),
        slug: String(row.slug),
        categoryName: row.category_name ? String(row.category_name) : null,
        periodViews: Number(row.period_views) || 0,
        totalViews: Number(row.total_views) || 0,
        publishedAt: this.serializeTimestamp(row.published_at),
        coverImage: row.cover_image ? String(row.cover_image) : null,
      })),
      topPostsAllTime: topAllTimeRows.map((row: any) => ({
        id: Number(row.id),
        title: String(row.title),
        slug: String(row.slug),
        categoryName: row.category_name ? String(row.category_name) : null,
        totalViews: Number(row.total_views) || 0,
        publishedAt: this.serializeTimestamp(row.published_at),
        coverImage: row.cover_image ? String(row.cover_image) : null,
      })),
    }
  }

  private async getTimelineSection(window: DateWindow, permissions: DashboardPermissions) {
    const buckets = buildZeroFilledBuckets(window)
    const bucketMap = new Map<string, TimelineBucket>(buckets.map((b) => [b.key, b]))
    const timelineFloor =
      window.granularity === 'month'
        ? window.currentEnd.startOf('month').minus({ months: window.bucketCount - 1 })
        : window.currentStart

    const viewsBucket = this.bucketExpression('post_views.created_at', window.granularity)
    const postsBucket = this.bucketExpression('posts.published_at', window.granularity)
    const commentsBucket = this.bucketExpression('comments.created_at', window.granularity)
    const contactsBucket = this.bucketExpression('contact_requests.created_at', window.granularity)

    const viewsTimelinePromise = permissions.canReadPosts
      ? (() => {
          const q = db
            .from('post_views')
            .select(db.raw(`${viewsBucket.sql} as bucket`, viewsBucket.bindings))
            .count('* as views')
            .countDistinct({ unique_visitors: db.raw("NULLIF(??, '')", ['ip']) })
            .groupBy('bucket')
          this.applyDateWindow(q, 'post_views.created_at', timelineFloor, window.currentEnd)
          return q
        })()
      : Promise.resolve([])

    const postsTimelinePromise = permissions.canReadPosts
      ? (() => {
          const q = db
            .from('posts')
            .whereNull('deleted_at')
            .where('status', 'PUBLISHED')
            .whereNotNull('published_at')
            .select(db.raw(`${postsBucket.sql} as bucket`, postsBucket.bindings))
            .count('* as count')
            .groupBy('bucket')
          this.applyDateWindow(q, 'posts.published_at', timelineFloor, window.currentEnd)
          return q
        })()
      : Promise.resolve([])

    const commentsTimelinePromise = permissions.canViewComments
      ? (() => {
          const q = db
            .from('comments')
            .whereNull('deleted_at')
            .select(db.raw(`${commentsBucket.sql} as bucket`, commentsBucket.bindings))
            .count('* as count')
            .groupBy('bucket')
          this.applyDateWindow(q, 'comments.created_at', timelineFloor, window.currentEnd)
          return q
        })()
      : Promise.resolve([])

    const contactsTimelinePromise = permissions.canViewContacts
      ? (() => {
          const q = db
            .from('contact_requests')
            .select(db.raw(`${contactsBucket.sql} as bucket`, contactsBucket.bindings))
            .count('* as count')
            .groupBy('bucket')
          this.applyDateWindow(q, 'contact_requests.created_at', timelineFloor, window.currentEnd)
          return q
        })()
      : Promise.resolve([])

    const [viewRows, postRows, commentRows, contactRows] = await Promise.all([
      viewsTimelinePromise,
      postsTimelinePromise,
      commentsTimelinePromise,
      contactsTimelinePromise,
    ])

    for (const row of viewRows as any[]) {
      const target = bucketMap.get(String(row.bucket))
      if (target) {
        target.views = Number(row.views) || 0
        target.uniqueVisitors = Number(row.unique_visitors) || 0
      }
    }

    for (const row of postRows as any[]) {
      const target = bucketMap.get(String(row.bucket))
      if (target) {
        target.publishedPosts = Number(row.count) || 0
      }
    }

    for (const row of commentRows as any[]) {
      const target = bucketMap.get(String(row.bucket))
      if (target) {
        target.comments = Number(row.count) || 0
      }
    }

    for (const row of contactRows as any[]) {
      const target = bucketMap.get(String(row.bucket))
      if (target) {
        target.contacts = Number(row.count) || 0
      }
    }

    return buckets
  }

  private async getContentAndSeoSection(
    window: DateWindow,
    now: DateTime,
    permissions: DashboardPermissions
  ) {
    if (!permissions.canReadPosts) {
      const counts = () => ({ total: 0, published: 0, draft: 0, archived: 0 })
      return {
        totals: { totalViewsAllTime: 0, publishedInRange: 0, publishedGrowthPercent: null },
        inventory: {
          posts: { ...counts(), trashed: 0 },
          pages: counts(),
          projects: { ...counts(), featured: 0 },
          tools: { ...counts(), featured: 0 },
          categories: { total: 0 },
          tags: { total: 0 },
          questionAnswers: { total: 0, published: 0, unpublished: 0 },
        },
        categoryDistribution: [],
        recentPosts: [],
        seoHealth: {
          score: 0,
          totalPublished: 0,
          healthyPosts: 0,
          postsWithIssues: 0,
          issues: {
            missingMetaDescription: 0,
            missingFocusKeyword: 0,
            missingCoverImage: 0,
            missingExcerpt: 0,
            missingCanonical: 0,
            staleDrafts: 0,
          },
        },
      }
    }
    const staleThreshold = now.minus({ days: 14 })

    const publishedInRangeQuery = db
      .from('posts')
      .whereNull('deleted_at')
      .where('status', 'PUBLISHED')
    this.applyDateWindow(
      publishedInRangeQuery,
      'posts.published_at',
      window.currentStart,
      window.currentEnd
    )

    const previousPublishedPromise =
      window.previousStart && window.previousEnd
        ? (() => {
            const q = db.from('posts').whereNull('deleted_at').where('status', 'PUBLISHED')
            this.applyDateWindow(q, 'posts.published_at', window.previousStart, window.previousEnd)
            return q.count('* as total').first()
          })()
        : Promise.resolve(null)

    const staleDraftsQuery = db.from('posts').whereNull('deleted_at').where('status', 'DRAFT')
    this.applyDateWindow(staleDraftsQuery, 'posts.updated_at', null, staleThreshold)

    const [
      postStatusRows,
      trashedPostsRow,
      totalViewsRow,
      publishedInRangeRow,
      previousPublishedRow,
      publishedSeoRows,
      staleDraftsRow,
      pageStatusRows,
      projectRows,
      toolRows,
      categoriesCountRow,
      tagsCountRow,
      qaRows,
      categoryDistRows,
      recentPostsRows,
    ] = await Promise.all([
      db
        .from('posts')
        .whereNull('deleted_at')
        .select('status')
        .count('* as count')
        .groupBy('status'),
      db.from('posts').whereNotNull('deleted_at').count('* as total').first(),
      db.from('posts').whereNull('deleted_at').sum('views as total_views').first(),
      publishedInRangeQuery.count('* as total').first(),
      previousPublishedPromise,
      db
        .from('posts')
        .whereNull('deleted_at')
        .where('status', 'PUBLISHED')
        .select(
          'id',
          'meta_description',
          'focus_keyword',
          'cover_image',
          'excerpt',
          'canonical_url'
        ),
      staleDraftsQuery.count('* as total').first(),
      db
        .from('pages')
        .whereNull('deleted_at')
        .select('status')
        .count('* as count')
        .groupBy('status'),
      db
        .from('projects')
        .select('status', 'featured')
        .count('* as count')
        .groupBy('status', 'featured'),
      db
        .from('tools')
        .whereNull('deleted_at')
        .select('status', 'featured')
        .count('* as count')
        .groupBy('status', 'featured'),
      db.from('categories').count('* as total').first(),
      db.from('tags').count('* as total').first(),
      db
        .from('question_answers')
        .select('is_published')
        .count('* as count')
        .groupBy('is_published'),
      db
        .from('categories')
        .leftJoin('posts', function () {
          this.on('posts.category_id', '=', 'categories.id').andOnNull('posts.deleted_at')
        })
        .select('categories.id', 'categories.name', 'categories.slug')
        .count('posts.id as post_count')
        .sum('posts.views as total_views')
        .groupBy('categories.id', 'categories.name', 'categories.slug')
        .orderBy('post_count', 'desc')
        .orderBy('total_views', 'desc'),
      db
        .from('posts')
        .leftJoin('categories', 'categories.id', 'posts.category_id')
        .whereNull('posts.deleted_at')
        .select(
          'posts.id',
          'posts.title',
          'posts.slug',
          'posts.status',
          'posts.views',
          'posts.cover_image',
          'posts.meta_description',
          'posts.focus_keyword',
          'posts.excerpt',
          'posts.canonical_url',
          'posts.published_at',
          'posts.updated_at',
          'categories.name as category_name'
        )
        .orderBy('posts.updated_at', 'desc')
        .orderBy('posts.id', 'desc')
        .limit(8),
    ])

    const countByStatus = (rows: any[]) => {
      let published = 0
      let draft = 0
      let archived = 0
      for (const r of rows) {
        const c = Number(r.count) || 0
        if (r.status === 'PUBLISHED') published += c
        else if (r.status === 'DRAFT') draft += c
        else if (r.status === 'ARCHIVED') archived += c
      }
      return { total: published + draft + archived, published, draft, archived }
    }

    const postsCounts = countByStatus(postStatusRows)
    const trashedPosts = Number(trashedPostsRow?.total ?? 0)
    const pagesCounts = countByStatus(pageStatusRows)
    const projectsCounts = {
      ...countByStatus(projectRows),
      featured: (projectRows as any[])
        .filter((r) => Boolean(r.featured))
        .reduce((acc, r) => acc + (Number(r.count) || 0), 0),
    }
    const toolsCounts = {
      ...countByStatus(toolRows),
      featured: (toolRows as any[])
        .filter((r) => Boolean(r.featured))
        .reduce((acc, r) => acc + (Number(r.count) || 0), 0),
    }

    let qaPublished = 0
    let qaUnpublished = 0
    for (const r of qaRows as any[]) {
      const c = Number(r.count) || 0
      if (r.is_published) qaPublished += c
      else qaUnpublished += c
    }

    // Compute SEO Health summary across all PUBLISHED non-deleted posts
    let missingMetaDescription = 0
    let missingFocusKeyword = 0
    let missingCoverImage = 0
    let missingExcerpt = 0
    let missingCanonical = 0
    let healthyPosts = 0
    let totalPassedChecks = 0
    const totalPublished = publishedSeoRows.length

    for (const row of publishedSeoRows as any[]) {
      const missing = evaluatePostSeoMissingFields(row)
      if (missing.length === 0) healthyPosts++
      totalPassedChecks += 5 - missing.length
      if (missing.includes('missing_meta_description')) missingMetaDescription++
      if (missing.includes('missing_focus_keyword')) missingFocusKeyword++
      if (missing.includes('missing_cover_image')) missingCoverImage++
      if (missing.includes('missing_excerpt')) missingExcerpt++
      if (missing.includes('missing_canonical')) missingCanonical++
    }

    const seoScore =
      totalPublished === 0 ? 100 : Math.round((totalPassedChecks / (totalPublished * 5)) * 100)
    const staleDrafts = Number(staleDraftsRow?.total ?? 0)

    const seoHealth: SeoHealthSummary = {
      score: seoScore,
      totalPublished,
      healthyPosts,
      postsWithIssues: totalPublished - healthyPosts,
      issues: {
        missingMetaDescription,
        missingFocusKeyword,
        missingCoverImage,
        missingExcerpt,
        missingCanonical,
        staleDrafts,
      },
    }

    const publishedInRange = Number(publishedInRangeRow?.total ?? 0)
    const previousPublished =
      previousPublishedRow !== null ? Number(previousPublishedRow?.total ?? 0) : null

    return {
      totals: {
        totalViewsAllTime: Number(totalViewsRow?.total_views ?? 0),
        publishedInRange,
        publishedGrowthPercent: calculateGrowthPercent(publishedInRange, previousPublished),
      },
      inventory: {
        posts: { ...postsCounts, trashed: trashedPosts },
        pages: pagesCounts,
        projects: projectsCounts,
        tools: toolsCounts,
        categories: { total: Number(categoriesCountRow?.total ?? 0) },
        tags: { total: Number(tagsCountRow?.total ?? 0) },
        questionAnswers: {
          total: qaPublished + qaUnpublished,
          published: qaPublished,
          unpublished: qaUnpublished,
        },
      },
      categoryDistribution: (categoryDistRows as any[]).map((row) => ({
        id: Number(row.id),
        name: String(row.name),
        slug: String(row.slug),
        postCount: Number(row.post_count) || 0,
        totalViews: Number(row.total_views) || 0,
      })),
      seoHealth,
      recentPosts: (recentPostsRows as any[]).map((row) => {
        const missing = evaluatePostSeoMissingFields(row)
        return {
          id: Number(row.id),
          title: String(row.title),
          slug: String(row.slug),
          status: String(row.status) as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
          views: Number(row.views) || 0,
          categoryName: row.category_name ? String(row.category_name) : null,
          coverImage: row.cover_image ? String(row.cover_image) : null,
          publishedAt: this.serializeTimestamp(row.published_at),
          updatedAt: this.serializeTimestamp(row.updated_at),
          seoChecksPassed: 5 - missing.length,
          seoChecksTotal: 5,
          missingSeoFields: missing,
        }
      }),
    }
  }

  private async getEngagementSection(window: DateWindow, permissions: DashboardPermissions) {
    const commentsPromise = permissions.canViewComments
      ? (async () => {
          const newInRangeQuery = db.from('comments').whereNull('deleted_at')
          this.applyDateWindow(
            newInRangeQuery,
            'comments.created_at',
            window.currentStart,
            window.currentEnd
          )

          const prevPromise =
            window.previousStart && window.previousEnd
              ? (() => {
                  const q = db.from('comments').whereNull('deleted_at')
                  this.applyDateWindow(
                    q,
                    'comments.created_at',
                    window.previousStart,
                    window.previousEnd
                  )
                  return q.count('* as total').first()
                })()
              : Promise.resolve(null)

          const [statusRows, newRow, prevRow, recentRows] = await Promise.all([
            db
              .from('comments')
              .whereNull('deleted_at')
              .select('status')
              .count('* as count')
              .groupBy('status'),
            newInRangeQuery.count('* as total').first(),
            prevPromise,
            db
              .from('comments')
              .leftJoin('posts', 'posts.id', 'comments.post_id')
              .whereNull('comments.deleted_at')
              .select(
                'comments.id',
                'comments.post_id',
                'comments.author_name',
                'comments.content',
                'comments.status',
                'comments.created_at',
                'posts.title as post_title'
              )
              .orderByRaw("CASE WHEN comments.status = 'PENDING' THEN 0 ELSE 1 END")
              .orderBy('comments.created_at', 'desc')
              .limit(6),
          ])

          let pending = 0
          let approved = 0
          let spam = 0
          for (const r of statusRows as any[]) {
            const c = Number(r.count) || 0
            if (r.status === 'PENDING') pending += c
            else if (r.status === 'APPROVED') approved += c
            else if (r.status === 'SPAM') spam += c
          }

          return {
            allowed: true,
            total: pending + approved + spam,
            pending,
            approved,
            spam,
            newInRange: Number(newRow?.total ?? 0),
            previousRange: prevRow !== null ? Number(prevRow?.total ?? 0) : null,
            recentItems: (recentRows as any[]).map((r) => ({
              id: Number(r.id),
              postId: Number(r.post_id),
              postTitle: r.post_title ? String(r.post_title) : null,
              authorName: String(r.author_name),
              contentPreview: String(r.content || '').slice(0, 140),
              status: String(r.status) as 'PENDING' | 'APPROVED' | 'SPAM',
              createdAt: this.serializeTimestamp(r.created_at),
            })),
          }
        })()
      : Promise.resolve({
          allowed: false,
          total: 0,
          pending: 0,
          approved: 0,
          spam: 0,
          newInRange: 0,
          previousRange: null as number | null,
          recentItems: [],
        })

    const contactsPromise = permissions.canViewContacts
      ? (async () => {
          const newInRangeQuery = db.from('contact_requests')
          this.applyDateWindow(
            newInRangeQuery,
            'contact_requests.created_at',
            window.currentStart,
            window.currentEnd
          )

          const prevPromise =
            window.previousStart && window.previousEnd
              ? (() => {
                  const q = db.from('contact_requests')
                  this.applyDateWindow(
                    q,
                    'contact_requests.created_at',
                    window.previousStart,
                    window.previousEnd
                  )
                  return q.count('* as total').first()
                })()
              : Promise.resolve(null)

          const [statusRows, newRow, prevRow, recentRows] = await Promise.all([
            db.from('contact_requests').select('status').count('* as count').groupBy('status'),
            newInRangeQuery.count('* as total').first(),
            prevPromise,
            db
              .from('contact_requests')
              .select('id', 'name', 'email', 'subject', 'message', 'status', 'created_at')
              .orderByRaw("CASE WHEN status = 'PENDING' THEN 0 ELSE 1 END")
              .orderBy('created_at', 'desc')
              .limit(6),
          ])

          let pending = 0
          let replied = 0
          let archived = 0
          for (const r of statusRows as any[]) {
            const c = Number(r.count) || 0
            if (r.status === 'PENDING') pending += c
            else if (r.status === 'REPLIED') replied += c
            else if (r.status === 'ARCHIVED') archived += c
          }

          return {
            allowed: true,
            total: pending + replied + archived,
            pending,
            replied,
            archived,
            newInRange: Number(newRow?.total ?? 0),
            previousRange: prevRow !== null ? Number(prevRow?.total ?? 0) : null,
            recentItems: (recentRows as any[]).map((r) => ({
              id: Number(r.id),
              name: String(r.name),
              email: String(r.email),
              subject: r.subject ? String(r.subject) : null,
              messagePreview: String(r.message || '').slice(0, 140),
              status: String(r.status) as 'PENDING' | 'REPLIED' | 'ARCHIVED',
              createdAt: this.serializeTimestamp(r.created_at),
            })),
          }
        })()
      : Promise.resolve({
          allowed: false,
          total: 0,
          pending: 0,
          replied: 0,
          archived: 0,
          newInRange: 0,
          previousRange: null as number | null,
          recentItems: [],
        })

    const newslettersPromise = permissions.canViewNewsletters
      ? (async () => {
          const newInRangeQuery = db.from('newsletters')
          this.applyDateWindow(
            newInRangeQuery,
            'newsletters.created_at',
            window.currentStart,
            window.currentEnd
          )

          const prevPromise =
            window.previousStart && window.previousEnd
              ? (() => {
                  const q = db.from('newsletters')
                  this.applyDateWindow(
                    q,
                    'newsletters.created_at',
                    window.previousStart,
                    window.previousEnd
                  )
                  return q.count('* as total').first()
                })()
              : Promise.resolve(null)

          const [totalRow, newRow, prevRow, recentRows] = await Promise.all([
            db.from('newsletters').count('* as total').first(),
            newInRangeQuery.count('* as total').first(),
            prevPromise,
            db
              .from('newsletters')
              .select('id', 'email', 'created_at')
              .orderBy('created_at', 'desc')
              .limit(6),
          ])

          return {
            allowed: true,
            total: Number(totalRow?.total ?? 0),
            newInRange: Number(newRow?.total ?? 0),
            previousRange: prevRow !== null ? Number(prevRow?.total ?? 0) : null,
            recentItems: (recentRows as any[]).map((r) => ({
              id: Number(r.id),
              email: String(r.email),
              createdAt: this.serializeTimestamp(r.created_at),
            })),
          }
        })()
      : Promise.resolve({
          allowed: false,
          total: 0,
          newInRange: 0,
          previousRange: null as number | null,
          recentItems: [],
        })

    const [comments, contacts, newsletters] = await Promise.all([
      commentsPromise,
      contactsPromise,
      newslettersPromise,
    ])

    const currentCombined = comments.newInRange + contacts.newInRange + newsletters.newInRange
    const hasPrevious =
      comments.previousRange !== null ||
      contacts.previousRange !== null ||
      newsletters.previousRange !== null
    const previousCombined = hasPrevious
      ? (comments.previousRange ?? 0) +
        (contacts.previousRange ?? 0) +
        (newsletters.previousRange ?? 0)
      : null

    return {
      combinedGrowthPercent: calculateGrowthPercent(currentCombined, previousCombined),
      comments,
      contacts,
      newsletters,
    }
  }

  private async getSystemSection(now: DateTime, permissions: DashboardPermissions) {
    // NEVER select api_key from llm_providers or token_hash from api_access_tokens.
    const llmPromise = permissions.canManageSettings
      ? db
          .from('llm_providers')
          .whereNull('deleted_at')
          .select(
            'id',
            'name',
            'driver',
            'model_name',
            'tasks',
            'input_tokens',
            'output_tokens',
            'total_tokens',
            'is_active',
            'sort_order'
          )
          .orderBy('sort_order', 'asc')
          .orderBy('id', 'asc')
      : Promise.resolve([])

    const apiTokensPromise = permissions.canViewApiTokens
      ? db
          .from('api_access_tokens')
          .whereNull('deleted_at')
          .select('id', 'name', 'permissions', 'expires_at', 'last_used_at', 'created_at')
          .orderBy('id', 'desc')
      : Promise.resolve([])

    const usersPromise = permissions.canViewUsers
      ? Promise.all([
          db
            .from('users')
            .whereNull('deleted_at')
            .select('status')
            .count('* as count')
            .groupBy('status'),
          db.from('roles').whereNull('deleted_at').count('* as total').first(),
          db.from('permissions').whereNull('deleted_at').count('* as total').first(),
        ])
      : Promise.resolve(null)

    const mediaPromise = permissions.canViewMedia
      ? this.fetchCdnRootSummary()
      : Promise.resolve({
          allowed: false,
          available: false,
          rootFolders: 0,
          rootFiles: 0,
          rootSizeBytes: 0,
        })

    const [llmRows, tokenRows, usersData, mediaData] = await Promise.all([
      llmPromise,
      apiTokensPromise,
      usersPromise,
      mediaPromise,
    ])

    let inputTokens = 0
    let outputTokens = 0
    let totalTokens = 0
    let activeLlmCount = 0

    const providers = (llmRows as any[]).map((row) => {
      const inTok = Number(row.input_tokens) || 0
      const outTok = Number(row.output_tokens) || 0
      const totTok = Number(row.total_tokens) || inTok + outTok
      const isActive = Boolean(row.is_active)
      inputTokens += inTok
      outputTokens += outTok
      totalTokens += totTok
      if (isActive) activeLlmCount++

      let tasks: string[] = []
      if (Array.isArray(row.tasks)) {
        tasks = row.tasks.map(String)
      } else if (typeof row.tasks === 'string') {
        try {
          const parsed = JSON.parse(row.tasks)
          if (Array.isArray(parsed)) tasks = parsed.map(String)
        } catch {
          tasks = []
        }
      }

      return {
        id: Number(row.id),
        name: String(row.name),
        driver: String(row.driver),
        modelName: String(row.model_name),
        isActive,
        inputTokens: inTok,
        outputTokens: outTok,
        totalTokens: totTok,
        tasks,
      }
    })

    let activeTokens = 0
    let expiredTokens = 0
    let usedLast7Days = 0
    const sevenDaysAgoMs = now.minus({ days: 7 }).toMillis()
    const nowMs = now.toMillis()

    const tokenItems = (tokenRows as any[]).map((row) => {
      const expiresIso = this.serializeTimestamp(row.expires_at)
      const lastUsedIso = this.serializeTimestamp(row.last_used_at)
      const isExpired = expiresIso ? Date.parse(expiresIso) <= nowMs : false
      if (isExpired) expiredTokens++
      else activeTokens++

      if (lastUsedIso && Date.parse(lastUsedIso) >= sevenDaysAgoMs) {
        usedLast7Days++
      }

      let permissionsCount = 0
      if (Array.isArray(row.permissions)) {
        permissionsCount = row.permissions.length
      } else if (typeof row.permissions === 'string') {
        try {
          const parsed = JSON.parse(row.permissions)
          if (Array.isArray(parsed)) permissionsCount = parsed.length
        } catch {
          permissionsCount = 0
        }
      }

      return {
        id: Number(row.id),
        name: String(row.name),
        permissionsCount,
        isExpired,
        expiresAt: expiresIso,
        lastUsedAt: lastUsedIso,
        createdAt: this.serializeTimestamp(row.created_at),
      }
    })

    let activeUsers = 0
    let inactiveUsers = 0
    let totalRoles = 0
    let totalPermissions = 0

    if (usersData) {
      const [userStatusRows, rolesRow, permsRow] = usersData
      for (const r of userStatusRows as any[]) {
        const c = Number(r.count) || 0
        if (r.status === 'active') activeUsers += c
        else inactiveUsers += c
      }
      totalRoles = Number(rolesRow?.total ?? 0)
      totalPermissions = Number(permsRow?.total ?? 0)
    }

    return {
      llm: {
        allowed: permissions.canManageSettings,
        totalCount: providers.length,
        activeCount: activeLlmCount,
        inputTokens,
        outputTokens,
        totalTokens,
        providers,
      },
      apiTokens: {
        allowed: permissions.canViewApiTokens,
        total: tokenItems.length,
        active: activeTokens,
        expired: expiredTokens,
        usedLast7Days,
        items: tokenItems.slice(0, 8),
      },
      users: {
        allowed: permissions.canViewUsers,
        totalUsers: activeUsers + inactiveUsers,
        activeUsers,
        inactiveUsers,
        totalRoles,
        totalPermissions,
      },
      media: mediaData,
    }
  }

  private async fetchCdnRootSummary() {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      const response = await Promise.race([
        this.cdn.get<{
          data?: {
            folders?: Array<{ name: string; path: string }>
            files?: Array<{ size?: number }>
            total?: number
          }
        }>('/api/media', { folder: '', limit: 0 }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('CDN summary timeout')), 1500)
        }),
      ])

      const folders = response?.data?.folders ?? []
      const files = response?.data?.files ?? []
      const rootSizeBytes = files.reduce((acc, f) => acc + (Number(f.size) || 0), 0)

      return {
        allowed: true,
        available: true,
        rootFolders: folders.length,
        rootFiles: Number(response?.data?.total ?? files.length),
        rootSizeBytes,
      }
    } catch {
      return {
        allowed: true,
        available: false,
        rootFolders: 0,
        rootFiles: 0,
        rootSizeBytes: 0,
      }
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

  async getGlobalViewsLog(params: {
    page?: number
    limit?: number
    range?: DashboardRange
    postId?: number
    device?: string
    browser?: string
    os?: string
    country?: string
    referrer?: string
    search?: string
  }) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const range = params.range ?? '30d'
    const window = resolveDateWindows(range)

    // Strictly select safe columns only — NEVER select visitor_key.
    const query = db
      .from('post_views')
      .innerJoin('posts', 'posts.id', 'post_views.post_id')
      .select(
        'post_views.id',
        'post_views.post_id',
        'posts.title as post_title',
        'posts.slug as post_slug',
        'post_views.ip',
        'post_views.country',
        'post_views.region',
        'post_views.city',
        'post_views.browser',
        'post_views.os',
        'post_views.device',
        'post_views.referrer',
        'post_views.created_at'
      )

    this.applyDateWindow(query, 'post_views.created_at', window.currentStart, window.currentEnd)

    if (params.postId) {
      query.where('post_views.post_id', params.postId)
    }
    for (const dimension of ['device', 'browser', 'os'] as const) {
      const value = params[dimension]
      if (!value) continue
      const column = `post_views.${dimension}`
      if (value === UNKNOWN_LABEL) {
        query.where((b) => b.whereNull(column).orWhere(column, ''))
      } else {
        query.where(column, value)
      }
    }
    if (params.country) {
      if (params.country === UNKNOWN_LABEL) {
        query.where((b) => b.whereNull('post_views.country').orWhere('post_views.country', ''))
      } else {
        query.where('post_views.country', params.country)
      }
    }
    if (params.referrer) {
      if (params.referrer === DIRECT_REFERRER_LABEL) {
        query.where((b) => b.whereNull('post_views.referrer').orWhere('post_views.referrer', ''))
      } else {
        query.where('post_views.referrer', params.referrer)
      }
    }
    if (params.search) {
      const like = `%${params.search}%`
      query.where((b) => {
        b.where('posts.title', 'like', like)
          .orWhere('post_views.ip', 'like', like)
          .orWhere('post_views.city', 'like', like)
          .orWhere('post_views.country', 'like', like)
          .orWhere('post_views.referrer', 'like', like)
          .orWhere('post_views.browser', 'like', like)
      })
    }

    const paginated = await query
      .orderBy('post_views.created_at', 'desc')
      .orderBy('post_views.id', 'desc')
      .paginate(page, limit)

    const json = paginated.toJSON()

    return {
      meta: json.meta,
      data: json.data.map((row: any) => ({
        id: Number(row.id),
        postId: Number(row.post_id),
        postTitle: String(row.post_title),
        postSlug: String(row.post_slug),
        ip: row.ip ? String(row.ip) : null,
        country: row.country ? String(row.country) : null,
        region: row.region ? String(row.region) : null,
        city: row.city ? String(row.city) : null,
        browser: String(row.browser),
        os: String(row.os),
        device: String(row.device),
        referrer: row.referrer ? String(row.referrer) : null,
        createdAt: this.serializeTimestamp(row.created_at),
      })),
    }
  }

  async getSeoIssuesList(params: {
    page?: number
    limit?: number
    issue?: SeoIssueType
    search?: string
  }) {
    const page = params.page ?? 1
    const limit = params.limit ?? 20
    const issue = params.issue ?? 'all'
    const staleThreshold = DateTime.utc().minus({ days: 14 })

    const query = db
      .from('posts')
      .leftJoin('categories', 'categories.id', 'posts.category_id')
      .whereNull('posts.deleted_at')
      .select(
        'posts.id',
        'posts.title',
        'posts.slug',
        'posts.status',
        'posts.views',
        'posts.meta_description',
        'posts.focus_keyword',
        'posts.cover_image',
        'posts.excerpt',
        'posts.canonical_url',
        'posts.published_at',
        'posts.updated_at',
        'categories.name as category_name'
      )

    const emptyField = (builder: any, col: string) => {
      builder.whereNull(col).orWhereRaw(`TRIM(${col}) = ''`)
    }

    if (issue === 'stale_draft') {
      query.where('posts.status', 'DRAFT')
      this.applyDateWindow(query, 'posts.updated_at', null, staleThreshold)
    } else if (issue === 'missing_meta_description') {
      query.where('posts.status', 'PUBLISHED').where((b) => emptyField(b, 'posts.meta_description'))
    } else if (issue === 'missing_focus_keyword') {
      query.where('posts.status', 'PUBLISHED').where((b) => emptyField(b, 'posts.focus_keyword'))
    } else if (issue === 'missing_cover_image') {
      query.where('posts.status', 'PUBLISHED').where((b) => emptyField(b, 'posts.cover_image'))
    } else if (issue === 'missing_excerpt') {
      query.where('posts.status', 'PUBLISHED').where((b) => emptyField(b, 'posts.excerpt'))
    } else if (issue === 'missing_canonical') {
      query.where('posts.status', 'PUBLISHED').where((b) => emptyField(b, 'posts.canonical_url'))
    } else {
      // 'all' — any published post missing at least 1 SEO field
      query.where('posts.status', 'PUBLISHED').where((b) => {
        b.whereNull('posts.meta_description')
          .orWhereRaw("TRIM(posts.meta_description) = ''")
          .orWhereNull('posts.focus_keyword')
          .orWhereRaw("TRIM(posts.focus_keyword) = ''")
          .orWhereNull('posts.cover_image')
          .orWhereRaw("TRIM(posts.cover_image) = ''")
          .orWhereNull('posts.excerpt')
          .orWhereRaw("TRIM(posts.excerpt) = ''")
          .orWhereNull('posts.canonical_url')
          .orWhereRaw("TRIM(posts.canonical_url) = ''")
      })
    }

    if (params.search) {
      const like = `%${params.search}%`
      query.where((b) => {
        b.where('posts.title', 'like', like).orWhere('posts.slug', 'like', like)
      })
    }

    const paginated = await query
      .orderBy('posts.updated_at', 'desc')
      .orderBy('posts.id', 'desc')
      .paginate(page, limit)

    const json = paginated.toJSON()

    return {
      meta: json.meta,
      data: json.data.map((row: any) => {
        const missing =
          issue === 'stale_draft'
            ? (['stale_draft'] as SeoIssueType[])
            : evaluatePostSeoMissingFields(row)
        return {
          id: Number(row.id),
          title: String(row.title),
          slug: String(row.slug),
          status: String(row.status) as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
          views: Number(row.views) || 0,
          categoryName: row.category_name ? String(row.category_name) : null,
          publishedAt: this.serializeTimestamp(row.published_at),
          updatedAt: this.serializeTimestamp(row.updated_at),
          issues: missing,
        }
      }),
    }
  }

  private serializeTimestamp(value: unknown): string | null {
    if (value === null || value === undefined || value === '') return null
    if (value instanceof Date) return value.toISOString()
    if (typeof value === 'number') {
      const dt = DateTime.fromMillis(value, { zone: 'utc' })
      return dt.isValid ? dt.toISO() : null
    }
    const str = String(value).trim()
    if (!str) return null
    const iso = DateTime.fromISO(str, { zone: 'utc' })
    if (iso.isValid) return iso.toISO()
    const sql = DateTime.fromSQL(str, { zone: 'utc' })
    if (sql.isValid) return sql.toISO()
    const parsed = new Date(str)
    return Number.isNaN(parsed.getTime()) ? str : parsed.toISOString()
  }
}
