const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

test('dashboard restores a cookie-authenticated user before requesting account-scoped analytics', async () => {
  const state = { user: null, isAuthenticated: true, setUser(user) { this.user = user } }
  const useAuthStore = selector => selector(state)
  useAuthStore.getState = () => state
  const queries = []
  const requests = []
  const dependencies = {
    '@tanstack/react-query': { useQuery(options) {
      queries.push(options)
      return { isPending: true, isLoading: false, refetch: () => options.queryFn() }
    } },
    '@/stores/auth': { useAuthStore },
    '@/lib/axios': { api: { async get(url) {
      requests.push(url)
      return { data: { data: { id: '42', fullName: 'Test user' } } }
    } } },
  }
  const filename = path.resolve(__dirname, '../src/hooks/queries/use-dashboard.ts')
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText
  const module = { exports: {} }
  new Function('require', 'module', 'exports', source)(name => dependencies[name], module, module.exports)
  const dashboard = module.exports.useDashboardOverview('30d')
  assert.equal(dashboard.isLoading, true)
  assert.equal(queries[0].enabled, true)
  assert.equal(queries[1].enabled, false)
  await queries[0].queryFn()
  assert.deepEqual(requests, ['/auth/me'])
  assert.equal(state.user.id, '42')
  queries.length = 0
  module.exports.useDashboardOverview('30d')
  assert.equal(queries[0].enabled, false)
  assert.equal(queries[1].enabled, true)
  assert.deepEqual(queries[1].queryKey, ['dashboard', '42', 'overview', '30d'])
})
