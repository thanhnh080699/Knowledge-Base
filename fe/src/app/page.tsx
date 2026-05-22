import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  FileCode2,
  Gauge,
  GitBranch,
  Headphones,
  Layers,
  Mail,
  MonitorCheck,
  Network,
  Search,
  Server,
  Shield,
  Terminal,
  Wrench
} from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HomeReveal, MouseFollowCard, TypingText } from "@/components/shared/home-motion"
import { fallbackCategories, fallbackPosts, fallbackProjects } from "@/lib/fallback-data"
import { getProjects, getRootCategories, getPosts } from "@/lib/api"
import type { Category } from "@/types/category"
import type { Post } from "@/types/post"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Knowledge Base kỹ thuật mở về SysAdmin, DevOps, Development và HelpDesk, được viết từ kinh nghiệm vận hành thực tế.",
  openGraph: {
    title: "Knowledge Base",
    description: "Tài liệu kỹ thuật mở cho cộng đồng kỹ thuật."
  }
}

const categoryIconMap: Record<string, typeof Server> = {
  sysadmin: Server,
  "system-administrator": Server,
  "systems-administrator": Server,
  "systems-administration": Server,
  devops: Shield,
  "dev-ops": Shield,
  development: Code2,
  helpdesk: Headphones,
  "help-desk": Headphones,
  linux: Terminal,
  docker: Layers,
  nginx: Server,
  apache: Server,
  "apache-php": Server,
  mysql: Database,
  monitoring: Shield,
  "caching-solutions": Database
}

const menuStories = [
  {
    href: "/docs",
    label: "Tài liệu",
    eyebrow: "System notes",
    title: "Runbook cho các lớp hạ tầng đang vận hành thật.",
    description:
      "Kho tài liệu tập trung vào Linux, NGINX, Apache/PHP-FPM, MySQL, Redis, Docker và Monitoring. Mỗi bài viết ưu tiên bối cảnh production, cấu hình có thể kiểm chứng, checklist cuối bài và các điểm cần theo dõi sau khi triển khai.",
    image: "/images/home-docs-runbook-bg.png",
    icon: BookOpen,
    stats: ["Hardening", "Performance", "Observability"]
  },
  {
    href: "/tools",
    label: "Tools",
    eyebrow: "Operator tools",
    title: "Bộ công cụ nhỏ cho lúc cần kiểm tra nhanh.",
    description:
      "Cron builder, timestamp converter, JSON/XML/SQL formatter, token/password generator và chmod calculator được đặt cạnh knowledge base để hỗ trợ thao tác thường gặp khi debug, viết tài liệu hoặc chuẩn bị cấu hình.",
    image: "/images/home-tools-utilities-bg.png",
    icon: Wrench,
    stats: ["Cron", "Crypto", "Developer utilities"]
  },
  {
    href: "/portfolio",
    label: "About Me",
    eyebrow: "Delivery story",
    title: "Câu chuyện triển khai qua các lớp sản phẩm đã xây.",
    description:
      "Khu vực này kể lại kinh nghiệm frontend, backend, CMS, CDN và vận hành hệ thống qua các mảnh ghép đã triển khai. Người đọc có thể nhìn thấy cách một sản phẩm nội dung được thiết kế, tối ưu và duy trì sau khi lên production.",
    image: "/images/home-portfolio-profile-bg.png",
    icon: MonitorCheck,
    stats: ["Delivery", "Next.js", "AdonisJS"]
  },
  {
    href: "/projects",
    label: "Dự án",
    eyebrow: "Build log",
    title: "Các mảnh ghép tạo nên hệ sinh thái nội dung này.",
    description:
      "Dự án trình bày CMS, API, CDN và các module hỗ trợ xuất bản tài liệu. Khi có case study, phần này cho biết phạm vi, tech stack, quyết định kiến trúc và những gì cần bàn giao để hệ thống chạy ổn định.",
    image: "/images/home-projects-architecture-bg.png",
    icon: GitBranch,
    stats: ["CMS", "Content API", "Media pipeline"]
  },
  {
    href: "/contact",
    label: "Liên hệ",
    eyebrow: "Contact",
    title: "Kênh trao đổi cho góp ý tài liệu và bài toán triển khai.",
    description:
      "Bạn có thể gửi góp ý khi thấy nội dung cần chỉnh, đề xuất chủ đề mới, hoặc trao đổi một vấn đề về website, CMS, API, hạ tầng Linux, reverse proxy, database hay monitoring.",
    image: "/images/home-contact-collab-bg.png",
    icon: Mail,
    stats: ["Hà Nội", "Technical notes", "Collaboration"]
  }
]

