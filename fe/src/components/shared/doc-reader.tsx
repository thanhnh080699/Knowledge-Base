"use client"

import { useState, type ReactNode } from "react"
import { DocActions } from "./doc-actions"
import type { TocItem } from "./table-of-contents"

interface DocReaderProps {
  children: ReactNode
  toc: TocItem[]
}

export function DocReader({ children, toc }: DocReaderProps) {
  const [fontSize, setFontSize] = useState(16)

  return (
    <>
      <div className="min-w-0" style={{ fontSize: `${fontSize}px` }}>
        {children}
      </div>
      <DocActions items={toc} fontSize={fontSize} setFontSize={setFontSize} />
    </>
  )
}
