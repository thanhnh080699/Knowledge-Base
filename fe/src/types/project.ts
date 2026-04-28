export interface Project {
  id: number
  title: string
  slug: string
  description: string | null
  techStack: string[]
  thumbnailUrl: string | null
  demoUrl: string | null
  repoUrl: string | null
  featured: boolean
  createdAt?: string
  updatedAt?: string
}
