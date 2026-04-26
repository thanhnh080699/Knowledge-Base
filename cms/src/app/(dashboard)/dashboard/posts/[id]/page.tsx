'use client'

import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '@/components/content/post-form'
import { useUpdatePost } from '@/hooks/mutations/use-post-mutations'
import { usePost } from '@/hooks/queries/use-posts'
import { useCategories, useTags } from '@/hooks/queries/use-taxonomies'
import type { CreatePostPayload, UpdatePostPayload } from '@/types/post'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const postId = Number(params.id)
  const { data: post, isLoading } = usePost(Number.isNaN(postId) ? null : postId)
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()
  const updatePost = useUpdatePost()

  async function handleSubmit(payload: CreatePostPayload | UpdatePostPayload) {
    if (Number.isNaN(postId)) {
      throw new Error('Post ID không hợp lệ')
    }

    await updatePost.mutateAsync({ id: postId, payload: payload as UpdatePostPayload })
    router.push('/dashboard/posts')
  }

  if (isLoading) {
    return <div className="mx-auto w-full max-w-7xl rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm"><span className="text-sm text-[var(--app-muted)]">Loading post...</span></div>
  }

  if (!post) {
    return <div className="mx-auto w-full max-w-7xl rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6 shadow-sm"><span className="text-sm text-[var(--app-muted)]">Post not found.</span></div>
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-[var(--app-muted)]">Dashboard / Posts</div>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Edit Post</h3>
          <span className="mt-1 block text-sm text-[var(--app-muted)]">Chỉnh sửa nội dung, taxonomy và SEO metadata của bài viết.</span>
        </div>
        <PostForm mode="edit" post={post} categories={categories} tags={tags} isSubmitting={updatePost.isPending} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
