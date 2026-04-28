import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { fallbackPosts } from "@/lib/fallback-data"
import { getPost } from "@/lib/api"

type Params = { category: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params
  const post = (await getPost(category)) ?? fallbackPosts.find((item) => item.slug === category)

  return {
    title: post?.title ?? "Tài liệu",
    description: post?.excerpt ?? "Tài liệu kỹ thuật trên thanhnh.id.vn"
  }
}

export default async function LegacyDocRedirectPage({ params }: { params: Promise<Params> }) {
  const { category } = await params
  const post = (await getPost(category)) ?? fallbackPosts.find((item) => item.slug === category)

  if (!post) notFound()

  redirect(`/docs/${post.category?.slug ?? "general"}/${post.slug}`)
}
