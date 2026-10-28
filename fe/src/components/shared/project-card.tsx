import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CdnImage } from "@/components/shared/cdn-image"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import type { Project } from "@/types/project"

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const imageSrc = absoluteCdnUrl(project.thumbnailUrl)

  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white transition-colors hover:border-[var(--color-hairline-strong)] hover:shadow-[var(--shadow-soft)]">
      <Link href={`/projects/${project.slug}`} aria-label={`Xem dự án ${project.title}`} className="relative block aspect-[16/9] border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
        <CdnImage
          useCdnLoader={!!project.thumbnailUrl}
          src={imageSrc}
          alt={`Ảnh dự án ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="object-cover"
        />
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {project.featured ? <Badge tone="amber">Featured</Badge> : null}
          {(project.techStack ?? []).slice(0, 4).map((tech) => (
            <Badge key={tech} tone="slate">{tech}</Badge>
          ))}
        </div>
        <h2 className="mt-4 text-lg font-medium leading-snug text-[var(--color-ink)]">
          <Link href={`/projects/${project.slug}`} className="transition-colors group-hover:text-[var(--color-body-strong)]">
            {project.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-body)]">{project.description ?? "Dự án thực tế với giao diện và backend tùy biến."}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-3 py-2 text-sm font-medium !text-[var(--color-on-primary)] transition-colors hover:bg-[var(--color-primary-active)]" href={`/projects/${project.slug}`}>
            Chi tiết
          </a>
          {project.demoUrl ? (
            <a className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] bg-transparent px-3 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] hover:bg-white" href={project.demoUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={15} aria-hidden /> Demo
            </a>
          ) : null}
          {project.repoUrl ? (
            <a className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] px-3 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]" href={project.repoUrl} target="_blank" rel="noreferrer">
              <Github size={15} aria-hidden /> Repo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
