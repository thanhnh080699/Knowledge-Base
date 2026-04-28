'use client'

import { useRouter } from 'next/navigation'
import { PostForm } from '@/components/content/post-form'
import { useCreatePost } from '@/hooks/mutations/use-post-mutations'
import { useCategories, useTags } from '@/hooks/queries/use-taxonomies'
import type { CreatePostPayload, UpdatePostPayload } from '@/types/post'

export default function CreatePostPage() {
  const router = useRouter()
  const createPost = useCreatePost()
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()

  async function handleSubmit(payload: CreatePostPayload | UpdatePostPayload) {
    await createPost.mutateAsync(payload as CreatePostPayload)
    router.push('/posts')
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">Dashboard / Posts</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Create Post</h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">Tạo bài viết mới theo cấu trúc tương thích WordPress migration.</span>
        </div>
        <PostForm mode="create" categories={categories} tags={tags} isSubmitting={createPost.isPending} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
