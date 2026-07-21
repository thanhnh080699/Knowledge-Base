import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Server, ShieldCheck, Terminal } from "lucide-react"
import { Sidebar } from "@/components/shared/sidebar"
import { SearchBox } from "@/components/shared/search-box"
import { Pagination } from "@/components/shared/pagination"
import { HomeReveal } from "@/components/shared/home-motion"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getRootCategories, getPosts, getCategory } from "@/lib/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tài liệu kỹ thuật",
  description: "Danh sách tài liệu SysAdmin, DevOps, Development và HelpDesk được sắp xếp khoa học, dễ tra cứu.",
  openGraph: {
    title: "Tài liệu kỹ thuật | thanhnh.id.vn",
    description: "Tra cứu nhanh tài liệu kỹ thuật theo danh mục và từ khóa."
  }
}

export default async function DocsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const [postsResponse, categoriesResponse, currentCategory] = await Promise.all([
    getPosts({ page, limit: 12, category: params.category, tag: params.tag, search: params.q }),
    getRootCategories(),
    params.category ? getCategory(params.category) : null
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const categories = categoriesResponse.length ? categoriesResponse : fallbackCategories

  return (
    <main className="bg-[var(--color-surface)]">
      {/* Refined Minimalist Hero */}
      <section className="page-hero border-b border-[var(--color-hairline)] bg-white/60 backdrop-blur-sm">
        <div className="home-glow home-glow-mint left-[8%] top-8 h-64 w-64"></div>
        <div className="home-glow home-glow-sky bottom-0 right-[12%] h-72 w-72"></div>
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-8 md:px-6 md:py-12">
          <HomeReveal className="max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="kb-eyebrow w-fit">
                <BookOpen size={15} aria-hidden />
                {currentCategory ? `Danh mục: ${currentCategory.name}` : "Documentation Hub"}
              </div>
              {params.tag && (
                <span className="rounded-full bg-stone-100 px-3 py-0.5 text-xs font-medium text-[var(--color-body)]">
                  Tag: #{params.tag}
                </span>
              )}
            </div>

            <h1 className="kb-display-xl mt-3">
              {currentCategory?.name ?? "Tài liệu kỹ thuật"}
            </h1>
            
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-body)] md:text-base">
              {currentCategory?.description ?? "Kho tri thức vận hành hệ thống, Docker, Linux, Web server và Security. Sắp xếp khoa học giúp tra cứu nhanh chóng."}
            </p>

            {/* Quick Category Badges Bar */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href="/docs"
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  !params.category
                    ? "bg-[var(--color-primary)] !text-white shadow-xs"
                    : "border border-[var(--color-hairline)] bg-white text-[var(--color-body-strong)] hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-soft)]"
                }`}
              >
                Tất cả bài viết
              </Link>
              {categories.slice(0, 5).map((cat) => {
                const isActive = params.category === cat.slug
                return (
                  <Link
                    key={cat.id}
                    href={`/docs?category=${cat.slug}`}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[var(--color-primary)] !text-white shadow-xs"
                        : "border border-[var(--color-hairline)] bg-white text-[var(--color-body-strong)] hover:border-[var(--color-hairline-strong)] hover:bg-[var(--color-surface-soft)]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </div>

            {/* Popular Topics Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
              <span className="font-medium text-[var(--color-body)]">Từ khóa phổ biến:</span>
              {["Docker", "Nginx", "Linux", "SSL", "CI/CD", "Security"].map((tag) => (
                <Link
                  key={tag}
                  href={`/docs?q=${tag}`}
                  className="rounded-md bg-stone-100 px-2 py-0.5 text-xs text-[var(--color-muted)] hover:bg-stone-200 hover:text-[var(--color-ink)] transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </HomeReveal>
        </div>
      </section>

      {/* Main Documentation Area */}
      <section className="kb-wide-container grid gap-6 py-8 md:grid-cols-[280px_1fr]">
        <HomeReveal>
          <Sidebar categories={categories} activeCategory={params.category} />
        </HomeReveal>
        
        <HomeReveal delay={0.08}>
          <section>
            <SearchBox posts={posts} initialQuery={params.q ?? ""} subcategories={currentCategory?.children} />
            <div className="mt-8">
              <Pagination
                currentPage={postsResponse.meta.currentPage}
                lastPage={postsResponse.meta.lastPage}
                basePath="/docs"
                query={{ category: params.category, tag: params.tag, q: params.q }}
              />
            </div>
          </section>
        </HomeReveal>
      </section>
    </main>
  )
}
