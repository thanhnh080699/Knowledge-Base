import axios from "axios"
import type { Category, SiteSettings } from "@/types/category"
import type { ContactPayload } from "@/types/contact"
import type { Menu } from "@/types/menu"
import type { PaginatedResponse, Post } from "@/types/post"
import type { Project } from "@/types/project"
import type { Tag } from "@/types/tag"
import type { Tool } from "@/types/tool"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  headers: { "Content-Type": "application/json" },
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
    previousPageUrl: null,
  },
  data: [],
})

export async function getPosts(
  params: {
    page?: number
    limit?: number
    category?: string
    tag?: string
    search?: string
  } = {},
) {
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
        q: params.search,
      },
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
      params: { roots: "true" },
    })
    return data.data
  } catch {
    return []
  }
}

export async function getCategory(slugOrId: string) {
  try {
    const { data } = await api.get<{ data: Category }>(
      `/categories/${slugOrId}`,
    )
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
    social_gitlab: "",
    social_youtube: "",
    social_instagram: "",
  }

  try {
    const { data } = await api.get<{ data: Record<string, unknown> }>(
      "/settings/public",
    )
    return { ...fallback, ...data.data } as SiteSettings
  } catch {
    return fallback
  }
}

export async function getMenu(identifier: string) {
  try {
    const { data } = await api.get<{ data: Menu }>(`/menus/${identifier}`)
    return data.data
  } catch {
    return null
  }
}

export async function getMenuByLocation(location: string) {
  try {
    const { data } = await api.get<{ data: Menu }>(
      `/menus/location/${location}`,
    )
    return data.data
  } catch {
    return null
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

export async function getProjects(
  params: { page?: number; limit?: number; featured?: boolean } = {},
) {
  try {
    const { data } = await api.get<PaginatedResponse<Project>>("/projects", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        featured: params.featured,
      },
    })
    return data
  } catch {
    return emptyPaginated<Project>(params.page ?? 1, params.limit ?? 10)
  }
}

export async function getProject(slug: string) {
  try {
    const { data } = await api.get<{ data: Project }>(`/projects/${slug}`)
    return data.data
  } catch {
    return null
  }
}

