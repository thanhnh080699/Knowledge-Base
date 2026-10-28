import { decodeHTML, escapeAttribute } from "entities"
import type { TocItem } from "@/components/shared/table-of-contents"
import { absoluteCdnUrl } from "./cdn-loader"

export function slugifyHeading(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export function hasHtmlContent(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content)
}

export function buildTocFromContent(content: string): TocItem[] {
  const items: TocItem[] = []
  const markdownHeadingRegex = /^#{2,3}\s+(.+)$/gm

  if (hasHtmlContent(content)) return prepareHtmlHeadings(content).items

  for (const match of content.matchAll(markdownHeadingRegex)) {
    const raw = match[0]
    const text = match[1].trim()
    items.push({ id: slugifyHeading(text), text, level: raw.startsWith("###") ? 3 : 2 })
  }

  return items
}

// Share heading text and IDs between the rendered article and its navigation.
function prepareHtmlHeadings(content: string) {
  const items: TocItem[] = []
  const usedIds = new Set<string>()
  const idPattern = /\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i
  for (const match of content.matchAll(/\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    usedIds.add(decodeHTML(match[1] ?? match[2] ?? match[3]))
  }
  const html = content
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
      const text = decodeHTML(stripHtml(inner)).trim()
      if (!text) return match
      const existingId = attrs.match(idPattern)
      let id = existingId ? decodeHTML(existingId[1] ?? existingId[2] ?? existingId[3]) : ""
      if (!existingId) {
        const base = slugifyHeading(text) || "section"
        id = base
        let suffix = 2
        while (usedIds.has(id)) id = `${base}-${suffix++}`
        usedIds.add(id)
      }
      items.push({ id, text, level: Number(level) })
      return existingId ? match : `<h${level}${attrs} id="${escapeAttribute(id)}">${inner}</h${level}>`
    })
  return { html, items }
}

export function normalizeHtmlContent(content: string) {
  return prepareHtmlHeadings(content).html
    .replace(/Trên điện thoại: cuộn ngang sơ đồ hoặc chạm để mở ảnh gốc\./g, "Chạm vào sơ đồ để mở ảnh gốc và phóng to.")
    .replace(/<img[^>]+src="([^">]+)"[^>]*>/gi, (match, src) => {
      if (src.startsWith("http")) return match
      return match.replace(src, absoluteCdnUrl(src))
    })
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "")
}

export function stripFirstImage(content: string, coverImage?: string | null): string {
  if (!coverImage) return content
  const image = content.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>|!\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/i)
  if (!image || image.index === undefined || image.index >= 100) return content
  const identity = (src: string) => {
    const normalized = absoluteCdnUrl(decodeHTML(src))
    return new URL(normalized, "https://thanhnh.id.vn").href
  }
  if (identity(image[1] ?? image[2]) === identity(coverImage)) {
    return content.slice(0, image.index) + content.slice(image.index + image[0].length)
  }
  return content
}

export function estimateReadingTime(content?: string | null, excerpt?: string | null): number {
  if (!content && !excerpt) return 3
  const text = stripHtml(content || excerpt || "")
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 180)
  return Math.max(1, minutes)
}

export function extractFirstImage(content?: string | null): string | null {
  if (!content) return null
  const htmlMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (htmlMatch && htmlMatch[1]) return htmlMatch[1]
  const mdMatch = content.match(/!\[.*?\]\((.*?)\)/)
  if (mdMatch && mdMatch[1]) return mdMatch[1].split(" ")[0]
  return null
}

export function getPostThumbnail(post: { coverImage?: string | null; content?: string | null }): string | null {
  if (post.coverImage && post.coverImage.trim()) {
    return absoluteCdnUrl(post.coverImage)
  }
  const extracted = extractFirstImage(post.content)
  if (extracted && extracted.trim()) {
    return absoluteCdnUrl(extracted)
  }
  return null
}
