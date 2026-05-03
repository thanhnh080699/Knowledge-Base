import type { Metadata } from "next"
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Code2, Database, ServerCog } from "lucide-react"
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

export default async function ProjectsPage() {
  const response = await getProjects({ limit: 24 })
  const projects = response.data.length ? response.data : fallbackProjects
  const featured = projects.filter((project) => project.featured).slice(0, 3)
  const totalTech = new Set(projects.flatMap((project) => project.techStack ?? [])).size

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              <BriefcaseBusiness size={16} aria-hidden />
              Projects
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
              Dự án đã triển khai
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Case study thực tế cho website nội dung, dashboard quản trị, API và hạ tầng media. Mỗi project tập trung vào khả năng vận hành lâu dài, SEO kỹ thuật và workflow quản trị rõ ràng.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/contact" variant="primary">
                Trao đổi dự án <ArrowRight size={16} aria-hidden />
              </Button>
              <Button href="/docs" variant="outline">Xem tài liệu</Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
              <div className="text-3xl font-bold">{projects.length}</div>
              <div className="mt-1 text-sm text-slate-300">project entries</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-slate-950">{featured.length}</div>
              <div className="mt-1 text-sm text-slate-600">featured case studies</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-3xl font-bold text-slate-950">{totalTech}</div>
              <div className="mt-1 text-sm text-slate-600">technologies used</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-10 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {capabilities.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <item.icon className="h-6 w-6 text-blue-600" aria-hidden />
              <h2 className="mt-3 text-base font-bold text-slate-950">{item.label}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.value}</p>
            </div>
          ))}
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
