const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const ts = require('typescript')
const Module = require('node:module')
const path = require('node:path')
const filename = path.resolve(__dirname, '../src/lib/category-tree.ts')
const compiled = new Module(filename, module)
compiled._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, filename)
const { buildCategoryTree, filterCategoryTree, flattenCategoryTree } = compiled.exports
const category = (id, name, parentId = null) => ({ id, name, slug: name.toLowerCase(), parentId })
const records = [category(1, 'Systems'), category(2, 'Linux', 1), category(3, 'Ubuntu', 2), category(4, 'Help Desk'), category(5, 'Windows', 4)]

test('keeps children under parents and paginates whole root branches', () => {
  const tree = buildCategoryTree(records)
  assert.deepEqual(flattenCategoryTree(tree.slice(0, 1)).map(row => [row.item.id, row.level]), [[1, 0], [2, 1], [3, 2]])
  assert.deepEqual(flattenCategoryTree(tree.slice(1, 2)).map(row => row.item.id), [4, 5])
  assert.equal(records[0].children, undefined)
})
test('collapse hides descendants and search retains the complete ancestor path', () => {
  const tree = buildCategoryTree(records)
  assert.deepEqual(flattenCategoryTree(tree, new Set([1])).map(row => row.item.id), [1, 4, 5])
  assert.deepEqual(flattenCategoryTree(filterCategoryTree(tree, 'Ubuntu')).map(row => row.item.id), [1, 2, 3])
  assert.deepEqual(filterCategoryTree(tree, 'unmatched'), [])
})
test('orphaned nodes, self-references and cycles remain reachable without recursion loops', () => {
  const tree = buildCategoryTree([category(1, 'Missing', 99), category(2, 'Self', 2), category(3, 'A', 4), category(4, 'B', 3)])
  assert.deepEqual(flattenCategoryTree(tree).map(row => row.item.id).sort(), [1, 2, 3, 4])
})
test('branch guides continue past nested descendants and stop at the last sibling', () => {
  const tree = buildCategoryTree([...records, category(6, 'Debian', 1)])
  const rows = flattenCategoryTree(tree)
  assert.deepEqual(rows.map(({ item, isLast, ancestorContinues }) => [item.id, isLast, ancestorContinues]), [
    [1, false, []], [2, false, []], [3, true, [true]], [6, true, []], [4, true, []], [5, true, []],
  ])
  assert.deepEqual(flattenCategoryTree(filterCategoryTree(tree, 'Ubuntu')).map(row => [row.item.id, row.isLast, row.ancestorContinues]), [
    [1, true, []], [2, true, []], [3, true, [false]],
  ])
})
