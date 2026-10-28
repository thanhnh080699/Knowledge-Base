"use client"

import { List, Printer, Share2 } from "lucide-react"
import type { TocItem } from "./table-of-contents"

interface DocActionsProps {
  items: TocItem[]
  defaultFontSize?: number
  fontSize: number
  setFontSize: (size: number) => void
}

export function DocActions({ items, fontSize, setFontSize, defaultFontSize = 16 }: DocActionsProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert("Đã sao chép liên kết vào bộ nhớ tạm!")
    }
  }

  return (
    <aside className="hidden min-w-0 gap-6 xl:sticky xl:top-24 xl:flex xl:max-h-[calc(100dvh-7rem)] xl:flex-col xl:self-start">
      {/* Share & Actions */}
      <div className="shrink-0 space-y-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 font-medium text-[var(--color-ink)] transition-colors"
        >
          <div className="kb-icon size-8">
            <Share2 size={16} />
          </div>
          <span>Share this Doc</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-full border border-[var(--color-hairline)] bg-white p-1">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="flex size-8 items-center justify-center rounded-full text-sm font-medium hover:bg-[var(--color-surface-strong)]"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(defaultFontSize)}
              className="flex size-8 items-center justify-center border-x border-[var(--color-hairline)] text-base font-medium hover:bg-[var(--color-surface-strong)]"
              aria-label="Reset font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="flex size-8 items-center justify-center rounded-full text-lg font-medium hover:bg-[var(--color-surface-strong)]"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--color-hairline)] bg-white text-[var(--color-muted)] transition-all hover:border-[var(--color-hairline-strong)] hover:text-[var(--color-ink)]"
            aria-label="Print document"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="flex min-h-0 flex-col gap-3">
        <div className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
          <List size={14} />
          <span>CONTENTS</span>
        </div>
        <nav className="flex min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain border-l border-[var(--color-hairline)] pl-4 pr-2" aria-label="Mục lục" tabIndex={0}>
          {items.length ? (
            items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                title={item.text}
                className={`block shrink-0 truncate text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] ${
                  item.level === 3 ? "pl-4" : ""
                }`}
              >
                {item.text}
              </a>
            ))
          ) : (
            <span className="text-sm italic text-[var(--color-muted)]">Chưa có đề mục</span>
          )}
        </nav>
      </div>

      {/* Suggestions for additional content */}
      <div className="shrink-0 space-y-4 border-t border-[var(--color-hairline)] pt-8">
        <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)]">Mẹo hữu ích</p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-body)]">
            Sử dụng phím <kbd className="rounded border border-[var(--color-hairline)] bg-white px-1">Ctrl</kbd> + <kbd className="rounded border border-[var(--color-hairline)] bg-white px-1">F</kbd> để tìm kiếm nhanh trong tài liệu.
          </p>
        </div>
      </div>
    </aside>
  )
}
