import type { Post, PaginatedResponse } from "@/types/post"

export function escapeXml(value: string) {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

export function siteOrigin(value?: string | null) {
  return new URL(value || process.env.NEXT_PUBLIC_SITE_URL || "https://thanhnh.id.vn").origin
}

/** Fail closed: a broken API must not produce a successful but incomplete feed. */
export async function discoveryRequest<T>(path: string): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api"
  const response = await fetch(`${base.replace(/\/+$/, "")}/${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: { Accept: "application/json" },
  })
  if (!response.ok) throw new Error(`Discovery API returned ${response.status}`)
  return response.json() as Promise<T>
}

export async function allPublished<T extends { id: number; status?: string }>(resource: string) {
  const result: T[] = []
  let lastPage = 1
  let total: number | undefined
  for (let page = 1; page <= lastPage; page++) {
    const response = await discoveryRequest<PaginatedResponse<T>>(
      `${resource}?status=PUBLISHED&limit=100&page=${page}`,
    )
    if (!Array.isArray(response.data) || !Number.isInteger(response.meta?.lastPage)
      || response.meta.lastPage < 1 || response.meta.lastPage > 10000
      || Number(response.meta.currentPage) !== page) {
      throw new Error("Invalid discovery pagination")
    }
    if (total === undefined) total = response.meta.total
    if (!Number.isInteger(total) || total < 0 || response.meta.total !== total) {
      throw new Error("Discovery dataset changed during pagination")
    }
    result.push(...response.data)
    lastPage = response.meta.lastPage
  }
  if (result.length !== total || new Set(result.map(item => item.id)).size !== result.length) {
    throw new Error("Incomplete discovery dataset")
  }
  return result.filter(item => item.status === "PUBLISHED")
}

export function publishedPosts(posts: Post[], now = new Date()) {
  return posts.filter(post => post.status === "PUBLISHED" &&
    (!post.publishedAt || new Date(post.publishedAt).getTime() <= now.getTime()))
}

export function postUrl(siteUrl: string, post: Post) {
  return `${siteUrl}/docs/${encodeURIComponent(post.category?.slug || "general")}/${encodeURIComponent(post.slug)}`
}

function validDate(value?: string | null) {
  const date = value ? new Date(value) : null
  return date && Number.isFinite(date.getTime()) ? date : null
}

export function buildRss(posts: Post[], settings: { site_name?: string; site_description?: string; site_url?: string }, now = new Date()) {
  const origin = siteOrigin(settings.site_url)
  const published = publishedPosts(posts, now).sort((a, b) =>
    (validDate(b.publishedAt || b.createdAt)?.getTime() || 0) -
    (validDate(a.publishedAt || a.createdAt)?.getTime() || 0) || b.id - a.id)
  const modified = published.flatMap(post => [validDate(post.updatedAt), validDate(post.publishedAt)])
    .filter((date): date is Date => date !== null)
  const lastBuild = modified.length ? new Date(Math.max(...modified.map(date => date.getTime()))) : now
  const items = published.map(post => {
    const url = escapeXml(postUrl(origin, post))
    const date = validDate(post.publishedAt || post.createdAt)
    const updated = validDate(post.updatedAt) || date
    const cdn = (process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.thanhnh.id.vn").replace(/\/+$/, "")
    const mediaBase = cdn.endsWith("/medias") ? cdn : `${cdn}/medias`
    const cover = post.coverImage ? (/^https?:\/\//.test(post.coverImage) ? post.coverImage
      : `${mediaBase}/${post.coverImage.replace(/^\/?medias\//, "").replace(/^\//, "")}`) : null
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="false">urn:${escapeXml(new URL(origin).hostname)}:post:${post.id}</guid>
      <description>${escapeXml(post.excerpt || post.metaDescription || post.title)}</description>
      <content:encoded>${escapeXml(post.content)}</content:encoded>${date ? `\n      <pubDate>${date.toUTCString()}</pubDate>` : ""}${updated ? `\n      <atom:updated>${updated.toISOString()}</atom:updated>` : ""}${cover ? `\n      <media:thumbnail url="${escapeXml(cover)}" />` : ""}${post.category ? `\n      <category>${escapeXml(post.category.name)}</category>` : ""}
    </item>`
  }).join("\n")
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(settings.site_name || "thanhnh.id.vn")}</title>
    <link>${escapeXml(origin)}/docs</link>
    <description>${escapeXml(settings.site_description || "Tài liệu kỹ thuật")}</description>
    <language>vi</language>
    <lastBuildDate>${lastBuild.toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(origin)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`
}
