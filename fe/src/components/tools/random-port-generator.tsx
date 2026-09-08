"use client"

import { useState } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

const COMMON_PORTS = new Set([
  21, 22, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 1433, 1521, 2049,
  3000, 3306, 5000, 5432, 6379, 8000, 8080, 8443, 9000, 9200, 27017,
])

export function RandomPortGenerator() {
  const [rangeType, setRangeType] = useState<"ephemeral" | "registered" | "all" | "custom">("ephemeral")
  const [customMin, setCustomMin] = useState(3000)
  const [customMax, setCustomMax] = useState(9000)
  const [count, setCount] = useState(5)
  const [excludeCommon, setExcludeCommon] = useState(true)
  const [ports, setPorts] = useState<number[]>([])

  const generate = () => {
    let min = 49152
    let max = 65535

    if (rangeType === "registered") {
      min = 1024
      max = 49151
    } else if (rangeType === "all") {
      min = 1024
      max = 65535
    } else if (rangeType === "custom") {
      min = Math.max(1, Math.min(65535, customMin))
      max = Math.max(min, Math.min(65535, customMax))
    }

    const set = new Set<number>()
    let attempts = 0

    while (set.size < count && attempts < count * 50) {
      attempts++
      const port = Math.floor(Math.random() * (max - min + 1)) + min
      if (excludeCommon && COMMON_PORTS.has(port)) continue
      set.add(port)
    }

    setPorts(Array.from(set))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Random Port Generator</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Generate available random network ports within standard IANA ranges to avoid socket port conflicts.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Port Range Category
          </label>
          <select
            value={rangeType}
            onChange={(e) => setRangeType(e.target.value as any)}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value="ephemeral">Dynamic / Ephemeral (49152 - 65535)</option>
            <option value="registered">User / Registered (1024 - 49151)</option>
            <option value="all">All Non-Privileged (1024 - 65535)</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Count (1 - 20)
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
          />
        </div>

        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink)] cursor-pointer">
            <input
              type="checkbox"
              checked={excludeCommon}
              onChange={(e) => setExcludeCommon(e.target.checked)}
              className="rounded accent-[var(--color-brand)]"
            />
            Exclude well-known ports (80, 443, 3000...)
          </label>
        </div>

        {rangeType === "custom" && (
          <div className="sm:col-span-2 lg:col-span-3 grid gap-4 sm:grid-cols-2 pt-2 border-t border-[var(--color-hairline)]">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
                Min Port (1 - 65535)
              </label>
              <input
                type="number"
                min={1}
                max={65535}
                value={customMin}
                onChange={(e) => setCustomMin(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
                Max Port (1 - 65535)
              </label>
              <input
                type="number"
                min={1}
                max={65535}
                value={customMax}
                onChange={(e) => setCustomMax(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
              />
            </div>
          </div>
        )}
      </div>

      <Button onClick={generate} variant="primary" size="default">
        <Shuffle size={15} />
        Generate {count} Random Port{count > 1 ? "s" : ""}
      </Button>

      {ports.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Generated Ports
            </span>
            <span className="text-xs text-[var(--color-muted)] font-mono">
              List: {ports.join(", ")}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {ports.map((port) => (
              <div
                key={port}
                className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-muted)] tracking-wider block">
                    Port
                  </span>
                  <span className="font-mono text-xl font-bold text-[var(--color-ink)]">
                    {port}
                  </span>
                </div>
                <CopyButton text={port.toString()} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
