'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  Bot,
  Globe,
  HardDrive,
  KeyRound,
  Mail,
  MessageSquareText,
  Search,
  Send,
  Shield,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tag } from '@/components/ui/tag'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  formatBytes,
  formatCompactNumber,
  formatDateTimeVi,
  formatFullNumber,
  formatRelativeTimeVi,
} from '@/lib/dashboard-utils'
import type { DashboardOverviewData } from '@/types/dashboard'
import type { useExternalAnalyticsSummary } from '@/hooks/queries/use-dashboard'

interface SystemEngagementTabProps {
  data: DashboardOverviewData
  external: ReturnType<typeof useExternalAnalyticsSummary>
}

export function SystemEngagementTab({ data, external }: SystemEngagementTabProps) {
  const { engagement, system, permissions } = data

  return (
    <div className="space-y-6">
      {/* Engagement Section: Comments, Contacts, Newsletters */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Comments */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquareText className="h-4 w-4 text-[var(--app-link)]" />
                Bình luận bài viết
              </CardTitle>
              {permissions.canViewComments ? (
                <Link
                  href="/comments"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--app-link)] hover:underline"
                >
                  Quản lý
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
            <CardDescription>
              {engagement.comments.allowed
                ? `Tổng ${formatFullNumber(engagement.comments.total)} bình luận (+${formatFullNumber(
                    engagement.comments.newInRange
                  )} trong kỳ)`
                : 'Tài khoản không có quyền xem bình luận.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {engagement.comments.allowed ? (
              <>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-[var(--app-warning-soft-bg)] p-2.5 text-[var(--app-warning-soft-fg)]">
                    <div className="font-bold text-base">
                      {formatFullNumber(engagement.comments.pending)}
                    </div>
                    <div>Chờ duyệt</div>
                  </div>
                  <div className="rounded-lg bg-[var(--app-success-soft-bg)] p-2.5 text-[var(--app-success-soft-fg)]">
                    <div className="font-bold text-base">
                      {formatFullNumber(engagement.comments.approved)}
                    </div>
                    <div>Đã duyệt</div>
                  </div>
                  <div className="rounded-lg bg-[var(--app-danger-soft-bg)] p-2.5 text-[var(--app-danger-soft-fg)]">
                    <div className="font-bold text-base">
                      {formatFullNumber(engagement.comments.spam)}
                    </div>
                    <div>Spam</div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {engagement.comments.recentItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[var(--app-border)] p-3 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[var(--foreground)]">
                          {item.authorName}
                        </span>
                        <Tag
                          variant={
                            item.status === 'APPROVED'
                              ? 'success'
                              : item.status === 'SPAM'
                                ? 'destructive'
                                : 'warning'
                          }
                        >
                          {item.status}
                        </Tag>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[var(--app-muted-strong)]">
                        {item.contentPreview}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-[var(--app-muted)]">
                        {item.postTitle ? `Bài: ${item.postTitle} · ` : ''}
                        {formatRelativeTimeVi(item.createdAt)}
                      </p>
                    </div>
                  ))}
                  {engagement.comments.recentItems.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[var(--app-muted)]">
                      Chưa có bình luận nào.
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Contact Requests */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-[var(--app-accent-soft-fg)]" />
                Yêu cầu liên hệ
              </CardTitle>
              {permissions.canViewContacts ? (
                <Link
                  href="/contacts"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--app-link)] hover:underline"
                >
                  Quản lý
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
            <CardDescription>
              {engagement.contacts.allowed
                ? `Tổng ${formatFullNumber(engagement.contacts.total)} liên hệ (+${formatFullNumber(
                    engagement.contacts.newInRange
                  )} trong kỳ)`
                : 'Tài khoản không có quyền xem liên hệ.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {engagement.contacts.allowed ? (
              <>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-[var(--app-warning-soft-bg)] p-2.5 text-[var(--app-warning-soft-fg)]">
                    <div className="font-bold text-base">
                      {formatFullNumber(engagement.contacts.pending)}
                    </div>
                    <div>Chờ xử lý</div>
                  </div>
                  <div className="rounded-lg bg-[var(--app-success-soft-bg)] p-2.5 text-[var(--app-success-soft-fg)]">
                    <div className="font-bold text-base">
                      {formatFullNumber(engagement.contacts.replied)}
                    </div>
                    <div>Đã trả lời</div>
                  </div>
                  <div className="rounded-lg bg-[var(--app-surface-muted)] p-2.5 text-[var(--app-muted-strong)]">
                    <div className="font-bold text-base">
                      {formatFullNumber(engagement.contacts.archived)}
                    </div>
                    <div>Lưu trữ</div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {engagement.contacts.recentItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-[var(--app-border)] p-3 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-[var(--foreground)]">
                          {item.name}
                        </span>
                        <Tag
                          variant={
                            item.status === 'REPLIED'
                              ? 'success'
                              : item.status === 'ARCHIVED'
                                ? 'secondary'
                                : 'warning'
                          }
                        >
                          {item.status}
                        </Tag>
                      </div>
                      <p className="mt-0.5 truncate font-medium text-[var(--app-muted-strong)]">
                        {item.subject || item.messagePreview}
                      </p>
                      <p className="mt-1 truncate text-[11px] text-[var(--app-muted)]">
                        {item.email} · {formatRelativeTimeVi(item.createdAt)}
                      </p>
                    </div>
                  ))}
                  {engagement.contacts.recentItems.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[var(--app-muted)]">
                      Chưa có yêu cầu liên hệ nào.
                    </p>
                  ) : null}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Newsletters & System Health Snapshot */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Send className="h-4 w-4 text-[var(--app-success-soft-fg)]" />
                  Đăng ký Bản tin (Newsletter)
                </CardTitle>
                {permissions.canViewNewsletters ? (
                  <Link
                    href="/contacts"
                    className="text-xs font-medium text-[var(--app-link)] hover:underline"
                  >
                    Xem tất cả
                  </Link>
                ) : null}
              </div>
              <CardDescription>
                {engagement.newsletters.allowed
                  ? `Tổng ${formatFullNumber(engagement.newsletters.total)} độc giả đăng ký (+${formatFullNumber(
                      engagement.newsletters.newInRange
                    )} mới trong kỳ)`
                  : 'Tài khoản không có quyền xem bản tin.'}
              </CardDescription>
            </CardHeader>
            {engagement.newsletters.allowed ? (
              <CardContent className="space-y-2">
                {engagement.newsletters.recentItems.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-md border border-[var(--app-border)] px-3 py-2 text-xs"
                  >
                    <span className="truncate font-medium text-[var(--foreground)]">
                      {sub.email}
                    </span>
                    <span className="shrink-0 text-[var(--app-muted)]">
                      {formatDateTimeVi(sub.createdAt)}
                    </span>
                  </div>
                ))}
                {engagement.newsletters.recentItems.length === 0 ? (
                  <p className="py-3 text-center text-xs text-[var(--app-muted)]">
                    Chưa có email đăng ký bản tin.
                  </p>
                ) : null}
              </CardContent>
            ) : null}
          </Card>

          {/* Users / ACL & CDN Storage Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HardDrive className="h-4 w-4 text-[var(--app-info-soft-fg)]" />
                Tài nguyên CDN & Phân quyền ACL
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-[var(--app-border)] p-3">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                  <HardDrive className="h-3.5 w-3.5 text-[var(--app-link)]" />
                  Go CDN Media
                </div>
                {system.media.allowed ? (
                  system.media.available ? (
                    <div className="mt-2 space-y-1 text-[var(--app-muted)]">
                      <div>
                        Thư mục gốc:{' '}
                        <strong className="text-[var(--foreground)]">
                          {formatFullNumber(system.media.rootFolders)}
                        </strong>
                      </div>
                      <div>
                        Tệp gốc:{' '}
                        <strong className="text-[var(--foreground)]">
                          {formatFullNumber(system.media.rootFiles)}
                        </strong>
                      </div>
                      <div>
                        Dung lượng gốc:{' '}
                        <strong className="text-[var(--foreground)]">
                          {formatBytes(system.media.rootSizeBytes)}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-[var(--app-warning-soft-fg)]">
                      CDN đang ngoại tuyến hoặc phản hồi chậm.
                    </p>
                  )
                ) : (
                  <p className="mt-2 text-[var(--app-muted)]">Giới hạn quyền xem Media.</p>
                )}
              </div>

              <div className="rounded-lg border border-[var(--app-border)] p-3">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                  <Shield className="h-3.5 w-3.5 text-[var(--app-accent-soft-fg)]" />
                  Users & ACL
                </div>
                {system.users.allowed ? (
                  <div className="mt-2 space-y-1 text-[var(--app-muted)]">
                    <div>
                      Tài khoản:{' '}
                      <strong className="text-[var(--foreground)]">
                        {system.users.activeUsers}/{system.users.totalUsers} active
                      </strong>
                    </div>
                    <div>
                      Vai trò (Roles):{' '}
                      <strong className="text-[var(--foreground)]">
                        {system.users.totalRoles}
                      </strong>
                    </div>
                    <div>
                      Quyền (Permissions):{' '}
                      <strong className="text-[var(--foreground)]">
                        {system.users.totalPermissions}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-[var(--app-muted)]">Giới hạn quyền quản trị User.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI / LLM Providers Token Usage + API Access Tokens */}
      {system.llm.allowed || system.apiTokens.allowed ? (
        <div className="grid gap-6 xl:grid-cols-3">
          {system.llm.allowed ? (
            <Card className="xl:col-span-2">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-[var(--app-accent-soft-fg)]" />
                    Thống kê Tiêu thụ Token AI / LLM Providers
                  </CardTitle>
                  <CardDescription>
                    Tổng cộng {formatFullNumber(system.llm.totalTokens)} tokens (Input:{' '}
                    {formatFullNumber(system.llm.inputTokens)} · Output:{' '}
                    {formatFullNumber(system.llm.outputTokens)}) trên {system.llm.totalCount} cấu hình.
                  </CardDescription>
                </div>
                <Link
                  href="/settings/llm"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--app-link)] hover:underline"
                >
                  Quản lý LLM
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-6">
                {system.llm.providers.length > 0 ? (
                  <>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={system.llm.providers}
                          margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="var(--app-border)"
                          />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--app-muted)' }}
                          />
                          <YAxis
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
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar
                            dataKey="inputTokens"
                            stackId="tokens"
                            name="Input Tokens"
                            fill="#3b82f6"
                            maxBarSize={36}
                          />
                          <Bar
                            dataKey="outputTokens"
                            stackId="tokens"
                            name="Output Tokens"
                            fill="#8b5cf6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={36}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Provider</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead className="text-right">Input / Output</TableHead>
                          <TableHead className="text-right">Tổng Token</TableHead>
                          <TableHead className="text-right">Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {system.llm.providers.map((provider) => (
                          <TableRow key={provider.id}>
                            <TableCell>
                              <div className="font-medium text-[var(--foreground)]">
                                {provider.name}
                              </div>
                              <div className="text-xs uppercase text-[var(--app-muted)]">
                                {provider.driver}
                              </div>
                            </TableCell>
                            <TableCell>
                              <code className="rounded bg-[var(--app-surface-muted)] px-2 py-0.5 text-xs">
                                {provider.modelName}
                              </code>
                            </TableCell>
                            <TableCell className="text-right text-xs text-[var(--app-muted)]">
                              {formatCompactNumber(provider.inputTokens)} /{' '}
                              {formatCompactNumber(provider.outputTokens)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-[var(--foreground)]">
                              {formatFullNumber(provider.totalTokens)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Tag variant={provider.isActive ? 'success' : 'secondary'}>
                                {provider.isActive ? 'Đang bật' : 'Tạm tắt'}
                              </Tag>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <p className="py-10 text-center text-sm text-[var(--app-muted)]">
                    Chưa cấu hình LLM Provider nào.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : null}

          {system.apiTokens.allowed ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <KeyRound className="h-4 w-4 text-[var(--app-warning-soft-fg)]" />
                    API Access Tokens (Tự động hóa)
                  </CardTitle>
                  <Link
                    href="/settings/api-tokens"
                    className="text-xs font-medium text-[var(--app-link)] hover:underline"
                  >
                    Quản lý
                  </Link>
                </div>
                <CardDescription>
                  {system.apiTokens.active} hiệu lực · {system.apiTokens.expired} hết hạn ·{' '}
                  {system.apiTokens.usedLast7Days} hoạt động trong 7 ngày qua.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {system.apiTokens.items.map((token) => (
                  <div
                    key={token.id}
                    className="rounded-lg border border-[var(--app-border)] p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-semibold text-[var(--foreground)]">
                        {token.name}
                      </span>
                      <Tag variant={token.isExpired ? 'destructive' : 'success'}>
                        {token.isExpired ? 'Hết hạn' : 'Hiệu lực'}
                      </Tag>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[var(--app-muted)]">
                      <span>{token.permissionsCount} quyền</span>
                      <span>Dùng cuối: {formatRelativeTimeVi(token.lastUsedAt)}</span>
                    </div>
                  </div>
                ))}
                {system.apiTokens.items.length === 0 ? (
                  <p className="py-8 text-center text-xs text-[var(--app-muted)]">
                    Chưa tạo API Access Token nào.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      {/* Detailed GA4 & Search Console Tables when enabled */}
      {permissions.canManageSettings && (external.ga.enabled || external.gsc.connected) ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {external.ga.enabled && external.ga.data ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-4 w-4 text-[var(--app-link)]" />
                    Top Trang trên Google Analytics 4
                  </CardTitle>
                  <Link
                    href="/settings/others/google-analytics"
                    className="text-xs font-medium text-[var(--app-link)] hover:underline"
                  >
                    Báo cáo đầy đủ
                  </Link>
                </div>
                <CardDescription>
                  Sessions: {external.ga.data.overview.sessions} · Tỷ lệ thoát:{' '}
                  {external.ga.data.overview.bounceRate} · Thời lượng TB:{' '}
                  {external.ga.data.overview.avgSessionDuration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Đường dẫn trang</TableHead>
                      <TableHead className="text-right">Lượt xem GA4</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {external.ga.data.pages.slice(0, 6).map((page) => (
                      <TableRow key={page.path}>
                        <TableCell className="max-w-[260px]">
                          <div className="truncate font-medium text-[var(--app-link)]">
                            {page.path}
                          </div>
                          <div className="truncate text-xs text-[var(--app-muted)]">
                            {page.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{page.views}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : null}

          {external.gsc.connected && external.gsc.data ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Search className="h-4 w-4 text-[var(--app-accent-soft-fg)]" />
                    Top Từ khóa tìm kiếm (Search Console)
                  </CardTitle>
                  <Link
                    href="/settings/others/google-search-console"
                    className="text-xs font-medium text-[var(--app-link)] hover:underline"
                  >
                    Báo cáo đầy đủ
                  </Link>
                </div>
                <CardDescription>
                  CTR trung bình: {external.gsc.data.overview.ctr} · Vị trí trung bình: #
                  {external.gsc.data.overview.position}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Từ khóa (Query)</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Hiển thị</TableHead>
                      <TableHead className="text-right">Vị trí</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {external.gsc.data.queries.slice(0, 6).map((q) => (
                      <TableRow key={q.query}>
                        <TableCell className="font-medium text-[var(--foreground)]">
                          {q.query}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[var(--app-link)]">
                          {formatFullNumber(q.clicks)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-[var(--app-muted)]">
                          {formatFullNumber(q.impressions)}
                        </TableCell>
                        <TableCell className="text-right text-xs">#{q.position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