const timelineSteps = [
  {
    title: "Ghi nhận sự cố",
    description: "Bắt đầu từ lỗi thật, nhu cầu tối ưu thật hoặc một checklist cần dùng lại trong quá trình quản trị hệ thống.",
    icon: Search
  },
  {
    title: "Kiểm chứng cấu hình",
    description: "Nội dung được viết theo hướng có bối cảnh, tham số cấu hình, điểm cần theo dõi và cách xác nhận sau khi thay đổi.",
    icon: Network
  },
  {
    title: "Đóng gói thành tài liệu",
    description: "Các ghi chú được gom theo System Administrator, Dev Ops, Help Desk, Development và các nhóm con như NGINX, Docker, MySQL, Monitoring.",
    icon: Activity
  },
  {
    title: "Cập nhật theo vận hành",
    description: "Khi stack thay đổi hoặc có bài học mới, tài liệu được bổ sung để giữ giá trị tra cứu cho lần xử lý tiếp theo.",
    icon: Gauge
  }
]

const projectModules = [
  {
    label: "Admin workspace",
    headline: "CMS quản trị nội dung",
    summary: "Không chỉ là form nhập bài. CMS là nơi biên tập nội dung, phân quyền người dùng, quản lý media, cấu hình site và theo dõi các dữ liệu gửi từ độc giả.",
    flow: ["Posts", "Categories", "Media", "Projects"],
    metric: "React Query + Zustand",
    tone: "mint",
    modules: ["Bài viết", "Danh mục", "Tags", "Media", "Dự án", "Menu", "Pages", "Settings", "Contacts", "Users", "Roles", "API Tokens"],
    checks: ["SEO metadata", "Publish status", "Upload pipeline", "ACL workflow"]
  },
  {
    label: "Content contract",
    headline: "API nghiệp vụ",
    summary: "RESTful backend AdonisJS v6 quản lý auth, ACL, content, portfolio, contact và sitemap.",
    flow: ["Auth", "ACL", "Content", "Sitemap"],
    metric: "AdonisJS + MariaDB",
    tone: "lavender",
    modules: ["Auth", "Posts", "Projects", "Tools", "Sitemap"],
    checks: ["VineJS validation", "Lucid ORM", "Role guard"]
  },
  {
    label: "Media delivery",
    headline: "CDN nội bộ",
    summary: "Dịch vụ Go/Gin xử lý upload, resize ảnh, biến thể WebP và phân phối media cho frontend.",
    flow: ["Upload", "Resize", "WebP", "Serve"],
    metric: "Go + Gin",
    tone: "peach",
    modules: ["Upload", "Folders", "Resize", "WebP", "Serve"],
    checks: ["API key", "Origin rules", "Image variants"]
  },
  {
    label: "Public surface",
    headline: "Frontend SEO",
    summary: "Next.js App Router, ISR và Tailwind CSS cho trải nghiệm đọc nhanh, sạch và tối ưu SEO.",
    flow: ["Route", "ISR", "SEO", "Render"],
    metric: "Next.js + React",
    tone: "sky",
    modules: ["Docs", "Tools", "Projects", "About Me", "Contact"],
    checks: ["Metadata", "ISR cache", "Sitemap"]
  }
]

