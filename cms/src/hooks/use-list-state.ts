'use client'

import { useMemo, useState, type SetStateAction } from 'react'
import { DEFAULT_PAGE_SIZE, newestFirst, paginateItems } from '@/lib/list-state'

export function useListState(filters: unknown = null) {
  const key = JSON.stringify(filters)
  const [state, setState] = useState({ key, page: 1, pageSize: DEFAULT_PAGE_SIZE })
  // Reset synchronously so a changed filter never requests the previous page.
  if (state.key !== key) setState({ ...state, key, page: 1 })
  const page = state.key === key ? state.page : 1
  const pageSize = state.pageSize
  const scope = JSON.stringify([key, page, pageSize])
  const [selectedIds, setSelectedIds] = useScopedSelection<number>(scope)
  const setPage = (value: number) => setState(previous => ({ ...previous, key, page: Math.max(1, value) }))
  const setPageSize = (value: number) => setState({ key, page: 1, pageSize: value })
  return { page, pageSize, setPage, setPageSize, selectedIds, setSelectedIds }
}

export type ListState = ReturnType<typeof useListState>

export function useClientList<T extends { id: number }>(items: readonly T[], list: ListState) {
  return useMemo(() => paginateItems(newestFirst(items), list.page, list.pageSize), [items, list.page, list.pageSize])
}

export function useScopedSelection<T>(scopeValue: unknown) {
  const scope = JSON.stringify(scopeValue)
  const [selection, setSelection] = useState<{ scope: string; ids: T[] }>({ scope, ids: [] })
  if (selection.scope !== scope) setSelection({ scope, ids: [] })
  const selected = selection.scope === scope ? selection.ids : []
  const update = (action: SetStateAction<T[]>) => setSelection(previous => ({
    scope,
    ids: typeof action === 'function' ? action(previous.scope === scope ? previous.ids : []) : action,
  }))
  return [selected, update] as const
}
