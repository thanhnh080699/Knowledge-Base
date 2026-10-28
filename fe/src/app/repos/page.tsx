import type { Metadata } from "next"
import Link from "next/link"
import { GitFork, Search } from "lucide-react"
import { getCategoryPosts } from "@/lib/api"
import { PostCard } from "@/components/shared/post-card"

export const revalidate = 60
export const metadata: Metadata = {
  title: "Top Repos",
  description: "Các bài giới thiệu repository, công cụ và dự án hữu ích trong chuyên mục Top Repos.",
  alternates: { canonical: "https://thanhnh.id.vn/repos" },
  openGraph: { title: "Top Repos", url: "https://thanhnh.id.vn/repos", description: "Đọc các bài giới thiệu và hướng dẫn trong chuyên mục Top Repos." },
}

function searchText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLocaleLowerCase("vi")
}

export default async function ReposPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams
  const query = (typeof params.q === "string" ? params.q : "").trim().slice(0, 200)

  const posts = (await getCategoryPosts("top-repos"))
    .filter(post => post.category?.slug === "top-repos")
    .sort((a, b) => (Date.parse(b.publishedAt || b.createdAt || "") || 0) - (Date.parse(a.publishedAt || a.createdAt || "") || 0) || b.id - a.id)
  const words = searchText(query).split(/\s+/).filter(Boolean)
  const results = posts.filter(post => {
    const text = searchText([post.title, post.excerpt || "", ...(post.tags?.map(tag => tag.name) || [])].join(" "))
    return words.every(word => text.includes(word))
  })
  return <main id="main-content" className="bg-[var(--color-surface)]">
    <section className="border-b border-[var(--color-hairline)] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]"><GitFork size={18} aria-hidden />Khám phá công cụ và dự án</p>
        <h1 className="kb-display-xl mt-3">Top Repos</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-body)]">Các bài giới thiệu, công dụng và hướng dẫn sử dụng repository, công cụ hữu ích cho công việc.</p>
      </div>
    </section>
    <section aria-label="Bài viết Top Repos" className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <form action="/repos" method="get" role="search" className="mb-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="repos-search" className="sr-only">Tìm kiếm bài viết Top Repos</label>
        <div className="relative min-w-0 flex-1"><Search size={19} aria-hidden className="pointer-events-none absolute left-4 top-3.5 text-[var(--color-muted)]" /><input id="repos-search" key={query} name="q" type="search" defaultValue={query} maxLength={200} placeholder="Tìm theo tên repo, công dụng hoặc từ khóa…" className="min-h-12 w-full rounded-xl border border-[var(--color-hairline-strong)] bg-white py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></div>
        <button type="submit" className="min-h-12 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold !text-white">Tìm kiếm</button>
        {query && <Link href="/repos" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-hairline-strong)] px-4 py-3 text-sm">Xóa tìm kiếm</Link>}
      </form>
      <p className="mb-5 text-sm text-[var(--color-muted)]" role="status">{query ? `${results.length} / ${posts.length} bài viết cho “${query}”` : `${posts.length} bài viết`}</p>
      {results.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{results.map((post, index) => <PostCard key={post.id} post={post} eager={index < 3} />)}</div> : <p className="rounded-xl border border-[var(--color-hairline)] bg-white p-6 text-sm">{posts.length ? "Không tìm thấy bài viết phù hợp. Hãy thử từ khóa khác hoặc xóa tìm kiếm." : "Chưa tải được bài viết. Vui lòng thử lại sau."}</p>}
    </section>
  </main>
}
