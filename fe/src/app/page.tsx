import { ArrowRight, BookOpen, Code2, Database, Headphones, Layers, Mail, Search, Server, Shield, Terminal, Wrench } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionTitle } from "@/components/ui/typography"
import { MotionReveal } from "@/components/shared/motion-reveal"
import { PostCard } from "@/components/shared/post-card"
import { fallbackCategories, fallbackPosts } from "@/lib/fallback-data"
import { getRootCategories, getPosts, getSettings } from "@/lib/api"
import type { Category } from "@/types/category"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Tài liệu kỹ thuật mở về SysAdmin, DevOps, Development và HelpDesk — dành cho cộng đồng.",
  openGraph: {
    title: "Knowledge Base",
    description: "Tài liệu kỹ thuật mở cho cộng đồng kỹ thuật."
  }
}

const categoryIconMap: Record<string, typeof Server> = {
  sysadmin: Server,
  "systems-administrator": Server,
  "systems-administration": Server,
  devops: Shield,
  development: Code2,
  helpdesk: Headphones,
  linux: Terminal,
  docker: Layers,
  nginx: Server,
  apache: Server,
  "apache-php": Server,
  mysql: Database,
  monitoring: Shield,
  "caching-solutions": Database
}

function getCategoryIcon(category: Category) {
  return categoryIconMap[category.slug] ?? BookOpen
}

export default async function HomePage() {
  const [postsResponse, categories, settings] = await Promise.all([
    getPosts({ limit: 3 }),
    getRootCategories(),
    getSettings()
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const displayCategories = categories.length ? categories : fallbackCategories

  const introBlocks = [
    {
      title: "Helpdesk",
      slug: "helpdesk",
      description: "Các tình huống hỗ trợ thường gặp, cách khoanh vùng lỗi, quy trình xử lý sự cố và kinh nghiệm hỗ trợ kỹ thuật thực tế.",
      icon: Headphones
    },
    {
      title: "Systems Administration",
      slug: "sysadmin",
      description: "Quản trị máy chủ, cấu hình mạng, phân quyền, bảo mật cơ bản, backup và các checklist vận hành thường nhật.",
      icon: Server
    },
    {
      title: "DevOps",
      slug: "devops",
      description: "Docker, CI/CD, reverse proxy, monitoring, tự động hóa triển khai và tối ưu quy trình vận hành liên tục.",
      icon: Shield
    }
  ]

  const topicHighlights = ["Linux", "Docker", "Nginx", "MySQL", "Monitoring", "Apache/PHP", "Caching", "Security"]

  return (
    <main>
      {/* Hero Section — no badge */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-slate-50">
        <div className="mx-auto max-w-[1600px] px-4 py-16 text-center md:px-6 md:py-24">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
            Tra cứu tài liệu kỹ thuật<br className="hidden md:block" /> cho cộng đồng
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Nơi tổng hợp ghi chú thực chiến về vận hành hệ thống, DevOps, lập trình và xử lý sự cố — được xây dựng và chia sẻ mở để mọi người cùng tra cứu, học hỏi và đóng góp.
          </p>
          <form action="/docs" className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <label className="sr-only" htmlFor="home-search">Tìm kiếm tài liệu</label>
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search size={20} className="text-slate-400" aria-hidden />
              <input id="home-search" name="q" className="min-h-14 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" placeholder="Nhập từ khóa, ví dụ: Docker, Linux, Nginx..." />
            </div>
            <button className="min-h-14 border-l border-blue-600 bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-blue-600" type="submit">
              Tìm kiếm
            </button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/docs" variant="outline"><BookOpen size={18} aria-hidden /> Xem tài liệu</Button>
            <Button href="/contact" variant="ghost"><Mail size={18} aria-hidden /> Liên hệ</Button>
          </div>
        </div>
      </section>

      {/* Intro blocks */}
      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {introBlocks.map((block) => {
            const Icon = block.icon

            return (
              <Link href={`/docs/categories/${block.slug}`} key={block.title} className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-600 hover:shadow-md">
                <span className="flex size-12 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={22} aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-bold text-slate-950">{block.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{block.description}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Something about this website — extended content */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-6">
          <div>
            <Badge tone="emerald">Về nền tảng này</Badge>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Knowledge base mở — xây dựng từ thực tế, chia sẻ cho cộng đồng</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Đây không chỉ là bộ ghi chú cá nhân, mà là một kho tài liệu kỹ thuật mở dành cho bất kỳ ai đang làm việc trong lĩnh vực vận hành hệ thống, DevOps và phát triển phần mềm. Nội dung được tổng hợp từ kinh nghiệm triển khai thực tế, tham khảo tài liệu chuyên ngành quốc tế và liên tục cập nhật.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Mục tiêu là tạo ra một nơi mà cả người mới bắt đầu lẫn kỹ sư có kinh nghiệm đều có thể quay lại tra cứu nhanh: từ checklist cấu hình server, cách debug lỗi production, quy trình deploy ứng dụng, cho đến hướng dẫn xử lý các tình huống helpdesk phổ biến.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Tất cả nội dung đều được tổ chức theo hệ thống danh mục rõ ràng, có thể tìm kiếm toàn văn, và được thiết kế để đọc nhanh — giống như một cuốn sổ tay kỹ thuật luôn sẵn sàng bên cạnh bạn.
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

      {/* Categories — clickable to category overview */}
      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-6">
        <div className="mb-6 text-center">
          <SectionTitle>Chủ đề tài liệu</SectionTitle>
          <p className="mt-2 text-sm text-slate-600">Chọn một chủ đề để xem danh sách các danh mục con và tài liệu liên quan.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {displayCategories.slice(0, 8).map((category) => {
            const Icon = getCategoryIcon(category)
            const childCount = category.children?.length ?? 0

            return (
              <Link key={category.slug} href={`/docs/categories/${category.slug}`} className="group rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm transition-all hover:border-blue-600 hover:shadow-md">
                <span className="mx-auto flex size-12 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={22} aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-slate-950">{category.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                  {category.description ?? (childCount > 0 ? `${childCount} danh mục con` : "Tài liệu đang được cập nhật.")}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                  Xem chi tiết <ArrowRight size={15} aria-hidden />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Latest posts */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-6">
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
