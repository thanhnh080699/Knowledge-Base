import type { MetadataRoute } from "next"
import { getSettings } from "@/lib/api"

const DEFAULT_SITE_URL = "https://thanhnh.id.vn"

function normalizeSiteUrl(value?: string | null) {
  return (
    value ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    DEFAULT_SITE_URL
  ).replace(/\/+$/, "")
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings()
  const siteUrl = normalizeSiteUrl(settings.site_url)

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
