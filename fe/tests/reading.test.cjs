const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

function load(name) {
  const filename = path.resolve(__dirname, '../src/lib', name + '.ts')
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const compiledModule = { exports: {} }
  new Function('require', 'module', 'exports', code)(
    id => id === './cdn-loader' ? load('cdn-loader') : id === './reading' ? load('reading') : require(id), compiledModule, compiledModule.exports,
  )
  return compiledModule.exports
}
const { CCNA_SLUGS, NGINX_SLUGS, MYSQL_SLUGS, DOCKER_SLUGS, displayPostTitle, sortLessons, readingSuggestions, parseReadingHistory, recordReadingVisit } = load('reading')
const { stripFirstImage, normalizeHtmlContent, buildTocFromContent } = load('content')
const post = (index, extra = {}) => ({ id: index + 1, slug: CCNA_SLUGS[index], title: 'Tiêu đề', status: 'PUBLISHED', categoryId: 1, publishedAt: '2026-10-22', tags: [], ...extra })
const nginxPost = (index, extra = {}) => ({ id: 100 + index + 1, slug: NGINX_SLUGS[index], title: 'Tiêu đề Nginx', status: 'PUBLISHED', categoryId: 4, publishedAt: '2026-10-22', tags: [], ...extra })
const mysqlPost = (index, extra = {}) => ({ id: 200 + index + 1, slug: MYSQL_SLUGS[index], title: 'Tiêu đề MySQL', status: 'PUBLISHED', categoryId: 6, publishedAt: '2026-10-22', tags: [], ...extra })
const dockerPost = (index, extra = {}) => ({ id: 300 + index + 1, slug: DOCKER_SLUGS[index], title: 'Tiêu đề Docker', status: 'PUBLISHED', categoryId: 8, publishedAt: '2026-10-22', tags: [], ...extra })

test('28 unique ordered lessons; unknown posts keep their title and sort last', () => {
  assert.equal(CCNA_SLUGS.length, 28)
  assert.equal(new Set(CCNA_SLUGS).size, 28)
  assert.equal(displayPostTitle(post(0)), 'Bài 1: Tiêu đề')
  assert.equal(displayPostTitle(post(27)), 'Bài 28: Tiêu đề')
  assert.equal(displayPostTitle(post(0, { slug: 'new-post' })), 'Tiêu đề')
  assert.deepEqual(sortLessons([post(27), post(0, { slug: 'new-post' }), post(0)]).map(p => p.slug), [CCNA_SLUGS[0], CCNA_SLUGS[27], 'new-post'])
})

test('10 unique ordered NGINX lessons with exact numbering and sequence', () => {
  assert.equal(NGINX_SLUGS.length, 10)
  assert.equal(new Set(NGINX_SLUGS).size, 10)
  assert.equal(displayPostTitle(nginxPost(0)), 'Bài 1: Tiêu đề Nginx')
  assert.equal(displayPostTitle(nginxPost(9)), 'Bài 10: Tiêu đề Nginx')
  assert.deepEqual(
    sortLessons([nginxPost(9), nginxPost(0), nginxPost(4)]).map(p => p.slug),
    [NGINX_SLUGS[0], NGINX_SLUGS[4], NGINX_SLUGS[9]]
  )
  const allNginx = NGINX_SLUGS.map((_, i) => nginxPost(i))
  assert.equal(readingSuggestions(allNginx[0], allNginx).previous, undefined)
  assert.equal(readingSuggestions(allNginx[0], allNginx).next.id, 102)
  assert.equal(readingSuggestions(allNginx[1], allNginx).previous.id, 101)
  assert.equal(readingSuggestions(allNginx[1], allNginx).next.id, 103)
  assert.equal(readingSuggestions(allNginx[9], allNginx).next, undefined)
  assert.equal(readingSuggestions(allNginx[9], allNginx).previous.id, 109)
})

