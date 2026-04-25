'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RoleFormModal } from '@/components/acl/role-form-modal'
import { useCreateRole, useDeleteRole, useUpdateRole } from '@/hooks/mutations/use-role-mutations'
import { useRoles, useRolesMeta } from '@/hooks/queries/use-roles'
import { formatDateTime, formatDisplayId } from '@/lib/admin-format'
import type { AclRole, CreateRolePayload, EntityStatusFilter, UpdateRolePayload } from '@/types/acl'
import { Filter, Pencil, Plus, RotateCcw, Search, Shield, Trash2 } from 'lucide-react'

interface DeleteState {
  ids: string[]
  title: string
  description: string
}

const FILTER_SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'

export default function RolesPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<EntityStatusFilter>('active')
  const [permissionId, setPermissionId] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<AclRole | null>(null)
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null)

  const filters = useMemo(
    () => ({
      q: query.trim() || undefined,
      status,
      permissionId: permissionId || undefined,
    }),
    [permissionId, query, status]
  )

  const { data: roles = [], isLoading } = useRoles(filters)
  const { data: meta } = useRolesMeta()
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()

  const permissions = meta?.permissions ?? []
  const allSelected = roles.length > 0 && selectedIds.length === roles.length
  const partiallySelected = selectedIds.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([])
      return
    }

    setSelectedIds(roles.map((role) => role.id))
  }

  function toggleOne(roleId: string) {
    setSelectedIds((current) =>
      current.includes(roleId) ? current.filter((id) => id !== roleId) : [...current, roleId]
    )
  }

  function resetFilters() {
    setQuery('')
    setStatus('active')
    setPermissionId('')
    setSelectedIds([])
  }

  async function handleCreate(payload: CreateRolePayload | UpdateRolePayload) {
    await createRole.mutateAsync(payload as CreateRolePayload)
    setIsCreateOpen(false)
  }

  async function handleUpdate(payload: CreateRolePayload | UpdateRolePayload) {
    if (!editingRole) {
      return
    }

    await updateRole.mutateAsync({
      id: editingRole.id,
      payload: payload as UpdateRolePayload,
    })
    setEditingRole(null)
  }

  async function handleDeleteConfirmed() {
    if (!deleteState) {
      return
    }

    await Promise.all(deleteState.ids.map((id) => deleteRole.mutateAsync(id)))
    setSelectedIds((current) => current.filter((id) => !deleteState.ids.includes(id)))
    setDeleteState(null)
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Roles</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Manage ACL roles and associated permission sets.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 px-4"
              disabled={selectedIds.length === 0}
              onClick={() =>
                setDeleteState({
                  ids: selectedIds,
                  title: 'Soft delete roles',
                  description: `Are you sure you want to move ${selectedIds.length} selected roles to trash?`,
                })
              }
            >
              <Trash2 className="h-4 w-4" />
              Trash
              <span className="inline-flex items-center rounded-full bg-[var(--app-surface-muted)] px-2.5 py-0.5 text-xs font-semibold text-[var(--app-muted-strong)]">
                {selectedIds.length}
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
                placeholder="Search by name, slug or description"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className={FILTER_SELECT_CLASS} value={status} onChange={(event) => setStatus(event.target.value as EntityStatusFilter)}>
                <option value="active">Active</option>
                <option value="deleted">Deleted</option>
                <option value="all">All</option>
              </select>
              <select className={FILTER_SELECT_CLASS} value={permissionId} onChange={(event) => setPermissionId(event.target.value)}>
                <option value="">All permissions</option>
                {permissions.map((permission) => (
                  <option key={permission.id} value={permission.id}>
                    {permission.slug}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">Loading roles...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : roles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-20 text-center text-[var(--app-muted)]">
                      No roles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  roles.map((role) => (
                    <TableRow key={role.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]">
                      <TableCell className="px-4">
                        <Checkbox checked={selectedIds.includes(role.id)} onChange={() => toggleOne(role.id)} />
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">
                        {formatDisplayId(role.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-accent-soft-bg)] text-[var(--app-accent-soft-fg)]">
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-[var(--app-muted-strong)]">{role.name}</div>
                            <div className="text-xs text-[var(--app-muted)]">{role.description || 'No description'}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[var(--app-muted)]">{role.slug}</TableCell>
                      <TableCell className="text-[var(--app-muted)]">
                        {role.permissions?.length ?? 0}
                      </TableCell>
                      <TableCell className="text-[var(--app-muted)]">{role.users?.length ?? 0}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            role.deletedAt
                              ? 'bg-[var(--app-danger-soft-bg)] text-[var(--app-danger-soft-fg)] ring-[var(--app-danger-soft-border)]'
                              : 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)] ring-[var(--app-success-soft-border)]'
                          }`}
                        >
                          {role.deletedAt ? 'Deleted' : 'Active'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">
                        {formatDateTime(role.createdAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-accent-soft-fg)]"
                            disabled={!!role.deletedAt}
                            onClick={() => setEditingRole(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-hover-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            disabled={!!role.deletedAt}
                            onClick={() =>
                              setDeleteState({
                                ids: [role.id],
                                title: 'Soft delete role',
                                description: `Are you sure you want to move role ${role.name} to trash?`,
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
        </div>
      </div>

      <RoleFormModal
        key={`role-create-${isCreateOpen ? 'open' : 'closed'}`}
        isOpen={isCreateOpen}
        mode="create"
        permissions={permissions}
        isSubmitting={createRole.isPending}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <RoleFormModal
        key={`role-edit-${editingRole?.id ?? 'none'}-${editingRole ? 'open' : 'closed'}`}
        isOpen={!!editingRole}
        mode="edit"
        role={editingRole}
        permissions={permissions}
        isSubmitting={updateRole.isPending}
        onClose={() => setEditingRole(null)}
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
          <Button variant="destructive" isLoading={deleteRole.isPending} onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
