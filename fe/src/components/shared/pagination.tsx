import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export function Pagination({
  currentPage,
  lastPage,
  basePath,
  query = {}
}: {
  currentPage: number
  lastPage: number
  basePath: string
  query?: Record<string, string | number | undefined>
}) {
  const makeHref = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value))
    })
    params.set("page", String(page))
    return `${basePath}?${params.toString()}`
  }

  return (
    <nav className="flex items-center justify-between border-t border-[var(--color-hairline)] pt-5" aria-label="Pagination">
      <Link
        href={makeHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage <= 1}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        <ChevronLeft size={16} aria-hidden /> Trang trước
      </Link>
      <span className="text-sm text-[var(--color-body)]">
        Trang {currentPage} / {lastPage}
      </span>
      <Link
        href={makeHref(Math.min(lastPage, currentPage + 1))}
        aria-disabled={currentPage >= lastPage}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline-strong)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Trang sau <ChevronRight size={16} aria-hidden />
      </Link>
    </nav>
  )
}
