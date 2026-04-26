'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { slugify } from '@/lib/utils'
import type { CreateTagPayload, Tag, UpdateTagPayload } from '@/types/taxonomy'

type TagPayload = CreateTagPayload | UpdateTagPayload

interface TagFormProps {
  mode: 'create' | 'edit'
  initialTag?: Tag | null
  isSubmitting: boolean
  onSubmit: (payload: TagPayload) => Promise<void> | void
}

interface FormState {
  name: string
  slug: string
  description: string
  metaTitle: string
  metaDescription: string
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
}

export function TagForm({ mode, initialTag, isSubmitting, onSubmit }: TagFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialTag) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      name: initialTag.name,
      slug: initialTag.slug,
      description: initialTag.description ?? '',
      metaTitle: initialTag.metaTitle ?? '',
      metaDescription: initialTag.metaDescription ?? '',
    })
  }, [initialTag])

  function updateName(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: mode === 'create' ? slugify(name) : current.slug,
      metaTitle: current.metaTitle || name,
    }))
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
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể lưu thẻ')
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Basic Information</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Tên hiển thị, slug và mô tả của tag dùng cho post archive và import từ WordPress.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Name</Label>
              <Input id="tag-name" value={form.name} onChange={(event) => updateName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-slug">Slug</Label>
              <Input id="tag-slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tag-description">Description</Label>
              <Textarea
                id="tag-description"
                className="min-h-28"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">SEO</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Map trực tiếp với metadata hiện có để giữ nguyên cấu trúc khi chuyển dữ liệu WordPress.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="tag-meta-title">SEO title</Label>
              <Input
                id="tag-meta-title"
                value={form.metaTitle}
                onChange={(event) => setForm((current) => ({ ...current, metaTitle: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tag-meta-description">SEO description</Label>
              <Textarea
                id="tag-meta-description"
                value={form.metaDescription}
                onChange={(event) => setForm((current) => ({ ...current, metaDescription: event.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div />
        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={isSubmitting}>
            {mode === 'create' ? 'Create tag' : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}
