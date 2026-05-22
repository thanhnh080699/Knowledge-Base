import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Search, Server, ShieldCheck } from "lucide-react"
import { Sidebar } from "@/components/shared/sidebar"
import { SearchBox } from "@/components/shared/search-box"
import { Pagination } from "@/components/shared/pagination"
import { HomeReveal } from "@/components/shared/home-motion"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getRootCategories, getPosts, getCategory } from "@/lib/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tài liệu kỹ thuật",
  description: "Danh sách tài liệu SysAdmin, DevOps, Development và HelpDesk.",
  openGraph: {
    title: "Tài liệu kỹ thuật | thanhnh.id.vn",
    description: "Tra cứu nhanh tài liệu kỹ thuật theo danh mục."
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
    getPosts({ page, limit: 9, category: params.category, tag: params.tag, search: params.q }),
    getRootCategories(),
    params.category ? getCategory(params.category) : null
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const categories = categoriesResponse.length ? categoriesResponse : fallbackCategories

  return (
    <main className="bg-[var(--color-surface)]">
      <section className="page-hero">
        <div className="home-glow home-glow-mint left-[8%] top-8 h-64 w-64"></div>
        <div className="home-glow home-glow-sky bottom-0 right-[12%] h-72 w-72"></div>
        <div className="relative z-10 mx-auto grid max-w-[1600px] gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1fr_0.72fr] lg:py-16">
          <HomeReveal>
            <div className="kb-eyebrow w-fit">
              <BookOpen size={16} aria-hidden />
              {currentCategory ? `Danh mục: ${currentCategory.name}` : "Trung tâm tài liệu"}
            </div>
            <h1 className="kb-display-xl mt-4">
              {currentCategory?.name ?? "Tài liệu kỹ thuật"}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--color-body)]">
              {currentCategory?.description ?? "Tổng hợp ghi chú vận hành hệ thống, Docker, Linux, web server, lập trình và xử lý sự cố theo dạng knowledge base dễ tra cứu. Các bài viết được đúc kết từ quá trình triển khai thực tế, tối ưu hóa bảo mật và hiệu suất hạ tầng."}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Server size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Hệ thống</h4>
                  <p className="text-xs text-[var(--color-muted)]">Linux, Web Server, Security</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">DevOps</h4>
                  <p className="text-xs text-[var(--color-muted)]">Docker, CI/CD, Monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Search size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[var(--color-ink)]">Tra cứu</h4>
                  <p className="text-xs text-[var(--color-muted)]">Tìm kiếm bài viết nhanh</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
              <span className="font-medium text-[var(--color-body)]">Từ khóa phổ biến:</span>
              {["Docker", "Nginx", "Linux", "SSL", "CI/CD", "Security", "Shell Script"].map((tag) => (
                <Link
                  key={tag}
                  href={`/docs?q=${tag}`}
                  className="rounded-full bg-[var(--color-surface-strong)] px-2.5 py-1 font-medium hover:text-[var(--color-ink)] transition-colors cursor-pointer"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </HomeReveal>
          <HomeReveal delay={0.1} className="hidden md:block">
            <div className="page-visual-panel page-visual-panel-clean flex items-center justify-center">
              <Image
                src="/images/knowledge.svg"
                alt="Knowledge Base Illustration"
                width={280}
                height={368}
                priority
                unoptimized
                className="h-auto w-auto object-contain max-h-[220px] lg:max-h-[360px] max-w-[160px] lg:max-w-[280px]"
              />
            </div>
          </HomeReveal>
        </div>
      </section>

      <section className="kb-wide-container grid gap-6 py-8 md:grid-cols-[280px_1fr]">
        <HomeReveal>
          <Sidebar categories={categories} activeCategory={params.category} />
        </HomeReveal>
        <HomeReveal delay={0.08}>
          <section>
            <SearchBox posts={posts} initialQuery={params.q ?? ""} subcategories={currentCategory?.children} />
            <div className="mt-6">
              <Pagination currentPage={postsResponse.meta.currentPage} lastPage={postsResponse.meta.lastPage} basePath="/docs" query={{ category: params.category, tag: params.tag, q: params.q }} />
            </div>
          </section>
        </HomeReveal>
      </section>
    </main>
  )
}
