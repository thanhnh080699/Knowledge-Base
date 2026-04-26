'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tag } from '@/components/ui/tag'
import { Typography } from '@/components/ui/typography'
import { Checkbox } from '@/components/ui/checkbox'
import type { CreateUserPayload, Role, UpdateUserPayload, User } from '@/types/user'

interface UserFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  roles: Role[]
  user?: User | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => Promise<void> | void
}

interface FormState {
  fullName: string
  email: string
  password: string
  roleIds: number[]
}

const initialState: FormState = {
  fullName: '',
  email: '',
  password: '',
  roleIds: [],
}

function buildInitialState(mode: 'create' | 'edit', user?: User | null): FormState {
  if (mode === 'edit' && user) {
    return {
      fullName: user.fullName ?? '',
      email: user.email,
      password: '',
      roleIds: user.roles.map((role) => role.id),
    }
  }

  return initialState
}

export function UserFormModal({
  isOpen,
  mode,
  roles,
  user,
  isSubmitting,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(mode, user))
  const [error, setError] = useState<string | null>(null)

  const selectedPermissions = useMemo(() => {
    const seen = new Map<string, string>()

    for (const role of roles) {
      if (!form.roleIds.includes(role.id) || !role.permissions) {
        continue
      }

      for (const permission of role.permissions) {
        seen.set(permission.slug, permission.name)
      }
    }

    return Array.from(seen.entries()).map(([slug, name]) => ({ slug, name }))
  }, [form.roleIds, roles])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!form.email.trim()) {
      setError('Email is required')
      return
    }

    if (mode === 'create' && !form.password.trim()) {
      setError('Password is required for new users')
      return
    }

    const payload: CreateUserPayload | UpdateUserPayload = {
      fullName: form.fullName.trim() || undefined,
      roleIds: form.roleIds,
    }

    if (mode === 'create') {
      Object.assign(payload, {
        email: form.email.trim(),
        password: form.password,
      })
    } else {
      if (form.email.trim() && form.email.trim() !== user?.email) {
        payload.email = form.email.trim()
      }

      if (form.password.trim()) {
        payload.password = form.password
      }
    }

    try {
      await onSubmit(payload)
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save user')
    }
  }

  function toggleRole(roleId: number) {
    setForm((current) => ({
      ...current,
      roleIds: current.roleIds.includes(roleId)
        ? current.roleIds.filter((id) => id !== roleId)
        : [...current.roleIds, roleId],
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Create User' : 'Update User'}
      description="Assign roles to the user to inherit system permissions."
      className="max-w-3xl"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="user-full-name">Full Name</Label>
            <Input
              id="user-full-name"
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-email">Email</Label>
            <Input
              id="user-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="admin@thanhnh.id.vn"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-password">
            {mode === 'create' ? 'Password' : 'New Password'}
          </Label>
          <Input
            id="user-password"
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            placeholder={mode === 'create' ? 'Minimum 4 characters' : 'Leave blank to keep current'}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <Typography variant="large">Roles</Typography>
            <div className="grid gap-3">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--app-border)] p-4 transition-colors hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-hover)]"
                >
                  <Checkbox
                    checked={form.roleIds.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Typography variant="small" className="text-sm">
                        {role.name}
                      </Typography>
                      <Tag variant="outline">{role.slug}</Tag>
                    </div>
                    <Typography variant="muted">
                      {role.description || 'No description for this role.'}
                    </Typography>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-[var(--app-border)] p-4">
            <Typography variant="large">Inherited Permissions</Typography>
            <Typography variant="muted" className="mt-0">
              User will receive all permissions from the selected roles.
            </Typography>
            <div className="mt-4 flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-thin">
              {selectedPermissions.length > 0 ? selectedPermissions.map((permission) => (
                <Tag key={permission.slug} variant="secondary">
                  {permission.slug}
                </Tag>
              )) : (
                <Typography variant="muted" className="mt-0">
                  No permissions granted yet.
                </Typography>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
