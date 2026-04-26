'use client'

import { useParams, useRouter } from 'next/navigation'
import { CategoryForm } from '@/components/content/category-form'
import { useUpdateCategory } from '@/hooks/mutations/use-taxonomy-mutations'
import { useCategory } from '@/hooks/queries/use-taxonomies'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '@/types/taxonomy'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const categoryId = Number(params.id)
  const { data: category, isLoading } = useCategory(Number.isNaN(categoryId) ? null : categoryId)
  const updateCategory = useUpdateCategory()

  async function handleSubmit(payload: CreateCategoryPayload | UpdateCategoryPayload) {
    if (Number.isNaN(categoryId)) {
      throw new Error('Category ID không hợp lệ')
    }

    await updateCategory.mutateAsync({
      id: categoryId,
      payload: payload as UpdateCategoryPayload,
    })
    router.push('/dashboard/categories')
  }

  if (isLoading) {
    return <div className="mx-auto w-full max-w-7xl rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm"><span className="text-sm text-[var(--app-muted)]">Loading category...</span></div>
  }

  if (!category) {
    return <div className="mx-auto w-full max-w-7xl rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm"><span className="text-sm text-[var(--app-muted)]">Category not found.</span></div>
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">Dashboard / Categories</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Edit Category</h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">Chỉnh sửa category và SEO metadata.</span>
        </div>
        <CategoryForm mode="edit" initialCategory={category} isSubmitting={updateCategory.isPending} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
