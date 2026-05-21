import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTool, getTools } from "@/lib/api"
import { ToolRenderer } from "@/components/tools/tool-renderer"
import { ToolSidebar } from "@/components/tools/tool-sidebar"
import { HomeReveal } from "@/components/shared/home-motion"

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return { title: "Tool Not Found" }

  return {
    title: tool.name,
    description: tool.description || `${tool.name} - Developer tool`,
    openGraph: {
      title: `${tool.name} | thanhnh.id.vn`,
      description: tool.description || `${tool.name} - Developer tool`
    }
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) notFound()

  const response = await getTools({ limit: 100 })
  const allTools = response.data

  return (
    <main className="bg-[var(--color-surface)]">
      <section className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <HomeReveal>
            <ToolSidebar tools={allTools} currentSlug={slug} />
          </HomeReveal>
          <HomeReveal className="flex-1 rounded-2xl border border-[var(--color-hairline)] bg-white p-6" delay={0.08}>
            <h1 className="kb-display-lg mb-2 break-words">{tool.name}</h1>
            {tool.description && (
              <p className="mb-6 break-words text-[var(--color-body)]">{tool.description}</p>
            )}
            <ToolRenderer slug={tool.slug} />
          </HomeReveal>
        </div>
      </section>
    </main>
  )
}
