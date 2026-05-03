export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Project {
  id: number
  title: string
  slug: string
  description: string | null
  content: string | null
  techStack: string[]
  thumbnailUrl: string | null
  demoUrl: string | null
  repoUrl: string | null
  featured: boolean
  status: ProjectStatus
  createdAt: string | null
  updatedAt: string | null
}

export interface ProjectFilters {
  page?: number
  limit?: number
  search?: string
  status?: ProjectStatus | ''
  featured?: boolean | ''
}

export interface CreateProjectPayload {
  title: string
  slug: string
  description: string
  content?: string
  techStack?: string[]
  thumbnailUrl?: string | File
  demoUrl?: string
  repoUrl?: string
  featured?: boolean
  status?: ProjectStatus
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>
