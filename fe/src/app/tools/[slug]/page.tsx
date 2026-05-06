import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getTool, getTools } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ToolRenderer } from "@/components/tools/tool-renderer"
import { ToolSidebar } from "@/components/tools/tool-sidebar"

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
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
          <Button href="/tools" variant="ghost" className="mb-4">
            <ArrowLeft size={16} aria-hidden />
            Back to Tools
          </Button>
          <h1 className="break-words text-3xl font-bold text-slate-950">{tool.name}</h1>
          {tool.description && (
            <p className="mt-2 break-words text-slate-600">{tool.description}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <div className="flex gap-6">
          <ToolSidebar tools={allTools} currentSlug={slug} />
          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <ToolRenderer slug={tool.slug} />
          </div>
        </div>
      </section>
    </main>
  )
}
