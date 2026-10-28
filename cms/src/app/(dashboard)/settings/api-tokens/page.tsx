'use client'

import { Select } from '@/components/ui/select'
import { useClientList, useListState } from '@/hooks/use-list-state'
import { type FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { Copy, KeyRound, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { Tag } from '@/components/ui/tag'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useCreateApiAccessToken, useDeleteApiAccessToken } from '@/hooks/mutations/use-api-access-token-mutations'
import { useApiAccessTokens } from '@/hooks/queries/use-api-access-tokens'
import { usePermissions } from '@/hooks/queries/use-permissions'
import type { TokenExpirationOption } from '@/types/api-access-token'
import { toast } from 'sonner'

const expirationOptions: Array<{ value: TokenExpirationOption; label: string }> = [
  { value: '1_week', label: '1 tuần' },
  { value: '1_month', label: '1 tháng' },
  { value: '1_year', label: '1 năm' },
  { value: 'no_expire', label: 'No expire' },
]

const contentModules = new Set(['Posts', 'Categories', 'Tags', 'Pages', 'Menus', 'Projects', 'Question & Answer', 'Media'])

export default function ApiTokensSettingsPage() {
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const list = useListState()
  const { data: allItems = [], isLoading, isFetching, error } = useApiAccessTokens()
  const tokens = useClientList(allItems, list)
  const total = allItems.length
  const { data: permissions = [] } = usePermissions({ status: 'active' })
  const deleteToken = useDeleteApiAccessToken()

  const contentPermissions = useMemo(
    () => permissions.filter((permission) => contentModules.has(permission.module)),
    [permissions]
  )

  async function copyCreatedToken() {
    if (!createdToken) return

    try {
      await navigator.clipboard.writeText(createdToken)
      toast.success('Đã copy token thành công')
    } catch {
      toast.error('Không thể copy tự động. Hãy chọn và sao chép token thủ công.')
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/" className="text-[var(--app-link)] hover:text-[var(--app-link-hover)]">Dashboard</Link>
          <span className="text-[var(--app-muted)]">/</span>
          <Link href="/settings" className="text-[var(--app-link)] hover:text-[var(--app-link-hover)]">Settings</Link>
          <span className="text-[var(--app-muted)]">/</span>
          <span className="text-[var(--app-muted-strong)]">API Tokens</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Access Tokens</h3>
            <span className="text-sm text-[var(--app-muted)]">Token dùng cho automation post bài, lấy dữ liệu content và marketing integrations.</span>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create token
          </Button>
        </div>

        {createdToken && (
          <div role="status" className="rounded-xl border border-[var(--app-warning-soft-border)] bg-[var(--app-warning-soft-bg)] px-5 py-4 text-[var(--app-warning-soft-fg)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="shrink-0 font-semibold">Token chỉ hiển thị một lần</div>
              <code aria-label="Token vừa tạo" className="block min-w-0 flex-1 select-all whitespace-normal break-all rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 py-2 font-mono text-sm text-[var(--foreground)]">
                {createdToken}
              </code>
              <Button type="button" variant="outline" onClick={copyCreatedToken} className="shrink-0">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <Table pagination={{ list, total, loading: isFetching }} error={error}>
            <TableHeader className="bg-[var(--app-surface-muted)]">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Expire date</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5}>Loading access tokens...</TableCell></TableRow>
              ) : tokens.length === 0 ? (
                <TableRow><TableCell colSpan={5}>No access tokens found.</TableCell></TableRow>
              ) : tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--app-surface-muted)] text-[var(--app-muted)]">
                        <KeyRound className="h-4 w-4" />
                      </span>
                      <span className="font-medium text-[var(--foreground)]">{token.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-xl flex-wrap gap-1.5">
                      {token.permissions.map((permission) => (
                        <Tag key={permission} variant="outline" className="max-w-full break-all bg-[var(--app-surface-muted)]">{permission}</Tag>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{token.expiresAt ? new Date(token.expiresAt).toLocaleDateString('vi-VN') : 'No expire'}</TableCell>
                  <TableCell>{token.lastUsedAt ? new Date(token.lastUsedAt).toLocaleString('vi-VN') : 'Never'}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteToken.mutate(token.id)} aria-label="Delete token">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CreateTokenModal
        isOpen={isCreateOpen}
        permissions={contentPermissions}
        onClose={() => setCreateOpen(false)}
        onCreated={(token) => {
          setCreatedToken(token)
          setCreateOpen(false)
        }}
      />
    </div>
  )
}

function CreateTokenModal({
  isOpen,
  permissions,
  onClose,
  onCreated,
}: {
  isOpen: boolean
  permissions: Array<{ id: number; slug: string; name: string; module: string }>
  onClose: () => void
  onCreated: (token: string) => void
}) {
  const createToken = useCreateApiAccessToken()
  const [name, setName] = useState('')
  const [expiresIn, setExpiresIn] = useState<TokenExpirationOption>('1_month')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, typeof permissions>>((carry, permission) => {
      carry[permission.module] = carry[permission.module] ?? []
      carry[permission.module].push(permission)
      return carry
    }, {})
  }, [permissions])

  const selectedCount = permissions.filter((permission) => selectedPermissions.includes(permission.slug)).length
  const allSelected = permissions.length > 0 && selectedCount === permissions.length
  const missingUploadPermission = permissions.length > 0 && !permissions.some((permission) => permission.slug === 'media.create')

  function togglePermission(slug: string) {
    setSelectedPermissions((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    let result
    try {
      result = await createToken.mutateAsync({
        name: name.trim(),
        expiresIn,
        permissions: selectedPermissions,
      })
    } catch {
      // The mutation displays the API error; preserve the form for retry.
      return
    }
    setName('')
    setExpiresIn('1_month')
    setSelectedPermissions([])
    onCreated(result.token)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create access token" description="Chọn quyền CMS Content mà automation được phép sử dụng." className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="token-name">Tên token</Label>
          <Input id="token-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Marketing automation" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="token-expire">Expire date</Label>
          <Select
            id="token-expire"
            value={expiresIn}
            onChange={(event) => setExpiresIn(event.target.value as TokenExpirationOption)}
            className="flex h-10 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-ring)]"
          >
            {expirationOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Phân quyền CMS Content</Label>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <Checkbox
                checked={allSelected}
                indeterminate={selectedCount > 0 && !allSelected}
                disabled={permissions.length === 0}
                onChange={(event) => setSelectedPermissions(event.target.checked ? permissions.map((permission) => permission.slug) : [])}
              />
              Chọn tất cả quyền đang hiển thị
            </label>
            <span className="text-sm text-[var(--app-muted)]" aria-live="polite">
              Đã chọn {selectedCount}/{permissions.length} quyền
            </span>
          </div>
          {missingUploadPermission && (
            <p role="status" className="text-sm text-[var(--app-muted-strong)]">
              Danh mục quyền chưa có media.create. Token mới chưa thể upload ảnh; quản trị viên cần đồng bộ quyền Media trước khi tạo token dùng để đăng bài kèm ảnh.
            </p>
          )}
          <div className="space-y-4 rounded-xl border border-[var(--app-border)] p-4">
            {Object.entries(groupedPermissions).map(([module, items]) => (
              <div key={module} className="space-y-2">
                <div className="text-sm font-semibold text-[var(--foreground)]">{module}</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {items.map((permission) => (
                    <label key={permission.id} className="flex items-start gap-3 rounded-md border border-[var(--app-border)] p-3">
                      <Checkbox checked={selectedPermissions.includes(permission.slug)} onChange={() => togglePermission(permission.slug)} />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-[var(--foreground)]">{permission.name}</span>
                        <span className="block text-xs text-[var(--app-muted)]">{permission.slug}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[var(--app-border)] pt-5">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={createToken.isPending} disabled={!name.trim() || selectedPermissions.length === 0}>Create token</Button>
        </div>
      </form>
    </Modal>
  )
}
