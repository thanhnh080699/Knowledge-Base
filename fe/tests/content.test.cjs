const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const ts = require('typescript')
const { test } = require('node:test')

// Compile these pure utilities without requiring a Next.js server or browser.
function loadUtility(name) {
  const filename = path.resolve(__dirname, `../src/lib/${name}.ts`)
  const loaded = new Module(filename, module)
  loaded.filename = filename
  loaded.paths = module.paths
  const originalRequire = loaded.require.bind(loaded)
  loaded.require = (id) => id === './cdn-loader' ? loadUtility('cdn-loader') : originalRequire(id)
  loaded._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText, filename)
  return loaded.exports
}

const { buildTocFromContent, normalizeHtmlContent } = loadUtility('content')

test('decodes Vietnamese, numeric entities and inline HTML into plain TOC text', () => {
  const [item] = buildTocFromContent('<h2>C&aacute;c <em>thuật ngữ</em> &amp; &#273;i&#7873;u kiện &#x1F512;</h2>')
  assert.equal(item.text, 'Các thuật ngữ & điều kiện 🔒')
  assert.ok(normalizeHtmlContent('<h2>C&aacute;c <em>thuật ngữ</em> &amp; &#273;i&#7873;u kiện &#x1F512;</h2>').includes(`id="${item.id}"`))
})

test('preserves authored IDs with different attribute syntax', () => {
  for (const attribute of ['id="custom"', "id = 'custom'", 'id=custom']) {
    const content = `<h2 ${attribute}>Tiêu đề &amp; nội dung</h2>`
    assert.equal(buildTocFromContent(content)[0].id, 'custom')
    assert.equal(normalizeHtmlContent(content), content)
  }
})

test('generates unique IDs without colliding with existing anchors', () => {
  const content = '<h2>Test</h2><h3>Test</h3><h2 id="test">Existing</h2><h2>Test</h2>'
  assert.deepEqual(buildTocFromContent(content).map(item => item.id), ['test-2', 'test-3', 'test', 'test-4'])
})

test('includes normalized h1 headings and leaves Markdown navigation working', () => {
  assert.equal(buildTocFromContent('<h1>Title</h1>')[0].level, 2)
  assert.equal(normalizeHtmlContent('<h1>Title</h1>'), '<h2 id="title">Title</h2>')
  assert.deepEqual(buildTocFromContent('## First\n### Second').map(item => item.level), [2, 3])
})
