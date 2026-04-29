import axios from "axios"
import type { Category, SiteSettings } from "@/types/category"
import type { ContactPayload } from "@/types/contact"
import type { PaginatedResponse, Post } from "@/types/post"
import type { Project } from "@/types/project"
import type { Service } from "@/types/service"
import type { Tag } from "@/types/tag"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" }
})

export default api

const emptyPaginated = <T>(page = 1, limit = 10): PaginatedResponse<T> => ({
  meta: {
    total: 0,
    perPage: limit,
    currentPage: page,
    lastPage: 1,
    firstPage: 1,
    firstPageUrl: "",
    lastPageUrl: "",
    nextPageUrl: null,
    previousPageUrl: null
  },
  data: []
})

export async function getPosts(params: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
} = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  try {
    const { data } = await api.get<PaginatedResponse<Post>>("/posts", {
      params: {
        page,
        limit,
        status: "PUBLISHED",
        category: params.category,
        tag: params.tag,
        q: params.search
      }
    })
    return data
  } catch {
    return emptyPaginated<Post>(page, limit)
  }
}

export async function getPost(slug: string) {
  try {
    const { data } = await api.get<{ data: Post }>(`/posts/${slug}`)
    return data.data
  } catch {
    return null
  }
}

export async function getCategories() {
  try {
    const { data } = await api.get<{ data: Category[] }>("/categories")
    return data.data
  } catch {
    return []
  }
}

export async function getRootCategories() {
  try {
    const { data } = await api.get<{ data: Category[] }>("/categories", {
      params: { roots: "true" }
    })
    return data.data
  } catch {
    return []
  }
}

export async function getCategory(slugOrId: string) {
  try {
    const { data } = await api.get<{ data: Category }>(`/categories/${slugOrId}`)
    return data.data
  } catch {
    return null
  }
}

export async function getSettings(): Promise<SiteSettings> {
  const fallback: SiteSettings = {
    site_name: "Knowledge Base",
    site_description: "Tài liệu kỹ thuật mở cho cộng đồng",
    site_url: "",
    google_analytics_enabled: false,
    google_analytics_measurement_id: "",
    admin_logo: null,
    admin_favicon: null,
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    working_hours: "",
    social_facebook: "",
    social_twitter: "",
    social_linkedin: "",
    social_github: "",
    social_youtube: "",
    social_instagram: ""
  }

  try {
    const { data } = await api.get<{ data: Record<string, unknown> }>("/settings/public")
    return { ...fallback, ...data.data } as SiteSettings
  } catch {
    return fallback
  }
}


export async function getTags() {
  try {
    const { data } = await api.get<{ data: Tag[] }>("/tags")
    return data.data
  } catch {
    return []
  }
}

export async function getProjects(params: { page?: number; limit?: number; featured?: boolean } = {}) {
  try {
    const { data } = await api.get<PaginatedResponse<Project>>("/projects", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        featured: params.featured
      }
    })
    return data
  } catch {
    return emptyPaginated<Project>(params.page ?? 1, params.limit ?? 10)
  }
}

export async function getServices(featured?: boolean) {
  try {
    const { data } = await api.get<{ data: Service[] }>("/services", { params: { featured } })
    return data.data
  } catch {
    return []
  }
}

export async function submitContact(payload: ContactPayload) {
  const subjectParts = [payload.service, payload.company].filter(Boolean)
  const subject = subjectParts.length ? subjectParts.join(" - ") : "Website contact request"

  const { data } = await api.post("/contact", {
    name: payload.name,
    email: payload.email,
    subject,
    message: payload.message
  })

  return data
}
