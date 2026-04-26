'use client'

import { useEffect, useState, type FormEvent, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { slugify, absoluteCdnUrl } from '@/lib/utils'
import type {
  Category,
  CreateCategoryPayload,
  CreateTagPayload,
  Tag,
  UpdateCategoryPayload,
  UpdateTagPayload,
} from '@/types/taxonomy'
import { ImageIcon, X } from 'lucide-react'

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
  metaTitle: string
  metaDescription: string
  icon: string
  image: string
  imageFile?: File | null
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

function isCategory(item?: TaxonomyItem | null): item is Category {
  return !!item && 'image' in item
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (mode === 'edit' && item) {
      const isCat = isCategory(item)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: item.name,
        slug: item.slug,
        description: isCat ? item.description ?? '' : '',
        metaTitle: item.metaTitle ?? '',
        metaDescription: item.metaDescription ?? '',
        icon: isCat ? item.icon ?? '' : '',
        image: isCat ? item.image ?? '' : '',
        imageFile: null,
      })
      setPreview(isCat ? item.image : null)
      return
    }

    setForm(emptyForm)
    setPreview(null)
  }, [isOpen, item, mode])

  function updateName(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: mode === 'create' ? slugify(name) : current.slug,
    }))
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      setForm((current) => ({ ...current, imageFile: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeImage() {
    setForm((current) => ({ ...current, imageFile: null, image: '' }))
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
            metaTitle: form.metaTitle.trim() || undefined,
            metaDescription: form.metaDescription.trim() || undefined,
            icon: form.icon.trim() || undefined,
            image: form.imageFile || form.image || undefined,
          }
        : {
            ...basePayload,
            description: form.description.trim() || undefined,
            metaTitle: form.metaTitle.trim() || undefined,
            metaDescription: form.metaDescription.trim() || undefined,
          }

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

        <div className="space-y-2">
          <Label htmlFor={`${kind}-description`}>Mô tả</Label>
          <Textarea
            id={`${kind}-description`}
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            className="min-h-24"
            placeholder="Mô tả ngắn dùng cho taxonomy archive và SEO"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${kind}-meta-title`}>SEO title</Label>
            <Input
              id={`${kind}-meta-title`}
              value={form.metaTitle}
              onChange={(event) => setForm((current) => ({ ...current, metaTitle: event.target.value }))}
              placeholder="Tiêu đề SEO"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${kind}-meta-description`}>SEO description</Label>
            <Input
              id={`${kind}-meta-description`}
              value={form.metaDescription}
              onChange={(event) => setForm((current) => ({ ...current, metaDescription: event.target.value }))}
              placeholder="Mô tả hiển thị trên Google"
            />
          </div>
        </div>

        {kind === 'category' ? (
          <>
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
                <Label>Ảnh đại diện</Label>
                <div className="flex items-center gap-4">
                  <div
                    className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)] transition-all hover:border-[var(--app-accent-soft-fg)]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {preview ? (
                      <img src={absoluteCdnUrl(preview)} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-[var(--app-muted)]" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-[10px] font-medium text-white">Thay đổi</span>
                    </div>
                  </div>
                  {preview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2 text-[var(--app-danger-soft-fg)] hover:bg-[var(--app-danger-soft-bg)]"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                      Xóa ảnh
                    </Button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
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
