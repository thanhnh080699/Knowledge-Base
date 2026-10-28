import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Sidebar } from "@/components/shared/sidebar"
import { SearchBox } from "@/components/shared/search-box"
import { Pagination } from "@/components/shared/pagination"
import { HomeReveal } from "@/components/shared/home-motion"
import { fallbackCategories } from "@/lib/fallback-data"
import { getRootCategories, getPosts, getCategory } from "@/lib/api"
import { getCategoryPosts } from "@/lib/api"
import { listingSort, orderPosts } from "@/lib/listing"

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
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string; sort?: string; reading?: string }>
}) {
  const params = await searchParams
  const page = /^\d+$/.test(params.page ?? "1") ? Math.max(1, Number(params.page ?? 1)) : 1
  const sort = listingSort(params.sort, params.category)
  const [postsResponse, categoriesResponse, currentCategory] = await Promise.all([
    getPosts({ page, limit: 12, category: params.category, tag: params.tag, search: params.q, sort }),
    getRootCategories(),
    params.category ? getCategory(params.category) : null
  ])
  if (params.category) {
    let all = await getCategoryPosts(params.category)
    if (params.tag) all = all.filter(p => p.tags?.some(t => t.slug === params.tag))
    if (params.q) {
      const needle = params.q.toLocaleLowerCase("vi")
      all = all.filter(p => [p.title, p.excerpt, p.content].join(" ").toLocaleLowerCase("vi").includes(needle))
    }
    const lastPage = Math.max(1, Math.ceil(all.length / 12))
    const currentPage = Math.min(page, lastPage)
    postsResponse.data = orderPosts(all, sort).slice((currentPage - 1) * 12, currentPage * 12)
    postsResponse.meta = { ...postsResponse.meta, total: all.length, currentPage, lastPage }
  }
  const posts = postsResponse.data
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
                query={{ category: params.category, tag: params.tag, q: params.q, sort, reading: params.reading }}
              />
            </div>
          </section>
        </HomeReveal>
      </section>
    </main>
  )
}
