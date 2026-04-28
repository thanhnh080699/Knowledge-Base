'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePermissions } from '@/hooks/queries/use-permissions'
import type { EntityStatusFilter, Permission } from '@/types/acl'
import { Filter, Lock, RotateCcw, Search } from 'lucide-react'

const FILTER_SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'

export default function PermissionsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<EntityStatusFilter>('active')
  const [module, setModule] = useState('')

  const filters = useMemo(
    () => ({
      q: query.trim() || undefined,
      status,
      module: module || undefined,
    }),
    [module, query, status]
  )

  const { data: permissions = [], isLoading } = usePermissions(filters)

  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
      const moduleName = permission.module || 'System'
      if (!acc[moduleName]) {
        acc[moduleName] = []
      }
      acc[moduleName].push(permission)
      return acc
    }, {})
  }, [permissions])

  function resetFilters() {
    setQuery('')
    setStatus('active')
    setModule('')
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Permissions</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              List of predefined system permissions.
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or slug"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                className={FILTER_SELECT_CLASS}
                value={status}
                onChange={(event) => setStatus(event.target.value as EntityStatusFilter)}
              >
                <option value="active">Active</option>
                <option value="deleted">Deleted</option>
                <option value="all">All</option>
              </select>
              <Button variant="outline" size="sm" className="h-10 gap-2" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2 py-20">
                <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                <span className="text-sm text-[var(--app-muted)]">Loading permissions...</span>
              </div>
            ) : Object.keys(groupedPermissions).length === 0 ? (
              <div className="py-20 text-center text-[var(--app-muted)]">No permissions found.</div>
            ) : (
              <div className="grid gap-8">
                {Object.entries(groupedPermissions).map(([moduleName, items]) => (
                  <div key={moduleName} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-[var(--app-border)]" />
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
                          {moduleName}
                        </h4>
                        <span className="rounded-full bg-[var(--app-accent-soft-bg)] px-2 py-0.5 text-xs font-bold text-[var(--app-accent-soft-fg)]">
                          {items.length}
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-[var(--app-border)]" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {items.map((permission) => (
                        <div
                          key={permission.id}
                          className="group relative flex flex-col gap-1 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 transition-all hover:border-[var(--app-accent-soft-border)] hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--app-surface-muted)] text-[var(--app-muted)] transition-colors group-hover:bg-[var(--app-accent-soft-bg)] group-hover:text-[var(--app-accent-soft-fg)]">
                              <Lock className="h-3.5 w-3.5" />
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                permission.deletedAt
                                  ? 'bg-[var(--app-danger-soft-bg)] text-[var(--app-danger-soft-fg)]'
                                  : 'bg-[var(--app-success-soft-bg)] text-[var(--app-success-soft-fg)]'
                              }`}
                            >
                              {permission.deletedAt ? 'Deleted' : 'Active'}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="font-semibold text-[var(--foreground)]">
                              {permission.name}
                            </div>
                            <div className="font-mono text-[10px] text-[var(--app-muted)]">
                              {permission.slug}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
