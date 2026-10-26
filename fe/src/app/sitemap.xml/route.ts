import { STATIC_TOOLS } from "@/lib/api"
import { allPublished, discoveryRequest, escapeXml, postUrl, publishedPosts, siteOrigin } from "@/lib/public-feeds"
import type { Post } from "@/types/post"
import type { Category } from "@/types/category"
import type { Project } from "@/types/project"
import type { Tool } from "@/types/tool"

export const dynamic = "force-dynamic"

type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: string
  priority: number
}

function absoluteUrl(siteUrl: string, path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

function sitemapDate(value?: string | null) {
  return value ? new Date(value) : new Date()
}

async function buildSitemapEntries() {
  const [settings, allPosts, categoryData, projects, apiTools] = await Promise.all([
    discoveryRequest<{ data: { site_url?: string } }>("settings/public"),
    allPublished<Post>("posts"),
    discoveryRequest<{ data: Category[] }>("categories"),
    allPublished<Project>("projects"),
    allPublished<Tool>("tools"),
  ])
  const categories = categoryData.data
  const posts = publishedPosts(allPosts)
  const tools = [...apiTools, ...STATIC_TOOLS.filter(tool => !apiTools.some(item => item.slug === tool.slug))]
  const siteUrl = siteOrigin(settings.data.site_url)
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
    url: postUrl(siteUrl, post),
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
  try {
    const entries = await buildSitemapEntries()
    return new Response(buildSitemapXml(entries), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    console.error("[Sitemap] Unable to load public content")
    return new Response("Sitemap temporarily unavailable", {
      status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    })
  }
}
