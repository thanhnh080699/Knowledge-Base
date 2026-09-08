"use client"

import { useState, useEffect, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Laptop, Smartphone, Bot, RotateCcw } from "lucide-react"

export function UserAgentParser() {
  const [uaString, setUaString] = useState("")

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setUaString(navigator.userAgent)
    }
  }, [])

  const parsed = useMemo(() => {
    const ua = uaString.trim()
    if (!ua) return null

    // 1. Browser
    let browser = "Unknown Browser"
    let browserVer = ""
    if (/Edg\/([\d.]+)/.test(ua)) {
      browser = "Microsoft Edge"
      browserVer = ua.match(/Edg\/([\d.]+)/)?.[1] || ""
    } else if (/OPR\/([\d.]+)/.test(ua) || /Opera\/([\d.]+)/.test(ua)) {
      browser = "Opera"
      browserVer = ua.match(/(?:OPR|Opera)\/([\d.]+)/)?.[1] || ""
    } else if (/Chrome\/([\d.]+)/.test(ua)) {
      browser = "Google Chrome"
      browserVer = ua.match(/Chrome\/([\d.]+)/)?.[1] || ""
    } else if (/Safari\/([\d.]+)/.test(ua) && /Version\/([\d.]+)/.test(ua)) {
      browser = "Apple Safari"
      browserVer = ua.match(/Version\/([\d.]+)/)?.[1] || ""
    } else if (/Firefox\/([\d.]+)/.test(ua)) {
      browser = "Mozilla Firefox"
      browserVer = ua.match(/Firefox\/([\d.]+)/)?.[1] || ""
    } else if (/Googlebot\/([\d.]+)/.test(ua)) {
      browser = "Googlebot Web Crawler"
      browserVer = ua.match(/Googlebot\/([\d.]+)/)?.[1] || ""
    }

    // 2. OS
    let os = "Unknown OS"
    if (/Mac OS X ([\d_]+)/.test(ua)) {
      const ver = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") || ""
      os = `macOS ${ver}`
    } else if (/Windows NT 10.0/.test(ua)) {
      os = "Windows 10 / 11"
    } else if (/Windows NT 6.3/.test(ua)) {
      os = "Windows 8.1"
    } else if (/Windows NT 6.1/.test(ua)) {
      os = "Windows 7"
    } else if (/iPhone OS ([\d_]+)/.test(ua)) {
      const ver = ua.match(/iPhone OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") || ""
      os = `iOS ${ver}`
    } else if (/iPad.*OS ([\d_]+)/.test(ua)) {
      const ver = ua.match(/OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") || ""
      os = `iPadOS ${ver}`
    } else if (/Android ([\d.]+)/.test(ua)) {
      os = `Android ${ua.match(/Android ([\d.]+)/)?.[1] || ""}`
    } else if (/Linux/.test(ua)) {
      os = "Linux"
    }

    // 3. Engine
    let engine = "Unknown Engine"
    if (/AppleWebKit\/([\d.]+)/.test(ua)) {
      engine = `Blink / WebKit (${ua.match(/AppleWebKit\/([\d.]+)/)?.[1] || ""})`
    } else if (/Gecko\/([\d.]+)/.test(ua)) {
      engine = "Gecko"
    }

    // 4. Device
    let device = "Desktop"
    let isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(ua)
    if (isBot) {
      device = "Search Bot / Crawler"
    } else if (/iPhone|iPod/.test(ua)) {
      device = "Apple iPhone"
    } else if (/iPad/.test(ua)) {
      device = "Apple iPad"
    } else if (/Mobile/.test(ua)) {
      device = "Mobile Phone"
    } else if (/Tablet/.test(ua)) {
      device = "Tablet Device"
    }

    // 5. Architecture
    let arch = "x86_64 / Unknown"
    if (/ARM64|aarch64|AppleWebKit.*Mobile/.test(ua)) {
      arch = "ARM64"
    } else if (/Win64; x64|x86_64|WOW64/.test(ua)) {
      arch = "x86_64 (64-bit)"
    } else if (/i686|i386/.test(ua)) {
      arch = "x86 (32-bit)"
    }

    return {
      browser: `${browser} ${browserVer}`.trim(),
      browserName: browser,
      browserVersion: browserVer || "N/A",
      os,
      engine,
      device,
      arch,
      isBot,
    }
  }, [uaString])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">User Agent Parser</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Detect and extract browser, operating system, rendering engine, and device architecture from User-Agent strings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            onClick={() =>
              setUaString(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
              )
            }
            variant="outline"
            size="sm"
          >
            <Smartphone size={14} />
            iPhone
          </Button>
          <Button
            onClick={() =>
              setUaString(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0"
              )
            }
            variant="outline"
            size="sm"
          >
            <Laptop size={14} />
            Windows Edge
          </Button>
          <Button
            onClick={() =>
              setUaString("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")
            }
            variant="outline"
            size="sm"
          >
            <Bot size={14} />
            Googlebot
          </Button>
          <Button
            onClick={() => typeof navigator !== "undefined" && setUaString(navigator.userAgent)}
            variant="ghost"
            size="sm"
          >
            <RotateCcw size={14} />
            My Browser
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4 space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          User Agent String
        </label>
        <div className="relative group">
          <textarea
            value={uaString}
            onChange={(e) => setUaString(e.target.value)}
            rows={3}
            placeholder="Paste User-Agent header..."
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-white p-3 pr-10 font-mono text-xs text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none"
          />
          {uaString && <CopyButton text={uaString} />}
        </div>
      </div>

      {parsed && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Browser Name", value: parsed.browserName },
            { label: "Browser Version", value: parsed.browserVersion },
            { label: "Operating System", value: parsed.os },
            { label: "Device Form Factor", value: parsed.device },
            { label: "Rendering Engine", value: parsed.engine },
            { label: "CPU Architecture", value: parsed.arch },
          ].map((item) => (
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
      )}
    </div>
  )
}
