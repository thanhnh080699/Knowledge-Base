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
const { listingUrl, listingCanonical } = load('listing')

test('listing URLs omit defaults, preserve active filters and keep each pagination page distinct', () => {
  const url = query => listingUrl('/docs', new URLSearchParams(query))
  assert.equal(url('page=1&sort=newest'), '/docs')
  assert.equal(url('page=2&sort=newest'), '/docs?page=2')
  assert.equal(url('sort=oldest&page=1'), '/docs?sort=oldest')
  assert.equal(url('category=lpi-linux-essentials&sort=roadmap&page=1'), '/docs?category=lpi-linux-essentials')
  assert.equal(url('category=lpi-linux-essentials&sort=newest&page=2'), '/docs?category=lpi-linux-essentials&page=2&sort=newest')
  assert.equal(url('page=1&q=Linux&tag=docker'), '/docs?q=Linux&tag=docker')
  assert.equal(url('page=002&sort=newest'), '/docs?page=2')
  for (const page of ['0', '-1', 'oops', 'Infinity', '9007199254740992']) assert.equal(url('page='+page), '/docs')
  assert.equal(listingCanonical('/docs', new URLSearchParams('page=1&sort=newest&utm_source=test&reading=1')), 'https://thanhnh.id.vn/docs')
  assert.equal(listingCanonical('/docs', new URLSearchParams('page=2&category=linux-4')), 'https://thanhnh.id.vn/docs?category=linux-4&page=2')
  assert.equal(listingCanonical('/docs', new URLSearchParams('page=3&sort=oldest')), 'https://thanhnh.id.vn/docs?page=3&sort=oldest')
})

