"use client"

import { useState, type ReactNode, type CSSProperties } from "react"
import { DocActions } from "./doc-actions"
import type { TocItem } from "./table-of-contents"

interface DocReaderProps {
  children: ReactNode
  toc: TocItem[]
  defaultFontSize?: number
}

export function DocReader({ children, toc, defaultFontSize = 16 }: DocReaderProps) {
  const [fontSize, setFontSize] = useState(defaultFontSize)

  return (
    <>
      <div className="min-w-0" style={{ fontSize: `${fontSize}px`, "--doc-font-size": `${fontSize}px` } as CSSProperties}>
        {!!toc.length && <details className="mb-4 rounded-xl border border-[var(--color-hairline)] bg-white p-4 xl:hidden">
          <summary className="cursor-pointer font-medium">Mục lục bài viết</summary>
          <nav aria-label="Mục lục bài viết" className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {toc.map(item => <a key={item.id} href={`#${item.id}`} className={`block break-words text-sm ${item.level === 3 ? "pl-4" : ""}`}>{item.text}</a>)}
          </nav>
        </details>}
        {children}
      </div>
      <DocActions items={toc} fontSize={fontSize} setFontSize={setFontSize} defaultFontSize={defaultFontSize} />
    </>
  )
}