test('14 unique ordered MySQL lessons with exact numbering and sequence', () => {
  assert.equal(MYSQL_SLUGS.length, 14)
  assert.equal(new Set(MYSQL_SLUGS).size, 14)
  assert.equal(displayPostTitle(mysqlPost(0)), 'Bài 1: Tiêu đề MySQL')
  assert.equal(displayPostTitle(mysqlPost(13)), 'Bài 14: Tiêu đề MySQL')
  assert.deepEqual(
    sortLessons([mysqlPost(13), mysqlPost(0), mysqlPost(5)]).map(p => p.slug),
    [MYSQL_SLUGS[0], MYSQL_SLUGS[5], MYSQL_SLUGS[13]]
  )
  const allMysql = MYSQL_SLUGS.map((_, i) => mysqlPost(i))
  assert.equal(readingSuggestions(allMysql[0], allMysql).previous, undefined)
  assert.equal(readingSuggestions(allMysql[0], allMysql).next.id, 202)
  assert.equal(readingSuggestions(allMysql[1], allMysql).previous.id, 201)
  assert.equal(readingSuggestions(allMysql[1], allMysql).next.id, 203)
  assert.equal(readingSuggestions(allMysql[13], allMysql).next, undefined)
  assert.equal(readingSuggestions(allMysql[13], allMysql).previous.id, 213)
})

test('10 unique ordered Docker lessons with exact numbering and sequence', () => {
  assert.equal(DOCKER_SLUGS.length, 10)
  assert.equal(new Set(DOCKER_SLUGS).size, 10)
  assert.equal(displayPostTitle(dockerPost(0)), 'Bài 1: Tiêu đề Docker')
  assert.equal(displayPostTitle(dockerPost(9)), 'Bài 10: Tiêu đề Docker')
  assert.deepEqual(
    sortLessons([dockerPost(9), dockerPost(0), dockerPost(4)]).map(p => p.slug),
    [DOCKER_SLUGS[0], DOCKER_SLUGS[4], DOCKER_SLUGS[9]]
  )
  const allDocker = DOCKER_SLUGS.map((_, i) => dockerPost(i))
  assert.equal(readingSuggestions(allDocker[0], allDocker).previous, undefined)
  assert.equal(readingSuggestions(allDocker[0], allDocker).next.id, 302)
  assert.equal(readingSuggestions(allDocker[1], allDocker).previous.id, 301)
  assert.equal(readingSuggestions(allDocker[1], allDocker).next.id, 303)
  assert.equal(readingSuggestions(allDocker[9], allDocker).next, undefined)
  assert.equal(readingSuggestions(allDocker[9], allDocker).previous.id, 309)
})

test('first/middle/last neighbors are exact and never bridge an unpublished lesson', () => {
  const all = CCNA_SLUGS.map((_, i) => post(i))
  assert.equal(readingSuggestions(all[0], all).previous, undefined)
  assert.equal(readingSuggestions(all[0], all).next.id, 2)
  assert.equal(readingSuggestions(all[14], all).previous.id, 14)
  assert.equal(readingSuggestions(all[14], all).next.id, 16)
  assert.equal(readingSuggestions(all[27], all).next, undefined)
  assert.equal(readingSuggestions(all[27], all).previous.id, 27)
  all[1].status = 'DRAFT'
  assert.equal(readingSuggestions(all[0], all).next, undefined)
})

test('related ranking uses tags, dates and stable IDs, excludes neighbors/drafts/other categories', () => {
  const current = post(0, { tags: [{ id: 7 }] })
  const candidates = [post(0), post(1), post(3, { tags: [{ id: 7 }] }), post(4, { tags: [{ id: 7 }] }), post(5, { publishedAt: '2026-10-23' }), post(6), post(7, { status: 'DRAFT' }), post(8, { categoryId: 2 })]
  const result = readingSuggestions(current, [...candidates, candidates[2]])
  assert.deepEqual(result.related.map(p => p.id), [4, 5, 6, 7])
  assert.deepEqual(readingSuggestions(current, []).related, [])
})

test('history handles corruption, validates records, deduplicates and bounds storage', () => {
  for (const value of [null, 'bad-json', '{}', 'null']) assert.deepEqual(parseReadingHistory(value), [])
  assert.deepEqual(parseReadingHistory(JSON.stringify([null, {}, { id: -1, visitedAt: 1 }, { id: 2, visitedAt: 1 }, { id: 2, visitedAt: 3 }, { id: 1, visitedAt: 2 }])), [{ id: 2, visitedAt: 3 }, { id: 1, visitedAt: 2 }])
  assert.equal(parseReadingHistory(JSON.stringify(Array.from({ length: 600 }, (_, i) => ({ id: i + 1, visitedAt: i })))).length, 500)
})

