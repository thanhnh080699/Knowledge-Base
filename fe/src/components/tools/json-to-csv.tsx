"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Download, Sparkles, RotateCcw } from "lucide-react"

export function JsonToCsv() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(
      [
        { id: 1, name: "Nguyen Van A", role: "DevOps Engineer", location: "Hanoi" },
        { id: 2, name: "Tran Thi B", role: "Frontend Specialist", location: "Da Nang" },
        { id: 3, name: "Le Van C", role: "Backend Architect", location: "Ho Chi Minh City" },
      ],
      null,
      2
    )
  )
  const [delimiter, setDelimiter] = useState<"," | ";" | "\t">(",")
  const [quoteValues, setQuoteValues] = useState(true)

  const conversion = useMemo(() => {
    if (!jsonInput.trim()) return { csv: "", headers: [], rows: [], error: null }

    try {
      const parsed = JSON.parse(jsonInput)
      if (!Array.isArray(parsed)) {
        return { csv: "", headers: [], rows: [], error: "Input JSON must be an array of objects." }
      }

      if (parsed.length === 0) {
        return { csv: "", headers: [], rows: [], error: "Array is empty." }
      }

      // Collect all unique keys
      const headersSet = new Set<string>()
      parsed.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((k) => headersSet.add(k))
        }
      })
      const headers = Array.from(headersSet)

      const csvLines: string[] = []
      // Header line
      csvLines.push(
        headers
          .map((h) => (quoteValues ? `"${h.replace(/"/g, '""')}"` : h))
          .join(delimiter)
      )

      // Rows
      const rows: string[][] = []
      parsed.forEach((item) => {
        const row = headers.map((h) => {
          const val = item?.[h]
          if (val === undefined || val === null) return ""
          const str = typeof val === "object" ? JSON.stringify(val) : String(val)
          return quoteValues || str.includes(delimiter) || str.includes("\n")
            ? `"${str.replace(/"/g, '""')}"`
            : str
        })
        rows.push(row)
        csvLines.push(row.join(delimiter))
      })

      return { csv: csvLines.join("\n"), headers, rows, error: null }
    } catch (err) {
      return { csv: "", headers: [], rows: [], error: err instanceof Error ? err.message : "Invalid JSON" }
    }
  }, [jsonInput, delimiter, quoteValues])

  const downloadCsv = () => {
    if (!conversion.csv) return
    const blob = new Blob([conversion.csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `data-export-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSample = () => {
    setJsonInput(
      JSON.stringify(
        [
          { server: "web-01", ip: "192.168.1.10", os: "Ubuntu 24.04", status: "online" },
          { server: "db-master", ip: "192.168.1.20", os: "Debian 12", status: "online" },
          { server: "cache-01", ip: "192.168.1.30", os: "Alpine 3.20", status: "standby" },
        ],
        null,
        2
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">JSON to CSV Converter</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Convert arrays of JSON objects into formatted CSV, TSV, or spreadsheet-friendly text with live preview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSample} variant="outline" size="sm">
            <Sparkles size={14} />
            Sample Data
          </Button>
          <Button onClick={() => setJsonInput("")} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      {/* Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[var(--color-muted)]">Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as any)}
              className="rounded-lg border border-[var(--color-hairline)] bg-white px-2.5 py-1 text-xs text-[var(--color-ink)]"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="&#9;">Tab (\t / TSV)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink)] cursor-pointer">
            <input
              type="checkbox"
              checked={quoteValues}
              onChange={(e) => setQuoteValues(e.target.checked)}
              className="rounded accent-[var(--color-brand)]"
            />
            Quote all fields
          </label>
        </div>

        {conversion.csv && (
          <Button onClick={downloadCsv} variant="primary" size="sm">
            <Download size={14} />
            Download .csv
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: JSON Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Input JSON (Array of Objects)
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={14}
            placeholder='[{"col1": "val1", "col2": "val2"}]'
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        {/* Right: CSV Output */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Generated CSV Text
          </label>
          <div className="relative group">
            <textarea
              readOnly
              value={conversion.csv}
              rows={14}
              placeholder="CSV will be generated here..."
              className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 pr-10 font-mono text-xs text-[var(--color-ink)] focus:outline-none leading-relaxed"
            />
            {conversion.csv && <CopyButton text={conversion.csv} />}
          </div>
        </div>
      </div>

      {conversion.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-mono">
          {conversion.error}
        </div>
      )}
    </div>
  )
}
