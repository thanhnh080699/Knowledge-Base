export interface Category {
  id: number
  name: string
  slug: string
  parentId: number | null
  description: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  image?: string | null
  icon?: string | null
  sortOrder?: number
  parent?: Category | null
  children?: Category[]
  createdAt?: string
  updatedAt?: string
}

export interface SiteSettings {
  site_name: string
  site_description: string
  site_url: string
  google_analytics_enabled: boolean
  google_analytics_measurement_id: string
  admin_logo: string | null
  admin_favicon: string | null
  contact_name: string
  contact_email: string
  contact_phone: string
  contact_address: string
  working_hours: string
  social_facebook: string
  social_twitter: string
  social_linkedin: string
  social_github: string
  social_gitlab: string
  social_youtube: string
  social_instagram: string
}
