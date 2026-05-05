import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getTool } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ToolRenderer } from "@/components/tools/tool-renderer"

export const revalidate = 60

interface Props {
  params: { slug: string }
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

  return (
    <main className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
          <Button href="/tools" variant="ghost" className="mb-4">
            <ArrowLeft size={16} aria-hidden />
            Back to Tools
          </Button>
          <h1 className="text-3xl font-bold text-slate-950">{tool.name}</h1>
          {tool.description && (
            <p className="mt-2 text-slate-600">{tool.description}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <ToolRenderer slug={tool.slug} />
        </div>
      </section>
    </main>
  )
}
