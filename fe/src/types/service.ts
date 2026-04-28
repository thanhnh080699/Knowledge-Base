export interface Service {
  id: number
  name: string
  slug: string
  description: string | null
  features: string[]
  priceRange: string | null
  category: string | null
  featured: boolean
  createdAt?: string
  updatedAt?: string
}
