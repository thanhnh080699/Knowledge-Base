"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { RotateCcw, Sparkles } from "lucide-react"

export function Ipv4AddressConverter() {
  const [inputVal, setInputVal] = useState("192.168.1.1")

  const converted = useMemo(() => {
    const raw = inputVal.trim()
    if (!raw) return null

    let longVal: number | null = null

    // 1. Try Dotted Decimal (e.g. 192.168.1.1)
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(raw)) {
      const octets = raw.split(".").map(Number)
      if (octets.every((o) => o >= 0 && o <= 255)) {
        longVal = ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0
      }
    }
    // 2. Try Hex (0x... or 8 hex digits)
    else if (/^(0x)?[0-9a-fA-F]{8}$/.test(raw)) {
      longVal = parseInt(raw.replace(/^0x/i, ""), 16) >>> 0
    }
    // 3. Try Binary (32 bits with or without dots)
    else if (/^[01]{8}(\.[01]{8}){3}$/.test(raw) || /^[01]{32}$/.test(raw)) {
      longVal = parseInt(raw.replace(/\./g, ""), 2) >>> 0
    }
    // 4. Try Integer / Decimal (up to 4294967295)
    else if (/^\d+$/.test(raw)) {
      const num = Number(raw)
      if (num >= 0 && num <= 4294967295) {
        longVal = num >>> 0
      }
    }

    if (longVal === null) return null

    const o1 = (longVal >>> 24) & 255
    const o2 = (longVal >>> 16) & 255
    const o3 = (longVal >>> 8) & 255
    const o4 = longVal & 255

    const dottedDecimal = `${o1}.${o2}.${o3}.${o4}`
    const hex = "0x" + longVal.toString(16).toUpperCase().padStart(8, "0")
    const hexDotted = [o1, o2, o3, o4].map((o) => "0x" + o.toString(16).padStart(2, "0")).join(".")
    const binary = [o1, o2, o3, o4].map((o) => o.toString(2).padStart(8, "0")).join(".")
    const binaryRaw = [o1, o2, o3, o4].map((o) => o.toString(2).padStart(8, "0")).join("")
    const integer = longVal.toString(10)
    const octal = "0" + longVal.toString(8)
    const octalDotted = [o1, o2, o3, o4].map((o) => "0" + o.toString(8).padStart(3, "0")).join(".")
    const ipv6Mapped = `::ffff:${dottedDecimal}`

    return [
      { label: "Dotted Decimal", value: dottedDecimal },
      { label: "Integer / Decimal (32-bit)", value: integer },
      { label: "Hexadecimal", value: hex },
      { label: "Hexadecimal (Dotted)", value: hexDotted },
      { label: "Binary (Dotted)", value: binary },
      { label: "Binary (32-bit Raw)", value: binaryRaw },
      { label: "Octal", value: octal },
      { label: "Octal (Dotted)", value: octalDotted },
      { label: "IPv6 Mapped", value: ipv6Mapped },
    ]
  }, [inputVal])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">IPv4 Address Converter</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Convert IPv4 addresses between Dotted Decimal, Integer, Hex, Binary, Octal, and IPv6 mapped notation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setInputVal("8.8.8.8")} variant="outline" size="sm">
            <Sparkles size={14} />
            8.8.8.8
          </Button>
          <Button onClick={() => setInputVal("")} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
          Input IP Address (Dotted, Decimal, Hex, or Binary)
        </label>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="192.168.1.1 or 3232235777 or 0xC0A80101"
          className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2.5 font-mono text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none"
        />
      </div>

      {converted ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {converted.map((item) => (
            <div
              key={item.label}
              className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs"
            >
              <span className="text-[11px] font-medium text-[var(--color-muted)] block mb-1">
                {item.label}
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--color-ink)] break-all pr-7 block">
                {item.value}
              </span>
              <CopyButton text={item.value} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
          Enter a valid IPv4 address in standard dotted format (e.g. 10.0.0.1), 32-bit integer, hex or binary.
        </div>
      )}
    </div>
  )
}
