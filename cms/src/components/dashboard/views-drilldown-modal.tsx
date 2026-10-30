'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink, RefreshCw, RotateCcw, Search, X } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tag } from '@/components/ui/tag'
import { useDashboardViewsLog } from '@/hooks/queries/use-dashboard'
import {
  DASHBOARD_RANGE_OPTIONS,
  formatDateTimeVi,
  formatFullNumber,
  getDeviceLabelVi,
} from '@/lib/dashboard-utils'
import type { DashboardRange, DashboardViewsFilter } from '@/types/dashboard'

interface ViewsDrilldownModalProps {
  isOpen: boolean
  initialFilter: DashboardViewsFilter
  onClose: () => void
}

const SELECT_CLASS =
  'h-9 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]'

export function ViewsDrilldownModal({
  isOpen,
  initialFilter,
  onClose,
}: ViewsDrilldownModalProps) {
  const [page, setPage] = useState(initialFilter.page ?? 1)
  const [range, setRange] = useState<DashboardRange>(initialFilter.range ?? '30d')
  const [device, setDevice] = useState(initialFilter.device ?? '')
  const [browser, setBrowser] = useState(initialFilter.browser ?? '')
  const [os, setOs] = useState(initialFilter.os ?? '')
  const [country, setCountry] = useState(initialFilter.country ?? '')
  const [referrer, setReferrer] = useState(initialFilter.referrer ?? '')
  const [postId, setPostId] = useState<number | undefined>(initialFilter.postId)
  const [search, setSearch] = useState(initialFilter.search ?? '')

  const { data, isLoading, isFetching, error, refetch } = useDashboardViewsLog(
    {
      page,
      limit: 15,
      range,
      postId,
      device: device || undefined,
      browser: browser || undefined,
      os: os || undefined,
      country: country || undefined,
      referrer: referrer || undefined,
      search: search || undefined,
    },
    isOpen
  )

  const hasFilters = Boolean(device || browser || os || country || referrer || postId || search)

  function clearFilters() {
    setDevice('')
    setBrowser('')
    setOs('')
    setCountry('')
    setReferrer('')
    setPostId(undefined)
    setSearch('')
    setPage(1)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nhật ký lượt xem chi tiết toàn hệ thống"
      description="Tra cứu thông tin độc giả (IP, vị trí GeoIP, thiết bị, trình duyệt, nguồn giới thiệu). Mỗi IP & trình duyệt được tính tối đa 1 lượt / 30 phút cho mỗi bài."
      className="max-w-6xl"
    >
      <div className="space-y-4 text-sm">
        {/* Filter Toolbar */}
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3.5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Tìm theo tiêu đề bài viết, IP, thành phố, quốc gia, nguồn..."
              className="h-9 pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              className={SELECT_CLASS}
              value={range}
              onChange={(e) => {
                setRange(e.target.value as DashboardRange)
                setPage(1)
              }}
            >
              {DASHBOARD_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            <Select
              className={SELECT_CLASS}
              value={device}
              onChange={(e) => {
                setDevice(e.target.value)
                setPage(1)
              }}
            >
              <option value="">Mọi thiết bị</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              <option value="Tablet">Tablet</option>
            </Select>

            {hasFilters ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 gap-1 text-xs"
                onClick={clearFilters}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Xóa lọc
              </Button>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1 text-xs"
              disabled={isFetching}
              onClick={() => void refetch()}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {browser || os || country || referrer || postId ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[var(--app-muted)]">Đang lọc theo:</span>
            {postId ? (
              <Tag variant="secondary" className="gap-1">
                Bài viết #{postId}
                <button
                  type="button"
                  onClick={() => {
                    setPostId(undefined)
                    setPage(1)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Tag>
            ) : null}
            {browser ? (
              <Tag variant="secondary" className="gap-1">
                Trình duyệt: {browser}
                <button
                  type="button"
                  onClick={() => {
                    setBrowser('')
                    setPage(1)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Tag>
            ) : null}
            {os ? (
              <Tag variant="secondary" className="gap-1">
                OS: {os}
                <button
                  type="button"
                  onClick={() => {
                    setOs('')
                    setPage(1)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Tag>
            ) : null}
            {country ? (
              <Tag variant="secondary" className="gap-1">
                Quốc gia: {country}
                <button
                  type="button"
                  onClick={() => {
                    setCountry('')
                    setPage(1)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Tag>
            ) : null}
            {referrer ? (
              <Tag variant="secondary" className="gap-1">
                Nguồn: {referrer}
                <button
                  type="button"
                  onClick={() => {
                    setReferrer('')
                    setPage(1)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Tag>
            ) : null}
          </div>
        ) : null}

        {/* Summary count */}
        <div className="flex items-center justify-between text-xs text-[var(--app-muted)]">
          <span>
            Tổng cộng:{' '}
            <strong className="text-[var(--foreground)]">
              {formatFullNumber(data?.meta.total ?? 0)}
            </strong>{' '}
            lượt xem phù hợp
          </span>
          <span>
            Trang {data?.meta.currentPage ?? page} / {Math.max(1, data?.meta.lastPage ?? 1)}
          </span>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="py-16 text-center text-[var(--app-muted)]">
            Đang tải nhật ký lượt xem...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] p-4 text-center text-[var(--app-danger-soft-fg)]"
          >
            Không thể tải nhật ký lượt xem. Vui lòng thử lại.
          </div>
        ) : !data?.data.length ? (
          <div className="rounded-xl border border-dashed border-[var(--app-border)] py-14 text-center text-[var(--app-muted)]">
            Không tìm thấy lượt xem nào khớp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] text-[var(--app-muted)]">
                <tr>
                  <th className="whitespace-nowrap px-3.5 py-3 font-medium">Thời gian</th>
                  <th className="px-3.5 py-3 font-medium">Bài viết</th>
                  <th className="whitespace-nowrap px-3.5 py-3 font-medium">IP</th>
                  <th className="px-3.5 py-3 font-medium">Vị trí gần đúng</th>
                  <th className="whitespace-nowrap px-3.5 py-3 font-medium">Trình duyệt / OS</th>
                  <th className="whitespace-nowrap px-3.5 py-3 font-medium">Thiết bị</th>
                  <th className="px-3.5 py-3 font-medium">Nguồn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {data.data.map((view) => (
                  <tr
                    key={view.id}
                    className="transition-colors hover:bg-[var(--app-surface-hover)]"
                  >
                    <td className="whitespace-nowrap px-3.5 py-3 text-[var(--app-muted)]">
                      {formatDateTimeVi(view.createdAt)}
                    </td>
                    <td className="max-w-[230px] px-3.5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setPostId(view.postId)
                            setPage(1)
                          }}
                          className="truncate font-medium text-[var(--foreground)] hover:text-[var(--app-link)]"
                          title="Lọc theo bài viết này"
                        >
                          {view.postTitle}
                        </button>
                        <Link
                          href={`/posts/${view.postId}`}
                          onClick={onClose}
                          className="shrink-0 text-[var(--app-muted)] hover:text-[var(--app-link)]"
                          title="Mở trang chỉnh sửa bài viết"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 font-mono text-[var(--foreground)]">
                      {view.ip || 'Không xác định'}
                    </td>
                    <td className="px-3.5 py-3 text-[var(--app-muted-strong)]">
                      {[view.city, view.region, view.country].filter(Boolean).join(', ') ||
                        'Không xác định'}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3">
                      {view.browser} / {view.os}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3">
                      {getDeviceLabelVi(view.device)}
                    </td>
                    <td className="max-w-[160px] truncate px-3.5 py-3 text-[var(--app-muted)]">
                      {view.referrer || 'Trực tiếp'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trang trước
          </Button>
          <span className="text-xs text-[var(--app-muted)]">
            Trang {page} / {Math.max(1, data?.meta.lastPage ?? 1)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!data || page >= data.meta.lastPage || isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            Trang sau
          </Button>
        </div>
      </div>
    </Modal>
  )
}
