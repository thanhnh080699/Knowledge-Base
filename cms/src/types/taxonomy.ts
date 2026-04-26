export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  metaTitle: string | null
  metaDescription: string | null
  icon: string | null
  image: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface Tag {
  id: number
  name: string
  slug: string
  description: string | null
  metaTitle: string | null
  metaDescription: string | null
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
  metaTitle?: string
  metaDescription?: string
  icon?: string
  image?: string | File
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>

export interface CreateTagPayload {
  name: string
  slug: string
  description?: string
  metaTitle?: string
  metaDescription?: string
}

export type UpdateTagPayload = Partial<CreateTagPayload>
