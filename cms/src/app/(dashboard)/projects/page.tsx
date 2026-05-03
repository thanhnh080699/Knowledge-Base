'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tag } from '@/components/ui/tag'
import { ProjectForm } from '@/components/content/project-form'
import { useProjects } from '@/hooks/queries/use-projects'
import { useCreateProject, useDeleteProject, useUpdateProject } from '@/hooks/mutations/use-project-mutations'
import { absoluteCdnUrl } from '@/lib/utils'
import { formatDateTime, formatDisplayId } from '@/lib/admin-format'
import type { CreateProjectPayload, Project, ProjectStatus, UpdateProjectPayload } from '@/types/project'
import { ExternalLink, Filter, Pencil, Plus, RotateCcw, Search, Star, Trash2 } from 'lucide-react'

const FILTER_SELECT_CLASS =
  'h-10 rounded-md border border-[var(--app-input-border)] bg-[var(--app-input-bg)] px-3 text-sm text-[var(--app-muted-strong)] outline-none focus:border-[var(--app-border-strong)]'

function statusVariant(status: ProjectStatus) {
  if (status === 'PUBLISHED') return 'success'
  if (status === 'ARCHIVED') return 'secondary'
  return 'warning'
}

export default function ProjectsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ProjectStatus | ''>('')
  const [featured, setFeatured] = useState<boolean | ''>('')
  const [formMode, setFormMode] = useState<'create' | 'edit' | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)

  const filters = useMemo(
    () => ({
      page: 1,
      limit: 20,
      search: query.trim() || undefined,
      status,
      featured,
    }),
    [featured, query, status]
  )

  const { data: projectsResponse, isLoading } = useProjects(filters)
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const removeProject = useDeleteProject()

  const projects = projectsResponse?.data ?? []
  const total = projectsResponse?.meta.total ?? projects.length

  function resetFilters() {
    setQuery('')
    setStatus('')
    setFeatured('')
  }

  function openCreate() {
    setEditingProject(null)
    setFormMode('create')
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setFormMode('edit')
  }

  function closeForm() {
    setFormMode(null)
    setEditingProject(null)
  }

  async function handleSubmit(payload: CreateProjectPayload | UpdateProjectPayload) {
    if (formMode === 'edit' && editingProject) {
      await updateProject.mutateAsync({ id: editingProject.id, payload })
    } else {
      await createProject.mutateAsync(payload as CreateProjectPayload)
    }
    closeForm()
  }

  async function handleDeleteConfirmed() {
    if (!deleteProject) return
    await removeProject.mutateAsync(deleteProject.id)
    setDeleteProject(null)
  }

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]">Projects</h3>
            <span className="mt-1 text-sm text-[var(--app-muted)]">
              Manage deployed project case studies, public status, tech stack and CDN thumbnails.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-10 gap-2 px-4" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--app-border)] p-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, slug or project content" className="pl-9" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className={FILTER_SELECT_CLASS} value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus | '')}>
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <select className={FILTER_SELECT_CLASS} value={featured === '' ? '' : String(featured)} onChange={(event) => setFeatured(event.target.value === '' ? '' : event.target.value === 'true')}>
                <option value="">All projects</option>
                <option value="true">Featured only</option>
                <option value="false">Non-featured</option>
              </select>
              <Button variant="outline" size="sm" className="h-10 gap-2" onClick={resetFilters}>
                <Filter className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm">
              <TableHeader className="border-b border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px] px-4">ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Stack</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RotateCcw className="h-6 w-6 animate-spin text-slate-400" />
                        <span className="text-sm text-[var(--app-muted)]">Loading projects...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center text-[var(--app-muted)]">No projects found.</TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id} className="border-b border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]">
                      <TableCell className="px-4 font-mono text-xs font-medium text-[var(--foreground)]">{formatDisplayId(project.id)}</TableCell>
                      <TableCell>
                        <div className="flex min-w-[320px] items-center gap-3">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded border border-[var(--app-border)] bg-[var(--app-surface-muted)]">
                            {project.thumbnailUrl ? <img src={absoluteCdnUrl(project.thumbnailUrl)} alt={project.title} className="h-full w-full object-cover" /> : null}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="line-clamp-1 font-medium text-[var(--app-muted-strong)]">{project.title}</span>
                              {project.featured ? <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> : null}
                            </div>
                            <div className="truncate font-mono text-xs text-[var(--app-muted)]">{project.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex max-w-[260px] flex-wrap gap-1">
                          {(project.techStack ?? []).slice(0, 4).map((tech) => <Tag key={tech} variant="secondary">{tech}</Tag>)}
                        </div>
                      </TableCell>
                      <TableCell><Tag variant={statusVariant(project.status)}>{project.status}</Tag></TableCell>
                      <TableCell className="text-sm text-[var(--app-muted)]">{formatDateTime(project.updatedAt)}</TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[var(--app-surface-hover)]">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--app-muted)] hover:bg-[var(--app-danger-soft-bg)] hover:text-[var(--app-danger-soft-fg)]" onClick={() => setDeleteProject(project)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--app-border)] bg-[var(--app-surface-muted)] px-6 py-3">
            <span className="text-sm text-[var(--app-muted)]">Showing {projects.length === 0 ? 0 : 1} to {projects.length} of {total} results</span>
          </div>
        </div>
      </div>

      <Modal isOpen={!!formMode} onClose={closeForm} title={formMode === 'edit' ? 'Edit project' : 'Create project'} description="Create a deployed project content entry with CDN thumbnail and public status." className="max-w-5xl">
        <ProjectForm mode={formMode === 'edit' ? 'edit' : 'create'} project={editingProject} isSubmitting={createProject.isPending || updateProject.isPending} onSubmit={handleSubmit} />
      </Modal>

      <Modal isOpen={!!deleteProject} onClose={() => setDeleteProject(null)} title={`Delete ${deleteProject?.title ?? 'project'}`} description="This action removes the project entry from the CMS and public website.">
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setDeleteProject(null)}>Cancel</Button>
          <Button type="button" variant="destructive" isLoading={removeProject.isPending} onClick={handleDeleteConfirmed}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