test('first image is removed only when its source matches the cover', () => {
  const distinct = '<figure><a href="/diagram.webp"><img src="/diagram.webp"></a></figure>'
  assert.equal(stripFirstImage(distinct, '/cover.webp'), distinct)
  assert.equal(stripFirstImage('<img src="/cover.webp"><p>Text</p>', '/cover.webp'), '<p>Text</p>')
  assert.equal(stripFirstImage('![cover](/cover.webp)\nText', '/cover.webp'), '\nText')
  assert.equal(stripFirstImage(distinct), distinct)
})

test('history survives reload, moves revisits to front, and tolerates blocked/quota-full storage', () => {
  let saved = null
  const storage = { getItem: () => saved, setItem: (_, value) => { saved = value } }
  assert.deepEqual(recordReadingVisit(storage, 1, 100), [])
  assert.deepEqual(recordReadingVisit(storage, 2, 200), [{ id: 1, visitedAt: 100 }])
  assert.deepEqual(recordReadingVisit(storage, 1, 300), [{ id: 2, visitedAt: 200 }])
  assert.deepEqual(parseReadingHistory(saved), [{ id: 1, visitedAt: 300 }, { id: 2, visitedAt: 200 }])
  assert.deepEqual(recordReadingVisit({ getItem: () => { throw Error('blocked') }, setItem: () => {} }, 1), [])
  assert.deepEqual(recordReadingVisit({ getItem: () => saved, setItem: () => { throw Error('quota') } }, 1), [])
})

test('render normalization retains full-resolution links and matching TOC IDs', () => {
  const html = '<h2>Mạng LAN</h2><figure><a href="/original.webp"><img src="/original.webp"></a><p class="diagram-hint">Trên điện thoại: cuộn ngang sơ đồ hoặc chạm để mở ảnh gốc.</p></figure>'
  const normalized = normalizeHtmlContent(html)
  assert.ok(normalized.includes('href="/original.webp"'))
  assert.ok(normalized.includes('Chạm vào sơ đồ để mở ảnh gốc và phóng to.'))
  assert.ok(normalized.includes(`id="${buildTocFromContent(html)[0].id}"`))
})

const { LPI_LINUX_SLUGS } = load('reading')
const { orderPosts, listingSort, safeListingUrl, listingStorageKey } = load('listing')
test('LPI roadmap follows prerequisites across page boundaries, independent of dates and IDs', () => {
  const ids = [122,123,124,127,128,129,125,130,126,131,132,133,134,135,136,137,138,139,140,141,142,143]
  const live = LPI_LINUX_SLUGS.map((slug, i) => ({ ...post(0), slug, id: ids[i], title: i === 17 ? 'Linux Essentials 5.1: Bảo mật' : 'Bài học', publishedAt: `2026-01-${String(22 - i).padStart(2, '0')}` })).reverse()
  const ordered = orderPosts(live, 'roadmap')
  assert.equal(LPI_LINUX_SLUGS.length, 22)
  assert.deepEqual(ordered.map(p => p.slug), [...LPI_LINUX_SLUGS])
  assert.deepEqual(ordered.slice(6, 10).map(p => p.id), [125, 130, 126, 131])
  assert.equal(ordered[12].id, 134)
  ordered.forEach((p, i) => {
    const title = displayPostTitle(p)
    assert.match(title, new RegExp(`EP ${i + 1}:`))
    assert.equal(displayPostTitle({ ...p, title }), title)
    const suggestions = readingSuggestions(p, live)
    assert.equal(suggestions.previous?.id, ordered[i - 1]?.id)
    assert.equal(suggestions.next?.id, ordered[i + 1]?.id)
  })
})
test('date sorts operate on the full collection with stable tie breaking', () => {
  const posts = [post(0, { id: 9, publishedAt: '2026-01-01' }), post(1, { id: 2, publishedAt: '2026-01-01' }), post(2, { id: 5, publishedAt: '2025-01-01' })]
  assert.deepEqual(orderPosts(posts, 'oldest').map(p => p.id), [5, 2, 9])
  assert.deepEqual(orderPosts(posts, 'newest').map(p => p.id), [9, 2, 5])
  assert.equal(listingSort(undefined, 'lpi-linux-essentials'), 'roadmap')
  assert.equal(listingSort('oldest', 'lpi-linux-essentials'), 'oldest')
})
test('listing restore isolates filters, retains page and sort, rejects unsafe URLs', () => {
  assert.equal(safeListingUrl('/docs?category=lpi-linux-essentials&page=3&sort=oldest'), '/docs?category=lpi-linux-essentials&page=3&sort=oldest')
  for (const url of ['https://evil.test/docs', '//evil.test/docs', '/docs/linux/post', 'javascript:alert(1)', '/docs-evil']) assert.equal(safeListingUrl(url), null)
  assert.equal(listingStorageKey('/docs', 'category=linux&page=3&sort=oldest'), listingStorageKey('/docs', 'sort=newest&category=linux&page=1'))
  assert.notEqual(listingStorageKey('/docs', 'category=linux'), listingStorageKey('/docs', 'category=docker'))
  assert.notEqual(listingStorageKey('/docs', 'category=linux'), listingStorageKey('/docs', 'category=linux&q=bash'))
})

