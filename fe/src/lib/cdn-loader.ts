

function cdnMediaBase() {
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, "") ?? ""
  if (!cdnUrl) return ""
  return cdnUrl.endsWith("/medias") ? cdnUrl : `${cdnUrl}/medias`
}

function mediaPathFromSrc(src: string) {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const url = new URL(src)
    const mediaIndex = url.pathname.indexOf("/medias/")
    if (mediaIndex === -1) return { path: src, search: url.search }
    return {
      path: url.pathname.slice(mediaIndex + "/medias/".length).replace(/^\//, ""),
      search: url.search,
    }
  }

  const [pathPart, query = ""] = src.split("?")
  return {
    path: pathPart.replace(/^\/?medias\//, "").replace(/^\//, ""),
    search: query ? `?${query}` : "",
  }
}

export function absoluteCdnUrl(src: string | null | undefined): string {
  if (!src) return "/placeholder-project.svg"
  if (src.startsWith("data:") || src.startsWith("blob:")) return src

  const { path, search } = mediaPathFromSrc(src)
  if (path.startsWith("http://") || path.startsWith("https://")) return src

  const mediaBase = cdnMediaBase()
  if (!mediaBase) return src.startsWith("/") ? src : `/${src}`

  return `${mediaBase}/${path}${search}`
}

export default function cdnLoader({ src, width, quality }: ImageLoaderProps) {
  const mediaBase = cdnMediaBase()
  const { path } = mediaPathFromSrc(src)

  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(src)
    url.searchParams.set("w", String(width))
    url.searchParams.set("fmt", "webp")
    if (quality) url.searchParams.set("q", String(quality))
    return url.toString()
  }

  if (!mediaBase) {
    const query = new URLSearchParams({ w: String(width), fmt: "webp" })
    if (quality) query.set("q", String(quality))
    return `/${path}?${query.toString()}`
  }

  const url = new URL(`${mediaBase}/${path}`)
  const query = new URLSearchParams({ w: String(width), fmt: "webp" })
  if (quality) query.set("q", String(quality))
  url.search = query.toString()
  return url.toString()
}
