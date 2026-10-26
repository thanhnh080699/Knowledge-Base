import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/shared/sidebar"
import { PostContent } from "@/components/shared/post-content"
import { DocReader } from "@/components/shared/doc-reader"
import { CdnImage } from "@/components/shared/cdn-image"
import { HomeReveal } from "@/components/shared/home-motion"
import { PostViewTracker } from "@/components/shared/post-view-tracker"
import { ReadingProgress } from "@/components/shared/reading-progress"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getRootCategories, getPost } from "@/lib/api"
import { buildTocFromContent, stripFirstImage } from "@/lib/content"

export const revalidate = 60

type Params = { category: string; slug: string }

const DEFAULT_SITE_URL = "https://thanhnh.id.vn"

function normalizeSiteUrl(value?: string | null) {
  return (value || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "")
}

function postPath(category: string, slug: string) {
  return `/docs/${category}/${slug}`
}

function absoluteSiteUrl(path: string) {
  const siteUrl = normalizeSiteUrl()
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

function uniqueKeywords(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => Boolean(value?.trim()))
        .map((value) => value.trim())
    )
  )
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, slug } = await params
  const post = (await getPost(slug)) ?? fallbackPosts.find((item) => item.slug === slug)

  if (!post) {
    return {
      title: "Tài liệu không tồn tại",
      description: "Không tìm thấy tài liệu."
    }
  }

  const title = post.metaTitle ?? post.title
  const description = post.metaDescription ?? post.excerpt ?? `Tài liệu ${post.title}`
  const categorySlug = post.category?.slug ?? category
  const canonicalUrl = post.canonicalUrl ?? absoluteSiteUrl(postPath(categorySlug, post.slug))
  const coverImageUrl = post.coverImage ? absoluteCdnUrl(post.coverImage) : undefined
  const keywords = uniqueKeywords([
    post.focusKeyword,
    post.category?.name,
    ...(post.tags?.map((tag) => tag.name) ?? []),
  ])

  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: canonicalUrl, types: { "application/rss+xml": "/rss.xml" } },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: coverImageUrl
        ? [
            {
              url: coverImageUrl,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: coverImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: coverImageUrl ? [coverImageUrl] : undefined,
    },
  }
}

export default async function DocDetailPage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params
  const [apiPost, apiCategories] = await Promise.all([getPost(slug), getRootCategories()])
  const post = apiPost ?? fallbackPosts.find((item) => item.slug === slug)
  const categories = apiCategories.length ? apiCategories : fallbackCategories

  if (!post) notFound()

  const toc = buildTocFromContent(post.content)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt || post.metaDescription || post.title,
    image: post.coverImage ? [absoluteCdnUrl(post.coverImage)] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    articleSection: post.category?.name || "Documentation",
    author: {
      "@type": "Person",
      name: "Thanh Nguyen",
      url: absoluteSiteUrl("/portfolio")
    }
  }

  return (
    <>
      <ReadingProgress />
      {apiPost?.status === "PUBLISHED" && <PostViewTracker postId={apiPost.id} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="kb-wide-container grid gap-8 py-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_300px]">
        <HomeReveal>
          <Sidebar categories={categories} activeCategory={post.category?.slug ?? category} />
        </HomeReveal>
        
        <DocReader toc={toc}>
          <HomeReveal className="min-w-0 rounded-2xl border border-[var(--color-hairline)] bg-white p-6 md:p-10" delay={0.08}>
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
              <Link href="/docs" className="hover:text-[var(--color-ink)]">Tài liệu</Link>
              <span>/</span>
              <Link href={`/docs/categories/${post.category?.slug ?? category}`} className="hover:text-[var(--color-ink)]">
                {post.category?.name ?? category}
              </Link>
              <span>/</span>
              <span className="max-w-[200px] truncate font-medium text-[var(--color-ink)]">{post.title}</span>
            </nav>

            <Badge tone="blue">{post.category?.name ?? "Tài liệu"}</Badge>
            
            <header className="mt-4 space-y-4">
              <h1 className="kb-display-xl">
                {post.title}
              </h1>

              {post.coverImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
                  <CdnImage
                    src={absoluteCdnUrl(post.coverImage)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {post.excerpt && (
                <p className="border-l border-[var(--color-hairline-strong)] py-1 pl-4 text-lg leading-relaxed text-[var(--color-body)]">
                  {post.excerpt}
                </p>
              )}
            </header>

            <PostContent content={post.coverImage ? stripFirstImage(post.content) : post.content} />
          </HomeReveal>
        </DocReader>
      </main>
    </>
  )
}
