import type { Metadata } from "next"
import { Sidebar } from "@/components/shared/sidebar"
import { SearchBox } from "@/components/shared/search-box"
import { Pagination } from "@/components/shared/pagination"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getCategories, getPosts } from "@/lib/api"

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
  const [postsResponse, categoriesResponse] = await Promise.all([
    getPosts({ page, limit: 9, category: params.category, tag: params.tag, search: params.q }),
    getCategories()
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const categories = categoriesResponse.length ? categoriesResponse : fallbackCategories

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[280px_1fr] md:px-6">
      <Sidebar categories={categories} />
      <section>
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Trung tâm tài liệu</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Tài liệu kỹ thuật</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Tổng hợp ghi chú vận hành hệ thống, Docker, Linux, web server, lập trình và xử lý sự cố theo dạng knowledge base dễ tra cứu.
          </p>
        </div>
        <SearchBox posts={posts} initialQuery={params.q ?? ""} />
        <div className="mt-6">
          <Pagination currentPage={postsResponse.meta.currentPage} lastPage={postsResponse.meta.lastPage} basePath="/docs" query={{ category: params.category, tag: params.tag, q: params.q }} />
        </div>
      </section>
    </main>
  )
}
