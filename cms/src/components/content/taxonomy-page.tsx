'use client'

import { buildCategoryTree, filterCategoryTree, flattenCategoryTree } from '@/lib/category-tree'
import { paginateItems } from '@/lib/list-state'
import { useClientList, useListState } from '@/hooks/use-list-state'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TaxonomyFormModal } from '@/components/content/taxonomy-form-modal'
import { CategoryReorderModal } from '@/components/content/category-reorder-modal'
import {
  useCreateCategory,
  useCreateTag,
  useDeleteCategory,
  useDeleteTag,
  useReorderCategories,
  useUpdateCategory,
  useUpdateTag,
} from '@/hooks/mutations/use-taxonomy-mutations'
import { useCategories, useTags } from '@/hooks/queries/use-taxonomies'
import { formatDateTime, formatDisplayId } from '@/lib/admin-format'
import type {
  Category,
  CreateCategoryPayload,
  CreateTagPayload,
  Tag,
  UpdateCategoryPayload,
  UpdateTagPayload,
} from '@/types/taxonomy'
import { ChevronDown, ChevronRight, FolderOpen, Pencil, Plus, RotateCcw, Search, TagIcon, Trash2 } from 'lucide-react'
import { absoluteCdnUrl } from '@/lib/utils'

type TaxonomyKind = 'category' | 'tag'
type TaxonomyItem = Category | Tag
type TaxonomyPayload =
  | CreateCategoryPayload
  | UpdateCategoryPayload
  | CreateTagPayload
  | UpdateTagPayload

interface TaxonomyPageProps {
  kind: TaxonomyKind
  usePageForm?: boolean
  pageBasePath?: string
}

interface DeleteState {
  ids: number[]
  title: string
  description: string
}

function isCategory(item: TaxonomyItem): item is Category {
  return 'image' in item
}

