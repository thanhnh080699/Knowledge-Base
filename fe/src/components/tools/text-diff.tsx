"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, RotateCcw } from "lucide-react"

type DiffLine = {
  type: "added" | "removed" | "unchanged"
  content: string
  oldLineNumber?: number
  newLineNumber?: number
}

function computeLineDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split("\n")
  const newLines = newText.split("\n")
  const diffs: DiffLine[] = []

  let oldIdx = 0
  let newIdx = 0

  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (oldIdx < oldLines.length && newIdx < newLines.length && oldLines[oldIdx] === newLines[newIdx]) {
      diffs.push({
        type: "unchanged",
        content: oldLines[oldIdx],
        oldLineNumber: oldIdx + 1,
        newLineNumber: newIdx + 1,
      })
      oldIdx++
      newIdx++
    } else {
      // Look ahead to find matches
      let foundOldInNew = -1
      for (let j = newIdx; j < Math.min(newLines.length, newIdx + 5); j++) {
        if (oldIdx < oldLines.length && oldLines[oldIdx] === newLines[j]) {
          foundOldInNew = j
          break
        }
      }

      if (foundOldInNew !== -1) {
        // Elements in new were added
        while (newIdx < foundOldInNew) {
          diffs.push({
            type: "added",
            content: newLines[newIdx],
            newLineNumber: newIdx + 1,
          })
          newIdx++
        }
      } else if (oldIdx < oldLines.length) {
        diffs.push({
          type: "removed",
          content: oldLines[oldIdx],
          oldLineNumber: oldIdx + 1,
        })
        oldIdx++
      } else if (newIdx < newLines.length) {
        diffs.push({
          type: "added",
          content: newLines[newIdx],
          newLineNumber: newIdx + 1,
        })
        newIdx++
      }
    }
  }

  return diffs
}

export function TextDiff() {
  const [oldText, setOldText] = useState(
    "The quick brown fox jumps over the lazy dog.\nWeb developers love clean code and fast applications.\nEvery day is an opportunity to learn something new.\nHave a great coding day!"
  )

  const [newText, setNewText] = useState(
    "The quick brown fox jumps over the lazy dog.\nFull-stack engineers craft scalable applications.\nEvery day is an opportunity to build something new.\nHave a wonderful day!"
  )

  const diffLines = useMemo(() => {
    return computeLineDiff(oldText, newText)
  }, [oldText, newText])

  const stats = useMemo(() => {
    return {
      added: diffLines.filter((l) => l.type === "added").length,
      removed: diffLines.filter((l) => l.type === "removed").length,
      unchanged: diffLines.filter((l) => l.type === "unchanged").length,
    }
  }, [diffLines])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Text Diff Checker</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Compare two blocks of plain text or code line-by-line to inspect additions and deletions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setOldText("version: 1\nmode: staging\ncache: false\n")
              setNewText("version: 2\nmode: production\ncache: true\nssl: required\n")
            }}
            variant="outline"
            size="sm"
          >
            <Sparkles size={14} />
            Sample
          </Button>
          <Button
            onClick={() => {
              setOldText("")
              setNewText("")
            }}
            variant="ghost"
            size="sm"
          >
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      {/* Input texts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Original Text
          </label>
          <textarea
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            rows={8}
            placeholder="Paste original text..."
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Changed / Modified Text
          </label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={8}
            placeholder="Paste modified text..."
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Diff Output */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Diff Output:
          </span>
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold">
            +{stats.added} Added
          </span>
          <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-semibold">
            -{stats.removed} Removed
          </span>
        </div>

        <div className="rounded-2xl border border-[var(--color-hairline)] bg-white overflow-hidden shadow-xs font-mono text-xs divide-y divide-slate-100">
          {diffLines.map((line, idx) => (
            <div
              key={idx}
              className={`flex items-start px-3 py-1.5 leading-relaxed ${
                line.type === "added"
                  ? "bg-emerald-50 text-emerald-900 font-medium"
                  : line.type === "removed"
                  ? "bg-rose-50 text-rose-900 line-through"
                  : "text-slate-700"
              }`}
            >
              <span className="w-8 select-none text-[10px] text-slate-400 font-mono text-right pr-2">
                {line.oldLineNumber || ""}
              </span>
              <span className="w-8 select-none text-[10px] text-slate-400 font-mono text-right pr-3">
                {line.newLineNumber || ""}
              </span>
              <span className="w-5 select-none font-bold">
                {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
              </span>
              <span className="flex-1 whitespace-pre-wrap break-all">
                {line.content || " "}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
