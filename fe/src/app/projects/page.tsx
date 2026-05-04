import type { Metadata } from "next"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  FileCode2,
  Layers3,
  MonitorCheck,
  ServerCog,
  ShieldCheck,
  Sparkles,
  TimerReset
} from "lucide-react"
import { ProjectsFilter } from "@/components/shared/projects-filter"
import { ProjectCard } from "@/components/shared/project-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fallbackProjects } from "@/lib/fallback-data"
import { getProjects } from "@/lib/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Dự án",
  description: "Các dự án đã triển khai, case study, tech stack, demo link và repo link.",
  openGraph: {
    title: "Dự án | thanhnh.id.vn",
    description: "Danh sách dự án web, API, CMS và CDN."
  }
}

const capabilities = [
  { label: "Frontend", value: "Next.js App Router", icon: Code2 },
  { label: "Backend", value: "AdonisJS REST API", icon: Database },
  { label: "Operations", value: "CDN, deploy, monitoring", icon: ServerCog }
]

const counters = [
  { label: "dự án triển khai", value: 18, suffix: "+", tone: "border-blue-200 bg-blue-50 text-blue-700" },
  { label: "module nghiệp vụ", value: 42, suffix: "+", tone: "border-slate-200 bg-slate-50 text-slate-800" },
  { label: "stack production", value: 12, suffix: "+", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { label: "quy trình bàn giao", value: 100, suffix: "%", tone: "border-amber-200 bg-amber-50 text-amber-700" }
]

const whyChooseUs = [
  {
    title: "Kiến trúc dễ vận hành",
    description: "Tách rõ FE, API, CMS và media để website dễ mở rộng, backup và debug sau bàn giao.",
    icon: Layers3
  },
  {
    title: "Tập trung hiệu năng thật",
    description: "Ưu tiên ISR, CDN ảnh, schema dữ liệu gọn và các điểm kiểm soát tốc độ ngay từ đầu.",
    icon: TimerReset
  },
  {
    title: "Chuẩn quản trị nội dung",
    description: "CMS, phân quyền, media flow và taxonomy được thiết kế để team nội dung dùng lâu dài.",
    icon: MonitorCheck
  },
  {
    title: "Bảo mật theo workflow",
    description: "Upload tập trung, validator chặt, API key/CDN rule và checklist hardening cho môi trường production.",
    icon: ShieldCheck
  }
]

export default async function ProjectsPage() {
  const response = await getProjects({ limit: 24 })
  const projects = response.data.length ? response.data : fallbackProjects
  const featured = projects.filter((project) => project.featured).slice(0, 3)
  const totalTech = new Set(projects.flatMap((project) => project.techStack ?? [])).size

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <BriefcaseBusiness size={16} aria-hidden />
              Project Portfolio
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
              Dự án đã triển khai cho website, API và hệ thống quản trị
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Case study thực tế cho website nội dung, dashboard quản trị, API và hạ tầng media. Mỗi project tập trung vào khả năng vận hành lâu dài, SEO kỹ thuật và workflow quản trị rõ ràng.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary">
                Trao đổi dự án <ArrowRight size={16} aria-hidden />
              </Button>
              <Button href="/docs" variant="outline">Xem tài liệu</Button>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {capabilities.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <item.icon className="h-5 w-5 text-blue-600" aria-hidden />
                  <div className="mt-3 text-sm font-bold text-slate-950">{item.label}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-600">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="grid h-full gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-600">Delivery board</span>
                    <BadgeCheck className="h-5 w-5 text-emerald-600" aria-hidden />
                  </div>
                  <div className="mt-5 space-y-3">
                    {["Discovery", "Design system", "API contract", "Deploy checklist"].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5 text-blue-700">
                  <div className="animate-[stat-pop_500ms_ease-out] text-4xl font-bold">
                    {projects.length || 18}+
                  </div>
                  <div className="mt-1 text-sm font-semibold text-blue-700">project entries ready to review</div>
                </div>
              </div>

              <div className="grid content-between gap-4">
                <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-950">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">Featured case studies</span>
                    <Sparkles className="h-5 w-5 text-amber-500" aria-hidden />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="text-3xl font-bold">{featured.length}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">featured</div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="text-3xl font-bold">{totalTech}</div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">technologies</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                  <FileCode2 className="h-8 w-8 text-blue-600" aria-hidden />
                  <h2 className="mt-4 text-xl font-bold text-slate-950">Build rõ phạm vi, bàn giao có kiểm soát</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Mỗi dự án được đóng gói theo module, tài liệu vận hành và tiêu chí nghiệm thu để khách hàng tiếp quản dễ hơn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-8 md:grid-cols-4 md:px-6">
          {counters.map((item) => (
            <div key={item.label} className={`rounded-lg border p-5 shadow-sm ${item.tone}`}>
              <div className="animate-[stat-pop_500ms_ease-out] text-4xl font-bold leading-none">
                {item.value}
                {item.suffix}
              </div>
              <div className="mt-2 text-sm font-semibold opacity-90">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge tone="slate">Why customers choose us</Badge>
            <h2 className="mt-4 max-w-xl text-3xl font-bold leading-tight text-slate-950">Vì sao khách hàng chọn cách triển khai này</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Không chỉ dựng giao diện. Mục tiêu là tạo một hệ thống có cấu trúc rõ, nội dung dễ quản trị và có thể vận hành ổn định khi lên production.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {whyChooseUs.map((item) => (
              <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-600">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {featured.length ? (
        <section className="mx-auto max-w-[1600px] px-4 pb-10 md:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Badge tone="amber">Featured</Badge>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">Dự án nổi bật</h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
              <CheckCircle2 size={16} className="text-emerald-600" aria-hidden />
              Có nội dung case study từ CMS
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((project, index) => <ProjectCard key={project.id} project={project} priority={index === 0} />)}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[1600px] px-4 pb-12 md:px-6">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-950">Tất cả dự án</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Lọc theo stack để xem nhanh những mảng đã triển khai.</p>
        </div>
        <ProjectsFilter projects={projects} />
      </section>
    </main>
  )
}
