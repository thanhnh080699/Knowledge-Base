"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { RefreshCw, Monitor, Globe, Wifi, Clock } from "lucide-react"

export function DeviceInformation() {
  const [info, setInfo] = useState<any>(null)

  const measure = () => {
    if (typeof window === "undefined") return

    const nav = window.navigator as any
    const scr = window.screen

    const conn = nav.connection || nav.mozConnection || nav.webkitConnection

    setInfo({
      screen: [
        { label: "Screen Resolution", value: `${scr.width} × ${scr.height}` },
        { label: "Available Screen", value: `${scr.availWidth} × ${scr.availHeight}` },
        { label: "Device Pixel Ratio", value: `${window.devicePixelRatio}x (Retina/HiDPI)` },
        { label: "Color Depth", value: `${scr.colorDepth}-bit` },
        { label: "Orientation", value: scr.orientation ? scr.orientation.type : "Landscape/Portrait" },
      ],
      viewport: [
        { label: "Viewport Size", value: `${window.innerWidth} × ${window.innerHeight}` },
        { label: "Outer Window Size", value: `${window.outerWidth} × ${window.outerHeight}` },
        { label: "Aspect Ratio", value: (window.innerWidth / window.innerHeight).toFixed(2) + ":1" },
        { label: "Touch Support", value: nav.maxTouchPoints > 0 ? `Yes (${nav.maxTouchPoints} points)` : "No" },
      ],
      system: [
        { label: "Platform", value: nav.userAgentData?.platform || nav.platform || "Unknown" },
        { label: "Language", value: nav.language || "Unknown" },
        { label: "Languages", value: (nav.languages || []).join(", ") },
        { label: "Cookies Enabled", value: nav.cookieEnabled ? "Yes" : "No" },
        { label: "Dark Mode Preference", value: window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light" },
        { label: "Do Not Track (DNT)", value: nav.doNotTrack === "1" ? "Enabled" : "Disabled" },
      ],
      networkAndTime: [
        { label: "Online Status", value: nav.onLine ? "Online (Connected)" : "Offline" },
        { label: "Connection Type", value: conn?.effectiveType ? conn.effectiveType.toUpperCase() : "N/A" },
        { label: "Downlink Speed", value: conn?.downlink ? `${conn.downlink} Mbps` : "N/A" },
        { label: "Round Trip Time (RTT)", value: conn?.rtt ? `${conn.rtt} ms` : "N/A" },
        { label: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
        { label: "UTC Offset", value: `UTC ${-(new Date().getTimezoneOffset() / 60)}` },
      ],
    })
  }

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Device &amp; Browser Information</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Real-time measurement of screen dimensions, device pixel ratio, network diagnostics, and browser capabilities.
          </p>
        </div>
        <Button onClick={measure} variant="outline" size="sm">
          <RefreshCw size={14} />
          Refresh Info
        </Button>
      </div>

      {info && (
        <div className="space-y-6">
          {/* Screen Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--color-ink)]">
              <Monitor size={17} className="text-[var(--color-brand)]" />
              <span>Screen &amp; Display</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {info.screen.map((item: any) => (
                <div key={item.label} className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs">
                  <span className="text-[11px] font-medium text-[var(--color-muted)] block mb-1">{item.label}</span>
                  <span className="font-mono text-sm font-semibold text-[var(--color-ink)] block pr-7">{item.value}</span>
                  <CopyButton text={item.value} />
                </div>
              ))}
            </div>
          </div>

          {/* Viewport Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--color-ink)]">
              <Monitor size={17} className="text-[var(--color-brand)]" />
              <span>Browser Viewport</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {info.viewport.map((item: any) => (
                <div key={item.label} className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs">
                  <span className="text-[11px] font-medium text-[var(--color-muted)] block mb-1">{item.label}</span>
                  <span className="font-mono text-sm font-semibold text-[var(--color-ink)] block pr-7">{item.value}</span>
                  <CopyButton text={item.value} />
                </div>
              ))}
            </div>
          </div>

          {/* System & Capabilities */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--color-ink)]">
              <Globe size={17} className="text-[var(--color-brand)]" />
              <span>System &amp; Environment</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {info.system.map((item: any) => (
                <div key={item.label} className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs">
                  <span className="text-[11px] font-medium text-[var(--color-muted)] block mb-1">{item.label}</span>
                  <span className="font-mono text-sm font-semibold text-[var(--color-ink)] block pr-7">{item.value}</span>
                  <CopyButton text={item.value} />
                </div>
              ))}
            </div>
          </div>

          {/* Network & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm text-[var(--color-ink)]">
              <Wifi size={17} className="text-[var(--color-brand)]" />
              <span>Network &amp; Timezone</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {info.networkAndTime.map((item: any) => (
                <div key={item.label} className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs">
                  <span className="text-[11px] font-medium text-[var(--color-muted)] block mb-1">{item.label}</span>
                  <span className="font-mono text-sm font-semibold text-[var(--color-ink)] block pr-7">{item.value}</span>
                  <CopyButton text={item.value} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
