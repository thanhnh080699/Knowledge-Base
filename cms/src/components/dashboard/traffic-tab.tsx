'use client'

import Link from 'next/link'
import {
  Eye,
  Filter,
  Globe2,
  Laptop,
  Link2,
  MapPin,
  MonitorSmartphone,
  Pencil,
  TrendingUp,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  formatFullNumber,
  getDeviceLabelVi,
  getRangeLabelVi,
} from '@/lib/dashboard-utils'
import type {
  DashboardOverviewData,
  DashboardViewsFilter,
} from '@/types/dashboard'

interface TrafficTabProps {
  data: DashboardOverviewData
  onOpenViewsDrilldown: (filter?: Partial<DashboardViewsFilter>) => void
  onOpenPostViews: (post: { id: number; title: string }) => void
}

const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

export function TrafficTab({
  data,
  onOpenViewsDrilldown,
  onOpenPostViews,
}: TrafficTabProps) {
  const rangeLabel = getRangeLabelVi(data.range)
  const { traffic, permissions } = data
  const canDrilldown = permissions.canManagePosts

  const deviceChartData = traffic.devices.map((item) => ({
    ...item,
    displayName: getDeviceLabelVi(item.name),
  }))

  if (!data.permissions.canReadPosts) {
    return <p className="py-8 text-center text-sm text-[var(--app-muted)]">Tài khoản không có quyền xem dữ liệu bài viết.</p>
  }

  return (
    <div className="space-y-6">
      {/* Top Traffic Banner */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--app-muted)]">
                Lượt xem chi tiết ({rangeLabel})
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                {formatFullNumber(traffic.summary.trackedViews)}
              </p>
              <p className="text-xs text-[var(--app-muted)]">
                Khử trùng lặp 30 phút / IP + Trình duyệt
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--app-muted)]">
                Địa chỉ IP duy nhất ({rangeLabel})
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--app-link)]">
                {formatFullNumber(traffic.summary.uniqueIps)}
              </p>
              <p className="text-xs text-[var(--app-muted)]">
                Số IP khác nhau, không tương đương số người đọc
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--app-muted)]">
                Tổng lượt xem tích lũy
              </p>
              <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
                {formatFullNumber(data.kpis.views.allTimeTotal)}
              </p>
              <p className="text-xs text-[var(--app-muted)]">
                Bao gồm cả số liệu trước khi bật lưu chi tiết
              </p>
            </div>
          </div>

          {canDrilldown ? (
            <Button onClick={() => onOpenViewsDrilldown({})} className="shrink-0 gap-2">
              <Filter className="h-4 w-4" />
              Tra cứu nhật ký người xem
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {/* Traffic Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Diễn biến lưu lượng đọc ({data.range === 'all' ? '12 tháng gần nhất' : rangeLabel})</CardTitle>
          <CardDescription>
            Biểu đồ theo dõi mật độ lượt xem bài viết và số IP khác nhau theo từng mốc thời gian.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeline} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="trafficTabViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="trafficTabUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--app-border)" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--app-muted)' }}
                  minTickGap={18}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--app-muted)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--app-surface)',
                    color: 'var(--foreground)',
                    borderRadius: '10px',
                    border: '1px solid var(--app-border)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Lượt xem"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#trafficTabViews)"
                />
                <Area
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="IP duy nhất"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#trafficTabUnique)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Devices, Browsers, OS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Devices Donut + List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MonitorSmartphone className="h-4 w-4 text-[var(--app-link)]" />
              Thiết bị truy cập
            </CardTitle>
            <CardDescription>
              {canDrilldown ? 'Bấm vào một nhóm thiết bị để xem danh sách lượt xem.' : 'Phân bổ theo loại thiết bị.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {deviceChartData.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--app-muted)]">
                Chưa có dữ liệu thiết bị trong kỳ này.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="h-[170px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceChartData}
                        dataKey="count"
                        nameKey="displayName"
                        innerRadius={45}
                        outerRadius={72}
                        paddingAngle={3}
                      >
                        {deviceChartData.map((entry, idx) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[idx % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--app-surface)',
                          color: 'var(--foreground)',
                          borderRadius: '10px',
                          border: '1px solid var(--app-border)',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {deviceChartData.map((item, idx) => (
                    <button
                      key={item.name}
                      type="button"
                      disabled={!canDrilldown}
                      onClick={() => onOpenViewsDrilldown({ device: item.name })}
                      className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-[var(--app-surface-hover)] disabled:cursor-default"
                    >
                      <span className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                        />
                        {item.displayName}
                      </span>
                      <span className="text-[var(--app-muted)]">
                        <strong className="text-[var(--foreground)]">{formatFullNumber(item.count)}</strong>{' '}
                        ({item.percentage}%)
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe2 className="h-4 w-4 text-[var(--app-accent-soft-fg)]" />
              Trình duyệt phổ biến
            </CardTitle>
            <CardDescription>Top trình duyệt độc giả sử dụng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {traffic.browsers.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--app-muted)]">
                Chưa có dữ liệu trình duyệt.
              </p>
            ) : (
              traffic.browsers.map((browser) => (
                <button
                  key={browser.name}
                  type="button"
                  disabled={!canDrilldown}
                  onClick={() => onOpenViewsDrilldown({ browser: browser.name })}
                  className="block w-full rounded-lg p-2 text-left transition-colors hover:bg-[var(--app-surface-hover)] disabled:cursor-default"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--foreground)]">{browser.name}</span>
                    <span className="text-[var(--app-muted)]">
                      <strong className="text-[var(--foreground)]">{formatFullNumber(browser.count)}</strong>{' '}
                      ({browser.percentage}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--app-surface-strong)]">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${Math.min(100, Math.max(3, browser.percentage))}%` }}
                    />
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Laptop className="h-4 w-4 text-[var(--app-success-soft-fg)]" />
              Hệ điều hành (OS)
            </CardTitle>
            <CardDescription>Phân bổ nền tảng Windows, macOS, Android, iOS, Linux.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {traffic.operatingSystems.length === 0 ? (
              <p className="py-10 text-center text-sm text-[var(--app-muted)]">
                Chưa có dữ liệu hệ điều hành.
              </p>
            ) : (
              traffic.operatingSystems.map((os) => (
                <button
                  key={os.name}
                  type="button"
                  disabled={!canDrilldown}
                  onClick={() => onOpenViewsDrilldown({ os: os.name })}
                  className="block w-full rounded-lg p-2 text-left transition-colors hover:bg-[var(--app-surface-hover)] disabled:cursor-default"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--foreground)]">{os.name}</span>
                    <span className="text-[var(--app-muted)]">
                      <strong className="text-[var(--foreground)]">{formatFullNumber(os.count)}</strong>{' '}
                      ({os.percentage}%)
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--app-surface-strong)]">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(100, Math.max(3, os.percentage))}%` }}
                    />
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Referrers & Locations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4 text-[var(--app-link)]" />
              Nguồn giới thiệu truy cập (Referrers)
            </CardTitle>
            <CardDescription>
              Các tên miền giới thiệu lưu lượng đến bài viết trong {rangeLabel.toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {traffic.referrers.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--app-muted)]">
                Chưa ghi nhận dữ liệu nguồn truy cập trong kỳ này.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nguồn / Tên miền</TableHead>
                    <TableHead className="text-right">Lượt xem</TableHead>
                    <TableHead className="text-right">Tỷ trọng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traffic.referrers.map((ref) => (
                    <TableRow
                      key={ref.source}
                      onClick={() =>
                        canDrilldown && onOpenViewsDrilldown({ referrer: ref.source })
                      }
                      className={canDrilldown ? 'cursor-pointer' : undefined}
                    >
                      <TableCell className="font-medium text-[var(--foreground)]">
                        {ref.source}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatFullNumber(ref.count)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-[var(--app-muted)]">
                        {ref.percentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-[var(--app-danger-soft-fg)]" />
              Vị trí địa lý ước tính (GeoIP)
            </CardTitle>
            <CardDescription>
              Thành phố và quốc gia ước tính từ IP người đọc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {traffic.locations.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--app-muted)]">
                Chưa có dữ liệu vị trí địa lý trong kỳ này.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thành phố / Quốc gia</TableHead>
                    <TableHead className="text-right">Lượt xem</TableHead>
                    <TableHead className="text-right">Tỷ trọng</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traffic.locations.map((loc, index) => (
                    <TableRow
                      key={`${loc.label}-${index}`}
                      onClick={() =>
                        canDrilldown &&
                        loc.country &&
                        onOpenViewsDrilldown({ country: loc.country })
                      }
                      className={canDrilldown && loc.country ? 'cursor-pointer' : undefined}
                    >
                      <TableCell className="font-medium text-[var(--foreground)]">
                        {loc.label}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatFullNumber(loc.count)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-[var(--app-muted)]">
                        {loc.percentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Posts Comparison: Period vs All Time */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-[var(--app-success-soft-fg)]" />
              Top 10 bài viết xu hướng ({rangeLabel})
            </CardTitle>
            <CardDescription>Xếp hạng theo số lượt đọc phát sinh trong kỳ đang chọn.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Bài viết</TableHead>
                  <TableHead className="text-right">Trong kỳ</TableHead>
                  <TableHead className="text-right">Tổng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {traffic.topPostsInRange.map((post, idx) => (
                  <TableRow key={post.id}>
                    <TableCell className="w-8 font-mono text-xs text-[var(--app-muted)]">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <Link
                        href={`/posts/${post.id}`}
                        className="block truncate font-medium text-[var(--foreground)] hover:text-[var(--app-link)]"
                      >
                        {post.title}
                      </Link>
                      <span className="text-xs text-[var(--app-muted)]">
                        {post.categoryName || 'Chưa phân loại'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[var(--app-link)]">
                      +{formatFullNumber(post.periodViews)}
                    </TableCell>
                    <TableCell className="text-right">
                      {canDrilldown ? (
                        <button
                          type="button"
                          onClick={() => onOpenPostViews({ id: post.id, title: post.title })}
                          className="inline-flex items-center gap-1 text-xs underline-offset-4 hover:text-[var(--app-link)] hover:underline"
                        >
                          <Eye className="h-3 w-3" />
                          {formatFullNumber(post.totalViews)}
                        </button>
                      ) : (
                        <span className="text-xs">{formatFullNumber(post.totalViews)}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {traffic.topPostsInRange.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-[var(--app-muted)]">
                      Chưa phát sinh lượt xem bài viết mới trong khoảng thời gian này.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-[var(--app-link)]" />
              Top 10 bài viết nhiều lượt xem nhất mọi thời đại
            </CardTitle>
            <CardDescription>Xếp hạng theo tổng lượt xem tích lũy từ trước đến nay.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Bài viết</TableHead>
                  <TableHead className="text-right">Tổng xem</TableHead>
                  <TableHead className="text-right">Sửa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {traffic.topPostsAllTime.map((post, idx) => (
                  <TableRow key={post.id}>
                    <TableCell className="w-8 font-mono text-xs text-[var(--app-muted)]">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="truncate font-medium text-[var(--foreground)]">
                        {post.title}
                      </div>
                      <span className="text-xs text-[var(--app-muted)]">
                        {post.categoryName || 'Chưa phân loại'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {canDrilldown ? (
                        <button
                          type="button"
                          onClick={() => onOpenPostViews({ id: post.id, title: post.title })}
                          className="inline-flex items-center gap-1 underline-offset-4 hover:text-[var(--app-link)] hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {formatFullNumber(post.totalViews)}
                        </button>
                      ) : (
                        formatFullNumber(post.totalViews)
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/posts/${post.id}`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--foreground)]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {traffic.topPostsAllTime.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-[var(--app-muted)]">
                      Chưa có bài viết xuất bản.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
