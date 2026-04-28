import Link from "next/link"
import type { Category } from "@/types/category"

export function CategoryNav({ categories, active }: { categories: Category[]; active?: string }) {
  return (
    <aside className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-white lg:sticky lg:top-20">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-400">Danh mục</p>
      <nav className="mt-4 grid gap-1" aria-label="Điều hướng danh mục">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/docs?category=${category.slug}`}
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
              active === category.slug ? "border-blue-500 bg-blue-600 text-white" : "border-transparent text-slate-200 hover:border-blue-500"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
