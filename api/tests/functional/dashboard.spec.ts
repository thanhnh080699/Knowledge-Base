import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import Category from '#models/category'
import Comment from '#models/comment'
import ContactRequest from '#models/contact_request'
import LlmProvider from '#models/llm_provider'
import ApiAccessToken from '#models/api_access_token'
import Permission from '#models/permission'
import Post from '#models/post'
import Role from '#models/role'
import User from '#models/user'
import {
  buildZeroFilledBuckets,
  calculateGrowthPercent,
  evaluatePostSeoMissingFields,
  resolveDateWindows,
  resolvePermissions,
} from '#services/dashboard_service'

test.group('Dashboard pure analytics helpers', () => {
  test('calculates growth percentages and handles zero or null baselines', ({ assert }) => {
    assert.isNull(calculateGrowthPercent(50, null))
    assert.equal(calculateGrowthPercent(0, 0), 0)
    assert.isNull(calculateGrowthPercent(12, 0))
    assert.equal(calculateGrowthPercent(150, 100), 50)
    assert.equal(calculateGrowthPercent(75, 100), -25)
  })

  test('builds continuous zero-filled daily and monthly timeline buckets', ({ assert }) => {
    const fixedNow = DateTime.fromISO('2026-10-30T15:00:00Z')
    const win7 = resolveDateWindows('7d', fixedNow)
    const buckets7 = buildZeroFilledBuckets(win7)
    assert.lengthOf(buckets7, 7)
    assert.equal(buckets7[0].key, '2026-10-24')
    assert.equal(buckets7[6].key, '2026-10-30')

    const winAll = resolveDateWindows('all', fixedNow)
    const bucketsAll = buildZeroFilledBuckets(winAll)
    assert.lengthOf(bucketsAll, 12)
    assert.equal(bucketsAll[11].key, '2026-10')

    const winYear = resolveDateWindows('365d', fixedNow)
    const bucketsYear = buildZeroFilledBuckets(winYear)
    assert.equal(winYear.currentStart?.toISODate(), '2025-11-01')
    assert.equal(winYear.previousStart?.toISODate(), '2024-11-01')
    assert.equal(bucketsYear[0].key, '2025-11')
    assert.equal(bucketsYear[11].key, '2026-10')
  })

  test('evaluates missing SEO metadata fields and scopes permissions accurately', ({ assert }) => {
    assert.deepEqual(
      evaluatePostSeoMissingFields({
        meta_description: 'Valid description',
        focus_keyword: 'help desk',
        cover_image: '/uploads/cover.webp',
        excerpt: 'Summary',
        canonical_url: 'https://thanhnh.id.vn/docs/help-desk/test',
      }),
      []
    )

    assert.deepEqual(
      evaluatePostSeoMissingFields({
        meta_description: '  ',
        focus_keyword: null,
        cover_image: '/uploads/cover.webp',
        excerpt: 'Summary',
        canonical_url: 'https://thanhnh.id.vn/docs/help-desk/test',
      }),
      ['missing_meta_description', 'missing_focus_keyword']
    )

    const editorPerms = resolvePermissions(['posts.read', 'categories.read'])
    assert.isTrue(editorPerms.canReadPosts)
    assert.isFalse(editorPerms.canManagePosts)
    assert.isFalse(editorPerms.canManageSettings)
    assert.isFalse(editorPerms.canViewApiTokens)
    assert.isFalse(resolvePermissions(['posts.create', 'posts.update']).canReadPosts)
  })
})

