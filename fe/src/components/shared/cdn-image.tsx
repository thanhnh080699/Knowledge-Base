"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import cdnLoader from "@/lib/cdn-loader"

interface CdnImageProps extends Omit<ImageProps, "loader"> {
  useCdnLoader?: boolean
}

export function CdnImage({ useCdnLoader = true, alt, src, ...props }: CdnImageProps) {
  const [error, setError] = useState(false)

  // If the src is an absolute external URL not belonging to CDN, disable custom loader to prevent CORS/format errors
  const isCdnOrRelative =
    typeof src === "string" &&
    (!src.startsWith("http") || src.includes("thanhnh.id.vn") || src.includes("/medias/"))

  const shouldLoadWithCdn = useCdnLoader && isCdnOrRelative

  if (error || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-strong)] text-[var(--color-muted)] text-xs font-medium p-2 text-center">
        <span>{alt || "Tài liệu"}</span>
      </div>
    )
  }

  return (
    <Image
      loader={shouldLoadWithCdn ? cdnLoader : undefined}
      src={src}
      alt={alt ?? ""}
      onError={() => setError(true)}
      {...props}
    />
  )
}
