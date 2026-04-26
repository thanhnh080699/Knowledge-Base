'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tag } from '@/components/ui/tag'
import type { AclRole, CreateRolePayload, Permission, UpdateRolePayload } from '@/types/acl'

interface RoleFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  role?: AclRole | null
  permissions: Permission[]
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: CreateRolePayload | UpdateRolePayload) => Promise<void> | void
}

interface FormState {
  name: string
  slug: string
  description: string
  permissionIds: number[]
}

const initialState: FormState = {
  name: '',
  slug: '',
  description: '',
  permissionIds: [],
}

function buildInitialState(mode: 'create' | 'edit', role?: AclRole | null): FormState {
  if (mode === 'edit' && role) {
    return {
      name: role.name,
      slug: role.slug,
      description: role.description ?? '',
      permissionIds: role.permissions?.map((permission) => permission.id) ?? [],
    }
  }

  return initialState
}

export function RoleFormModal({
  isOpen,
  mode,
  role,
  permissions,
  isSubmitting,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(mode, role))
  const [error, setError] = useState<string | null>(null)

  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = []
      }
      acc[permission.module].push(permission)
      return acc
    }, {})
  }, [permissions])

  function togglePermission(permissionId: number) {
    setForm((current) => ({
      ...current,
      permissionIds: current.permissionIds.includes(permissionId)
        ? current.permissionIds.filter((id) => id !== permissionId)
        : [...current.permissionIds, permissionId],
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.slug.trim()) {
      setError('Tên và slug là bắt buộc')
      return
    }

    const payload: CreateRolePayload | UpdateRolePayload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      description: form.description.trim() || undefined,
      permissionIds: form.permissionIds,
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể lưu role')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Tạo role' : 'Cập nhật role'}
      description="Role gom nhiều permission để áp vào user."
      className="max-w-4xl"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="role-name">Tên role</Label>
            <Input
              id="role-name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Administrator"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-slug">Slug</Label>
            <Input
              id="role-slug"
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="administrator"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role-description">Mô tả</Label>
          <textarea
            id="role-description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="min-h-24 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
            placeholder="Mô tả ngắn cho role"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-[var(--foreground)]">Permissions</h3>
            <p className="text-sm text-[var(--app-muted)]">Chọn các quyền role sẽ sở hữu.</p>
          </div>
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(([module, items]) => (
              <div key={module} className="rounded-lg border border-[var(--app-border)] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Tag variant="outline">{module}</Tag>
                  <span className="text-xs text-[var(--app-muted)]">{items.length} permissions</span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {items.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--app-border)] p-3 hover:bg-[var(--app-surface-hover)]"
                    >
                      <Checkbox
                        checked={form.permissionIds.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-[var(--foreground)]">{permission.name}</div>
                        <div className="text-xs text-[var(--app-muted)]">{permission.slug}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === 'create' ? 'Tạo role' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
