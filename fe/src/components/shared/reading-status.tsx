"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { parseReadingHistory, READING_HISTORY_KEY } from "@/lib/reading"
import { LAST_LISTING_KEY, safeListingUrl } from "@/lib/listing"

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener("docs-reading-change", callback)
  window.addEventListener("pageshow", callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener("docs-reading-change", callback)
    window.removeEventListener("pageshow", callback)
  }
}
function snapshot() {
  try { return localStorage.getItem(READING_HISTORY_KEY) ?? "[]" } catch { return "[]" }
}
export function useReadingVisits() {
  return parseReadingHistory(useSyncExternalStore(subscribe, snapshot, () => "[]"))
}
export function ReadingStatus({ id }: { id: number }) {
  const visits = useReadingVisits()
  if (visits[0]?.id !== id) return null
  return <span className="absolute right-3 top-3 z-10 whitespace-nowrap rounded-full border border-emerald-200 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-emerald-800 shadow-xs">Đã đọc</span>
}
export function ReturnToListing() {
  const href = useSyncExternalStore(subscribe, () => {
    try { return safeListingUrl(sessionStorage.getItem(LAST_LISTING_KEY) ?? localStorage.getItem(LAST_LISTING_KEY)) } catch { return null }
  }, () => null)
  return href ? <Link className="reading-link mb-4 inline-block" href={href}>← Quay lại danh sách đang xem</Link> : null
}
