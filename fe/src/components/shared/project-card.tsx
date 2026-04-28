import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import cdnLoader, { absoluteCdnUrl } from "@/lib/cdn-loader"
import type { Project } from "@/types/project"

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const imageSrc = absoluteCdnUrl(project.thumbnailUrl)

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-colors hover:border-blue-600">
      <div className="relative aspect-[16/9] border-b border-slate-200 bg-slate-50">
        <Image
          loader={project.thumbnailUrl ? cdnLoader : undefined}
          src={imageSrc}
          alt={`Ảnh dự án ${project.title}`}
          fill
          priority={priority}
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {project.featured ? <Badge tone="amber">Featured</Badge> : null}
          {(project.techStack ?? []).slice(0, 4).map((tech) => (
            <Badge key={tech} tone="slate">{tech}</Badge>
          ))}
        </div>
        <h2 className="mt-3 text-lg font-bold text-slate-950">{project.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{project.description ?? "Dự án thực tế với giao diện và backend tùy biến."}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.demoUrl ? (
            <a className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white" href={project.demoUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={15} aria-hidden /> Demo
            </a>
          ) : null}
          {project.repoUrl ? (
            <a className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950" href={project.repoUrl} target="_blank" rel="noreferrer">
              <Github size={15} aria-hidden /> Repo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
