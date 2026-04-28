import type { Metadata } from "next"
import { Sidebar } from "@/components/shared/sidebar"
import { SearchBox } from "@/components/shared/search-box"
import { Pagination } from "@/components/shared/pagination"
import { fallbackCategories, fallbackPosts, fallbackTags } from "@/lib/fallback-data"
import { getCategories, getPosts, getTags } from "@/lib/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Tài liệu kỹ thuật",
  description: "Danh sách tài liệu SysAdmin, DevOps, Development và HelpDesk.",
  openGraph: {
    title: "Tài liệu kỹ thuật | thanhnh.id.vn",
    description: "Tra cứu nhanh tài liệu kỹ thuật theo danh mục và tag."
  }
}

export default async function DocsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const [postsResponse, categoriesResponse, tagsResponse] = await Promise.all([
    getPosts({ page, limit: 9, category: params.category, tag: params.tag, search: params.q }),
    getCategories(),
    getTags()
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const categories = categoriesResponse.length ? categoriesResponse : fallbackCategories
  const tags = tagsResponse.length ? tagsResponse : fallbackTags

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[280px_1fr] md:px-6">
      <Sidebar categories={categories} tags={tags} />
      <section>
        <div className="mb-6 rounded-lg border border-slate-200 bg-blue-50 p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Trung tâm tài liệu</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">Tài liệu kỹ thuật</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tìm kiếm nhanh các ghi chú về hệ thống, DevOps, lập trình và xử lý sự cố.
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
