const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const ts = require('typescript')
const Module = require('node:module')
const path = require('node:path')

const filename = path.resolve(__dirname, '../src/lib/dashboard-utils.ts')
const compiled = new Module(filename, module)
compiled._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText,
  filename
)

const {
  formatBytes,
  formatCompactNumber,
  formatFullNumber,
  formatGrowthBadge,
  formatRelativeTimeVi,
  getDeviceLabelVi,
  getRangeLabelVi,
  getSeoIssueLabelVi,
  getSeoScoreGrade,
} = compiled.exports

test('formatCompactNumber and formatFullNumber handle edge values and large counts', () => {
  assert.equal(formatFullNumber(null), '0')
  assert.equal(formatFullNumber(undefined), '0')
  assert.equal(formatCompactNumber(9850), formatFullNumber(9850))
  assert.equal(formatCompactNumber(12500), '12.5K')
  assert.equal(formatCompactNumber(1500000), '1.5M')
  assert.equal(formatCompactNumber(2000000000), '2B')
})

test('formatBytes formats storage units accurately', () => {
  assert.equal(formatBytes(0), '0 B')
  assert.equal(formatBytes(-10), '0 B')
  assert.equal(formatBytes(512), '512 B')
  assert.equal(formatBytes(2048), '2 KB')
  assert.equal(formatBytes(1048576 * 3.5), '3.5 MB')
})

test('formatGrowthBadge distinguishes positive, negative, zero and all-time null', () => {
  assert.deepEqual(formatGrowthBadge(18.4), { text: '+18.4%', tone: 'positive' })
  assert.deepEqual(formatGrowthBadge(-6.2), { text: '-6.2%', tone: 'negative' })
  assert.deepEqual(formatGrowthBadge(0), { text: '0%', tone: 'neutral' })
  assert.deepEqual(formatGrowthBadge(null), { text: 'Chưa có cơ sở so sánh', tone: 'neutral' })
})

test('formatRelativeTimeVi produces Vietnamese relative labels', () => {
  const base = Date.parse('2026-10-30T12:00:00Z')
  assert.equal(formatRelativeTimeVi(null, base), 'Chưa từng')
  assert.equal(formatRelativeTimeVi('2026-10-30T11:59:30Z', base), 'Vừa xong')
  assert.equal(formatRelativeTimeVi('2026-10-30T11:45:00Z', base), '15 phút trước')
  assert.equal(formatRelativeTimeVi('2026-10-30T09:00:00Z', base), '3 giờ trước')
  assert.equal(formatRelativeTimeVi('2026-10-27T12:00:00Z', base), '3 ngày trước')
})

test('Vietnamese labels for range, SEO issues, score grade and devices map cleanly', () => {
  assert.equal(getRangeLabelVi('7d'), '7 ngày qua')
  assert.equal(getRangeLabelVi('all'), 'Toàn thời gian')
  assert.equal(getSeoIssueLabelVi('missing_meta_description'), 'Thiếu Meta Description')
  assert.equal(getSeoIssueLabelVi('stale_draft'), 'Bản nháp tồn đọng > 14 ngày')
  assert.deepEqual(getSeoScoreGrade(92), { label: 'Xuất sắc', tone: 'excellent' })
  assert.deepEqual(getSeoScoreGrade(80), { label: 'Tốt', tone: 'good' })
  assert.deepEqual(getSeoScoreGrade(60), { label: 'Cần cải thiện', tone: 'warning' })
  assert.deepEqual(getSeoScoreGrade(35), { label: 'Cần tối ưu gấp', tone: 'critical' })
  assert.equal(getDeviceLabelVi('Desktop'), 'Máy tính (Desktop)')
  assert.equal(getDeviceLabelVi('mobile'), 'Điện thoại (Mobile)')
})
