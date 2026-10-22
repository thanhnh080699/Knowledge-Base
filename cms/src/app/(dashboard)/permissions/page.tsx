'use client'

import { Select } from '@/components/ui/select'
import { useClientList, useListState } from '@/hooks/use-list-state'
import { Table, TableHeader, TableBody, TableHead, TableCell, TableRow } from '@/components/ui/table'
import { Tag } from '@/components/ui/tag'
import { formatDisplayId } from '@/lib/admin-format'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePermissions } from '@/hooks/queries/use-permissions'
import type { EntityStatusFilter } from '@/types/acl'
import { Filter, Search } from 'lucide-react'

const FILTER_SELECT_CLASS =
  'w-auto h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'

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

  const list = useListState(filters)
  const { data: allItems = [], isLoading, isFetching, error } = usePermissions(filters)
  const permissions = useClientList(allItems, list)

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
              <Select
                className={FILTER_SELECT_CLASS}
                value={status}
                onChange={(event) => setStatus(event.target.value as EntityStatusFilter)}
              >
                <option value="active">Active</option>
                <option value="deleted">Deleted</option>
                <option value="all">All</option>
              </Select>
              <Button variant="outline" size="sm" className="h-10 gap-2" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <Table pagination={{ list, total: allItems.length, loading: isFetching }} error={error}>
            <TableHeader><TableRow><TableHead>ID ↓</TableHead><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Module</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={5}>Loading permissions…</TableCell></TableRow> : permissions.length ? permissions.map(permission => (
                <TableRow key={permission.id}><TableCell>{formatDisplayId(permission.id)}</TableCell><TableCell>{permission.name}</TableCell><TableCell>{permission.slug}</TableCell><TableCell>{permission.module}</TableCell><TableCell><Tag variant={permission.deletedAt ? 'destructive' : 'success'}>{permission.deletedAt ? 'Deleted' : 'Active'}</Tag></TableCell></TableRow>
              )) : <TableRow><TableCell colSpan={5}>No permissions found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
