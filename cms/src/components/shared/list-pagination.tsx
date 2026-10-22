'use client'

import { useEffect } from 'react'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { PAGE_SIZES, paginationRange } from '@/lib/list-state'
import type { ListState } from '@/hooks/use-list-state'

export interface ListPaginationProps {
  list: ListState
  total: number
  loading?: boolean
  label?: string
}

export function ListPagination({ list, total, loading, label = 'kết quả' }: ListPaginationProps) {
  const { currentPage, lastPage, from, to } = paginationRange(list.page, list.pageSize, total)
  useEffect(() => {
    if (!loading && list.page > lastPage) list.setPage(lastPage)
  }, [loading, list.page, lastPage, list.setPage])
  return (
    <nav aria-label="Phân trang" className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 text-sm text-[var(--app-muted)]">
      <span role="status" aria-live="polite">{loading ? 'Đang tải…' : `${from}–${to} / ${total} ${label}`}</span>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">Số dòng
          <Select aria-label="Số dòng mỗi trang" className="w-20" value={list.pageSize} disabled={loading} onChange={event => list.setPageSize(Number(event.target.value))}>
            {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
          </Select>
        </label>
        <span>Trang {loading ? list.page : currentPage} / {loading ? '…' : lastPage}</span>
        <div className="flex gap-1">
          {[{ title: 'Trang đầu', page: 1, Icon: ChevronFirst, disabled: currentPage === 1 }, { title: 'Trang trước', page: currentPage - 1, Icon: ChevronLeft, disabled: currentPage === 1 }, { title: 'Trang sau', page: currentPage + 1, Icon: ChevronRight, disabled: currentPage === lastPage }, { title: 'Trang cuối', page: lastPage, Icon: ChevronLast, disabled: currentPage === lastPage }].map(({ title, page, Icon, disabled }) => (
            <Button key={title} type="button" variant="outline" size="icon" aria-label={title} title={title} disabled={loading || disabled} onClick={() => list.setPage(page)}><Icon className="h-4 w-4" /></Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
