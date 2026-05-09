import {
  getCategories,
  getPosts,
  getProjects,
  getSettings,
  getTools,
} from "@/lib/api"
import type { PaginatedResponse, Post } from "@/types/post"
import type { Project } from "@/types/project"
import type { Tool } from "@/types/tool"

export const revalidate = 86400

const DEFAULT_SITE_URL = "https://thanhnh.id.vn"
const PAGE_SIZE = 100

type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: string
  priority: number
}

function normalizeSiteUrl(value?: string | null) {
  return (
    value ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL
  ).replace(/\/+$/, "")
}

function absoluteUrl(siteUrl: string, path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

function sitemapDate(value?: string | null) {
  return value ? new Date(value) : new Date()
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

async function collectPaginated<T>(
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>,
) {
  const items: T[] = []
  let page = 1
  let lastPage = 1

  do {
    const response = await fetchPage(page)
    items.push(...response.data)
    lastPage = response.meta.lastPage
    page += 1
  } while (page <= lastPage)

  return items
}

async function buildSitemapEntries() {
  const [settings, posts, categories, projects, tools] = await Promise.all([
    getSettings(),
    collectPaginated<Post>((page) => getPosts({ page, limit: PAGE_SIZE })),
    getCategories(),
    collectPaginated<Project>((page) =>
      getProjects({ page, limit: PAGE_SIZE }),
    ),
    collectPaginated<Tool>((page) => getTools({ page, limit: PAGE_SIZE })),
  ])

  const siteUrl = normalizeSiteUrl(settings.site_url)
  const now = new Date()

  const staticRoutes: SitemapEntry[] = [
    {
      url: absoluteUrl(siteUrl, "/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl(siteUrl, "/docs"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl(siteUrl, "/projects"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(siteUrl, "/portfolio"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl(siteUrl, "/tools"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl(siteUrl, "/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  const categoryRoutes: SitemapEntry[] = categories.map((category) => ({
    url: absoluteUrl(siteUrl, `/docs/categories/${category.slug}`),
    lastModified: sitemapDate(category.updatedAt),
    changeFrequency: "weekly",
    priority: category.parentId ? 0.55 : 0.65,
  }))

  const postRoutes: SitemapEntry[] = posts.map((post) => ({
    url: absoluteUrl(
      siteUrl,
      `/docs/${post.category?.slug ?? "general"}/${post.slug}`,
    ),
    lastModified: sitemapDate(post.updatedAt ?? post.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const projectRoutes: SitemapEntry[] = projects.map((project) => ({
    url: absoluteUrl(siteUrl, `/projects/${project.slug}`),
    lastModified: sitemapDate(project.updatedAt),
    changeFrequency: "monthly",
    priority: project.featured ? 0.75 : 0.65,
  }))

  const toolRoutes: SitemapEntry[] = tools.map((tool) => ({
    url: absoluteUrl(siteUrl, `/tools/${tool.slug}`),
    lastModified: sitemapDate(tool.updatedAt),
    changeFrequency: "monthly",
    priority: tool.featured ? 0.75 : 0.65,
  }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...postRoutes,
    ...projectRoutes,
    ...toolRoutes,
  ]
}

function buildSitemapXml(entries: SitemapEntry[]) {
  const urls = entries
    .map((entry) => {
      return `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export async function GET() {
  const entries = await buildSitemapEntries()

  return new Response(buildSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  })
}
