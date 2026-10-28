import Link from "next/link"
import type { Post } from "@/types/post"
import { displayPostTitle, lessonNumber, postHref, readingSuggestions } from "@/lib/reading"
import { PostCard } from "./post-card"
import { RecentPosts } from "./recent-posts"
import { ReturnToListing } from "./reading-status"

export function PostSuggestions({ post, candidates }: { post: Post; candidates: Post[] }) {
  const { previous, next, related } = readingSuggestions(post, candidates)
  const isLesson = !!lessonNumber(post)
  const category = post.category
  const neighbors: Array<{ label: string; target: Post | undefined }> = [
    { label: "Bài trước", target: previous },
    { label: "Bài tiếp theo", target: next },
  ]
  return (
    <div className="mt-10 space-y-8 border-t border-[var(--color-hairline)] pt-8">
      <ReturnToListing />
      {(isLesson || category || post.tags?.length) ? <section aria-labelledby="further-reading-heading" className="reading-section">
        <h2 id="further-reading-heading">Tìm hiểu thêm</h2>
        {isLesson ? <>
          <div className="grid gap-3 sm:grid-cols-2">
            {neighbors.map(({ label, target }) => {
              return target ? <Link key={label} href={postHref(target)} className="reading-nav-card">
                <span className="mb-1 block text-xs text-[var(--color-muted)]">{label}</span>
                {displayPostTitle(target)}
              </Link> : null
            })}
          </div>
          <Link className="reading-link mt-4 inline-block" href={`/docs/categories/${category?.slug ?? "ccna"}`}>Xem toàn bộ lộ trình {category?.name ?? "CCNA"}</Link>
        </> : <div className="flex flex-wrap gap-3">
          {category && <Link className="reading-link" href={`/docs/categories/${category.slug}`}>Khám phá {category.name}</Link>}
          {post.tags?.map(tag => <Link className="reading-link" key={tag.id} href={`/docs?tag=${encodeURIComponent(tag.slug)}`}>#{tag.name}</Link>)}
        </div>}
      </section> : null}
      {!!related.length && <section aria-labelledby="related-posts-heading" className="reading-section">
        <h2 id="related-posts-heading">Bài viết liên quan</h2>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">{related.map(item => <PostCard key={item.id} post={item} />)}</div>
      </section>}
      <RecentPosts currentId={post.id} />
    </div>
  )
}
