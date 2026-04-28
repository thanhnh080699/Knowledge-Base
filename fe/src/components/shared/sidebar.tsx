import { BookOpen, Code2, Headphones, Server, Shield } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/types/category"

const fallback = [
  { name: "SysAdmin", slug: "sysadmin", icon: Server },
  { name: "DevOps", slug: "devops", icon: Shield },
  { name: "Development", slug: "development", icon: Code2 },
  { name: "HelpDesk", slug: "helpdesk", icon: Headphones }
]

export function Sidebar({ categories }: { categories: Category[]; activeCategory?: string }) {
  const items = categories.length ? categories.map((item) => ({ ...item, icon: BookOpen })) : fallback

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-20">
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Danh mục tài liệu</p>
      <nav className="mt-4 grid gap-2" aria-label="Danh mục tài liệu">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.slug}
              href={`/docs?category=${item.slug}`}
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-white text-blue-600">
                <Icon size={16} aria-hidden />
              </span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
