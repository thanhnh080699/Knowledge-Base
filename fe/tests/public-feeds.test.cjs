/* eslint-disable @typescript-eslint/no-require-imports -- Node test harness compiles TypeScript utilities in memory. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const { test } = require('node:test')
const { spawnSync } = require('node:child_process')

function load(relative, mocks = {}) {
  const filename = path.resolve(__dirname, '../src', relative)
  const loaded = new Module(filename, module)
  loaded.filename = filename
  loaded.paths = module.paths
  const original = loaded.require.bind(loaded)
  loaded.require = id => mocks[id] || original(id)
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, filename)
  return loaded.exports
}
const utility = load('lib/public-feeds.ts')
const post = (id, extra = {}) => ({
  id, title: 'Tiếng Việt & <XML>', slug: `post-${id}`, status: 'PUBLISHED',
  content: '<p>A & B ]]> <img src="https://cdn.example/image.webp"></p>', excerpt: 'Mô tả & kiểm tra',
  publishedAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z',
  category: { slug: 'help-desk', name: 'Help & Desk' }, ...extra,
})
const settings = { site_name: 'Thanh & Blog', site_url: 'https://thanhnh.id.vn/' }

test('RSS preserves Vietnamese, full HTML, stable IDs and dates in valid XML', () => {
  const xml = utility.buildRss([post(1), post(2, { status: 'DRAFT' }), post(3, { publishedAt: '2099-01-01' })], settings)
  const parsed = spawnSync('python3', ['-c', `import sys,xml.etree.ElementTree as E
r=E.fromstring(sys.stdin.read());i=r.findall('./channel/item');assert len(i)==1
assert i[0].findtext('title')=='Tiếng Việt & <XML>'
assert i[0].findtext('{http://purl.org/rss/1.0/modules/content/}encoded')=='<p>A & B ]]> <img src="https://cdn.example/image.webp"></p>'
assert i[0].findtext('link')=='https://thanhnh.id.vn/docs/help-desk/post-1'
assert i[0].findtext('pubDate')=='Thu, 01 Jan 2026 00:00:00 GMT'
assert i[0].findtext('guid')=='urn:thanhnh.id.vn:post:1'
`], { input: xml, encoding: 'utf8' })
  assert.equal(parsed.status, 0, parsed.stderr)
  assert.equal(utility.escapeXml('A\u0000&B'), 'A&amp;B')
  assert.ok(utility.buildRss([post(1, { slug: 'renamed' })], settings).includes('urn:thanhnh.id.vn:post:1'))
})

test('fetches every page uncached and rejects a truncated dataset or API failure', async t => {
  const requests = []
  t.mock.method(global, 'fetch', async (url, options) => {
    requests.push({ url, options })
    const page = Number(new URL(url).searchParams.get('page'))
    return new Response(JSON.stringify({ data: [post(page)], meta: { currentPage: page, lastPage: 3, total: 3 } }))
  })
  assert.equal((await utility.allPublished('posts')).length, 3)
  assert.ok(requests.every(({ url, options }) => url.includes('status=PUBLISHED') && options.cache === 'no-store'))
  global.fetch = async () => new Response(JSON.stringify({ data: [post(1)], meta: { currentPage: 1, lastPage: 1, total: 3 } }))
  await assert.rejects(utility.allPublished('posts'), /Incomplete/)
  global.fetch = async () => new Response('failure', { status: 500 })
  await assert.rejects(utility.allPublished('posts'), /500/)
})

test('RSS reflects create, edit, unpublish and deletion on the very next request', async () => {
  let posts = [post(1)]
  const route = load('app/rss.xml/route.ts', { '@/lib/public-feeds': {
    ...utility, allPublished: async () => posts, discoveryRequest: async () => ({ data: settings }),
  } })
  const initial = await route.GET()
  assert.equal(initial.headers.get('cache-control'), 'no-store')
  assert.match(await initial.text(), /post-1/)
  posts = [post(1, { title: 'Updated title' }), post(2)]
  assert.match(await (await route.GET()).text(), /Updated title/)
  posts = [post(1, { status: 'DRAFT' }), post(2)]
  assert.doesNotMatch(await (await route.GET()).text(), /post-1/)
  posts = []
  assert.doesNotMatch(await (await route.GET()).text(), /<item>/)
})

test('RSS and sitemap return 503 rather than a partial successful response on upstream failure', async t => {
  t.mock.method(console, 'error', () => {})
  const broken = { ...utility, allPublished: async () => { throw new Error('offline') }, discoveryRequest: async () => ({ data: settings }) }
  for (const routePath of ['app/rss.xml/route.ts', 'app/sitemap.xml/route.ts']) {
    const route = load(routePath, { '@/lib/public-feeds': broken, '@/lib/api': { STATIC_TOOLS: [] } })
    const response = await route.GET()
    assert.equal(response.status, 503)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  }
})
