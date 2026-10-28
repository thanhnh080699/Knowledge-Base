import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import "./project-reading.css"
import { ExternalLink, Github, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PostContent } from "@/components/shared/post-content"
import { CdnImage } from "@/components/shared/cdn-image"
import { absoluteCdnUrl } from "@/lib/cdn-loader"
import { stripFirstImage, buildTocFromContent, estimateReadingTime } from "@/lib/content"
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
    alternates: { canonical: `https://thanhnh.id.vn/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url: `https://thanhnh.id.vn/projects/${project.slug}`,
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
  const content = stripFirstImage(project.content || "", project.thumbnailUrl)
  const toc = buildTocFromContent(content).filter(item => item.text !== "Mục lục")
  const minutes = estimateReadingTime(content)

  return (
    <main className="project-reading bg-[var(--color-surface)]">
      <article className="mx-auto max-w-[1440px] px-4 py-10 md:px-6">
        <header className="project-hero">
          <Link href="/projects" className="project-back"><ArrowLeft size={16} aria-hidden /> Tất cả dự án</Link>
          <div className="flex flex-wrap gap-2">
            {project.featured ? <Badge tone="amber">Featured</Badge> : null}
            {(project.techStack ?? []).map((tech) => <Badge key={tech} tone="slate">{tech}</Badge>)}
          </div>
          <h1 className="project-title mt-5">{project.title}</h1>
          
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
            <CdnImage
              useCdnLoader={!!project.thumbnailUrl}
              src={imageSrc}
              alt={`Ảnh dự án ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
              className="object-cover"
            />
          </div>

          <p className="mt-8 max-w-5xl text-lg leading-8 text-[var(--color-body)]">
            {project.description ?? "Case study dự án đã triển khai với giao diện, backend và hạ tầng tùy biến."}
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-[var(--color-muted)]"><Clock size={16} aria-hidden /> {minutes} phút đọc · Case study dự án</div>
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
        </header>

        <div className="project-body-grid">
          <section className="project-story" aria-label="Nội dung dự án">
            <PostContent content={content} />
          </section>
          <aside className="project-sidebar">
            <nav aria-label="Mục lục bài dự án" className="project-panel">
              <h2>Trong bài viết</h2>
              <ol>{toc.map((item, index) => <li key={item.id}><a href={`#${item.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{item.text}</a></li>)}</ol>
            </nav>
            <div className="project-panel">
              <h2>Công nghệ sử dụng</h2>
              <div className="mt-4 flex flex-wrap gap-2">{(project.techStack ?? []).map(tech => <Badge key={tech} tone="blue">{tech}</Badge>)}</div>
            </div>
            <div className="project-panel project-contact">
              <h2>Bạn có bài toán tương tự?</h2>
              <p>Trao đổi về chức năng, kiến trúc và phạm vi triển khai phù hợp.</p>
              <Button href="/contact" variant="primary">Trao đổi dự án</Button>
            </div>
          </aside>
        </div>
      </article>
    </main>
  )
}
