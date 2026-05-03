import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ExternalLink, Github } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PostContent } from "@/components/shared/post-content"
import cdnLoader, { absoluteCdnUrl } from "@/lib/cdn-loader"
import { fallbackProjects } from "@/lib/fallback-data"
import { getProject } from "@/lib/api"

export const revalidate = 60

type ProjectDetailProps = {
  params: Promise<{ slug: string }>
}

async function findProject(slug: string) {
  const project = await getProject(slug)
  if (project) return project
  return fallbackProjects.find((item) => item.slug === slug) ?? null
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params
  const project = await findProject(slug)

  if (!project) {
    return {
      title: "Không tìm thấy dự án"
    }
  }

  return {
    title: project.title,
    description: project.description ?? `Case study dự án ${project.title}`,
    openGraph: {
      title: `${project.title} | thanhnh.id.vn`,
      description: project.description ?? undefined,
      images: project.thumbnailUrl ? [absoluteCdnUrl(project.thumbnailUrl)] : undefined
    }
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params
  const project = await findProject(slug)

  if (!project) notFound()

  const imageSrc = absoluteCdnUrl(project.thumbnailUrl)

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
        <header className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="flex flex-wrap gap-2">
              {project.featured ? <Badge tone="amber">Featured</Badge> : null}
              {(project.techStack ?? []).map((tech) => <Badge key={tech} tone="slate">{tech}</Badge>)}
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-950 md:text-5xl">{project.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              {project.description ?? "Case study dự án đã triển khai với giao diện, backend và hạ tầng tùy biến."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.demoUrl ? (
                <Button href={project.demoUrl} variant="primary" target="_blank" rel="noreferrer">
                  <ExternalLink size={16} aria-hidden /> Demo
                </Button>
              ) : null}
              {project.repoUrl ? (
                <Button href={project.repoUrl} variant="outline" target="_blank" rel="noreferrer">
                  <Github size={16} aria-hidden /> Repo
                </Button>
              ) : null}
              <Button href="/contact" variant="secondary">Trao đổi dự án tương tự</Button>
            </div>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
            <Image
              loader={project.thumbnailUrl ? cdnLoader : undefined}
              src={imageSrc}
              alt={`Ảnh dự án ${project.title}`}
              fill
              priority
              className="object-cover"
            />
          </div>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-sm font-bold uppercase text-slate-950">Project stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.techStack ?? []).map((tech) => <Badge key={tech} tone="blue">{tech}</Badge>)}
            </div>
          </aside>
          <section>
            <h2 className="text-2xl font-bold text-slate-950">Nội dung triển khai</h2>
            <PostContent content={project.content || "## Đang cập nhật\nNội dung chi tiết của project này sẽ được bổ sung từ CMS."} />
          </section>
        </div>
      </article>
    </main>
  )
}
