'use client'

import { useRouter } from 'next/navigation'
import { TagForm } from '@/components/content/tag-form'
import { useCreateTag } from '@/hooks/mutations/use-taxonomy-mutations'
import type { CreateTagPayload, UpdateTagPayload } from '@/types/taxonomy'

export default function CreateTagPage() {
  const router = useRouter()
  const createTag = useCreateTag()

  async function handleSubmit(payload: CreateTagPayload | UpdateTagPayload) {
    await createTag.mutateAsync(payload as CreateTagPayload)
    router.push('/tags')
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">Dashboard / Tags</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Create Tag</h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">
            Tạo tag mới theo cấu trúc taxonomy dùng cho WordPress migration.
          </span>
        </div>

        <TagForm mode="create" isSubmitting={createTag.isPending} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
