export interface Tag {
  id: number
  name: string
  slug: string
  description: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  createdAt?: string
  updatedAt?: string
}
