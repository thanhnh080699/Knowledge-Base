export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Tag {
  id: number
  name: string
  slug: string
  createdAt: string | null
  updatedAt: string | null
}

export interface TaxonomyFilters {
  q?: string
  page?: number
  limit?: number
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  description?: string
  icon?: string
  image?: string | File
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export interface CreateTagPayload {
  name: string
  slug: string
}

export type UpdateTagPayload = Partial<CreateTagPayload>
