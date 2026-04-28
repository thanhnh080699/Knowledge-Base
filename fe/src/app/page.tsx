import { ArrowRight, BookOpen, Code2, Headphones, Mail, Search, Server, Shield, Wrench } from "lucide-react"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionTitle } from "@/components/ui/typography"
import { MotionReveal } from "@/components/shared/motion-reveal"
import { PostCard } from "@/components/shared/post-card"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getCategories, getPosts } from "@/lib/api"

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
  const [postsResponse, categoriesResponse] = await Promise.all([
    getPosts({ limit: 3 }),
    getCategories()
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const categories = categoriesResponse.length ? categoriesResponse : fallbackCategories
  const iconMap = [Server, Shield, Code2, Headphones]
  const introBlocks = [
    {
      title: "Helpdesk",
      description: "Các tình huống hỗ trợ thường gặp, cách khoanh vùng lỗi, quy trình xử lý sự cố và kinh nghiệm làm việc với người dùng cuối.",
      icon: Headphones
    },
    {
      title: "Systems Administration",
      description: "Quản trị máy chủ, cấu hình mạng, phân quyền, bảo mật cơ bản, backup và các checklist vận hành cần dùng hằng ngày.",
      icon: Server
    },
    {
      title: "DevOps",
      description: "Docker, CI/CD, reverse proxy, monitor, tự động hóa triển khai và các bước tối ưu để hệ thống chạy gọn, dễ bảo trì.",
      icon: Shield
    }
  ]
  const topicHighlights = ["Linux", "Docker", "Nginx", "MySQL", "Monitoring", "Apache/PHP"]

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
            <button className="min-h-14 border-l border-blue-600 bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-blue-600" type="submit">
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
        <div className="grid gap-5 md:grid-cols-3">
          {introBlocks.map((block) => {
            const Icon = block.icon

            return (
              <article key={block.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex size-12 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600">
                  <Icon size={22} aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-bold text-slate-950">{block.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{block.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-6">
          <div>
            <Badge tone="emerald">Something about this website</Badge>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Nơi tổng hợp ghi chú kỹ thuật để tra cứu và triển khai thực tế</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Nội dung tập trung vào helpdesk, quản trị hệ thống, DevOps và development. Đây là bộ ghi chú được Thanh tổng hợp lại từ quá trình làm việc thực tế và tham khảo tài liệu chuyên ngành để dùng như một knowledge base gọn, dễ quay lại tra cứu.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Mục tiêu là giúp cả người mới lẫn người đã làm nghề có một nơi để xem nhanh checklist, cách cấu hình, kinh nghiệm xử lý lỗi và hướng triển khai phù hợp cho từng nhóm bài toán.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-md bg-white text-blue-600 shadow-sm">
                <Wrench size={20} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Chủ đề nổi bật</p>
                <p className="text-sm text-slate-500">Các nhóm nội dung đang được cập nhật thường xuyên.</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {topicHighlights.map((topic) => (
                <span key={topic} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-6 text-center">
          <SectionTitle>Chủ đề tài liệu</SectionTitle>
          <p className="mt-2 text-sm text-slate-600">Các nhóm nội dung chính để đi từ tra cứu nhanh đến áp dụng thực tế.</p>
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
    </main>
  )
}
