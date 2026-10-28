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
    sort?: string
  } = {},
  options: { signal?: AbortSignal } = {},
) {
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  try {
    const { data } = await api.get<PaginatedResponse<Post>>("/posts", {
      signal: options.signal,
      params: {
        page,
        limit,
        status: "PUBLISHED",
        category: params.category,
        tag: params.tag,
        q: params.search,
        sort: params.sort,
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

// Category endpoints include descendants; exhaust pagination before ranking locally.
export async function getCategoryPosts(category: string): Promise<Post[]> {
  const options = { signal: AbortSignal.timeout(8000) }
  const first = await getPosts({ category, limit: 100 }, options)
  const posts = [...first.data]
  for (let page = 2; page <= first.meta.lastPage; page++) {
    const result = await getPosts({ category, limit: 100, page }, options)
    if (!result.data.length) break
    posts.push(...result.data)
  }
  return [...new Map(posts.filter(p => p.status === "PUBLISHED").map(p => [p.id, p])).values()]
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

export const STATIC_TOOLS: Tool[] = [
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
  {
    id: 124,
    slug: "docker-run-to-docker-compose",
    name: "Docker Run to Docker Compose",
    description: "Convert docker run commands into clean docker-compose.yml files",
    category: "Developer",
    icon: null,
    urlPath: "/tools/docker-run-to-docker-compose",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 23,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 125,
    slug: "ipv4-subnet-calculator",
    name: "IPv4 Subnet Calculator",
    description: "Calculate network, broadcast, wildcard mask, and usable IP host ranges",
    category: "Network",
    icon: null,
    urlPath: "/tools/ipv4-subnet-calculator",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 24,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 126,
    slug: "ipv4-address-converter",
    name: "IPv4 Address Converter",
    description: "Convert IPv4 between Dotted Decimal, Integer, Hex, Binary, and Octal",
    category: "Network",
    icon: null,
    urlPath: "/tools/ipv4-address-converter",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 25,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 127,
    slug: "ipv4-range-expander",
    name: "IPv4 Range Expander",
    description: "Expand CIDR blocks or IP ranges into a list of individual IP addresses",
    category: "Network",
    icon: null,
    urlPath: "/tools/ipv4-range-expander",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 26,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 128,
    slug: "mac-address-lookup",
    name: "MAC Address Lookup",
    description: "Identify OUI manufacturer, vendor, and transmission type from MAC address",
    category: "Network",
    icon: null,
    urlPath: "/tools/mac-address-lookup",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 27,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 129,
    slug: "mac-address-generator",
    name: "MAC Address Generator",
    description: "Generate random MAC addresses with custom delimiters and vendor prefixes",
    category: "Network",
    icon: null,
    urlPath: "/tools/mac-address-generator",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 28,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 130,
    slug: "random-port-generator",
    name: "Random Port Generator",
    description: "Generate random network ports within standard IANA ranges without conflicts",
    category: "Network",
    icon: null,
    urlPath: "/tools/random-port-generator",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 29,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 131,
    slug: "git-memo",
    name: "Git Cheatsheet & Memo",
    description: "Quick reference guide for essential and advanced Git commands",
    category: "Developer",
    icon: null,
    urlPath: "/tools/git-memo",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 30,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 132,
    slug: "regex-tester",
    name: "Regex Tester",
    description: "Test and debug regular expressions with real-time capture groups",
    category: "Developer",
    icon: null,
    urlPath: "/tools/regex-tester",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 31,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 133,
    slug: "regex-memo",
    name: "Regex Syntax Cheatsheet",
    description: "Comprehensive cheatsheet for regular expression syntax and assertions",
    category: "Developer",
    icon: null,
    urlPath: "/tools/regex-memo",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 32,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 134,
    slug: "url-parser",
    name: "URL Parser & Query Editor",
    description: "Deconstruct URLs into parts and interactively edit query parameters",
    category: "Developer",
    icon: null,
    urlPath: "/tools/url-parser",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 33,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 135,
    slug: "user-agent-parser",
    name: "User Agent Parser",
    description: "Extract browser, OS, rendering engine, and architecture from User-Agent",
    category: "Developer",
    icon: null,
    urlPath: "/tools/user-agent-parser",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 34,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 136,
    slug: "http-status-codes",
    name: "HTTP Status Codes Reference",
    description: "Complete list of standard HTTP response status codes with definitions",
    category: "Developer",
    icon: null,
    urlPath: "/tools/http-status-codes",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 35,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 137,
    slug: "json-diff",
    name: "JSON Diff Viewer",
    description: "Compare two JSON objects side-by-side to highlight added and modified fields",
    category: "Developer",
    icon: null,
    urlPath: "/tools/json-diff",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 36,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 138,
    slug: "text-diff",
    name: "Text Diff Checker",
    description: "Compare two blocks of plain text line-by-line to inspect additions and deletions",
    category: "Text",
    icon: null,
    urlPath: "/tools/text-diff",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 37,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 139,
    slug: "yaml-to-json-converter",
    name: "YAML to JSON Converter",
    description: "Convert YAML configuration data to JSON format with syntax validation",
    category: "Converter",
    icon: null,
    urlPath: "/tools/yaml-to-json-converter",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 38,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 140,
    slug: "json-to-yaml-converter",
    name: "JSON to YAML Converter",
    description: "Convert JSON format data to YAML configuration syntax",
    category: "Converter",
    icon: null,
    urlPath: "/tools/json-to-yaml-converter",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 39,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 141,
    slug: "base64-file-converter",
    name: "Base64 File Converter",
    description: "Convert files to Base64 Data URLs and decode Base64 back into downloadable files",
    category: "Encoder",
    icon: null,
    urlPath: "/tools/base64-file-converter",
    featured: true,
    status: "PUBLISHED",
    sortOrder: 40,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 142,
    slug: "markdown-to-html",
    name: "Markdown to HTML Converter",
    description: "Render live Markdown previews and generate clean HTML markup",
    category: "Converter",
    icon: null,
    urlPath: "/tools/markdown-to-html",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 41,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 143,
    slug: "json-to-csv",
    name: "JSON to CSV Converter",
    description: "Convert arrays of JSON objects into formatted CSV or TSV spreadsheets",
    category: "Converter",
    icon: null,
    urlPath: "/tools/json-to-csv",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 42,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 144,
    slug: "device-information",
    name: "Device & Browser Information",
    description: "Real-time measurement of screen dimensions, DPR, network, and browser info",
    category: "Developer",
    icon: null,
    urlPath: "/tools/device-information",
    featured: false,
    status: "PUBLISHED",
    sortOrder: 43,
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
