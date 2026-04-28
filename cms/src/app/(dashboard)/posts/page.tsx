'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tag } from '@/components/ui/tag'
import { useCategories } from '@/hooks/queries/use-taxonomies'
import { usePosts } from '@/hooks/queries/use-posts'
import {
  useDeletePost,
  useForceDeletePost,
  useRestorePost,
} from '@/hooks/mutations/use-post-mutations'
import { absoluteCdnUrl } from '@/lib/utils'
import { formatDateTime, formatDisplayId } from '@/lib/admin-format'
import type { PostStatus } from '@/types/post'
import { ArchiveRestore, Eye, Filter, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'

interface DeleteState {
  ids: number[]
  title: string
  description: string
}

const FILTER_SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'

function statusVariant(status: PostStatus) {
  if (status === 'PUBLISHED') return 'success'
  if (status === 'ARCHIVED') return 'secondary'
  return 'warning'
}

export default function PostsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PostStatus | ''>('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [trashed, setTrashed] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null)

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 20,
      search: query.trim() || undefined,
      status,
      categoryId,
      trashed,
    }),
    [categoryId, query, status, trashed]
  )

  const { data: postsResponse, isLoading } = usePosts(filters)
  const { data: categories = [] } = useCategories()
  const deletePost = useDeletePost()
  const restorePost = useRestorePost()
  const forceDeletePost = useForceDeletePost()

  const posts = postsResponse?.data ?? []
  const total = postsResponse?.meta.total ?? posts.length
  const allSelected = posts.length > 0 && selectedIds.length === posts.length
  const partiallySelected = selectedIds.length > 0 && !allSelected
  const isDeleting = deletePost.isPending || forceDeletePost.isPending

  function toggleAll() {
    setSelectedIds(allSelected ? [] : posts.map((post) => post.id))
  }

  function toggleOne(postId: number) {
    setSelectedIds((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId]
    )
  }

  function resetFilters() {
    setQuery('')
    setStatus('')
    setCategoryId('')
    setSelectedIds([])
  }

  async function handleDeleteConfirmed() {
    if (!deleteState) return

    if (trashed) {
      await Promise.all(deleteState.ids.map((id) => forceDeletePost.mutateAsync(id)))
    } else {
      await Promise.all(deleteState.ids.map((id) => deletePost.mutateAsync(id)))
    }

    setSelectedIds((current) => current.filter((id) => !deleteState.ids.includes(id)))
    setDeleteState(null)
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Posts</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Manage WordPress-style posts with taxonomy, publish state and SEO metadata.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={trashed ? 'default' : 'outline'}
              size="sm"
              className={`h-10 gap-2 px-4 ${trashed ? 'bg-rose-600 text-white hover:bg-rose-700' : ''}`}
              onClick={() => {
                setTrashed((current) => !current)
                setSelectedIds([])
              }}
            >
              <Trash2 className="h-4 w-4" />
              Trash
            </Button>
            <Link href="/posts/create" className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--foreground)] px-4 text-sm font-medium text-[var(--app-surface)] transition-colors hover:opacity-90">
              <Plus className="h-4 w-4" />
              Create New
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, slug or content"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className={FILTER_SELECT_CLASS} value={status} onChange={(event) => setStatus(event.target.value as PostStatus | '')}>
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <select className={FILTER_SELECT_CLASS} value={categoryId} onChange={(event) => setCategoryId(event.target.value ? Number(event.target.value) : '')}>
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <Button variant="outline" size="sm" className="h-10 gap-2" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          {selectedIds.length > 0 ? (
            <div className="flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface-muted)] px-4 py-3">
              <span className="text-sm text-[var(--app-muted)]">{selectedIds.length} selected</span>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2"
                onClick={() =>
                  setDeleteState({
                    ids: selectedIds,
                    title: trashed ? 'Permanently delete posts' : 'Move posts to trash',
                    description: `Are you sure you want to ${trashed ? 'permanently delete' : 'move to trash'} ${selectedIds.length} selected posts?`,
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
                {trashed ? 'Delete permanently' : 'Move to trash'}
              </Button>
            </div>
          ) : null}

          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] px-4">
                    <Checkbox checked={allSelected} indeterminate={partiallySelected} onChange={toggleAll} />
                  </TableHead>
                  <TableHead className="w-[120px] px-4">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>{trashed ? 'Deleted At' : 'Published At'}</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">Loading posts...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-20 text-center text-[var(--app-muted)]">No posts found.</TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]">
                      <TableCell className="px-4">
                        <Checkbox checked={selectedIds.includes(post.id)} onChange={() => toggleOne(post.id)} />
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">{formatDisplayId(post.id)}</TableCell>
                      <TableCell>
                        <div className="flex min-w-[280px] items-center gap-3">
                          <div className="h-10 w-14 shrink-0 overflow-hidden rounded border border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                            {post.coverImage ? (
                              <img src={absoluteCdnUrl(post.coverImage)} alt={post.title} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <div className="line-clamp-1 font-medium text-[var(--app-muted-strong)]">{post.title}</div>
                            <div className="truncate font-mono text-xs text-[var(--app-muted)]">{post.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">{post.category?.name ?? 'Uncategorized'}</TableCell>
                      <TableCell><Tag variant={statusVariant(post.status)}>{post.status}</Tag></TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]"><span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.views}</span></TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">{formatDateTime(trashed ? post.deletedAt : post.publishedAt)}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {trashed ? (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => restorePost.mutate(post.id)}>
                              <ArchiveRestore className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Link href={`/posts/${post.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[var(--app-surface-hover)]">
                              <Pencil className="h-4 w-4" />
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-soft-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            onClick={() =>
                              setDeleteState({
                                ids: [post.id],
                                title: trashed ? `Permanently delete ${post.title}` : `Move ${post.title} to trash`,
                                description: trashed
                                  ? 'This action cannot be undone.'
                                  : 'The post can be restored from trash later.',
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

          <div className="flex items-center justify-between border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-6 py-3">
            <span className="text-sm text-[var(--app-muted)]">Showing {posts.length === 0 ? 0 : 1} to {posts.length} of {total} results</span>
          </div>
        </div>
      </div>

      <Modal isOpen={!!deleteState} onClose={() => setDeleteState(null)} title={deleteState?.title} description={deleteState?.description}>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setDeleteState(null)}>Cancel</Button>
          <Button type="button" variant="destructive" isLoading={isDeleting} onClick={handleDeleteConfirmed}>
            {trashed ? 'Delete permanently' : 'Move to trash'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
