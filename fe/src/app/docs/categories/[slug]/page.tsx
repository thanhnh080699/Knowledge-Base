import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, BookOpen, FolderOpen } from "lucide-react"
import { getCategory, getCategoryPosts } from "@/lib/api"
import { sortLessons } from "@/lib/reading"
import { CategoryPostList } from "@/components/shared/category-post-list"
import { HomeReveal } from "@/components/shared/home-motion"
import { Button } from "@/components/ui/button"

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
  const category = await getCategory(slug)

  if (!category) notFound()

  const children = category.children ?? []
  const categoryPosts = await getCategoryPosts(slug)
  const allPosts = (slug === "lpi-web-development-essentials" || slug === "lpi-open-source-essentials" || slug === "lpi-security-essentials" || slug === "lpi-linux-essentials" || slug === "ccna" || slug === "nginx-3" || slug === "nginx" || slug === "mysql" || slug === "docker") ? sortLessons(categoryPosts) : categoryPosts

  return (
    <main className="kb-wide-container py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--color-ink)]">Trang chủ</Link>
        <span>/</span>
        <Link href="/docs" className="hover:text-[var(--color-ink)]">Tài liệu</Link>
        <span>/</span>
        {category.parent && (
          <>
            <Link href={`/docs/categories/${category.parent.slug}`} className="hover:text-[var(--color-ink)]">{category.parent.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="font-medium text-[var(--color-ink)]">{category.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main Content Area */}
        <HomeReveal className="space-y-10">
          {/* Header */}
          <div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-8">
            <div className="flex items-center gap-5">
              <span className="kb-icon size-16">
                <FolderOpen size={32} aria-hidden />
              </span>
              <div>
                <h1 className="kb-display-xl">{category.name}</h1>
                {category.description && (
                  <p className="mt-2 max-w-3xl text-base text-[var(--color-body)]">{category.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Main Category Posts */}
            {allPosts.filter(p => p.category?.id === category.id).length > 0 && (
              <section>
                <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-normal text-[var(--color-ink)]">
                  <BookOpen className="text-[var(--color-ink)]" size={24} />
                  Tài liệu tổng quan
                </h2>
                <CategoryPostList posts={allPosts.filter(p => p.category?.id === category.id)} />
              </section>
            )}

            {/* Sub-categories (3 levels) */}
            {children.length > 0 && (
              <section className="space-y-12">
                <h2 className="kb-display-md">Danh mục nội dung</h2>
                <div className="grid gap-8">
                  {children.map((child) => {
                    const grandchildren = child.children ?? []
                    const childPosts = allPosts.filter(p => p.category?.id === child.id || p.category?.parentId === child.id)

                    return (
                      <div key={child.slug} className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6 transition-all hover:bg-white hover:shadow-[var(--shadow-soft)]">
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <Link href={`/docs/categories/${child.slug}`} className="group flex items-center gap-2">
                              <span className="kb-icon size-8 transition-colors">
                                <BookOpen size={18} />
                              </span>
                              <h3 className="text-xl font-medium text-[var(--color-ink)] transition-colors">{child.name}</h3>
                            </Link>
                            {child.description && (
                              <p className="mt-1 text-sm text-[var(--color-muted)]">{child.description}</p>
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
                                  className="inline-flex items-center rounded-full border border-[var(--color-hairline)] bg-white px-3 py-1 text-xs font-medium text-[var(--color-body)] transition-colors hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-ink)]"
                                >
                                  {gc.name}
                                </Link>
                              ))}
                            </div>
                          )}

                          {/* Posts in this sub-category */}
                          <CategoryPostList posts={childPosts} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Empty state */}
            {children.length === 0 && allPosts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[var(--color-hairline-strong)] bg-[var(--color-surface-soft)] px-6 py-20 text-center">
                <FolderOpen size={48} className="mx-auto text-[var(--color-muted)]" />
                <p className="mt-4 text-xl font-medium text-[var(--color-ink)]">Chưa có nội dung</p>
                <p className="mt-2 text-base text-[var(--color-muted)]">Danh mục này đang được cập nhật. Hãy quay lại sau nhé!</p>
                <div className="mt-8">
                  <Button href="/docs" variant="outline">Quay lại trung tâm tài liệu</Button>
                </div>
              </div>
            )}
          </div>
        </HomeReveal>

        {/* Right Sidebar - Info Sidebar */}
        <HomeReveal className="hidden lg:block space-y-6" delay={0.1}>
          <div className="rounded-2xl border border-[var(--color-hairline)] bg-white p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)]">Thông tin danh mục</h3>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase text-[var(--color-muted)]">Số lượng bài viết</p>
                <p className="text-xl font-medium text-[var(--color-ink)]">{allPosts.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-[var(--color-muted)]">Danh mục con</p>
                <p className="text-xl font-medium text-[var(--color-ink)]">{children.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-6">
            <h3 className="font-medium text-[var(--color-ink)]">Bạn không tìm thấy?</h3>
            <p className="mt-2 text-sm text-[var(--color-body)]">Hãy thử tìm kiếm với từ khóa chính xác hoặc liên hệ hỗ trợ.</p>
            <Button href="/docs" className="mt-4 w-full">Tìm kiếm ngay</Button>
          </div>
        </HomeReveal>
      </div>
    </main>
  )
}
