import type { Metadata } from "next"
import { ProjectsFilter } from "@/components/shared/projects-filter"
import { ProjectCard } from "@/components/shared/project-card"
import { fallbackProjects } from "@/lib/fallback-data"
import { getProjects } from "@/lib/api"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Dự án",
  description: "Các dự án đã làm, tech stack, demo link và repo link.",
  openGraph: {
    title: "Dự án | thanhnh.id.vn",
    description: "Danh sách dự án web, API, CMS và CDN."
  }
}

export default async function ProjectsPage() {
  const response = await getProjects({ limit: 24 })
  const projects = response.data.length ? response.data : fallbackProjects
  const featured = projects.filter((project) => project.featured).slice(0, 3)

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-10 md:px-6">
      <section className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Projects</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Dự án đã làm</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Các dự án tập trung vào website nội dung, dashboard quản trị, API và hạ tầng deploy.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-950">Dự án nổi bật</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {featured.map((project, index) => <ProjectCard key={project.id} project={project} priority={index === 0} />)}
        </div>
      </section>

      <ProjectsFilter projects={projects} />
    </main>
  )
}