const { LPI_SECURITY_SLUGS } = load('reading')
test('Security Essentials has 18 exact EPs with stable roadmap and neighbor navigation', () => {
  assert.equal(LPI_SECURITY_SLUGS.length, 18)
  assert.equal(new Set(LPI_SECURITY_SLUGS).size, 18)
  const all = LPI_SECURITY_SLUGS.map((slug, i) => ({...post(0), slug, id:144+i, title: i===1 ? 'Security Essentials 021.1: Mục tiêu' : 'Bài học', publishedAt:`2026-01-${String(18-i).padStart(2,'0')}`}))
  assert.deepEqual(orderPosts([...all].reverse(),'roadmap').map(p=>p.slug), [...LPI_SECURITY_SLUGS])
  all.forEach((p,i)=>{const title=displayPostTitle(p);assert.match(title,new RegExp(`EP ${i+1}:`));assert.equal(displayPostTitle({...p,title}),title);const n=readingSuggestions(p,all);assert.equal(n.previous?.id,all[i-1]?.id);assert.equal(n.next?.id,all[i+1]?.id)})
  assert.equal(listingSort(undefined,'lpi-security-essentials'),'roadmap')
})

const { LPI_WEB_SLUGS } = load('reading')
test('Web Development Essentials has 19 ordered EPs, exact neighbors and default roadmap', () => {
  assert.equal(LPI_WEB_SLUGS.length,19)
  assert.equal(new Set(LPI_WEB_SLUGS).size,19)
  const all=LPI_WEB_SLUGS.map((slug,i)=>({...post(0),slug,id:162+i,title:i===1?'Web Development Essentials 031.1: Phát triển phần mềm':'Bài học',publishedAt:`2026-01-${String(19-i).padStart(2,'0')}`}))
  assert.deepEqual(orderPosts([...all].reverse(),'roadmap').map(p=>p.slug),[...LPI_WEB_SLUGS])
  all.forEach((p,i)=>{const title=displayPostTitle(p);assert.match(title,new RegExp(`EP ${i+1}:`));assert.equal(displayPostTitle({...p,title}),title);const n=readingSuggestions(p,all);assert.equal(n.previous?.id,all[i-1]?.id);assert.equal(n.next?.id,all[i+1]?.id)})
  assert.equal(listingSort(undefined,'lpi-web-development-essentials'),'roadmap')
})

const { LPI_OPEN_SOURCE_SLUGS } = load('reading')
test('Open Source Essentials has 19 ordered EPs, exact neighbors and default roadmap', () => {
  assert.equal(LPI_OPEN_SOURCE_SLUGS.length,19)
  assert.equal(new Set(LPI_OPEN_SOURCE_SLUGS).size,19)
  const all=LPI_OPEN_SOURCE_SLUGS.map((slug,i)=>({...post(0),slug,id:181+i,title:i===1?'Open Source Essentials 051.1: Phát triển phần mềm':'Bài học',publishedAt:`2026-01-${String(19-i).padStart(2,'0')}`}))
  assert.deepEqual(orderPosts([...all].reverse(),'roadmap').map(p=>p.slug),[...LPI_OPEN_SOURCE_SLUGS])
  all.forEach((p,i)=>{const title=displayPostTitle(p);assert.match(title,new RegExp(`EP ${i+1}:`));assert.equal(displayPostTitle({...p,title}),title);const n=readingSuggestions(p,all);assert.equal(n.previous?.id,all[i-1]?.id);assert.equal(n.next?.id,all[i+1]?.id)})
  assert.equal(listingSort(undefined,'lpi-open-source-essentials'),'roadmap')
})
