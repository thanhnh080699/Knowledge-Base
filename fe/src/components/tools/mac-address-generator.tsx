"use client"

import { useState } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"

export function MacAddressGenerator() {
  const [count, setCount] = useState(5)
  const [casing, setCasing] = useState<"upper" | "lower">("upper")
  const [delimiter, setDelimiter] = useState<":" | "-" | "." | "none">(":")
  const [prefix, setPrefix] = useState("")
  const [type, setType] = useState<"unicast" | "multicast">("unicast")
  const [admin, setAdmin] = useState<"local" | "universal">("local")
  const [generatedMacs, setGeneratedMacs] = useState<string[]>([])

  const generate = () => {
    const list: string[] = []
    const cleanPrefix = prefix.replace(/[^a-fA-F0-9]/g, "")

    for (let i = 0; i < count; i++) {
      const bytes: number[] = []

      // 1st byte: handle Unicast/Multicast and Local/Universal flags
      let b0 = Math.floor(Math.random() * 256)
      if (type === "unicast") {
        b0 &= ~1 // bit 0 = 0
      } else {
        b0 |= 1 // bit 0 = 1
      }

      if (admin === "local") {
        b0 |= 2 // bit 1 = 1 (LAA)
      } else {
        b0 &= ~2 // bit 1 = 0 (UAA)
      }

      bytes.push(b0)
      for (let j = 1; j < 6; j++) {
        bytes.push(Math.floor(Math.random() * 256))
      }

      let hexRaw = bytes.map((b) => b.toString(16).padStart(2, "0")).join("")

      // If custom prefix is provided
      if (cleanPrefix.length > 0) {
        const prefixPadded = cleanPrefix.padEnd(12, hexRaw.slice(cleanPrefix.length)).slice(0, 12)
        hexRaw = prefixPadded
      }

      if (casing === "upper") hexRaw = hexRaw.toUpperCase()
      else hexRaw = hexRaw.toLowerCase()

      let formatted = ""
      if (delimiter === ":") {
        formatted = (hexRaw.match(/.{1,2}/g) || []).join(":")
      } else if (delimiter === "-") {
        formatted = (hexRaw.match(/.{1,2}/g) || []).join("-")
      } else if (delimiter === ".") {
        formatted = (hexRaw.match(/.{1,4}/g) || []).join(".")
      } else {
        formatted = hexRaw
      }

      list.push(formatted)
    }

    setGeneratedMacs(list)
  }

  const allText = generatedMacs.join("\n")

  const downloadFile = () => {
    if (!allText) return
    const blob = new Blob([allText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mac-addresses-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">MAC Address Generator</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Generate random valid MAC addresses with custom delimiters, case, unicast/multicast flags, and vendor prefixes.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Count (1 - 50)
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Delimiter
          </label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as ":" | "-" | "." | "none")}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value=":">Colon (00:1A:2B:3C:4D:5E)</option>
            <option value="-">Hyphen (00-1A-2B-3C-4D-5E)</option>
            <option value=".">Dot / Cisco (001a.2b3c.4d5e)</option>
            <option value="none">None (001A2B3C4D5E)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Case
          </label>
          <select
            value={casing}
            onChange={(e) => setCasing(e.target.value as "upper" | "lower")}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Transmission
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "unicast" | "multicast")}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value="unicast">Unicast (Normal Device)</option>
            <option value="multicast">Multicast</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Administration
          </label>
          <select
            value={admin}
            onChange={(e) => setAdmin(e.target.value as "local" | "universal")}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value="local">Locally Administered (LAA / Virtual)</option>
            <option value="universal">Universally Administered (UAA)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            Custom Prefix (Optional OUI)
          </label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g. 00:1A:2B or DC:A6"
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2 font-mono text-sm text-[var(--color-ink)]"
          />
        </div>
      </div>

      <Button onClick={generate} variant="primary" size="default">
        <RefreshCw size={15} />
        Generate {count} MAC Address{count > 1 ? "es" : ""}
      </Button>

      {generatedMacs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Generated Addresses ({generatedMacs.length})
            </span>
            <Button onClick={downloadFile} variant="outline" size="sm">
              <Download size={13} />
              Download List
            </Button>
          </div>

          <div className="relative group">
            <textarea
              readOnly
              value={allText}
              rows={Math.min(15, Math.max(4, generatedMacs.length + 1))}
              className="w-full rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 font-mono text-sm text-[var(--color-ink)] focus:outline-none leading-relaxed"
            />
            <CopyButton text={allText} />
          </div>
        </div>
      )}
    </div>
  )
}
