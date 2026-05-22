import type { ReactNode } from "react"
import { getTools } from "@/lib/api"
import { ToolSidebar } from "@/components/tools/tool-sidebar"
import { HomeReveal } from "@/components/shared/home-motion"

export const revalidate = 60

interface Props {
  children: ReactNode
}

export default async function ToolsLayout({ children }: Props) {
  const response = await getTools({ limit: 100 })
  const allTools = response.data

  return (
    <main className="bg-[var(--color-surface)]">
      <section className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <HomeReveal>
            <ToolSidebar tools={allTools} />
          </HomeReveal>
          {children}
        </div>
      </section>
    </main>
  )
}
