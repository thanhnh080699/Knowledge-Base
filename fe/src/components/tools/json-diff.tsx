"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, RotateCcw } from "lucide-react"

type DiffItem = {
  path: string
  type: "added" | "removed" | "modified" | "unchanged"
  oldValue?: any
  newValue?: any
}

function compareObjects(obj1: any, obj2: any, path = ""): DiffItem[] {
  const diffs: DiffItem[] = []

  if (obj1 === obj2) {
    return diffs
  }

  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    diffs.push({
      path: path || "root",
      type: "modified",
      oldValue: obj1,
      newValue: obj2,
    })
    return diffs
  }

  const allKeys = Array.from(new Set([...Object.keys(obj1), ...Object.keys(obj2)]))

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key
    const has1 = key in obj1
    const has2 = key in obj2

    if (has1 && !has2) {
      diffs.push({
        path: currentPath,
        type: "removed",
        oldValue: obj1[key],
      })
    } else if (!has1 && has2) {
      diffs.push({
        path: currentPath,
        type: "added",
        newValue: obj2[key],
      })
    } else {
      const v1 = obj1[key]
      const v2 = obj2[key]

      if (typeof v1 === "object" && v1 !== null && typeof v2 === "object" && v2 !== null) {
        diffs.push(...compareObjects(v1, v2, currentPath))
      } else if (v1 !== v2) {
        diffs.push({
          path: currentPath,
          type: "modified",
          oldValue: v1,
          newValue: v2,
        })
      }
    }
  }

  return diffs
}

export function JsonDiff() {
  const [json1, setJson1] = useState(
    JSON.stringify(
      {
        name: "thanhnh-service",
        version: "1.0.0",
        port: 8080,
        features: ["auth", "database"],
        settings: { debug: false, timeout: 30 },
      },
      null,
      2
    )
  )

  const [json2, setJson2] = useState(
    JSON.stringify(
      {
        name: "thanhnh-service",
        version: "1.1.0",
        port: 8443,
        features: ["auth", "database", "redis"],
        settings: { debug: true, timeout: 30, retries: 3 },
      },
      null,
      2
    )
  )

  const diffResult = useMemo(() => {
    let parsed1: any
    let parsed2: any

    try {
      parsed1 = JSON.parse(json1)
    } catch {
      return { error: "Left JSON is invalid syntax", diffs: [], counts: { added: 0, removed: 0, modified: 0 } }
    }

    try {
      parsed2 = JSON.parse(json2)
    } catch {
      return { error: "Right JSON is invalid syntax", diffs: [], counts: { added: 0, removed: 0, modified: 0 } }
    }

    const diffs = compareObjects(parsed1, parsed2)
    const counts = {
      added: diffs.filter((d) => d.type === "added").length,
      removed: diffs.filter((d) => d.type === "removed").length,
      modified: diffs.filter((d) => d.type === "modified").length,
    }

    return { error: null, diffs, counts }
  }, [json1, json2])

  const formatSide = (side: 1 | 2) => {
    try {
      if (side === 1) {
        setJson1(JSON.stringify(JSON.parse(json1), null, 2))
      } else {
        setJson2(JSON.stringify(JSON.parse(json2), null, 2))
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">JSON Diff Viewer</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Compare two JSON objects side-by-side to highlight added, removed, and modified attributes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setJson1(JSON.stringify({ status: "active", count: 10 }, null, 2))
              setJson2(JSON.stringify({ status: "inactive", count: 15, tag: "new" }, null, 2))
            }}
            variant="outline"
            size="sm"
          >
            <Sparkles size={14} />
            Sample
          </Button>
          <Button
            onClick={() => {
              setJson1("")
              setJson2("")
            }}
            variant="ghost"
            size="sm"
          >
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      {/* Inputs Side-by-Side */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Original JSON (Left)
            </label>
            <button
              onClick={() => formatSide(1)}
              className="text-[11px] text-[var(--color-brand)] hover:underline cursor-pointer"
            >
              Prettify
            </button>
          </div>
          <textarea
            value={json1}
            onChange={(e) => setJson1(e.target.value)}
            rows={10}
            placeholder='{"key": "value"}'
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Modified JSON (Right)
            </label>
            <button
              onClick={() => formatSide(2)}
              className="text-[11px] text-[var(--color-brand)] hover:underline cursor-pointer"
            >
              Prettify
            </button>
          </div>
          <textarea
            value={json2}
            onChange={(e) => setJson2(e.target.value)}
            rows={10}
            placeholder='{"key": "value"}'
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Difference Results */}
      {diffResult.error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
          {diffResult.error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Summary:
            </span>
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold">
              +{diffResult.counts.added} Added
            </span>
            <span className="rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-semibold">
              -{diffResult.counts.removed} Removed
            </span>
            <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-semibold">
              ~{diffResult.counts.modified} Modified
            </span>
          </div>

          {diffResult.diffs.length === 0 ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-xs font-medium text-emerald-800">
              ✓ Both JSON payloads are identical. No differences found!
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-hairline)] bg-white overflow-hidden shadow-xs divide-y divide-[var(--color-hairline)]">
              {diffResult.diffs.map((d, idx) => (
                <div key={idx} className="p-3 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.type === "added"
                          ? "bg-emerald-100 text-emerald-800"
                          : d.type === "removed"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {d.type}
                    </span>
                    <strong className="text-[var(--color-ink)]">{d.path}</strong>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    {d.type === "modified" && (
                      <>
                        <span className="text-rose-600 line-through bg-rose-50 px-1.5 py-0.5 rounded">
                          {JSON.stringify(d.oldValue)}
                        </span>
                        <span>→</span>
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {JSON.stringify(d.newValue)}
                        </span>
                      </>
                    )}
                    {d.type === "added" && (
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        {JSON.stringify(d.newValue)}
                      </span>
                    )}
                    {d.type === "removed" && (
                      <span className="text-rose-600 line-through bg-rose-50 px-1.5 py-0.5 rounded">
                        {JSON.stringify(d.oldValue)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
