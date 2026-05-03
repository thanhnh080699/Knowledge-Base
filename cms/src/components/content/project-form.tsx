'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Textarea } from '@/components/ui/textarea'
import { absoluteCdnUrl, slugify } from '@/lib/utils'
import type { CreateProjectPayload, Project, ProjectStatus, UpdateProjectPayload } from '@/types/project'
import { ImageIcon, X } from 'lucide-react'

type ProjectPayload = CreateProjectPayload | UpdateProjectPayload

interface ProjectFormProps {
  mode: 'create' | 'edit'
  project?: Project | null
  isSubmitting: boolean
  onSubmit: (payload: ProjectPayload) => Promise<void> | void
}

interface FormState {
  title: string
  slug: string
  description: string
  content: string
  techStack: string
  thumbnailUrl: string
  thumbnailFile: File | null
  demoUrl: string
  repoUrl: string
  featured: boolean
  status: ProjectStatus
}

const emptyForm: FormState = {
  title: '',
  slug: '',
  description: '',
  content: '',
  techStack: '',
  thumbnailUrl: '',
  thumbnailFile: null,
  demoUrl: '',
  repoUrl: '',
  featured: false,
  status: 'PUBLISHED',
}

const SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--app-border-strong)]'

function parseTechStack(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function ProjectForm({ mode, project, isSubmitting, onSubmit }: ProjectFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!project) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(emptyForm)
      setPreview(null)
      return
    }

    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description ?? '',
      content: project.content ?? '',
      techStack: (project.techStack ?? []).join(', '),
      thumbnailUrl: project.thumbnailUrl ?? '',
      thumbnailFile: null,
      demoUrl: project.demoUrl ?? '',
      repoUrl: project.repoUrl ?? '',
      featured: project.featured,
      status: project.status ?? 'PUBLISHED',
    })
    setPreview(project.thumbnailUrl)
  }, [project])

  function updateTitle(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: mode === 'create' ? slugify(title) : current.slug,
    }))
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setForm((current) => ({ ...current, thumbnailFile: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function removeThumbnail() {
    setForm((current) => ({ ...current, thumbnailUrl: '', thumbnailFile: null }))
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!form.title.trim() || !form.slug.trim() || !form.description.trim()) {
      setError('Tiêu đề, slug và mô tả ngắn là bắt buộc')
      return
    }

    try {
      await onSubmit({
        title: form.title.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.description.trim(),
        content: form.content.trim() || undefined,
        techStack: parseTechStack(form.techStack),
        thumbnailUrl: form.thumbnailFile || form.thumbnailUrl || undefined,
        demoUrl: form.demoUrl.trim() || undefined,
        repoUrl: form.repoUrl.trim() || undefined,
        featured: form.featured,
        status: form.status,
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể lưu project')
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? <div className="rounded-lg border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] px-4 py-3 text-sm text-[var(--app-danger-soft-fg)]">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Overview</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Thông tin hiển thị trên trang danh sách project.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
            <div className="space-y-2">
              <Label htmlFor="project-title">Title</Label>
              <Input id="project-title" value={form.title} onChange={(event) => updateTitle(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-status">Status</Label>
              <select id="project-status" className={SELECT_CLASS} value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ProjectStatus }))}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project-slug">Slug</Label>
              <Input id="project-slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project-description">Short description</Label>
              <Textarea id="project-description" className="min-h-24" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-demo">Demo URL</Label>
              <Input id="project-demo" value={form.demoUrl} onChange={(event) => setForm((current) => ({ ...current, demoUrl: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-repo">Repo URL</Label>
              <Input id="project-repo" value={form.repoUrl} onChange={(event) => setForm((current) => ({ ...current, repoUrl: event.target.value }))} />
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--app-muted-strong)] md:col-span-2">
              <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} />
              Featured project
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Content</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Bài content/case study cho project đã triển khai.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-tech-stack">Tech stack</Label>
              <Input id="project-tech-stack" value={form.techStack} placeholder="Next.js, AdonisJS, Gin" onChange={(event) => setForm((current) => ({ ...current, techStack: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-content">Project content</Label>
              <RichTextEditor value={form.content} height={420} placeholder="Viết bài case study, phạm vi triển khai, kết quả và stack kỹ thuật..." onChange={(value) => setForm((current) => ({ ...current, content: value }))} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div>
          <h4 className="text-base font-semibold text-[var(--foreground)]">Thumbnail</h4>
          <p className="mt-1 text-sm text-[var(--app-muted)]">Ảnh được upload qua Media API vào CDN folder Projects/content.</p>
        </div>
        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-[280px_1fr]">
            <div className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-[var(--app-border)] bg-[var(--app-surface-muted)]" onClick={() => fileInputRef.current?.click()}>
              {preview ? <img src={absoluteCdnUrl(preview)} alt="Project thumbnail preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-[var(--app-muted)]" />}
            </div>
            <div className="space-y-3">
              <Input value={form.thumbnailUrl} placeholder="Projects/content/image.png" onChange={(event) => {
                setForm((current) => ({ ...current, thumbnailUrl: event.target.value, thumbnailFile: null }))
                setPreview(event.target.value)
              }} />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Choose image</Button>
                {preview ? <Button type="button" variant="ghost" className="text-[var(--app-danger-soft-fg)]" onClick={removeThumbnail}><X className="h-4 w-4" />Remove</Button> : null}
              </div>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div />
        <div className="flex justify-end gap-3">
          <Button type="submit" isLoading={isSubmitting}>{mode === 'create' ? 'Create project' : 'Save changes'}</Button>
        </div>
      </div>
    </form>
  )
}
