'use client'

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

const contentModules = new Set(['Posts', 'Categories', 'Tags', 'Pages', 'Menus', 'Projects', 'Question & Answer'])

export default function ApiTokensSettingsPage() {
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const { data: tokens = [], isLoading } = useApiAccessTokens()
  const { data: permissions = [] } = usePermissions({ status: 'active' })
  const deleteToken = useDeleteApiAccessToken()

  const contentPermissions = useMemo(
    () => permissions.filter((permission) => contentModules.has(permission.module)),
    [permissions]
  )

  async function copyCreatedToken() {
    if (!createdToken) return

    await navigator.clipboard.writeText(createdToken)
    toast.success('Đã copy token thành công')
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
          <Link href="/" className="text-blue-600 hover:text-blue-700">Dashboard</Link>
          <span className="text-[var(--app-muted)]">/</span>
          <Link href="/settings" className="text-blue-600 hover:text-blue-700">Settings</Link>
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
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="shrink-0 font-semibold">Token chỉ hiển thị một lần</div>
              <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded-md border border-amber-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 dark:border-amber-900/60 dark:bg-slate-950 dark:text-slate-100">
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
          <Table>
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
                        <Tag key={permission} variant="secondary">{permission}</Tag>
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
          <div className="flex items-center justify-between border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-6 py-3 text-sm text-[var(--app-muted)]">
            <span>Showing {tokens.length} token{tokens.length === 1 ? '' : 's'}</span>
          </div>
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

  function togglePermission(slug: string) {
    setSelectedPermissions((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await createToken.mutateAsync({
      name,
      expiresIn,
      permissions: selectedPermissions,
    })
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
          <select
            id="token-expire"
            value={expiresIn}
            onChange={(event) => setExpiresIn(event.target.value as TokenExpirationOption)}
            className="flex h-10 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-ring)]"
          >
            {expirationOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <Label>Phân quyền CMS Content</Label>
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
