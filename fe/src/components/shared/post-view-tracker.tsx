"use client"

import { useEffect, useRef } from "react"

/** Count an opened document once per mount, including React Strict Mode. */
export function PostViewTracker({ postId }: { postId: number }) {
  const recordedId = useRef<number | null>(null)

  useEffect(() => {
    const record = () => {
      if (document.visibilityState !== "visible" || recordedId.current === postId) return
      recordedId.current = postId
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api"
      void fetch(`${baseUrl.replace(/\/$/, "")}/posts/${postId}/view`, {
        method: "POST",
        keepalive: true,
        credentials: "omit",
      }).catch(() => {
        // Analytics must never prevent reading the document.
      })
    }

    record()
    document.addEventListener("visibilitychange", record)
    return () => document.removeEventListener("visibilitychange", record)
  }, [postId])

  return null
}
