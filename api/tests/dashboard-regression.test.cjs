const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const { DateTime } = require('luxon')

function load(relative, dependencies = {}) {
  const filename = path.resolve(__dirname, '..', relative)
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', code)(
    (name) => (Object.hasOwn(dependencies, name) ? dependencies[name] : require(name)),
    module,
    module.exports
  )
  return module.exports
}

const math = load('app/helpers/dashboard_math.ts')

test('growth does not invent a percentage for a zero baseline; unknown breakdown groups merge', () => {
  assert.equal(math.calculateGrowthPercent(12, 0), null)
  assert.equal(math.calculateGrowthPercent(0, 0), 0)
  assert.equal(math.calculateGrowthPercent(150, 100), 50)
  assert.deepEqual(
    math.toBreakdown(
      [
        { name: null, count: 2 },
        { name: '', count: 3 },
      ],
      5
    ),
    [{ name: math.UNKNOWN_LABEL, count: 5, percentage: 100 }]
  )
})
function service(db) {
  const { default: DashboardService } = load('app/services/dashboard_service.ts', {
    '@adonisjs/lucid/services/db': db,
    '#services/cdn_media_service': class {},
    '#helpers/dashboard_math': math,
  })
  return new DashboardService()
}

test('12-month window exactly matches the chart buckets, including a leap year', () => {
  for (const date of ['2026-10-30T15:00:00Z', '2024-02-29T12:00:00Z']) {
    const window = math.resolveDateWindows('365d', DateTime.fromISO(date))
    const buckets = math.buildZeroFilledBuckets(window)
    assert.equal(buckets.length, 12)
    assert.equal(window.currentStart.toFormat('yyyy-MM'), buckets[0].key)
    assert.equal(window.previousEnd.toMillis(), window.currentStart.toMillis())
    assert.equal(
      window.previousStart.plus({ months: 12 }).toMillis(),
      window.currentStart.toMillis()
    )
  }
})

test('an account without read permission receives no content or traffic and triggers no content queries', async () => {
  const db = {
    connection: () => ({ dialect: { name: 'sqlite3' } }),
    from() {
      throw new Error('Unauthorized query')
    },
  }
  const data = await service(db).getOverview('30d', ['posts.create', 'posts.update'])
  assert.equal(data.permissions.canReadPosts, false)
  assert.equal(data.kpis.posts.total, 0)
  assert.equal(data.traffic.allowed, false)
  assert.deepEqual(data.content.recentPosts, [])
  assert.deepEqual(data.content.categoryDistribution, [])
  assert.ok(data.timeline.every((bucket) => bucket.publishedPosts === 0 && bucket.views === 0))
})

test('SQLite traffic totals and timeline agree and exclude future records and empty visitor IPs', async () => {
  const knex = require('knex')({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })
  try {
    await knex.schema.createTable('categories', (table) => {
      table.integer('id')
      table.string('name')
    })
    await knex.schema.createTable('posts', (table) => {
      table.integer('id')
      table.string('title')
      table.string('slug')
      table.integer('views')
      table.integer('category_id')
      table.string('status')
      table.string('published_at')
      table.string('cover_image')
      table.string('deleted_at')
    })
    await knex.schema.createTable('post_views', (table) => {
      table.integer('id')
      table.integer('post_id')
      table.string('ip')
      table.string('created_at')
      for (const field of ['device', 'browser', 'os', 'referrer', 'country', 'city'])
        table.string(field)
    })
    await knex('posts').insert({
      id: 1,
      title: 'Article',
      slug: 'article',
      views: 10,
      status: 'PUBLISHED',
      published_at: '2026-10-29 12:00:00',
    })
    await knex('post_views').insert([
      { id: 1, post_id: 1, ip: '203.0.113.1', created_at: '2026-10-29 12:00:00' },
      { id: 2, post_id: 1, ip: '', created_at: '2026-10-29 13:00:00' },
      { id: 3, post_id: 1, ip: '203.0.113.2', created_at: '2026-10-31 12:00:00' },
      { id: 4, post_id: 1, ip: '203.0.113.3', created_at: '2026-09-01 12:00:00' },
    ])
    const dashboard = service({
      from: (table) => knex(table),
      raw: (...args) => knex.raw(...args),
      connection: () => ({ dialect: { name: 'sqlite3' } }),
    })
    const window = math.resolveDateWindows('7d', DateTime.fromISO('2026-10-30T15:00:00Z'))
    const traffic = await dashboard.getTrafficSection(window)
    const timeline = await dashboard.getTimelineSection(
      window,
      math.resolvePermissions(['posts.read'])
    )
    assert.equal(traffic.summary.trackedViews, 2)
    assert.equal(traffic.summary.uniqueIps, 1)
    assert.equal(
      timeline.reduce((sum, bucket) => sum + bucket.views, 0),
      2
    )
    assert.equal(timeline.find((bucket) => bucket.key === '2026-10-29').uniqueVisitors, 1)
  } finally {
    await knex.destroy()
  }
})

test('validators reject fractional identifiers and pagination but accept integer query strings', async () => {
  const { dashboardViewsQueryValidator, dashboardSeoIssuesValidator } = load(
    'app/validators/dashboard.ts'
  )
  for (const key of ['page', 'limit', 'postId']) {
    await assert.rejects(() => dashboardViewsQueryValidator.validate({ [key]: '1.5' }))
    assert.equal((await dashboardViewsQueryValidator.validate({ [key]: '2' }))[key], 2)
  }
  await assert.rejects(() => dashboardSeoIssuesValidator.validate({ page: '1.5' }))
})
