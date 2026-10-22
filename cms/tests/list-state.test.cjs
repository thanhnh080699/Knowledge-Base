const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const ts = require('typescript')
const Module = require('node:module')
const path = require('node:path')
const filename = path.resolve(__dirname, '../src/lib/list-state.ts')
const compiled = new Module(filename, module)
compiled._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, filename)
const { newestFirst, paginateItems, paginationRange } = compiled.exports

test('ID order applies to the complete collection before pagination without mutation', () => {
  const items = Array.from({ length: 53 }, (_, i) => ({ id: i + 1, createdAt: 1000 - i }))
  const before = items.slice()
  const sorted = newestFirst(items)
  assert.deepEqual(paginateItems(sorted, 1, 20).map(x => x.id), Array.from({ length: 20 }, (_, i) => 53 - i))
  assert.equal(paginateItems(sorted, 2, 20)[0].id, 33)
  assert.equal(paginateItems(sorted, 3, 20).length, 13)
  assert.deepEqual(items, before)
})

test('empty, exact-size and partial pages report correct ranges', () => {
  assert.deepEqual(paginationRange(1, 20, 0), { currentPage: 1, lastPage: 1, from: 0, to: 0 })
  assert.deepEqual(paginationRange(2, 20, 40), { currentPage: 2, lastPage: 2, from: 21, to: 40 })
  assert.deepEqual(paginationRange(3, 20, 53), { currentPage: 3, lastPage: 3, from: 41, to: 53 })
})

test('deleting the last row on a last page safely clamps to the remaining page', () => {
  assert.equal(paginationRange(3, 20, 40).currentPage, 2)
  assert.equal(paginateItems(newestFirst([{ id: 1 }]), 2, 20)[0].id, 1)
})
