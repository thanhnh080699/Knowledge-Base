'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { slugify } from '@/lib/utils'
import type {
  Category,
  CreateCategoryPayload,
  CreateTagPayload,
  Tag,
  UpdateCategoryPayload,
  UpdateTagPayload,
} from '@/types/taxonomy'

type TaxonomyKind = 'category' | 'tag'
type TaxonomyItem = Category | Tag
type TaxonomyPayload =
  | CreateCategoryPayload
  | UpdateCategoryPayload
  | CreateTagPayload
  | UpdateTagPayload

interface TaxonomyFormModalProps {
  isOpen: boolean
  kind: TaxonomyKind
  mode: 'create' | 'edit'
  item?: TaxonomyItem | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: TaxonomyPayload) => Promise<void> | void
}

interface FormState {
  name: string
  slug: string
  description: string
  icon: string
  color: string
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  color: '',
}

function isCategory(item?: TaxonomyItem | null): item is Category {
  return !!item && 'description' in item
}

export function TaxonomyFormModal({
  isOpen,
  kind,
  mode,
  item,
  isSubmitting,
  onClose,
  onSubmit,
}: TaxonomyFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode === 'edit' && item) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: item.name,
        slug: item.slug,
        description: isCategory(item) ? item.description ?? '' : '',
        icon: isCategory(item) ? item.icon ?? '' : '',
        color: isCategory(item) ? item.color ?? '' : '',
      })
      return
    }

    setForm(emptyForm)
  }, [isOpen, item, mode])

  function updateName(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: mode === 'create' ? slugify(name) : current.slug,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.slug.trim()) {
      setError('Tên và slug là bắt buộc')
      return
    }

    const basePayload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
    }

    const payload: TaxonomyPayload =
      kind === 'category'
        ? {
            ...basePayload,
            description: form.description.trim() || undefined,
            icon: form.icon.trim() || undefined,
            color: form.color.trim() || undefined,
          }
        : basePayload

    try {
      await onSubmit(payload)
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể lưu dữ liệu')
    }
  }

  const label = kind === 'category' ? 'danh mục' : 'thẻ'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? `Tạo ${label}` : `Cập nhật ${label}`}
      description="Thiết lập tên hiển thị và slug dùng cho nội dung."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${kind}-name`}>Tên</Label>
            <Input
              id={`${kind}-name`}
              value={form.name}
              onChange={(event) => updateName(event.target.value)}
              placeholder={kind === 'category' ? 'DevOps' : 'kubernetes'}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${kind}-slug`}>Slug</Label>
            <Input
              id={`${kind}-slug`}
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder={kind === 'category' ? 'devops' : 'kubernetes'}
            />
          </div>
        </div>

        {kind === 'category' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="category-description">Mô tả</Label>
              <textarea
                id="category-description"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-24 w-full rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]"
                placeholder="Mô tả ngắn cho danh mục"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon</Label>
                <Input
                  id="category-icon"
                  value={form.icon}
                  onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
                  placeholder="FolderOpen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-color">Màu</Label>
                <Input
                  id="category-color"
                  value={form.color}
                  onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                  placeholder="#2563eb"
                />
              </div>
            </div>
          </>
        ) : null}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
