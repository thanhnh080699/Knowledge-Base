'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tag } from '@/components/ui/tag'
import { Textarea } from '@/components/ui/textarea'
import { useDeleteComment, useReplyComment, useUpdateCommentStatus } from '@/hooks/mutations/use-comment-mutations'
import { useComments } from '@/hooks/queries/use-comments'
import { formatDateTime, formatDisplayId } from '@/lib/admin-format'
import type { Comment, CommentStatus } from '@/types/comment'
import { CheckCircle2, Filter, MessageSquareReply, RotateCcw, Search, ShieldAlert, Trash2 } from 'lucide-react'

interface ReplyState {
  comment: Comment
  content: string
}

interface DeleteState {
  ids: number[]
  title: string
  description: string
}

const FILTER_SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'

function statusVariant(status: CommentStatus) {
  if (status === 'APPROVED') return 'success'
  if (status === 'SPAM') return 'destructive'
  return 'warning'
}

export default function CommentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<CommentStatus | ''>('')
  const [trashed, setTrashed] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [replyState, setReplyState] = useState<ReplyState | null>(null)
  const [deleteState, setDeleteState] = useState<DeleteState | null>(null)

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 20,
      search: query.trim() || undefined,
      status,
      trashed,
    }),
    [query, status, trashed]
  )

  const { data: commentsResponse, isLoading } = useComments(filters)
  const updateStatus = useUpdateCommentStatus()
  const replyComment = useReplyComment()
  const deleteComment = useDeleteComment()

  const comments = commentsResponse?.data ?? []
  const total = commentsResponse?.meta.total ?? comments.length
  const allSelected = comments.length > 0 && selectedIds.length === comments.length
  const partiallySelected = selectedIds.length > 0 && !allSelected
  const isMutating = updateStatus.isPending || replyComment.isPending || deleteComment.isPending

  function toggleAll() {
    setSelectedIds(allSelected ? [] : comments.map((comment) => comment.id))
  }

  function toggleOne(commentId: number) {
    setSelectedIds((current) =>
      current.includes(commentId) ? current.filter((id) => id !== commentId) : [...current, commentId]
    )
  }

  function resetFilters() {
    setQuery('')
    setStatus('')
    setSelectedIds([])
  }

  async function handleDeleteConfirmed() {
    if (!deleteState) return

    await Promise.all(deleteState.ids.map((id) => deleteComment.mutateAsync(id)))
    setSelectedIds((current) => current.filter((id) => !deleteState.ids.includes(id)))
    setDeleteState(null)
  }

  async function handleReply() {
    if (!replyState || !replyState.content.trim()) return

    await replyComment.mutateAsync({
      id: replyState.comment.id,
      content: replyState.content.trim(),
    })
    setReplyState(null)
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Comments</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Moderate reader comments, approve useful discussions and reply from the CMS.
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
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search author, email or content"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className={FILTER_SELECT_CLASS} value={status} onChange={(event) => setStatus(event.target.value as CommentStatus | '')}>
                <option value="">All statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="SPAM">Spam</option>
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
                    title: 'Move comments to trash',
                    description: `Are you sure you want to move ${selectedIds.length} selected comments to trash?`,
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
                Move to trash
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
                  <TableHead className="w-[110px] px-4">ID</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>{trashed ? 'Deleted At' : 'Created At'}</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">Loading comments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : comments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-20 text-center text-[var(--app-muted)]">No comments found.</TableCell>
                  </TableRow>
                ) : (
                  comments.map((comment) => (
                    <TableRow key={comment.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]">
                      <TableCell className="px-4">
                        <Checkbox checked={selectedIds.includes(comment.id)} onChange={() => toggleOne(comment.id)} />
                      </TableCell>
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">{formatDisplayId(comment.id)}</TableCell>
                      <TableCell>
                        <div className="min-w-[320px] max-w-xl">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-medium text-[var(--app-muted-strong)]">{comment.authorName}</span>
                            <span className="text-xs text-[var(--app-muted)]">{comment.authorEmail}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-[var(--app-muted)]">{comment.content}</p>
                          {comment.parentId ? (
                            <span className="mt-2 inline-flex text-xs text-[var(--app-muted)]">Reply to #{formatDisplayId(comment.parentId)}</span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-sm text-[var(--app-muted)]">
                        {comment.post?.title ?? `Post #${formatDisplayId(comment.postId)}`}
                      </TableCell>
                      <TableCell>
                        <Tag variant={statusVariant(comment.status)}>{comment.status}</Tag>
                      </TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">{formatDateTime(trashed ? comment.deletedAt : comment.createdAt)}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateStatus.mutate({ id: comment.id, status: 'APPROVED' })}
                            title="Approve"
                            disabled={trashed || comment.status === 'APPROVED'}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateStatus.mutate({ id: comment.id, status: 'SPAM' })}
                            title="Mark as spam"
                            disabled={trashed || comment.status === 'SPAM'}
                          >
                            <ShieldAlert className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setReplyState({ comment, content: '' })}
                            title="Reply"
                            disabled={trashed}
                          >
                            <MessageSquareReply className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-soft-bg)] hover:text-[var(--app-danger-soft-fg)]"
                            onClick={() =>
                              setDeleteState({
                                ids: [comment.id],
                                title: `Move comment #${formatDisplayId(comment.id)} to trash`,
                                description: 'The comment will be hidden from moderation lists unless trash is enabled.',
                              })
                            }
                            disabled={trashed}
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
            <span className="text-sm text-[var(--app-muted)]">Showing {comments.length === 0 ? 0 : 1} to {comments.length} of {total} results</span>
          </div>
        </div>
      </div>

      <Modal isOpen={!!replyState} onClose={() => setReplyState(null)} title="Reply to comment" description={replyState?.comment.authorName}>
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-muted)] p-3 text-sm text-[var(--app-muted)]">
            {replyState?.comment.content}
          </div>
          <Textarea
            value={replyState?.content ?? ''}
            onChange={(event) =>
              setReplyState((current) => (current ? { ...current, content: event.target.value } : current))
            }
            placeholder="Write a reply"
            rows={5}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setReplyState(null)}>Cancel</Button>
            <Button type="button" isLoading={replyComment.isPending} onClick={handleReply}>Send reply</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteState} onClose={() => setDeleteState(null)} title={deleteState?.title} description={deleteState?.description}>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setDeleteState(null)}>Cancel</Button>
          <Button type="button" variant="destructive" isLoading={isMutating} onClick={handleDeleteConfirmed}>
            Move to trash
          </Button>
        </div>
      </Modal>
    </div>
  )
}
