"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Download, Sparkles, RotateCcw } from "lucide-react"

function ipToLong(ip: string): number {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  )
}

function longToIp(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join(".")
}

export function Ipv4RangeExpander() {
  const [inputVal, setInputVal] = useState("192.168.1.0/28")
  const [includeNetBroad, setIncludeNetBroad] = useState(true)

  const result = useMemo(() => {
    const raw = inputVal.trim()
    if (!raw) return { error: "Please enter a CIDR notation or IP range", ips: [] }

    let startLong: number | null = null
    let endLong: number | null = null

    // 1. CIDR notation: 192.168.1.0/28
    if (raw.includes("/")) {
      const [ipPart, cidrPart] = raw.split("/")
      const cidr = parseInt(cidrPart, 10)
      if (isNaN(cidr) || cidr < 0 || cidr > 32) {
        return { error: "Invalid CIDR prefix (0-32)", ips: [] }
      }

      const octets = ipPart.trim().split(".")
      if (octets.length !== 4 || !octets.every((o) => !isNaN(Number(o)) && Number(o) >= 0 && Number(o) <= 255)) {
        return { error: "Invalid IP address in CIDR", ips: [] }
      }

      const ipLong = ipToLong(ipPart.trim())
      const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
      const net = (ipLong & mask) >>> 0
      const broad = (net | (~mask >>> 0)) >>> 0

      startLong = includeNetBroad || cidr >= 31 ? net : net + 1
      endLong = includeNetBroad || cidr >= 31 ? broad : broad - 1
    }
    // 2. IP Range: 192.168.1.1 - 192.168.1.10
    else if (raw.includes("-")) {
      const [startIp, endIp] = raw.split("-").map((s) => s.trim())
      const startParts = startIp.split(".")
      const endParts = endIp.split(".")

      if (
        startParts.length !== 4 ||
        endParts.length !== 4 ||
        !startParts.every((o) => Number(o) >= 0 && Number(o) <= 255) ||
        !endParts.every((o) => Number(o) >= 0 && Number(o) <= 255)
      ) {
        return { error: "Invalid IP range format (e.g. 192.168.1.1 - 192.168.1.10)", ips: [] }
      }

      startLong = ipToLong(startIp)
      endLong = ipToLong(endIp)
      if (startLong > endLong) {
        return { error: "Start IP must be less than or equal to End IP", ips: [] }
      }
    } else {
      return { error: "Format not recognized. Use CIDR (192.168.1.0/28) or Range (192.168.1.1 - 192.168.1.10)", ips: [] }
    }

    if (startLong === null || endLong === null) {
      return { error: "Could not parse IP range", ips: [] }
    }

    const count = endLong - startLong + 1
    if (count > 65536) {
      return {
        error: `Range contains ${count.toLocaleString()} addresses. Maximum expansion limit is 65,536 IPs to prevent browser freezing.`,
        ips: [],
      }
    }

    const ips: string[] = []
    for (let i = startLong; i <= endLong; i++) {
      ips.push(longToIp(i))
    }

    return { error: null, ips }
  }, [inputVal, includeNetBroad])

  const outputText = result.ips.join("\n")

  const downloadTxt = () => {
    if (!outputText) return
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `expanded-ips-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">IPv4 Range Expander</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Expand CIDR subnet blocks or IP ranges into an exhaustive, line-by-line list of individual IP addresses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setInputVal("10.0.0.0/27")} variant="outline" size="sm">
            <Sparkles size={14} />
            Sample /27
          </Button>
          <Button onClick={() => setInputVal("")} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 items-center">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            CIDR Block or IP Range
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="192.168.1.0/28 or 10.0.0.1 - 10.0.0.20"
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2.5 font-mono text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:items-end justify-center">
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--color-ink)] cursor-pointer">
            <input
              type="checkbox"
              checked={includeNetBroad}
              onChange={(e) => setIncludeNetBroad(e.target.checked)}
              className="rounded accent-[var(--color-brand)]"
            />
            Include Network and Broadcast IPs
          </label>
          <span className="text-[11px] text-[var(--color-muted)] mt-1">
            Total addresses: <strong className="font-mono text-[var(--color-ink)]">{result.ips.length.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {result.error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
          {result.error}
        </div>
      )}

      {result.ips.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Expanded List ({result.ips.length} IPs)
            </span>
            <div className="flex items-center gap-2">
              <Button onClick={downloadTxt} variant="outline" size="sm">
                <Download size={13} />
                Download .txt
              </Button>
            </div>
          </div>
          <div className="relative group">
            <textarea
              readOnly
              value={outputText}
              rows={14}
              className="w-full rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 font-mono text-xs text-[var(--color-ink)] focus:outline-none leading-relaxed"
            />
            <CopyButton text={outputText} />
          </div>
        </div>
      )}
    </div>
  )
}
