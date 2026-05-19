import { CalendarDays, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Post } from "@/types/post"

function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa xuất bản"
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value))
}

export function PostCard({ post }: { post: Post; eager?: boolean }) {
  const href = post.category?.slug ? `/docs/${post.category.slug}/${post.slug}` : `/docs/general/${post.slug}`

  return (
    <article className="kb-card h-full">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{post.category?.name ?? "Tài liệu"}</Badge>
        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)]">
          <CalendarDays size={14} aria-hidden />
          {formatDate(post.publishedAt)}
        </span>
      </div>
      <h2 className="mt-4 text-lg font-medium leading-snug text-[var(--color-ink)]">
        <Link href={href} className="transition-colors hover:text-[var(--color-body-strong)]">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--color-body)]">{post.excerpt ?? "Tài liệu kỹ thuật đang được cập nhật nội dung."}</p>
      <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
        Đọc tiếp <ArrowRight size={15} aria-hidden />
      </Link>
    </article>
  )
}