function getProjectModule(projectTitle: string, index: number) {
  const normalizedTitle = projectTitle.toLowerCase()
  if (normalizedTitle.includes("cms")) return projectModules[0]
  if (normalizedTitle.includes("api") || normalizedTitle.includes("adonis")) return projectModules[1]
  if (normalizedTitle.includes("cdn") || normalizedTitle.includes("media")) return projectModules[2]
  return projectModules[index % projectModules.length]
}

function getCategoryIcon(category: Category) {
  return categoryIconMap[category.slug] ?? BookOpen
}

function postHref(post: Post) {
  return post.category?.slug ? `/docs/${post.category.slug}/${post.slug}` : `/docs/general/${post.slug}`
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa xuất bản"
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value))
}

export default async function HomePage() {
  const [postsResponse, categories, projectsResponse] = await Promise.all([
    getPosts({ limit: 3 }),
    getRootCategories(),
    getProjects({ limit: 4, featured: true })
  ])
  const posts = postsResponse.data.length ? postsResponse.data : fallbackPosts
  const displayCategories = categories.length ? categories : fallbackCategories
  const projects = projectsResponse.data.length ? projectsResponse.data : fallbackProjects
  const orderedMenuStories = [menuStories[0], menuStories[1], menuStories[3], menuStories[2], menuStories[4]]

  return (
    <main className="overflow-hidden bg-[var(--color-surface)]">
      <section className="home-hero relative border-b border-[var(--color-hairline)]">
        <Image
          src="/images/home-hero-ops-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero-bg"
        />
        <div className="home-glow home-glow-mint left-[4%] top-10 h-72 w-72"></div>
        <div className="home-glow home-glow-peach bottom-8 right-[8%] h-80 w-80"></div>
        <div className="home-glow home-glow-lavender left-[48%] top-[22%] h-64 w-64"></div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1600px] items-center gap-12 px-4 py-16 md:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:py-20">
          <HomeReveal>
            <h1 className="home-typing-title mt-6">
              <span className="home-title-line">Knowledge Base</span>
              <span className="home-title-line home-title-line-nowrap">
                <TypingText text="Vận hành thực chiến" />
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-body)] md:text-lg">
              Ghi chú kỹ thuật, checklist hardening và kinh nghiệm tối ưu hệ thống cho sysadmin, developer và người đang phải giữ dịch vụ chạy ổn định. Nội dung được viết từ các tình huống triển khai website, API, CMS, CDN và hạ tầng production.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/docs" variant="primary">
                Bắt đầu đọc <ArrowRight size={16} aria-hidden />
              </Button>
              <Button href="/projects" variant="outline">
                Xem dự án
              </Button>
            </div>
          </HomeReveal>

          <HomeReveal delay={0.12}>
            <div className="home-command-panel">
              <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-[var(--color-gradient-rose)]"></span>
                  <span className="size-2.5 rounded-full bg-[var(--color-gradient-peach)]"></span>
                  <span className="size-2.5 rounded-full bg-[var(--color-gradient-mint)]"></span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">Production notes</span>
              </div>
              <div className="p-5">
                <form action="/docs" className="home-search">
                  <label className="sr-only" htmlFor="home-search">Tìm kiếm tài liệu</label>
                  <Search size={20} className="shrink-0 text-[var(--color-muted)]" aria-hidden />
                  <input
                    id="home-search"
                    name="q"
                    className="min-h-12 w-full bg-transparent text-sm font-medium text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted-soft)]"
                    placeholder="Docker, Linux, Nginx, hardening..."
                  />
                  <button className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-medium !text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-active)]" type="submit">
                    Tìm
                  </button>
                </form>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {displayCategories.slice(0, 4).map((category, index) => {
                    const Icon = getCategoryIcon(category)
                    return (
                      <Link key={category.slug} href={`/docs/categories/${category.slug}`} className="home-mini-route group">
                        <Icon size={18} aria-hidden />
                        <span>
                          <strong>{category.name}</strong>
                          <small>{category.description ?? `${category.children?.length ?? index + 2} danh mục con`}</small>
                        </span>
                      </Link>
                    )
                  })}
                </div>

                <div className="home-signal mt-5">
                  {["Docs", "Tools", "Projects", "About Me", "Contact"].map((item, index) => (
                    <span key={item} style={{ animationDelay: `${index * 140}ms` }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </HomeReveal>
        </div>
      </section>

      <section className="kb-wide-container py-16 md:py-24">
        <div className="mb-10 max-w-3xl">
          <Badge tone="slate">Nội dung chính</Badge>
          <h2 className="kb-display-xl mt-4">Đi từ tài liệu vận hành đến công cụ hỗ trợ thao tác.</h2>
          <p className="mt-4 text-base leading-7 text-[var(--color-body)]">
            Trang được tổ chức cho hai nhu cầu: đọc sâu các ghi chú kỹ thuật và xử lý nhanh những việc nhỏ trong lúc vận hành. Mỗi khu vực dẫn tới một phần cụ thể của hệ sinh thái thanhnh.id.vn.
          </p>
        </div>

        <div className="space-y-14">
          {orderedMenuStories.map((item, index) => {
            const Icon = item.icon
            const reversed = index % 2 === 1

            return (
              <HomeReveal key={item.href} delay={Math.min(index * 0.04, 0.16)}>
                <article className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                  <Link href={item.href} className={`home-menu-visual group ${reversed ? "lg:order-2" : ""}`}>
                    <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 46vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-[var(--color-ink)]/10"></div>
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <span className="home-menu-badge">
                        <Icon size={18} aria-hidden />
                        {item.label}
                      </span>
                      <ArrowRight className="text-white transition-transform group-hover:translate-x-1" size={22} aria-hidden />
                    </div>
                  </Link>
                  <div className={reversed ? "lg:order-1" : ""}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">{item.eyebrow}</p>
                    <h3 className="kb-display-lg mt-3 max-w-2xl">{item.title}</h3>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-body)]">{item.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.stats.map((stat) => (
                        <span key={stat} className="rounded-full border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--color-body)]">
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </HomeReveal>
            )
          })}
        </div>
      </section>

      <section className="border-y border-[var(--color-hairline)] bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="blue">Bài viết mới</Badge>
              <h2 className="kb-display-xl mt-4">Các ghi chú mới nhất từ kho vận hành.</h2>
            </div>
            <Button href="/docs" variant="ghost">
              Xem tất cả <ArrowRight size={16} aria-hidden />
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {posts.slice(0, 3).map((post, index) => (
              <HomeReveal key={post.id} delay={index * 0.08}>
                <article className="home-article-card group">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{post.category?.name ?? "Tài liệu"}</Badge>
                    <span className="text-xs font-medium text-[var(--color-muted)]">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-medium leading-snug text-[var(--color-ink)]">
                    <Link href={postHref(post)}>{post.title}</Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--color-body)]">
                    {post.excerpt ?? "Tài liệu kỹ thuật đang được cập nhật nội dung."}
                  </p>
                  <Link href={postHref(post)} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
                    Đọc tiếp <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </Link>
                </article>
              </HomeReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <div className="home-glow home-glow-sky -right-24 top-12 h-80 w-80"></div>
        <div className="mx-auto max-w-[1600px] px-4 md:px-6">
          <div className="mb-8 grid gap-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <Badge tone="amber">Projects</Badge>
              <h2 className="kb-display-xl mt-4">Bốn lớp chính tạo nên thanhnh.id.vn.</h2>
            </div>
            <p className="max-w-3xl text-base leading-7 text-[var(--color-body)] lg:justify-self-end">
              Theo README, hệ thống được thiết kế theo hướng modular gồm API, FE, CMS và CDN. Phần này không chỉ liệt kê project; nó mô tả luồng nội dung đi từ trang quản trị, qua API và media service, rồi được frontend tối ưu SEO hiển thị cho người đọc.
            </p>
          </div>

          <div className="home-bento-grid">
            {projects.slice(0, 4).map((project, index) => {
              const moduleInfo = getProjectModule(project.title, index)
              return (
                <MouseFollowCard key={project.id} className={`home-project-card ${index === 0 ? "home-bento-featured" : ""}`}>
                  <div className="home-project-inner relative z-10 grid h-full gap-6">
                    <div className="flex min-w-0 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="kb-icon size-11">
                          {index === 0 ? <FileCode2 size={20} aria-hidden /> : <Layers size={20} aria-hidden />}
                        </div>
                        <Link href={`/projects/${project.slug}`} className="rounded-full border border-[var(--color-hairline)] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-hairline-strong)]">
                          Case study
                        </Link>
                      </div>
                      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">{moduleInfo.label}</p>
                      <h3 className="kb-display-md mt-2">{project.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--color-body)]">{project.description ?? moduleInfo.summary}</p>
                      <div className="mt-5 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">{moduleInfo.headline}</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">{moduleInfo.summary}</p>
                      </div>
                    </div>

                    <div className={`home-project-visual home-project-visual-${moduleInfo.tone}`}>
                      <div className="home-project-orbit" aria-hidden>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      {index === 0 ? (
                        <div className="home-cms-board">
                          <div className="home-cms-board-header">
                            <span>Admin Workspace</span>
                            <strong>CMS</strong>
                          </div>
                          <div className="home-cms-module-list">
                            {moduleInfo.modules.map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                          <div className="home-cms-checks">
                            {moduleInfo.checks.map((item) => (
                              <small key={item}>{item}</small>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div className="home-project-flow">
                        {moduleInfo.flow.map((step, stepIndex) => (
                          <div key={step} className="home-project-flow-item">
                            <span>{String(stepIndex + 1).padStart(2, "0")}</span>
                            <strong>{step}</strong>
                          </div>
                        ))}
                      </div>
                      <div className="home-project-metric">
                        <span>{moduleInfo.metric}</span>
                        <div>
                          {(project.techStack ?? []).slice(0, 4).map((tech) => (
                            <small key={tech}>{tech}</small>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </MouseFollowCard>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--color-hairline)] bg-[var(--color-surface-soft)] py-16 md:py-24">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 md:px-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Badge tone="slate">About</Badge>
            <h2 className="kb-display-xl mt-4">Cách một ghi chú kỹ thuật trở thành tài liệu có thể dùng lại.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-body)]">
              Mục tiêu của website không phải viết lại tài liệu chính thức, mà là biến kinh nghiệm triển khai thành hướng dẫn có ngữ cảnh: biết dùng khi nào, chỉnh tham số nào, theo dõi chỉ số gì và kiểm tra ra sao.
            </p>
            <div className="mt-7 flex items-center gap-3 text-sm font-medium text-[var(--color-body)]">
              <CheckCircle2 size={18} className="text-[var(--color-ink)]" aria-hidden />
              57 bài viết đang được phân loại theo stack và nhóm vận hành
            </div>
          </div>

          <div className="home-timeline">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <HomeReveal key={step.title} delay={index * 0.06}>
                  <article className="home-timeline-step">
                    <span className="home-timeline-index">{String(index + 1).padStart(2, "0")}</span>
                    <div className="kb-icon size-12">
                      <Icon size={21} aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-[var(--color-ink)]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">{step.description}</p>
                    </div>
                  </article>
                </HomeReveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="home-marquee-section" aria-label="Footer marquee">
        <div className="home-marquee">
          <div>
            {["Linux hardening", "NGINX performance", "Docker production", "MySQL tuning", "Monitoring notes"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div aria-hidden>
            {["Linux hardening", "NGINX performance", "Docker production", "MySQL tuning", "Monitoring notes"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
