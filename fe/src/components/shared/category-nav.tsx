import Link from "next/link"
import type { Category } from "@/types/category"

export function CategoryNav({ categories, active }: { categories: Category[]; active?: string }) {
  return (
    <aside className="rounded-2xl border border-[var(--color-hairline)] bg-white p-4 lg:sticky lg:top-20">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">Danh mục</p>
      <nav className="mt-4 grid gap-1" aria-label="Điều hướng danh mục">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/docs?category=${category.slug}`}
            className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
              active === category.slug ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : "border-transparent text-[var(--color-body)] hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-ink)]"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
