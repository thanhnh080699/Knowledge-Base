import { allPublished, buildRss, discoveryRequest } from "@/lib/public-feeds"
import type { Post } from "@/types/post"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [posts, settings] = await Promise.all([
      allPublished<Post>("posts"),
      discoveryRequest<{ data: { site_name?: string; site_description?: string; site_url?: string } }>("settings/public"),
    ])
    return new Response(buildRss(posts, settings.data), {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    console.error("[RSS] Unable to load published content")
    return new Response("RSS temporarily unavailable", {
      status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" },
    })
  }
}