const STATIC_TOOLS: Tool[] = [
  {
    id: 101,
    slug: "crypto-bcrypt",
    name: "Bcrypt Hash Generator (Bcrypt 12)",
    description: "Generate and verify Bcrypt password hashes with cost factor 12",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/crypto-bcrypt",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 8,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 102,
    slug: "cron-builder",
    name: "Cron Expression Builder",
    description: "Build and understand cron expressions with human-readable descriptions",
    category: "Cron & Date Convert",
    icon: null,
    urlPath: "/tools/cron-builder",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 103,
    slug: "timestamp-converter",
    name: "Unix Timestamp Converter",
    description: "Convert between Unix timestamps and datetime",
    category: "Cron & Date Convert",
    icon: null,
    urlPath: "/tools/timestamp-converter",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 104,
    slug: "date-formatter",
    name: "Date Formatter",
    description: "Format date and time to various standard formats",
    category: "Cron & Date Convert",
    icon: null,
    urlPath: "/tools/date-formatter",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 3,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 105,
    slug: "crypto-token-generator",
    name: "Token Generator",
    description: "Generate random tokens with uppercase, lowercase, numbers, and symbols",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/crypto-token-generator",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 4,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 106,
    slug: "crypto-password-generator",
    name: "Password Generator",
    description: "Generate secure passwords with strength score",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/crypto-password-generator",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 5,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 107,
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate random UUID v4 identifiers",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/uuid-generator",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 6,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 108,
    slug: "crypto-hash-text",
    name: "Hash Text",
    description: "Generate SHA hashes with hex or base64 encoding",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/crypto-hash-text",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 7,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 109,
    slug: "sql-formatter",
    name: "SQL Prettify & Format",
    description: "Format and beautify your SQL queries",
    category: "Developer",
    icon: null,
    urlPath: "/tools/sql-formatter",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 8,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 110,
    slug: "xml-formatter",
    name: "XML Formatter",
    description: "Format and minify XML data",
    category: "Developer",
    icon: null,
    urlPath: "/tools/xml-formatter",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 9,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 111,
    slug: "chmod-calculator",
    name: "Chmod Calculator",
    description: "Calculate Linux file permissions in octal and symbolic formats",
    category: "Developer",
    icon: null,
    urlPath: "/tools/chmod-calculator",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 112,
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON data",
    category: "Developer",
    icon: null,
    urlPath: "/tools/json-formatter",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 11,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 113,
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings",
    category: "Encoder",
    icon: null,
    urlPath: "/tools/base64-encoder-decoder",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 12,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 114,
    slug: "url-encoder-decoder",
    name: "URL Encoder/Decoder",
    description: "Encode and decode URL strings",
    category: "Encoder",
    icon: null,
    urlPath: "/tools/url-encoder-decoder",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 13,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 115,
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text between camelCase, snake_case, kebab-case, etc.",
    category: "Converter",
    icon: null,
    urlPath: "/tools/case-converter",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 14,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 116,
    slug: "color-converter",
    name: "Color Converter",
    description: "Convert between HEX, RGB, and HSL color formats",
    category: "Converter",
    icon: null,
    urlPath: "/tools/color-converter",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 15,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 117,
    slug: "slug-generator",
    name: "Slug Generator",
    description: "Convert text to URL-friendly slugs",
    category: "Text",
    icon: null,
    urlPath: "/tools/slug-generator",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 16,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 118,
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs",
    category: "Text",
    icon: null,
    urlPath: "/tools/lorem-ipsum-generator",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 17,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 119,
    slug: "crypto-encrypt-decrypt",
    name: "Encrypt / Decrypt Text",
    description: "Encrypt and decrypt text with AES-GCM and password",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/crypto-encrypt-decrypt",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 18,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 120,
    slug: "crypto-hmac",
    name: "HMAC Generator",
    description: "Generate HMAC message authentication codes with secret key",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/crypto-hmac",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 19,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 121,
    slug: "crypto-rsa-key-generator",
    name: "RSA Key Pair Generator",
    description: "Generate RSA public and private key pairs in PEM format",
    category: "Crypto",
    icon: null,
    urlPath: "/tools/crypto-rsa-key-generator",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 20,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 122,
    slug: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens (Header, Payload, Signature)",
    category: "Developer",
    icon: null,
    urlPath: "/tools/jwt-decoder",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 21,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 123,
    slug: "html-entities",
    name: "HTML Entities Encoder/Decoder",
    description: "Encode and decode special HTML characters and entities",
    category: "Encoder",
    icon: null,
    urlPath: "/tools/html-entities",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 22,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
]

export async function getTools(
  params: {
    page?: number
    limit?: number
    category?: string
    featured?: boolean
  } = {},
) {
  try {
    const { data } = await api.get<PaginatedResponse<Tool>>("/tools", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 100,
        category: params.category,
        featured: params.featured,
      },
    })

    const apiTools = data.data || []
    const existingSlugs = new Set(apiTools.map((t) => t.slug))
    const missingStatic = STATIC_TOOLS.filter((t) => !existingSlugs.has(t.slug))
    const merged = [...apiTools, ...missingStatic]

    return {
      ...data,
      data: merged,
    }
  } catch {
    return {
      ...emptyPaginated<Tool>(params.page ?? 1, params.limit ?? 100),
      data: STATIC_TOOLS,
    }
  }
}

export async function getTool(slug: string) {
  try {
    const { data } = await api.get<{ data: Tool }>(`/tools/${slug}`)
    if (data.data) return data.data
  } catch {
    // Ignore error
  }
  return STATIC_TOOLS.find((t) => t.slug === slug) || null
}

export async function submitContact(payload: ContactPayload) {
  const { data } = await api.post("/contact", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || undefined,
    message: payload.message,
  })
  return data
}