export function TaxonomyPage({ kind, usePageForm = false, pageBasePath }: TaxonomyPageProps) {
  const [query, setQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TaxonomyItem | null>(null)
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null)
  const [isReorderOpen, setIsReorderOpen] = useState(false)

  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set())

  const list = useListState({ kind, query })
  const { selectedIds, setSelectedIds } = list

  const filters = useMemo(
    () => ({
      q: query.trim() || undefined,
    }),
    [query]
  )

  const categoriesQuery = useCategories({}, kind === 'category')
  const tagsQuery = useTags(filters, kind === 'tag')
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const reorderCategories = useReorderCategories()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const allItems: TaxonomyItem[] = useMemo(() => kind === 'category' ? categoriesQuery.data ?? [] : tagsQuery.data ?? [], [kind, categoriesQuery.data, tagsQuery.data])
  const tagItems = useClientList(allItems, list)
  const isLoading = kind === 'category' ? categoriesQuery.isLoading : tagsQuery.isLoading
  const isFetching = kind === 'category' ? categoriesQuery.isFetching : tagsQuery.isFetching
  const treeItems = useMemo(() => kind === 'category' ? buildCategoryTree(allItems as Category[]) : [], [allItems, kind])
  const filteredTree = useMemo(() => filterCategoryTree(treeItems, query), [treeItems, query])
  const pageRoots = paginateItems(filteredTree, list.page, list.pageSize)
  const categoryRows = flattenCategoryTree(pageRoots, query.trim() ? new Set() : collapsedIds)
  const rows = kind === 'category' ? categoryRows : tagItems.map(item => ({ item, level: 0 }))
  const items = rows.map(row => row.item)
  const total = kind === 'category' ? filteredTree.length : allItems.length

  function toggleBranch(id: number) {
    setSelectedIds([])
    setCollapsedIds(previous => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length
  const partiallySelected = selectedIds.length > 0 && !allSelected
  const title = kind === 'category' ? 'Categories' : 'Tags'
  const description =
    kind === 'category'
      ? 'Duyệt danh mục theo cây cha–con. Mỗi trang giữ trọn một nhóm nhánh gốc.'
      : 'Manage quick labels used to classify posts.'
  const Icon = kind === 'category' ? FolderOpen : TagIcon
  const useModalForm = !usePageForm
  const basePath = pageBasePath ?? `/${kind === 'category' ? 'categories' : 'tags'}`

  function toggleAll() {
    if (allSelected) {
      setSelectedIds([])
      return
    }

    setSelectedIds(items.map((item) => item.id))
  }

  function toggleOne(itemId: number) {
    setSelectedIds((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]
    )
  }

  async function handleCreate(payload: TaxonomyPayload) {
    if (kind === 'category') {
      await createCategory.mutateAsync(payload as CreateCategoryPayload)
    } else {
      await createTag.mutateAsync(payload as CreateTagPayload)
    }
    setIsCreateOpen(false)
  }

  async function handleUpdate(payload: TaxonomyPayload) {
    if (!editingItem) {
      return
    }

    if (kind === 'category') {
      await updateCategory.mutateAsync({
        id: editingItem.id,
        payload: payload as UpdateCategoryPayload,
      })
    } else {
      await updateTag.mutateAsync({
        id: editingItem.id,
        payload: payload as UpdateTagPayload,
      })
    }
    setEditingItem(null)
  }

  async function handleDeleteConfirmed() {
    if (!deleteState) {
      return
    }

    if (kind === 'category') {
      await Promise.all(deleteState.ids.map((id) => deleteCategory.mutateAsync(id)))
    } else {
      await Promise.all(deleteState.ids.map((id) => deleteTag.mutateAsync(id)))
    }

    setSelectedIds((current) => current.filter((id) => !deleteState.ids.includes(id)))
    setDeleteState(null)
  }

  const isSubmitting =
    createCategory.isPending || updateCategory.isPending || createTag.isPending || updateTag.isPending
  const isDeleting = deleteCategory.isPending || deleteTag.isPending

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {title}
            </h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">{description}</span>
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
                  title: `Delete ${title.toLowerCase()}`,
                  description: `Are you sure you want to delete ${selectedIds.length} selected ${title.toLowerCase()}?`,
                })
              }
            >
              <Trash2 className="h-4 w-4" />
              Trash
              <span className="inline-flex items-center rounded-full bg-[var(--app-surface-muted)] px-2.5 py-0.5 text-xs font-semibold text-[var(--app-muted-strong)]">
                {selectedIds.length}
              </span>
            </Button>
            {kind === 'category' && !query && (
              <Button variant="outline" size="sm" className="h-10 gap-2 px-4" onClick={() => setIsReorderOpen(true)}>
                <RotateCcw className="h-4 w-4" />
                Reorder
              </Button>
            )}
            {useModalForm ? (
              <Button size="sm" className="h-10 gap-2 px-4" onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create New
              </Button>
            ) : (
              <Link
                href={`${basePath}/create`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--app-surface)] transition-colors hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Create New
              </Link>
            )}
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
            {kind === 'category' ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-[var(--app-muted)]">{allItems.length} danh mục · {filteredTree.length} nhánh gốc</span>
                <Button type="button" variant="outline" size="sm" disabled={!!query.trim()} onClick={() => { setSelectedIds([]); setCollapsedIds(new Set()) }}>Mở tất cả</Button>
                <Button type="button" variant="outline" size="sm" disabled={!!query.trim()} onClick={() => { setSelectedIds([]); setCollapsedIds(new Set(allItems.map(item => item.id))) }}>Thu gọn tất cả</Button>
              </div>
            ) : null}
          </div>

          <Table pagination={{ list, total, loading: isFetching, label: kind === 'category' ? 'nhánh gốc' : 'kết quả' }} error={kind === 'category' ? categoriesQuery.error : tagsQuery.error} className="w-full caption-bottom text-sm">
              <TableHeader className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] px-4">
                    <Checkbox checked={allSelected} indeterminate={partiallySelected} onChange={toggleAll} />
                  </TableHead>
                  <TableHead className="w-[90px] px-4" aria-sort={kind === 'tag' ? 'descending' : undefined}>{kind === 'tag' ? 'ID ↓' : 'ID'}</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  {kind === 'category' ? <TableHead>Description</TableHead> : null}
                  {kind === 'category' ? <TableHead>Image</TableHead> : null}
                  <TableHead>Created At</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={kind === 'category' ? 8 : 6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">Loading {title.toLowerCase()}...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={kind === 'category' ? 8 : 6} className="py-20 text-center text-[var(--app-muted)]">
                      No {title.toLowerCase()} found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map(({ item, level }) => (
                    <TableRow key={item.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]">
                      <TableCell className="px-4">
                        <Checkbox checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)} />
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">
                        {formatDisplayId(item.id)}
                      </TableCell>
                      <TableCell>
                        <div className="flex min-w-[220px] items-center gap-2" style={kind === 'category' ? { paddingInlineStart: `${level * 24}px` } : undefined}>
                          {kind === 'category' ? (
                            isCategory(item) && item.children?.length ? (
                              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label={`${collapsedIds.has(item.id) && !query.trim() ? 'Mở' : 'Thu gọn'} nhánh ${item.name}`} aria-expanded={!!query.trim() || !collapsedIds.has(item.id)} disabled={!!query.trim()} onClick={() => toggleBranch(item.id)}>
                                {collapsedIds.has(item.id) && !query.trim() ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            ) : <span className="w-8 shrink-0 text-center text-[var(--app-muted)]" aria-hidden="true">{level ? '└' : ''}</span>
                          ) : null}
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--app-accent-soft-bg)] text-[var(--app-accent-soft-fg)]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-[var(--app-muted-strong)]">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-[var(--app-muted)]">{item.slug}</TableCell>
                      {isCategory(item) ? (
                        <TableCell className="max-w-[340px] text-[var(--app-muted)]">
                          <span className="line-clamp-2">{item.description || 'No description'}</span>
                        </TableCell>
                      ) : null}
                      {isCategory(item) ? (
                        <TableCell>
                          {item.image ? (
                            <div className="relative h-10 w-10 overflow-hidden rounded border border-[var(--app-border)]">
                              <img
                                src={absoluteCdnUrl(item.image)}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--app-muted)]">No Image</span>
                          )}
                        </TableCell>
                      ) : null}
                      <TableCell className="text-sm text-[var(--app-muted)]">
                        {formatDateTime(item.createdAt)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {useModalForm ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-accent-soft-fg)]"
                              onClick={() => setEditingItem(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Link
                              href={`${basePath}/${item.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-accent-soft-fg)]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-soft-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            onClick={() =>
                              setDeleteState({
                                ids: [item.id],
                                title: `Delete ${item.name}`,
                                description: `Are you sure you want to delete "${item.name}"?`,
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

      {useModalForm ? (
        <>
          <TaxonomyFormModal
            isOpen={isCreateOpen}
            kind={kind}
            mode="create"
            isSubmitting={isSubmitting}
            onClose={() => setIsCreateOpen(false)}
            onSubmit={handleCreate}
            items={allItems}
          />

          <TaxonomyFormModal
            isOpen={!!editingItem}
            kind={kind}
            mode="edit"
            item={editingItem}
            isSubmitting={isSubmitting}
            onClose={() => setEditingItem(null)}
            onSubmit={handleUpdate}
            items={allItems}
          />
        </>
      ) : null}

      {kind === 'category' && (
        <CategoryReorderModal
          isOpen={isReorderOpen}
          onClose={() => setIsReorderOpen(false)}
          items={treeItems}
          onSave={async (items) => {
            await reorderCategories.mutateAsync(items)
          }}
          isSubmitting={reorderCategories.isPending}
        />
      )}

      <Modal
        isOpen={!!deleteState}
        onClose={() => setDeleteState(null)}
        title={deleteState?.title}
        description={deleteState?.description}
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setDeleteState(null)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" isLoading={isDeleting} onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
