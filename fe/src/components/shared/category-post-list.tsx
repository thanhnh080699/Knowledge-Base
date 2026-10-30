"use client"

import { useState } from "react"
import { orderPosts, type ListingSort } from "@/lib/listing"
import { SortBar } from "./sort-bar"
import { PostCard } from "./post-card"
import type { Post } from "@/types/post"

export function CategoryPostList({ posts, defaultSort = "roadmap" }: { posts: Post[]; defaultSort?: ListingSort }) {
  const [sort, setSort] = useState<ListingSort>(defaultSort)
  return <div className="space-y-4">
    <SortBar value={sort} onChange={setSort} />
    <div className="docs-post-grid">{orderPosts(posts, sort).map(post => <PostCard key={post.id} post={post} />)}</div>
  </div>
}
