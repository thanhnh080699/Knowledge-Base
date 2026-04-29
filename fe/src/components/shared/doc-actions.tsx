"use client"

import { List, Printer, Share2 } from "lucide-react"
import type { TocItem } from "./table-of-contents"

interface DocActionsProps {
  items: TocItem[]
  fontSize: number
  setFontSize: (size: number) => void
}

export function DocActions({ items, fontSize, setFontSize }: DocActionsProps) {
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
    <aside className="hidden xl:block xl:sticky xl:top-24 space-y-8">
      {/* Share & Actions */}
      <div className="space-y-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100">
            <Share2 size={16} />
          </div>
          <span>Share this Doc</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="flex size-8 items-center justify-center rounded hover:bg-slate-100 text-sm font-medium"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(16)}
              className="flex size-8 items-center justify-center rounded hover:bg-slate-100 text-base font-medium border-x border-slate-100"
              aria-label="Reset font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="flex size-8 items-center justify-center rounded hover:bg-slate-100 text-lg font-medium"
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
            aria-label="Print document"
          >
            <Printer size={20} />
          </button>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
          <List size={14} />
          <span>CONTENTS</span>
        </div>
        <nav className="grid gap-2 border-l border-slate-100 pl-4" aria-label="Mục lục">
          {items.length ? (
            items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm text-slate-500 hover:text-blue-600 transition-colors line-clamp-2 ${
                  item.level === 3 ? "pl-4" : ""
                }`}
              >
                {item.text}
              </a>
            ))
          ) : (
            <span className="text-sm text-slate-400 italic">Chưa có đề mục</span>
          )}
        </nav>
      </div>

      {/* Suggestions for additional content */}
      <div className="pt-8 space-y-4 border-t border-slate-100">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-100">
          <p className="text-xs font-bold text-blue-800 uppercase tracking-tight">Mẹo hữu ích</p>
          <p className="mt-2 text-xs text-blue-600 leading-relaxed">
            Sử dụng phím <kbd className="rounded border border-blue-200 bg-white px-1">Ctrl</kbd> + <kbd className="rounded border border-blue-200 bg-white px-1">F</kbd> để tìm kiếm nhanh trong tài liệu.
          </p>
        </div>
      </div>
    </aside>
  )
}
