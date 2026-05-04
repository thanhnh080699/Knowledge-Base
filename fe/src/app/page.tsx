import { ArrowRight, BookOpen, Code2, Database, Headphones, Layers, Mail, Search, Server, Shield, Terminal, Wrench } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionTitle } from "@/components/ui/typography"
import { MotionReveal } from "@/components/shared/motion-reveal"
import { HeroAnimation } from "@/components/shared/hero-animation"
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
    },
    {
      title: "Development",
      slug: "development",
      description: "Phát triển ứng dụng web, tối ưu hóa mã nguồn, kiến trúc hệ thống và các framework hiện đại như React, Next.js, AdonisJS.",
      icon: Code2
    }
  ]

  const topicHighlights = ["Linux", "Docker", "Nginx", "MySQL", "Monitoring", "Apache/PHP", "Caching", "Security"]

  return (
    <main>
      {/* Hero Section — premium background */}
      <section className="relative overflow-hidden border-b border-slate-200 py-20 md:py-28">
        {/* Background Image with Theme-aware Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg-new.png" 
            alt="IT DevOps Background" 
            className="h-full w-full object-cover opacity-60 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/80"></div>
        </div>

        <HeroAnimation 
          leftContent={
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-5xl lg:leading-[1.2]">
                Kiến trúc tương lai<br /> Vận hành chuyên nghiệp
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
                Nền tảng chia sẻ kiến thức chuyên sâu về DevOps, Cloud Computing và quản trị hệ thống. 
                Được đúc kết từ những dự án thực tế, giúp bạn làm chủ hạ tầng.
              </p>
            </div>
          }
          rightContent={
            <div className="mt-8 lg:mt-0">
              <form action="/docs" className="flex overflow-hidden rounded-lg border-2 border-blue-600/30 bg-white shadow-md dark:border-blue-500/30 dark:bg-slate-950">
                <label className="sr-only" htmlFor="home-search">Tìm kiếm tài liệu</label>
                <div className="flex flex-1 items-center gap-3 px-4">
                  <Search size={20} className="text-slate-400" aria-hidden />
                  <input 
                    id="home-search" 
                    name="q" 
                    className="min-h-14 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white" 
                    placeholder="Nhập từ khóa, ví dụ: Docker, Linux, Nginx..." 
                  />
                </div>
                <button className="min-h-14 bg-blue-600 px-8 text-sm font-bold text-white transition-colors hover:bg-blue-700" type="submit">
                  Tìm kiếm
                </button>
              </form>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/docs" variant="primary" className="h-11 px-6">
                  <BookOpen size={18} aria-hidden /> Xem tài liệu
                </Button>
                <Button href="/contact" variant="outline" className="h-11 px-6 border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300">
                  <Mail size={18} aria-hidden /> Liên hệ
                </Button>
              </div>
            </div>
          }
        />
      </section>

      {/* Intro blocks — static with hover effects */}
      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {introBlocks.map((block) => {
            const Icon = block.icon

            return (
              <div key={block.title} className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-600 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500">
                <span className="flex size-12 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:border-blue-900/50 dark:bg-blue-950/30">
                  <Icon size={22} aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{block.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{block.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Something about this website — premium content */}
      <section className="relative border-y border-slate-200 bg-slate-50/50 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 mx-auto grid max-w-[1600px] gap-12 px-4 md:grid-cols-[1.2fr_0.8fr] md:px-6">
          <div>
            <Badge tone="blue" className="mb-4">Về nền tảng này</Badge>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">Hệ sinh thái kiến thức mở<br />Thực chiến và Tin cậy</h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-slate-600">
              <p>
                Đây không chỉ là một trang blog kỹ thuật, mà là hệ sinh thái kiến thức được tinh lọc từ hàng nghìn giờ vận hành thực tế. Chúng tôi tập trung vào việc chuẩn hóa quy trình, tối ưu hóa hạ tầng và giải quyết những bài toán hóc búa nhất trong thế giới IT hiện đại.
              </p>
              <p>
                Từ việc thiết lập cụm Kubernetes phức tạp đến việc debug những lỗi hệ thống tinh vi, mọi tài liệu đều được trình bày một cách khoa học, dễ hiểu và có thể áp dụng ngay vào công việc hàng ngày của bạn.
              </p>
              <p>
                Sứ mệnh của chúng tôi là xây dựng một cộng đồng kỹ sư vững mạnh, nơi kiến thức được tự do lưu chuyển và mọi người cùng nhau nâng tầm tiêu chuẩn kỹ thuật tại Việt Nam.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                  <Wrench size={26} aria-hidden />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Chủ đề trọng tâm</p>
                  <p className="text-sm text-slate-500">Các lĩnh vực được cập nhật liên tục hàng tuần.</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {topicHighlights.map((topic) => (
                  <span key={topic} className="rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    {topic}
                  </span>
                ))}
              </div>
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
