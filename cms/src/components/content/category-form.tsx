'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { absoluteCdnUrl, slugify } from '@/lib/utils'
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/taxonomy'
import { ImageIcon, X } from 'lucide-react'

type CategoryPayload = CreateCategoryPayload | UpdateCategoryPayload

interface CategoryFormProps {
  mode: 'create' | 'edit'
  initialCategory?: Category | null
  isSubmitting: boolean
  onSubmit: (payload: CategoryPayload) => Promise<void> | void
}

interface FormState {
  name: string
  slug: string
  description: string
  metaTitle: string
  metaDescription: string
  icon: string
  image: string
  imageFile: File | null
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  icon: '',
  image: '',
  imageFile: null,
}

export function CategoryForm({ mode, initialCategory, isSubmitting, onSubmit }: CategoryFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!initialCategory) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: initialCategory.name,
      slug: initialCategory.slug,
      description: initialCategory.description ?? '',
      metaTitle: initialCategory.metaTitle ?? '',
      metaDescription: initialCategory.metaDescription ?? '',
      icon: initialCategory.icon ?? '',
      image: initialCategory.image ?? '',
      imageFile: null,
    })
    setPreview(initialCategory.image)
  }, [initialCategory])

  function updateName(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: mode === 'create' ? slugify(name) : current.slug,
      metaTitle: current.metaTitle || name,
    }))
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setForm((current) => ({ ...current, imageFile: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setForm((current) => ({ ...current, image: '', imageFile: null }))
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Tên và slug là bắt buộc')
      return
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim() || undefined,
        metaTitle: form.metaTitle.trim() || undefined,
        metaDescription: form.metaDescription.trim() || undefined,
        icon: form.icon.trim() || undefined,
        image: form.imageFile || form.image || undefined,
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể lưu danh mục')
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Basic Information</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Tên, slug và mô tả dùng cho archive nội dung và migration từ WordPress.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input id="category-name" value={form.name} onChange={(event) => updateName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-slug">Slug</Label>
              <Input id="category-slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea id="category-description" className="min-h-28" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-icon">Icon</Label>
              <Input id="category-icon" value={form.icon} onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="flex items-center gap-4">
                <div className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)]" onClick={() => fileInputRef.current?.click()}>
                  {preview ? <img src={absoluteCdnUrl(preview)} alt="Preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-[var(--app-muted)]" />}
                </div>
                {preview ? <Button type="button" variant="ghost" size="sm" className="h-8 gap-2 text-[var(--app-danger-soft-fg)]" onClick={removeImage}><X className="h-4 w-4" />Remove</Button> : null}
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">SEO</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Giữ sẵn metadata để taxonomy landing page và import dữ liệu đồng nhất.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="category-meta-title">SEO title</Label>
              <Input id="category-meta-title" value={form.metaTitle} onChange={(event) => setForm((current) => ({ ...current, metaTitle: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-meta-description">SEO description</Label>
              <Textarea id="category-meta-description" value={form.metaDescription} onChange={(event) => setForm((current) => ({ ...current, metaDescription: event.target.value }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div />
        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={isSubmitting}>{mode === 'create' ? 'Create category' : 'Save changes'}</Button>
        </div>
      </div>
    </form>
  )
}
