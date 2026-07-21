import { CalendarDays, ArrowRight, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CdnImage } from "@/components/shared/cdn-image"
import { estimateReadingTime, getPostThumbnail } from "@/lib/content"
import type { Post } from "@/types/post"

function formatDate(value: string | null | undefined) {
  if (!value) return "Chưa xuất bản"
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value))
}

export function PostCard({ post, eager = false }: { post: Post; eager?: boolean }) {
  const href = post.category?.slug ? `/docs/${post.category.slug}/${post.slug}` : `/docs/general/${post.slug}`
  const readTime = estimateReadingTime(post.content, post.excerpt)
  const coverUrl = getPostThumbnail(post)

  return (
    <article className="group kb-card flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--color-hairline)] bg-white p-4 md:p-5 transition-all hover:border-[var(--color-hairline-strong)] hover:shadow-xs">
      <div>
        {/* Cover Thumbnail (if available) */}
        {coverUrl ? (
          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-[var(--color-hairline-soft)] bg-[var(--color-surface-soft)]">
            <CdnImage
              src={coverUrl}
              alt={post.title}
              fill
              priority={eager}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : null}

        {/* Card Header Meta */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge>{post.category?.name ?? "Tài liệu"}</Badge>
          <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-1">
              <Clock size={13} aria-hidden />
              {readTime} phút
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={13} aria-hidden />
              {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>

        {/* Post Title */}
        <h2 className="mt-3 text-base font-semibold leading-snug text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary-active)] md:text-lg">
          <Link href={href} className="focus:outline-none">
            {post.title}
          </Link>
        </h2>
        
        {/* Post Excerpt */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--color-body)] md:text-sm">
          {post.excerpt ?? "Tài liệu kỹ thuật đang được cập nhật nội dung."}
        </p>
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-[var(--color-hairline-soft)] flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          {post.tags?.length ? `#${post.tags[0].name}` : "Guide"}
        </span>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-primary-active)] transition-colors"
        >
          Đọc ngay <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </article>
  )
}
