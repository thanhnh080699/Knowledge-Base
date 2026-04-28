import { ArrowRight, BookOpen, Code2, Headphones, Mail, Search, Server, Shield } from "lucide-react"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionTitle } from "@/components/ui/typography"
import { MotionReveal } from "@/components/shared/motion-reveal"
import { PostCard } from "@/components/shared/post-card"
import { ProjectCard } from "@/components/shared/project-card"
import { ServiceCard } from "@/components/shared/service-card"
import { fallbackCategories, fallbackPosts, fallbackProjects, fallbackServices } from "@/lib/fallback-data"
import { getCategories, getPosts, getProjects, getServices } from "@/lib/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Tài liệu SysAdmin, DevOps, Development, portfolio và dịch vụ lập trình web.",
  openGraph: {
    title: "thanhnh.id.vn",
    description: "Tài liệu kỹ thuật, portfolio và dịch vụ lập trình web."
  }
}

export default async function HomePage() {
  const [postsResponse, projectsResponse, servicesResponse, categoriesResponse] = await Promise.all([
    getPosts({ limit: 3 }),
    getProjects({ limit: 3, featured: true }),
    getServices(true),
    getCategories()
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const projects = projectsResponse.data.length ? projectsResponse.data : fallbackProjects
  const services = servicesResponse.length ? servicesResponse : fallbackServices
  const categories = categoriesResponse.length ? categoriesResponse : fallbackCategories
  const iconMap = [Server, Shield, Code2, Headphones]

  return (
    <main>
      <section className="border-b border-slate-200 bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center md:px-6 md:py-24">
          <Badge>SysAdmin / DevOps / Development / HelpDesk</Badge>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
            Bạn cần tìm tài liệu kỹ thuật nào?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Tra cứu nhanh ghi chú vận hành hệ thống, DevOps, lập trình, xử lý sự cố và các dự án thực tế của Thanh.
          </p>
          <form action="/docs" className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <label className="sr-only" htmlFor="home-search">Tìm kiếm tài liệu</label>
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search size={20} className="text-slate-400" aria-hidden />
              <input id="home-search" name="q" className="min-h-14 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" placeholder="Nhập từ khóa, ví dụ: Docker, Linux, Next.js..." />
            </div>
            <button className="min-h-14 border-l border-blue-600 bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-blue-600" type="submit">
              Tìm kiếm
            </button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/docs"><BookOpen size={18} aria-hidden /> Xem tài liệu</Button>
            <Button href="/contact" variant="outline"><Mail size={18} aria-hidden /> Liên hệ</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-6 text-center">
          <SectionTitle>Chủ đề tài liệu</SectionTitle>
          <p className="mt-2 text-sm text-slate-600">Các nhóm nội dung chính theo phong cách knowledge base của Docly.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {categories.slice(0, 4).map((category, index) => {
            const Icon = iconMap[index] ?? BookOpen
            return (
              <a key={category.slug} href={`/docs?category=${category.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors hover:border-blue-600">
                <span className="mx-auto flex size-12 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600">
                  <Icon size={22} aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-slate-950">{category.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{category.description ?? "Tài liệu đang được cập nhật."}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  Xem bài viết <ArrowRight size={15} aria-hidden />
                </span>
              </a>
            )
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <SectionTitle>Tài liệu mới nhất</SectionTitle>
            <Button href="/docs" variant="ghost">Xem tất cả</Button>
          </div>
          <MotionReveal className="grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => <PostCard key={post.id} post={post} />)}
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[0.85fr_1.15fr] md:px-6">
        <div>
          <Badge tone="amber">Portfolio</Badge>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">Dự án đã triển khai</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Tập trung vào website nội dung, CMS, API và hạ tầng triển khai gọn, dễ vận hành.
          </p>
          <Button href="/projects" variant="outline" className="mt-5">Xem dự án</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} priority={index === 0} />)}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <SectionTitle>Dịch vụ lập trình web</SectionTitle>
            <Button href="/services" variant="outline">Xem dịch vụ</Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {services.slice(0, 3).map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
