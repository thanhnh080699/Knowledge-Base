'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Textarea } from '@/components/ui/textarea'
import { MediaLibraryModal } from '@/components/shared/media-library-modal'
import { absoluteCdnUrl, slugify } from '@/lib/utils'
import type { Category, Tag } from '@/types/taxonomy'
import type { CreatePostPayload, Post, PostStatus, UpdatePostPayload } from '@/types/post'
import type { MediaAsset } from '@/types/media'
import { ImageIcon, Library, X } from 'lucide-react'

type PostPayload = CreatePostPayload | UpdatePostPayload

interface PostFormProps {
  mode: 'create' | 'edit'
  post?: Post | null
  categories: Category[]
  tags: Tag[]
  isSubmitting: boolean
  onSubmit: (payload: PostPayload) => Promise<void> | void
}

interface FormState {
  title: string
  slug: string
  wordpressId: string
  content: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  canonicalUrl: string
  coverImage: string
  coverImageFile: File | null
  status: PostStatus
  views: string
  categoryId: string
  tagIds: number[]
  publishedAt: string
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  wordpressId: '',
  content: '',
  excerpt: '',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonicalUrl: '',
  coverImage: '',
  coverImageFile: null,
  status: 'DRAFT',
  views: '0',
  categoryId: '',
  tagIds: [],
  publishedAt: '',
}

const SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]'

function toDatetimeLocal(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 16)
}

