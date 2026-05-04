"use client"

import Image, { type ImageProps } from "next/image"
import cdnLoader from "@/lib/cdn-loader"

interface CdnImageProps extends Omit<ImageProps, "loader"> {
  useCdnLoader?: boolean
}

export function CdnImage({ useCdnLoader = true, ...props }: CdnImageProps) {
  return (
    <Image
      loader={useCdnLoader ? cdnLoader : undefined}
      {...props}
    />
  )
}
