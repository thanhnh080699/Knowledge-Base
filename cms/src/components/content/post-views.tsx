'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/admin-format'

interface View {
  id: number
  ip: string | null
  country: string | null
  region: string | null
  city: string | null
  browser: string
  os: string
  device: string
  referrer: string | null
  created_at: string
}

export function PostViews({ postId, title, onClose }: { postId: number; title: string; onClose: () => void }) {
  const [page, setPage] = useState(1)
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['post-views', postId, page],
    queryFn: async () => {
      const result = await api.get<{ data: View[]; totalViews: number; meta: { total: number; lastPage: number } }>(`/admin/posts/${postId}/views`, { params: { page } })
      return result.data
    },
  })
  return (
    <Modal isOpen onClose={onClose} title={`Lượt xem: ${title}`} className="max-w-5xl">
      <div className="space-y-4 text-sm">
        <p>Tổng lượt xem: <strong>{data?.totalViews ?? '…'}</strong> · Lượt có thông tin: <strong>{data?.meta.total ?? '…'}</strong></p>
        <p className="text-[var(--app-muted)]">Thông tin bắt đầu được lưu từ khi triển khai tính năng. Mỗi IP và trình duyệt được tính tối đa một lượt trong mỗi khung 30 phút. Vị trí được ước tính theo IP, có thể khác thực tế khi dùng VPN/proxy; IP nội bộ hoặc chưa xác định sẽ không có vị trí.</p>
        <Button variant="outline" size="sm" disabled={isFetching} onClick={() => void refetch()}>Làm mới</Button>
        {isLoading ? <p>Đang tải…</p> : error ? <p role="alert">Không tải được thống kê. Vui lòng thử lại.</p> : !data?.data.length ? <p>Chưa có dữ liệu người xem.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr>{['Thời gian', 'IP', 'Vị trí gần đúng', 'Trình duyệt / OS', 'Thiết bị', 'Nguồn'].map(label => <th key={label} className="whitespace-nowrap border-b p-3">{label}</th>)}</tr></thead>
              <tbody>{data.data.map(view => (
                <tr key={view.id} className="border-b border-[var(--app-border)]">
                  <td className="whitespace-nowrap p-3">{formatDateTime(view.created_at)}</td>
                  <td className="p-3 font-mono">{view.ip || 'Không xác định'}</td>
                  <td className="p-3">{[view.city, view.region, view.country].filter(Boolean).join(', ') || 'Không xác định'}</td>
                  <td className="p-3">{view.browser} / {view.os}</td>
                  <td className="p-3">{view.device}</td>
                  <td className="max-w-48 break-words p-3">{view.referrer || 'Trực tiếp / không cung cấp'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1 || isFetching} onClick={() => setPage(value => value - 1)}>Trước</Button>
          <span>Trang {page} / {data?.meta.lastPage || 1}</span>
          <Button variant="outline" size="sm" disabled={!data || page >= data.meta.lastPage || isFetching} onClick={() => setPage(value => value + 1)}>Sau</Button>
        </div>
      </div>
    </Modal>
  )
}
