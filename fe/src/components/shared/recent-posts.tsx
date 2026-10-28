"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getPost } from "@/lib/api"
import { displayPostTitle, recordReadingVisit, postHref } from "@/lib/reading"
import type { Post } from "@/types/post"

export function RecentPosts({ currentId }: { currentId: number }) {
  const [state, setState] = useState<{ currentId: number; posts: Post[] }>({ currentId, posts: [] })

  useEffect(() => {
    let cancelled = false
    async function load() {
      let visits
      try {
        visits = recordReadingVisit(localStorage, currentId)
        window.dispatchEvent(new Event("docs-reading-change"))
      } catch {
        return
      }
      // Validate against current public records, never render stale stored titles/URLs.
      const posts = await Promise.all(visits.slice(0, 10).map(v => getPost(String(v.id))))
      if (!cancelled) setState({ currentId, posts: posts.filter((p): p is Post => p !== null && p.status === "PUBLISHED" && p.id !== currentId).slice(0, 5) })
    }
    void load()
    return () => { cancelled = true }
  }, [currentId])

  if (state.currentId !== currentId || !state.posts.length) return null
  return (
    <section aria-labelledby="recent-posts-heading" className="reading-section">
      <h2 id="recent-posts-heading">Bài viết vừa đọc</h2>
      <ul className="space-y-3">
        {state.posts.map(post => <li key={post.id}><Link className="reading-link" href={postHref(post)}>{displayPostTitle(post)}</Link></li>)}
      </ul>
    </section>
  )
}