export function PostForm({ mode, post, categories, tags, isSubmitting, onSubmit }: PostFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mediaPicker, setMediaPicker] = useState<'cover' | 'content' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!post) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      title: post.title,
      slug: post.slug,
      wordpressId: post.wordpressId ? String(post.wordpressId) : '',
      content: post.content,
      excerpt: post.excerpt ?? '',
      metaTitle: post.metaTitle ?? '',
      metaDescription: post.metaDescription ?? '',
      focusKeyword: post.focusKeyword ?? '',
      canonicalUrl: post.canonicalUrl ?? '',
      coverImage: post.coverImage ?? '',
      coverImageFile: null,
      status: post.status,
      views: String(post.views ?? 0),
      categoryId: post.categoryId ? String(post.categoryId) : '',
      tagIds: post.tags?.map((tag) => tag.id) ?? [],
      publishedAt: toDatetimeLocal(post.publishedAt),
    })
    setPreview(post.coverImage)
  }, [post])

  function updateTitle(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: mode === 'create' ? slugify(title) : current.slug,
      metaTitle: current.metaTitle || title,
    }))
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setForm((current) => ({ ...current, coverImageFile: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removeCoverImage() {
    setForm((current) => ({ ...current, coverImage: '', coverImageFile: null }))
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function selectCoverFromLibrary(asset: MediaAsset) {
    setForm((current) => ({ ...current, coverImage: asset.path, coverImageFile: null }))
    setPreview(asset.path)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function insertImageIntoContent(asset: MediaAsset) {
    const imageUrl = absoluteCdnUrl(asset.url || asset.path)
    const alt = asset.alt || asset.original_name || ''
    const imageHtml = `<figure><img src="${imageUrl}" alt="${alt}" /></figure>`
    setForm((current) => ({
      ...current,
      content: current.content ? `${current.content}\n${imageHtml}` : imageHtml,
    }))
  }

  function handleMediaSelect(asset: MediaAsset) {
    if (mediaPicker === 'cover') {
      selectCoverFromLibrary(asset)
    }

    if (mediaPicker === 'content') {
      insertImageIntoContent(asset)
    }

    setMediaPicker(null)
  }

  function toggleTag(tagId: number) {
    setForm((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId) ? current.tagIds.filter((id) => id !== tagId) : [...current.tagIds, tagId],
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setError('Tiêu đề, slug và nội dung là bắt buộc')
      return
    }

    try {
      await onSubmit({
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        wordpressId: form.wordpressId ? Number(form.wordpressId) : undefined,
        content: form.content.trim(),
        excerpt: form.excerpt.trim() || undefined,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        focusKeyword: form.focusKeyword.trim() || undefined,
        canonicalUrl: form.canonicalUrl.trim() || undefined,
        coverImage: form.coverImageFile || form.coverImage || undefined,
        status: form.status,
        views: Number(form.views || 0),
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        tagIds: form.tagIds,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể lưu bài viết')
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Content</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">WordPress-compatible fields cho title, slug, body, excerpt và trạng thái publish.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input id="post-title" value={form.title} onChange={(event) => updateTitle(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-status">Status</Label>
              <select id="post-status" className={SELECT_CLASS} value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as PostStatus }))}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="post-slug">Slug</Label>
              <Input id="post-slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label htmlFor="post-content">Content</Label>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setMediaPicker('content')}>
                  <Library className="h-4 w-4" />
                  Insert media
                </Button>
              </div>
              <RichTextEditor value={form.content} onChange={(value) => setForm((current) => ({ ...current, content: value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="post-excerpt">Excerpt</Label>
              <Textarea id="post-excerpt" className="min-h-24" value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">SEO</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Map tốt với Yoast hoặc RankMath khi import từ WordPress.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="post-meta-title">Meta title</Label>
              <Input id="post-meta-title" value={form.metaTitle} onChange={(event) => setForm((current) => ({ ...current, metaTitle: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-focus-keyword">Focus keyword</Label>
              <Input id="post-focus-keyword" value={form.focusKeyword} onChange={(event) => setForm((current) => ({ ...current, focusKeyword: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="post-meta-description">Meta description</Label>
              <Textarea id="post-meta-description" value={form.metaDescription} onChange={(event) => setForm((current) => ({ ...current, metaDescription: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="post-canonical-url">Canonical URL</Label>
              <Input id="post-canonical-url" value={form.canonicalUrl} onChange={(event) => setForm((current) => ({ ...current, canonicalUrl: event.target.value }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Publishing</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Taxonomy, cover image, publish date và metadata phụ trợ.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="post-category">Category</Label>
                <select id="post-category" className={SELECT_CLASS} value={form.categoryId} onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}>
                  <option value="">Uncategorized</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="max-h-44 space-y-2 overflow-y-auto rounded-md border border-[var(--app-border)] p-3">
                  {tags.length === 0 ? <span className="text-sm text-[var(--app-muted)]">No tags</span> : tags.map((tag) => (
                    <label key={tag.id} className="flex items-center gap-2 text-sm text-[var(--app-muted-strong)]">
                      <input type="checkbox" checked={form.tagIds.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="post-published-at">Published at</Label>
                  <Input id="post-published-at" type="datetime-local" value={form.publishedAt} onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-wordpress-id">WordPress ID</Label>
                  <Input id="post-wordpress-id" type="number" min="0" value={form.wordpressId} onChange={(event) => setForm((current) => ({ ...current, wordpressId: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-views">Views</Label>
                  <Input id="post-views" type="number" min="0" value={form.views} onChange={(event) => setForm((current) => ({ ...current, views: event.target.value }))} />
                </div>
              </div>
            </div>
            <aside className="space-y-2">
              <Label>Cover image</Label>
              <div className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)]" onClick={() => fileInputRef.current?.click()}>
                {preview ? <img src={absoluteCdnUrl(preview)} alt="Cover preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-[var(--app-muted)]" />}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="h-8 gap-2" onClick={() => setMediaPicker('cover')}>
                  <Library className="h-4 w-4" />
                  Media library
                </Button>
                {preview ? <Button type="button" variant="ghost" size="sm" className="h-8 gap-2 text-[var(--app-danger-soft-fg)]" onClick={removeCoverImage}><X className="h-4 w-4" />Remove image</Button> : null}
              </div>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </aside>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div />
        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={isSubmitting}>{mode === 'create' ? 'Create post' : 'Save changes'}</Button>
        </div>
      </div>

      <MediaLibraryModal
        isOpen={mediaPicker !== null}
        title={mediaPicker === 'cover' ? 'Select cover image' : 'Insert content image'}
        initialFolder="Posts"
        imagesOnly
        onClose={() => setMediaPicker(null)}
        onSelect={handleMediaSelect}
      />
    </form>
  )
}
