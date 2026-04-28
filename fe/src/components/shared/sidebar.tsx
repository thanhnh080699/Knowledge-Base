import { BookOpen, Code2, Headphones, Server, Shield } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/types/category"
import type { Tag } from "@/types/tag"

const fallback = [
  { name: "SysAdmin", slug: "sysadmin", icon: Server },
  { name: "DevOps", slug: "devops", icon: Shield },
  { name: "Development", slug: "development", icon: Code2 },
  { name: "HelpDesk", slug: "helpdesk", icon: Headphones }
]

export function Sidebar({ categories, tags }: { categories: Category[]; tags?: Tag[]; activeCategory?: string; activeTag?: string }) {
  const items = categories.length ? categories.map((item) => ({ ...item, icon: BookOpen })) : fallback

  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-white md:sticky md:top-20">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Tài liệu</p>
      <nav className="mt-4 grid gap-1" aria-label="Danh mục tài liệu">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.slug} href={`/docs?category=${item.slug}`} className="flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:border-blue-500 hover:text-white">
              <Icon size={16} aria-hidden />
              {item.name}
            </Link>
          )
        })}
      </nav>
      {tags?.length ? (
        <div className="mt-6 border-t border-slate-800 pt-4">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Nhãn</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 16).map((tag) => (
              <Link key={tag.slug} href={`/docs?tag=${tag.slug}`} className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-blue-500 hover:text-white">
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  )
}
