export interface Project {
  id: number
  title: string
  slug: string
  description: string | null
  content?: string | null
  techStack: string[]
  thumbnailUrl: string | null
  demoUrl: string | null
  repoUrl: string | null
  featured: boolean
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  createdAt?: string
  updatedAt?: string
}
