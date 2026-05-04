import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/shared/sidebar"
import { PostContent } from "@/components/shared/post-content"
import { DocReader } from "@/components/shared/doc-reader"
import { CdnImage } from "@/components/shared/cdn-image"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getRootCategories, getPost } from "@/lib/api"
import { buildTocFromContent, stripFirstImage } from "@/lib/content"

export const revalidate = 60

type Params = { category: string; slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const post = (await getPost(slug)) ?? fallbackPosts.find((item) => item.slug === slug)

  if (!post) {
    return {
      title: "Tài liệu không tồn tại",
      description: "Không tìm thấy tài liệu."
    }
  }

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? `Tài liệu ${post.title}`,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? `Tài liệu ${post.title}`
    }
  }
}

export default async function DocDetailPage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params
  const [apiPost, apiCategories] = await Promise.all([getPost(slug), getRootCategories()])
  const post = apiPost ?? fallbackPosts.find((item) => item.slug === slug)
  const categories = apiCategories.length ? apiCategories : fallbackCategories

  if (!post) notFound()

  const toc = buildTocFromContent(post.content)

  return (
    <main className="mx-auto grid max-w-[1600px] gap-8 px-4 py-8 md:px-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_300px]">
      <Sidebar categories={categories} activeCategory={post.category?.slug ?? category} />
      
      <DocReader toc={toc}>
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/docs" className="hover:text-blue-600">Tài liệu</Link>
            <span>/</span>
            <Link href={`/docs/categories/${post.category?.slug ?? category}`} className="hover:text-blue-600">
              {post.category?.name ?? category}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate max-w-[200px]">{post.title}</span>
          </nav>

          <Badge tone="blue">{post.category?.name ?? "Tài liệu"}</Badge>
          
          <header className="mt-4 space-y-4">
            <h1 className="text-3xl font-extrabold leading-tight text-slate-950 md:text-5xl">
              {post.title}
            </h1>

            {post.coverImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <CdnImage
                  src={absoluteCdnUrl(post.coverImage)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {post.excerpt && (
              <p className="text-lg leading-relaxed text-slate-600 border-l-4 border-blue-100 pl-4 py-1">
                {post.excerpt}
              </p>
            )}
          </header>

          <PostContent content={post.coverImage ? stripFirstImage(post.content) : post.content} />
        </article>
      </DocReader>
    </main>
  )
}
