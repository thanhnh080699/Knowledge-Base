import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BookOpen, FolderOpen } from "lucide-react"
import { getCategory, getPosts, getRootCategories } from "@/lib/api"
import { PostCard } from "@/components/shared/post-card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/shared/sidebar"
import { fallbackCategories } from "@/lib/fallback-data"

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  return {
    title: category?.name ?? "Danh mục",
    description: category?.description ?? `Danh sách tài liệu trong danh mục ${category?.name ?? slug}.`
  }
}

export const revalidate = 60

export default async function CategoryOverviewPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const [category, apiCategories] = await Promise.all([getCategory(slug), getRootCategories()])
  const rootCategories = apiCategories.length ? apiCategories : fallbackCategories

  if (!category) notFound()

  const children = category.children ?? []
  // Fetch more posts to show "all" articles (limit 100)
  const postsResponse = await getPosts({ category: slug, limit: 100 })
  const allPosts = postsResponse.data

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-10 md:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600">Trang chủ</Link>
        <span>/</span>
        <Link href="/docs" className="hover:text-blue-600">Tài liệu</Link>
        <span>/</span>
        {category.parent && (
          <>
            <Link href={`/docs/categories/${category.parent.slug}`} className="hover:text-blue-600">{category.parent.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 font-medium">{category.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main Content Area */}
        <div className="space-y-10">
          {/* Header */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-5">
              <span className="flex size-16 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <FolderOpen size={32} aria-hidden />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-950 md:text-4xl">{category.name}</h1>
                {category.description && (
                  <p className="mt-2 max-w-3xl text-base text-slate-600">{category.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Main Category Posts */}
            {allPosts.filter(p => p.category?.id === category.id).length > 0 && (
              <section>
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900">
                  <BookOpen className="text-blue-600" size={24} />
                  Tài liệu tổng quan
                </h2>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {allPosts.filter(p => p.category?.id === category.id).map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Sub-categories (3 levels) */}
            {children.length > 0 && (
              <section className="space-y-12">
                <h2 className="text-2xl font-bold text-slate-900">Danh mục nội dung</h2>
                <div className="grid gap-8">
                  {children.map((child) => {
                    const grandchildren = child.children ?? []
                    const childPosts = allPosts.filter(p => p.category?.id === child.id || p.category?.parentId === child.id)

                    return (
                      <div key={child.slug} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-md">
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <Link href={`/docs/categories/${child.slug}`} className="group flex items-center gap-2">
                              <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen size={18} />
                              </span>
                              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{child.name}</h3>
                            </Link>
                            {child.description && (
                              <p className="mt-1 text-sm text-slate-500">{child.description}</p>
                            )}
                          </div>
                          <Button href={`/docs/categories/${child.slug}`} variant="outline" size="sm">
                            Xem tất cả <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </div>

                        <div className="grid gap-6">
                          {/* Grandchildren (Level 3) */}
                          {grandchildren.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {grandchildren.map(gc => (
                                <Link 
                                  key={gc.slug} 
                                  href={`/docs/categories/${gc.slug}`}
                                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                                >
                                  {gc.name}
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Posts in this sub-category */}
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {childPosts.slice(0, 6).map(post => (
                              <Link 
                                key={post.id} 
                                href={`/docs/${post.category?.slug ?? "general"}/${post.slug}`}
                                className="group flex flex-col rounded-lg border border-slate-100 bg-white p-4 shadow-sm hover:border-blue-200 transition-all h-full"
                              >
                                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{post.title}</h4>
                                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{post.excerpt}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Empty state */}
            {children.length === 0 && allPosts.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">
                <FolderOpen size={48} className="mx-auto text-slate-400" />
                <p className="mt-4 text-xl font-bold text-slate-700">Chưa có nội dung</p>
                <p className="mt-2 text-slate-500 text-base">Danh mục này đang được cập nhật. Hãy quay lại sau nhé!</p>
                <div className="mt-8">
                  <Button href="/docs" variant="outline">Quay lại trung tâm tài liệu</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Info Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Thông tin danh mục</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Số lượng bài viết</p>
                <p className="text-xl font-bold text-slate-900">{allPosts.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Danh mục con</p>
                <p className="text-xl font-bold text-slate-900">{children.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-blue-600 p-6 text-white shadow-lg shadow-blue-100">
            <h3 className="font-bold">Bạn không tìm thấy?</h3>
            <p className="mt-2 text-sm text-blue-100">Hãy thử tìm kiếm với từ khóa chính xác hoặc liên hệ hỗ trợ.</p>
            <Button href="/docs" className="mt-4 w-full bg-white text-blue-600 hover:bg-blue-50">Tìm kiếm ngay</Button>
          </div>
        </aside>
      </div>
    </main>
  )
}


