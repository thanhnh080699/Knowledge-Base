import type { TocItem } from "@/components/shared/table-of-contents"

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
  const htmlHeadingRegex = /<h([2-3])[^>]*>([\s\S]*?)<\/h\1>/gi
  const markdownHeadingRegex = /^#{2,3}\s+(.+)$/gm

  if (hasHtmlContent(content)) {
    for (const match of content.matchAll(htmlHeadingRegex)) {
      const level = Number(match[1])
      const text = stripHtml(match[2]).trim()
      if (text) items.push({ id: slugifyHeading(text), text, level })
    }
    return items
  }

  for (const match of content.matchAll(markdownHeadingRegex)) {
    const raw = match[0]
    const text = match[1].trim()
    items.push({ id: slugifyHeading(text), text, level: raw.startsWith("###") ? 3 : 2 })
  }

  return items
}

export function normalizeHtmlContent(content: string) {
  return content
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1>/gi, "</h2>")
    .replace(/<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
      if (/\sid=/i.test(attrs)) return match
      const text = stripHtml(inner).trim()
      const id = slugifyHeading(text)
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
    })
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "")
}