test.group('Dashboard admin API endpoints', (group) => {
  let adminUser: User
  let editorUser: User
  let category: Category
  let healthyPost: Post
  let incompletePost: Post
  let comment: Comment
  let contact: ContactRequest
  let llm: LlmProvider
  let apiToken: ApiAccessToken

  group.setup(async () => {
    const stamp = Date.now()
    const fixtureAuth = ['fixture', 'cred'].join('-')

    adminUser = await User.create({
      fullName: 'Dashboard Admin',
      email: `dash-admin-${stamp}@example.com`,
      password: fixtureAuth,
    })

    editorUser = await User.create({
      fullName: 'Dashboard Editor',
      email: `dash-editor-${stamp}@example.com`,
      password: fixtureAuth,
    })

    const adminRole = await Role.firstOrCreate(
      { slug: `dash-admin-role-${stamp}` },
      { name: `Dash Admin ${stamp}` }
    )
    const editorRole = await Role.firstOrCreate(
      { slug: `dash-editor-role-${stamp}` },
      { name: `Dash Editor ${stamp}` }
    )

    const permSpecs = [
      { slug: 'posts.manage', name: 'Manage Posts', module: 'Posts' },
      { slug: 'posts.read', name: 'Read Posts', module: 'Posts' },
      { slug: 'comments.manage', name: 'Manage Comments', module: 'Comments' },
      { slug: 'contacts.manage', name: 'Manage Contacts', module: 'Contacts' },
      { slug: 'newsletters.manage', name: 'Manage Newsletters', module: 'Newsletters' },
      { slug: 'settings.manage', name: 'Manage Settings', module: 'Settings' },
      { slug: 'users.manage', name: 'Manage Users', module: 'Users' },
      { slug: 'api_tokens.manage', name: 'Manage API Tokens', module: 'API Tokens' },
      { slug: 'media.manage', name: 'Manage Media', module: 'Media' },
    ]

    const perms: Permission[] = []
    for (const spec of permSpecs) {
      perms.push(await Permission.firstOrCreate({ slug: spec.slug }, spec))
    }

    await adminRole.related('permissions').sync(perms.map((p) => p.id))
    const postsReadPerm = perms.find((p) => p.slug === 'posts.read')!
    await editorRole.related('permissions').sync([postsReadPerm.id])

    await adminUser.related('roles').attach([adminRole.id])
    await editorUser.related('roles').attach([editorRole.id])

    category = await Category.create({
      name: `Dash Cat ${stamp}`,
      slug: `dash-cat-${stamp}`,
      sortOrder: 1,
    })

    healthyPost = await Post.create({
      title: 'Healthy SEO Article',
      slug: `healthy-seo-${stamp}`,
      content: 'Detailed content',
      excerpt: 'Clear excerpt',
      metaTitle: 'Healthy SEO Title',
      metaDescription: 'Complete meta description',
      focusKeyword: 'dashboard analytics',
      canonicalUrl: `https://thanhnh.id.vn/docs/healthy-seo-${stamp}`,
      coverImage: '/uploads/cover.webp',
      status: 'PUBLISHED',
      views: 25,
      categoryId: category.id,
      publishedAt: DateTime.utc().minus({ days: 2 }),
    })

    incompletePost = await Post.create({
      title: 'Missing SEO Article',
      slug: `missing-seo-${stamp}`,
      content: 'Content without SEO metadata',
      status: 'PUBLISHED',
      views: 5,
      categoryId: category.id,
      publishedAt: DateTime.utc().minus({ days: 1 }),
    })

    await db.table('post_views').insert([
      {
        post_id: healthyPost.id,
        visitor_key: `vk-1-${stamp}`,
        ip: '203.0.113.10',
        country: 'VN',
        region: 'HN',
        city: 'Hanoi',
        browser: 'Chrome',
        os: 'Windows',
        device: 'Desktop',
        referrer: 'google.com',
        created_at: new Date(),
      },
      {
        post_id: incompletePost.id,
        visitor_key: `vk-2-${stamp}`,
        ip: '203.0.113.20',
        country: 'VN',
        region: 'SG',
        city: 'Ho Chi Minh City',
        browser: 'Safari',
        os: 'iOS',
        device: 'Mobile',
        referrer: null,
        created_at: new Date(),
      },
    ])

    comment = await Comment.create({
      postId: healthyPost.id,
      authorName: 'Reader One',
      authorEmail: 'reader@example.com',
      content: 'Great troubleshooting article!',
      status: 'PENDING',
    })

    contact = await ContactRequest.create({
      name: 'Customer One',
      email: 'customer@example.com',
      subject: 'Support inquiry',
      message: 'Need help with setup',
      status: 'PENDING',
    })

    llm = await LlmProvider.create({
      name: `Test OpenAI ${stamp}`,
      driver: 'openai',
      modelName: 'gpt-5.2',
      apiKey: 'sk-super-secret-do-not-leak',
      tasks: ['general'],
      inputTokens: 1200,
      outputTokens: 800,
      totalTokens: 2000,
      isActive: true,
      sortOrder: 1,
    })

    apiToken = await ApiAccessToken.create({
      name: `Automation Token ${stamp}`,
      permissions: ['posts.read', 'posts.create'],
    })
  })

  group.teardown(async () => {
    await db.from('post_views').whereIn('post_id', [healthyPost.id, incompletePost.id]).delete()
    await comment.delete()
    await contact.delete()
    await llm.delete()
    await apiToken.delete()
    await healthyPost.delete()
    await incompletePost.delete()
    await category.delete()
    await adminUser.delete()
    await editorUser.delete()
  })

  test('blocks unauthenticated access to all dashboard routes', async ({ client }) => {
    const r1 = await client.get('/api/admin/dashboard')
    r1.assertStatus(401)
    const r2 = await client.get('/api/admin/dashboard/views')
    r2.assertStatus(401)
    const r3 = await client.get('/api/admin/dashboard/seo-issues')
    r3.assertStatus(401)
  })

  test('returns comprehensive stats for admin without leaking secrets', async ({
    client,
    assert,
  }) => {
    const response = await client.get('/api/admin/dashboard?range=30d').loginAs(adminUser)
    response.assertStatus(200)
    assert.include(response.headers()['cache-control'], 'no-store')

    const body = response.body().data
    assert.equal(body.range, '30d')
    assert.isTrue(body.permissions.canManagePosts)
    assert.isTrue(body.permissions.canManageSettings)
    assert.isAtLeast(body.kpis.views.trackedInRange, 2)
    assert.isAtLeast(body.kpis.posts.published, 2)
    assert.isAtLeast(body.engagement.comments.pending, 1)
    assert.isAtLeast(body.engagement.contacts.pending, 1)
    assert.isAtLeast(body.system.llm.totalTokens, 2000)

    const serialized = JSON.stringify(body)
    assert.notInclude(serialized, 'sk-super-secret-do-not-leak')
    assert.notInclude(serialized, apiToken.tokenHash)
    assert.notInclude(serialized, 'visitor_key')
  })

  test('scopes restricted sections safely for editor without 403 on overview, while guarding views log', async ({
    client,
    assert,
  }) => {
    const overview = await client.get('/api/admin/dashboard?range=7d').loginAs(editorUser)
    overview.assertStatus(200)
    const data = overview.body().data
    assert.isTrue(data.permissions.canReadPosts)
    assert.isFalse(data.permissions.canManagePosts)
    assert.isFalse(data.permissions.canManageSettings)
    assert.isFalse(data.system.llm.allowed)
    assert.lengthOf(data.system.llm.providers, 0)
    assert.isFalse(data.system.apiTokens.allowed)
    assert.lengthOf(data.system.apiTokens.items, 0)

    const viewsDenied = await client.get('/api/admin/dashboard/views').loginAs(editorUser)
    viewsDenied.assertStatus(403)

    const seoAllowed = await client
      .get('/api/admin/dashboard/seo-issues?issue=missing_meta_description')
      .loginAs(editorUser)
    seoAllowed.assertStatus(200)
    assert.isAtLeast(seoAllowed.body().data.length, 1)
  })

  test('supports filtered pagination on global views and SEO issues drill-down endpoints', async ({
    client,
    assert,
  }) => {
    const viewsRes = await client
      .get('/api/admin/dashboard/views?range=30d&device=Mobile')
      .loginAs(adminUser)
    viewsRes.assertStatus(200)
    assert.include(viewsRes.headers()['cache-control'], 'no-store')
    const viewsRows = viewsRes.body().data
    assert.isAtLeast(viewsRows.length, 1)
    for (const row of viewsRows) {
      assert.equal(row.device, 'Mobile')
      assert.isUndefined(row.visitor_key)
    }

    const seoRes = await client
      .get(`/api/admin/dashboard/seo-issues?issue=all&search=${encodeURIComponent('Missing SEO')}`)
      .loginAs(adminUser)
    seoRes.assertStatus(200)
    const seoRows = seoRes.body().data
    const found = seoRows.find((r: any) => r.id === incompletePost.id)
    assert.isDefined(found)
    assert.include(found.issues, 'missing_meta_description')
    assert.include(found.issues, 'missing_focus_keyword')
  })

  test('rejects fractional pagination and post identifiers', async ({ client }) => {
    for (const query of ['page=1.5', 'limit=2.5', 'postId=1.5']) {
      const response = await client.get(`/api/admin/dashboard/views?${query}`).loginAs(adminUser)
      response.assertStatus(422)
    }
    const response = await client.get('/api/admin/dashboard/seo-issues?page=1.5').loginAs(adminUser)
    response.assertStatus(422)
  })
})
