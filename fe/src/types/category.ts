export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  image?: string | null
  icon?: string | null
  createdAt?: string
  updatedAt?: string
}
