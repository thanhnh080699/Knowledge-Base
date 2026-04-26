'use client'

import { useRouter, useParams } from 'next/navigation'
import { TagForm } from '@/components/content/tag-form'
import { useUpdateTag } from '@/hooks/mutations/use-taxonomy-mutations'
import { useTag } from '@/hooks/queries/use-taxonomies'
import type { CreateTagPayload, UpdateTagPayload } from '@/types/taxonomy'

export default function EditTagPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const tagId = Number(params.id)
  const { data: tag, isLoading } = useTag(Number.isNaN(tagId) ? null : tagId)
  const updateTag = useUpdateTag()

  async function handleSubmit(payload: CreateTagPayload | UpdateTagPayload) {
    if (Number.isNaN(tagId)) {
      throw new Error('Tag ID không hợp lệ')
    }

    await updateTag.mutateAsync({
      id: tagId,
      payload: payload as UpdateTagPayload,
    })
    router.push('/dashboard/tags')
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
          <span className="text-sm text-[var(--app-muted)]">Loading tag...</span>
        </div>
      </div>
    )
  }

  if (!tag) {
    return (
      <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm">
          <span className="text-sm text-[var(--app-muted)]">Tag not found.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">Dashboard / Tags</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Edit Tag</h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">
            Chỉnh sửa taxonomy và SEO metadata cho tag.
          </span>
        </div>

        <TagForm
          mode="edit"
          initialTag={tag}
          isSubmitting={updateTag.isPending}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
