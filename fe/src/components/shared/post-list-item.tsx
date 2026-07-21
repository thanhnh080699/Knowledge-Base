import { CalendarDays, Clock, ChevronRight, FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CdnImage } from "@/components/shared/cdn-image"
import { estimateReadingTime, getPostThumbnail } from "@/lib/content"
import type { Post } from "@/types/post"

function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa xuất bản"
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value))
}

export function PostListItem({ post }: { post: Post }) {
  const href = post.category?.slug ? `/docs/${post.category.slug}/${post.slug}` : `/docs/general/${post.slug}`
  const readTime = estimateReadingTime(post.content, post.excerpt)
  const coverUrl = getPostThumbnail(post)

  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 transition-all hover:border-[var(--color-hairline-strong)] hover:shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Compact Thumbnail or Icon */}
        {coverUrl ? (
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-[var(--color-hairline-soft)] bg-[var(--color-surface-soft)]">
            <CdnImage
              src={coverUrl}
              alt={post.title}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-soft)] text-[var(--color-muted)]">
            <FileText size={18} />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-0.5 overflow-hidden sm:flex-row sm:items-center sm:gap-3">
          <Badge className="w-fit shrink-0 font-normal text-[11px]">{post.category?.name ?? "Tài liệu"}</Badge>
          <h3 className="truncate text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-primary-active)]">
            <Link href={href} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>
        </div>
      </div>
      
      <div className="flex shrink-0 items-center justify-between gap-4 text-xs text-[var(--color-muted)] sm:justify-end">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} aria-hidden />
            {readTime} phút đọc
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} aria-hidden />
            {formatDate(post.publishedAt)}
          </span>
        </div>
        <Link href={href} aria-label={`Xem bài viết ${post.title}`} className="rounded-lg bg-[var(--color-surface-soft)] p-1.5 text-[var(--color-muted)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:!text-white">
          <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  )
}
