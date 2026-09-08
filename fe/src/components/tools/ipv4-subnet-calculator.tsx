"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Sparkles, RotateCcw } from "lucide-react"

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

function getIpClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "Class A"
  if (firstOctet === 127) return "Class A (Loopback)"
  if (firstOctet >= 128 && firstOctet <= 191) return "Class B"
  if (firstOctet >= 192 && firstOctet <= 223) return "Class C"
  if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)"
  if (firstOctet >= 240 && firstOctet <= 254) return "Class E (Experimental)"
  return "Unknown"
}

function getIpType(ipLong: number, firstOctet: number): string {
  // 10.0.0.0/8
  if (firstOctet === 10) return "Private (RFC 1918)"
  // 172.16.0.0/12
  if (firstOctet === 172) {
    const second = (ipLong >>> 16) & 255
    if (second >= 16 && second <= 31) return "Private (RFC 1918)"
  }
  // 192.168.0.0/16
  if (firstOctet === 192) {
    const second = (ipLong >>> 16) & 255
    if (second === 168) return "Private (RFC 1918)"
  }
  // 127.0.0.0/8
  if (firstOctet === 127) return "Loopback"
  // 169.254.0.0/16
  if (firstOctet === 169 && ((ipLong >>> 16) & 255) === 254) return "Link-Local (APIPA)"
  // 224.0.0.0/4
  if (firstOctet >= 224 && firstOctet <= 239) return "Multicast"
  return "Public IP"
}

export function Ipv4SubnetCalculator() {
  const [ip, setIp] = useState("192.168.1.1")
  const [cidr, setCidr] = useState(24)

  const subnetInfo = useMemo(() => {
    const parts = ip.trim().split(".")
    if (parts.length !== 4) return null
    for (const part of parts) {
      const n = Number(part)
      if (isNaN(n) || n < 0 || n > 255 || part.trim() === "") return null
    }

    const ipLong = ipToLong(ip)
    const maskLong = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
    const wildcardLong = ~maskLong >>> 0
    const networkLong = (ipLong & maskLong) >>> 0
    const broadcastLong = (networkLong | wildcardLong) >>> 0

    const totalHosts = Math.pow(2, 32 - cidr)
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2)

    const firstUsableLong = cidr >= 31 ? networkLong : networkLong + 1
    const lastUsableLong = cidr >= 31 ? broadcastLong : broadcastLong - 1

    const firstOctet = parseInt(parts[0], 10)
    const ipClass = getIpClass(firstOctet)
    const ipType = getIpType(ipLong, firstOctet)

    const binaryMask = longToIp(maskLong)
      .split(".")
      .map((octet) => parseInt(octet, 10).toString(2).padStart(8, "0"))
      .join(".")

    return {
      network: longToIp(networkLong),
      broadcast: longToIp(broadcastLong),
      subnetMask: longToIp(maskLong),
      wildcard: longToIp(wildcardLong),
      firstUsable: longToIp(firstUsableLong),
      lastUsable: longToIp(lastUsableLong),
      totalHosts: totalHosts.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
      ipClass,
      ipType,
      binaryMask,
      cidrNotation: `${longToIp(networkLong)}/${cidr}`,
    }
  }, [ip, cidr])

  const handleSample = () => {
    setIp("10.50.12.34")
    setCidr(22)
  }

  const handleReset = () => {
    setIp("192.168.1.1")
    setCidr(24)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">IPv4 Subnet Calculator</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Calculate network, broadcast, wildcard mask, usable IP host ranges, and address classification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSample} variant="outline" size="sm">
            <Sparkles size={14} />
            Class A Sample
          </Button>
          <Button onClick={handleReset} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Reset
          </Button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
            IP Address
          </label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.1"
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2.5 font-mono text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              CIDR Prefix: <span className="font-mono text-[var(--color-brand)] font-bold">/{cidr}</span>
            </label>
            <span className="font-mono text-xs text-[var(--color-muted)]">
              {subnetInfo?.subnetMask || "255.255.255.0"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={32}
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full accent-[var(--color-brand)] cursor-pointer mt-2"
          />
          <div className="flex justify-between text-[10px] font-mono text-[var(--color-muted)] mt-1">
            <span>/0 (0.0.0.0)</span>
            <span>/16</span>
            <span>/24</span>
            <span>/32 (Host)</span>
          </div>
        </div>
      </div>

      {/* Results */}
      {subnetInfo ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "CIDR Route", value: subnetInfo.cidrNotation, highlight: true },
            { label: "Subnet Mask", value: subnetInfo.subnetMask },
            { label: "Wildcard Mask", value: subnetInfo.wildcard },
            { label: "Network Address", value: subnetInfo.network },
            { label: "Broadcast Address", value: subnetInfo.broadcast },
            { label: "Usable Host Range", value: `${subnetInfo.firstUsable} - ${subnetInfo.lastUsable}` },
            { label: "Usable Hosts", value: subnetInfo.usableHosts },
            { label: "Total Addresses", value: subnetInfo.totalHosts },
            { label: "Address Classification", value: `${subnetInfo.ipClass} • ${subnetInfo.ipType}` },
          ].map((item) => (
            <div
              key={item.label}
              className={`relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs transition-all ${
                item.highlight ? "border-[var(--color-brand)]/40 bg-[var(--color-surface-soft)]" : ""
              }`}
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

          <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3.5 font-mono text-xs">
            <span className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wider block mb-1">
              Binary Subnet Mask
            </span>
            <span className="text-[var(--color-ink)] break-all">{subnetInfo.binaryMask}</span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
          Invalid IPv4 Address. Please enter a valid address (e.g. 192.168.1.1).
        </div>
      )}
    </div>
  )
}
