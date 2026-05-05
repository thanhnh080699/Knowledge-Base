export interface Tool {
  id: number
  name: string
  slug: string
  description: string | null
  category: string
  icon: string | null
  urlPath: string
  featured: boolean
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  sortOrder: number
  createdAt: string
  updatedAt: string
}
