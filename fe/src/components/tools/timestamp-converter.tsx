"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Copy, Check } from "lucide-react"

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("")
  const [datetime, setDatetime] = useState("")
  const [copiedTs, setCopiedTs] = useState(false)
  const [copiedDt, setCopiedDt] = useState(false)

  const toTimestamp = () => {
    const date = new Date(datetime)
    setTimestamp(Math.floor(date.getTime() / 1000).toString())
  }

  const toDatetime = () => {
    const date = new Date(Number(timestamp) * 1000)
    setDatetime(date.toISOString().slice(0, 16))
  }

  const now = () => {
    const ts = Math.floor(Date.now() / 1000)
    setTimestamp(ts.toString())
    setDatetime(new Date(ts * 1000).toISOString().slice(0, 16))
  }

  const copy = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Button onClick={now} variant="primary">
        <RefreshCw size={16} />
        Current Timestamp
      </Button>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 font-bold uppercase tracking-wider text-[10px] text-slate-500">Unix Timestamp</label>
          <div className="relative">
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="1234567890"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {timestamp && (
              <Button
                onClick={() => copy(timestamp, setCopiedTs)}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-8 text-slate-400 hover:text-primary transition-colors"
              >
                {copiedTs ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
            )}
          </div>
          <Button onClick={toDatetime} variant="outline" size="sm" className="mt-3 w-full">
            To Date
          </Button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 font-bold uppercase tracking-wider text-[10px] text-slate-500">Datetime</label>
          <div className="relative">
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {datetime && (
              <Button
                onClick={() => copy(datetime, setCopiedDt)}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-8 text-slate-400 hover:text-primary transition-colors"
              >
                {copiedDt ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </Button>
            )}
          </div>
          <Button onClick={toTimestamp} variant="outline" size="sm" className="mt-3 w-full">
            To Timestamp
          </Button>
        </div>
      </div>
    </div>
  )
}
