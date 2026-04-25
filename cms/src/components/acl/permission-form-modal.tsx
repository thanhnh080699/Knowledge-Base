'use client'

import { useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CreatePermissionPayload, Permission, UpdatePermissionPayload } from '@/types/acl'

interface PermissionFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  permission?: Permission | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: CreatePermissionPayload | UpdatePermissionPayload) => Promise<void> | void
}

interface FormState {
  name: string
  slug: string
  module: string
}

const initialState: FormState = {
  name: '',
  slug: '',
  module: '',
}

function buildInitialState(mode: 'create' | 'edit', permission?: Permission | null): FormState {
  if (mode === 'edit' && permission) {
    return {
      name: permission.name,
      slug: permission.slug,
      module: permission.module,
    }
  }

  return initialState
}

export function PermissionFormModal({
  isOpen,
  mode,
  permission,
  isSubmitting,
  onClose,
  onSubmit,
}: PermissionFormModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(mode, permission))
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.slug.trim() || !form.module.trim()) {
      setError('Tên, slug và module là bắt buộc')
      return
    }

    const payload: CreatePermissionPayload | UpdatePermissionPayload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
      module: form.module.trim().toLowerCase(),
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể lưu permission')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Tạo permission' : 'Cập nhật permission'}
      description="Permission là quyền nhỏ nhất dùng để gán vào role."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">
            {error}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="permission-name">Tên permission</Label>
          <Input
            id="permission-name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Manage Users"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="permission-slug">Slug</Label>
          <Input
            id="permission-slug"
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            placeholder="users.manage"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="permission-module">Module</Label>
          <Input
            id="permission-module"
            value={form.module}
            onChange={(event) => setForm((current) => ({ ...current, module: event.target.value }))}
            placeholder="users"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === 'create' ? 'Tạo permission' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
