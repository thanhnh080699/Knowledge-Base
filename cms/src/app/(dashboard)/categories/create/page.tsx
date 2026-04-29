'use client'

import { useRouter } from 'next/navigation'
import { CategoryForm } from '@/components/content/category-form'
import { useCreateCategory } from '@/hooks/mutations/use-taxonomy-mutations'
import { useCategories } from '@/hooks/queries/use-taxonomies'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '@/types/taxonomy'

export default function CreateCategoryPage() {
  const router = useRouter()
  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()

  async function handleSubmit(payload: CreateCategoryPayload | UpdateCategoryPayload) {
    await createCategory.mutateAsync(payload as CreateCategoryPayload)
    router.push('/categories')
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">Dashboard / Categories</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Create Category</h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">Tạo category mới cho hệ thống taxonomy và WordPress migration.</span>
        </div>
        <CategoryForm mode="create" categories={categories} isSubmitting={createCategory.isPending} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
