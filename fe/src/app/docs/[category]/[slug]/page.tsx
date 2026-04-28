import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CategoryNav } from "@/components/shared/category-nav"
import { PostContent } from "@/components/shared/post-content"
import { TableOfContents } from "@/components/shared/table-of-contents"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getCategories, getPost } from "@/lib/api"
import { buildTocFromContent } from "@/lib/content"

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
  const [apiPost, apiCategories] = await Promise.all([getPost(slug), getCategories()])
  const post = apiPost ?? fallbackPosts.find((item) => item.slug === slug)
  const categories = apiCategories.length ? apiCategories : fallbackCategories

  if (!post) notFound()

  const toc = buildTocFromContent(post.content)

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_240px]">
      <CategoryNav categories={categories} active={category} />
      <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/docs" className="hover:text-blue-600">Tài liệu</Link>
          <span>/</span>
          <Link href={`/docs?category=${post.category?.slug ?? category}`} className="hover:text-blue-600">{post.category?.name ?? category}</Link>
        </nav>
        <Badge>{post.category?.name ?? "Tài liệu"}</Badge>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-950 md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{post.excerpt ?? "Tài liệu kỹ thuật trên thanhnh.id.vn"}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(post.tags ?? []).map((tag) => <Badge key={tag.slug} tone="slate">{tag.name}</Badge>)}
        </div>
        <PostContent content={post.content} />
      </article>
      <TableOfContents items={toc} />
    </main>
  )
}
