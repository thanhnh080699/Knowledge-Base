'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Pencil, Search } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useDashboardSeoIssues } from '@/hooks/queries/use-dashboard'
import {
  formatDateTimeVi,
  formatFullNumber,
  getSeoIssueLabelVi,
} from '@/lib/dashboard-utils'
import type { SeoIssueType } from '@/types/dashboard'

interface SeoDrilldownModalProps {
  isOpen: boolean
  initialIssue: SeoIssueType
  onClose: () => void
}

const ISSUE_OPTIONS: SeoIssueType[] = [
  'all',
  'missing_meta_description',
  'missing_focus_keyword',
  'missing_cover_image',
  'missing_excerpt',
  'missing_canonical',
  'stale_draft',
]

export function SeoDrilldownModal({
  isOpen,
  initialIssue,
  onClose,
}: SeoDrilldownModalProps) {
  const [issue, setIssue] = useState<SeoIssueType>(initialIssue)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, error } = useDashboardSeoIssues(
    {
      page,
      limit: 12,
      issue,
      search,
    },
    isOpen
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kiểm toán chi tiết SEO & Nội dung bài viết"
      description="Danh sách các bài viết cần bổ sung metadata SEO hoặc bản nháp tồn đọng để cải thiện thứ hạng tìm kiếm."
      className="max-w-5xl"
    >
      <div className="space-y-4 text-sm">
        <div className="flex flex-col gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Tìm theo tiêu đề hoặc slug bài viết..."
              className="h-9 pl-9 text-xs"
            />
          </div>

          <Select
            value={issue}
            onChange={(e) => {
              setIssue(e.target.value as SeoIssueType)
              setPage(1)
            }}
            className="h-9 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
          >
            {ISSUE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {getSeoIssueLabelVi(opt)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--app-muted)]">
          <span>
            Tìm thấy{' '}
            <strong className="text-[var(--foreground)]">
              {formatFullNumber(data?.meta.total ?? 0)}
            </strong>{' '}
            bài viết thuộc nhóm &ldquo;{getSeoIssueLabelVi(issue)}&rdquo;
          </span>
          <span>
            Trang {data?.meta.currentPage ?? page} / {Math.max(1, data?.meta.lastPage ?? 1)}
          </span>
        </div>

        {isLoading ? (
          <div className="py-14 text-center text-[var(--app-muted)]">
            Đang phân tích danh sách bài viết...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] p-4 text-center text-[var(--app-danger-soft-fg)]"
          >
            Không thể tải danh sách kiểm toán SEO. Vui lòng thử lại.
          </div>
        ) : !data?.data.length ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--app-border)] py-14 text-center">
            <CheckCircle2 className="h-10 w-10 text-[var(--app-success-soft-fg)]" />
            <p className="mt-3 font-semibold text-[var(--foreground)]">
              Tuyệt vời! Không có bài viết nào gặp vấn đề ở hạng mục này.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--app-border)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] text-[var(--app-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Bài viết</th>
                  <th className="px-4 py-3 font-medium">Các hạng mục cần bổ sung</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Lượt xem</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">Cập nhật</th>
                  <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--app-border)]">
                {data.data.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-[var(--app-surface-hover)]"
                  >
                    <td className="max-w-[260px] px-4 py-3">
                      <div className="truncate font-semibold text-[var(--foreground)]">
                        #{post.id} · {post.title}
                      </div>
                      <div className="truncate font-mono text-[11px] text-[var(--app-muted)]">
                        {post.categoryName || 'Chưa phân loại'} · /{post.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {post.issues.map((item) => (
                          <span
                            key={item}
                            className="inline-flex items-center rounded-md bg-[var(--app-warning-soft-bg)] px-2 py-0.5 text-[11px] font-medium text-[var(--app-warning-soft-fg)]"
                          >
                            {getSeoIssueLabelVi(item)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium">
                      {formatFullNumber(post.views)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--app-muted)]">
                      {formatDateTimeVi(post.updatedAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        href={`/posts/${post.id}`}
                        onClick={onClose}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--foreground)] px-3 text-xs font-medium text-[var(--app-surface)] transition-opacity hover:opacity-90"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Chỉnh sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
