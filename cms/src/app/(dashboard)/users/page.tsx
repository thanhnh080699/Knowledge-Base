'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Modal } from '@/components/ui/modal'
import { UserFormModal } from '@/components/users/user-form-modal'
import { useUsers, useUsersMeta } from '@/hooks/queries/use-users'
import { useCreateUser, useDeleteUser, useUpdateUser, useForceDeleteUser, useChangePassword } from '@/hooks/mutations/use-user-mutations'
import { formatDateTime, formatDisplayId } from '@/lib/admin-format'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types/user'
import type { EntityStatusFilter } from '@/types/acl'
import { Filter, Key, Pencil, Plus, RotateCcw, Search, Trash2, UserRound } from 'lucide-react'

interface DeleteState {
  ids: number[]
  title: string
  description: string
}

const FILTER_SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'

export default function UsersPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<EntityStatusFilter>('active')
  const [roleId, setRoleId] = useState<number | ''>('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [changingPasswordUser, setChangingPasswordUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null)

  const filters = useMemo(
    () => ({
      q: query.trim() || undefined,
      status,
      roleId: roleId || undefined,
    }),
    [query, roleId, status]
  )

  const { data: users = [], isLoading } = useUsers(filters)
  const { data: meta } = useUsersMeta()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const forceDeleteUser = useForceDeleteUser()
  const changePassword = useChangePassword()

  const roles = meta?.roles ?? []
  const trashCount = meta?.trashCount ?? 0
  const allSelected = users.length > 0 && selectedIds.length === users.length
  const partiallySelected = selectedIds.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([])
      return
    }

    setSelectedIds(users.map((user) => user.id))
  }

  function toggleOne(userId: number) {
    setSelectedIds((current) =>
      current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]
    )
  }

  function resetFilters() {
    setQuery('')
    setStatus('active')
    setRoleId('')
    setSelectedIds([])
  }

  async function handleCreate(payload: CreateUserPayload | UpdateUserPayload) {
    await createUser.mutateAsync(payload as CreateUserPayload)
    setIsCreateOpen(false)
  }

  async function handleUpdate(payload: CreateUserPayload | UpdateUserPayload) {
    if (!editingUser) {
      return
    }

    await updateUser.mutateAsync({
      id: editingUser.id,
      payload: payload as UpdateUserPayload,
    })
    setEditingUser(null)
  }

  async function handleDeleteConfirmed() {
    if (!deleteState) {
      return
    }

    if (status === 'deleted') {
      await Promise.all(deleteState.ids.map((id) => forceDeleteUser.mutateAsync(id)))
    } else {
      await Promise.all(deleteState.ids.map((id) => deleteUser.mutateAsync(id)))
    }

    setSelectedIds((current) => current.filter((id) => !deleteState.ids.includes(id)))
    setDeleteState(null)
  }

  async function handleChangePassword() {
    if (!changingPasswordUser || !newPassword.trim()) {
      return
    }

    await changePassword.mutateAsync({
      id: changingPasswordUser.id,
      password: newPassword,
    })
    setChangingPasswordUser(null)
    setNewPassword('')
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Users</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              CRUD, filter and soft delete for administrative users.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={status === 'deleted' ? 'default' : 'outline'}
              size="sm"
              className={`h-10 gap-2 px-4 ${status === 'deleted'
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : ''
                }`}
              onClick={() => setStatus(status === 'deleted' ? 'active' : 'deleted')}
            >
              <Trash2 className="h-4 w-4" />
              Trash
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status === 'deleted' ? 'bg-rose-500 text-white' : 'bg-[var(--app-surface-muted)] text-[var(--app-muted-strong)]'
                }`}>
                {trashCount}
              </span>
            </Button>
            <Button
              size="sm"
              className="h-10 gap-2 px-4"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or email"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className={FILTER_SELECT_CLASS} value={status} onChange={(event) => setStatus(event.target.value as EntityStatusFilter)}>
                <option value="active">Active</option>
                <option value="deleted">Deleted</option>
                <option value="all">All</option>
              </select>
              <select
                className={FILTER_SELECT_CLASS}
                value={roleId}
                onChange={(event) => setRoleId(event.target.value ? Number(event.target.value) : '')}
              >
                <option value="">All roles</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="h-10 gap-2" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] px-4">
                    <Checkbox checked={allSelected} indeterminate={partiallySelected} onChange={toggleAll} />
                  </TableHead>
                  <TableHead className="w-[120px] px-4">ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center text-[var(--app-muted)]">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]">
                      <TableCell className="px-4">
                        <Checkbox checked={selectedIds.includes(user.id)} onChange={() => toggleOne(user.id)} />
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">
                        {formatDisplayId(user.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-surface-muted)] text-[var(--app-muted)]">
                            <UserRound className="h-[14px] w-[14px]" />
                          </div>
                          <span className="font-medium text-[var(--app-muted-strong)]">{user.fullName || 'No Name'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[var(--app-muted-strong)]">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <span key={role.id} className="inline-flex items-center rounded-md bg-[var(--app-accent-soft-bg)] px-2 py-1 text-xs font-medium text-[var(--app-accent-soft-fg)] ring-1 ring-inset ring-[var(--app-accent-soft-border)]">
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.deletedAt || user.status === 'inactive'
                            ? 'bg-[var(--app-danger-soft-bg)] text-[var(--app-danger-soft-fg)] ring-[var(--app-danger-soft-border)]'
                            : 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)] ring-[var(--app-success-soft-border)]'
                            }`}
                        >
                          {user.deletedAt ? 'Deleted' : user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">
                        {formatDateTime(user.createdAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-accent-soft-fg)]"
                            disabled={!!user.deletedAt}
                            onClick={() => setEditingUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-amber-600"
                            disabled={!!user.deletedAt}
                            onClick={() => setChangingPasswordUser(user)}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-hover-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            onClick={() =>
                              setDeleteState({
                                ids: [user.id],
                                title: user.deletedAt ? 'Permanently delete user' : 'Move user to trash',
                                description: user.deletedAt
                                  ? `Are you sure you want to PERMANENTLY delete user ${user.email}? This action cannot be undone.`
                                  : `Are you sure you want to move user ${user.email} to trash?`,
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3 sm:px-6">
            <p className="text-sm text-[var(--app-muted)]">
              Total <span className="font-medium text-[var(--foreground)]">{users.length}</span> users
            </p>
          </div>
        </div>
      </div>

      <UserFormModal
        key={`user-create-${isCreateOpen ? 'open' : 'closed'}`}
        isOpen={isCreateOpen}
        mode="create"
        roles={roles}
        isSubmitting={createUser.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <UserFormModal
        key={`user-edit-${editingUser?.id ?? 'none'}-${editingUser ? 'open' : 'closed'}`}
        isOpen={!!editingUser}
        mode="edit"
        user={editingUser}
        roles={roles}
        isSubmitting={updateUser.isPending}
        onClose={() => setEditingUser(null)}
        onSubmit={handleUpdate}
      />

      <Modal
        isOpen={!!deleteState}
        onClose={() => setDeleteState(null)}
        title={deleteState?.title}
        description={deleteState?.description}
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteState(null)}>
            Cancel
          </Button>
          <Button variant="destructive" isLoading={deleteUser.isPending || forceDeleteUser.isPending} onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={!!changingPasswordUser}
        onClose={() => {
          setChangingPasswordUser(null)
          setNewPassword('')
        }}
        title="Change Password"
        description={`Set a new password for ${changingPasswordUser?.email}. All current sessions for this user will be terminated.`}
      >
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter new password (min 4 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setChangingPasswordUser(null)
                setNewPassword('')
              }}
            >
              Cancel
            </Button>
            <Button
              isLoading={changePassword.isPending}
              disabled={newPassword.length < 4}
              onClick={handleChangePassword}
            >
              Update Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
