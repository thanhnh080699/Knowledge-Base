"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/shared/project-card"
import type { Project } from "@/types/project"

export function ProjectsFilter({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const values = new Set<string>()
    projects.forEach((project) => (project.techStack ?? []).forEach((tech) => values.add(tech)))
    return ["Tất cả", ...Array.from(values).slice(0, 8)]
  }, [projects])
  const [active, setActive] = useState("Tất cả")
  const filtered = active === "Tất cả" ? projects : projects.filter((project) => project.techStack?.includes(active))

  return (
    <section className="space-y-6" aria-label="Danh sách dự án">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button key={category} type="button" variant={active === category ? "primary" : "outline"} onClick={() => setActive(category)}>
            {category}
          </Button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </section>
  )
}
