"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Calendar } from "lucide-react"

export function DateFormatter() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState("12:00")
  const [formats, setFormats] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState("")

  useEffect(() => {
    format()
  }, [date, time])

  const format = () => {
    const d = new Date(`${date}T${time}`)
    if (isNaN(d.getTime())) return

    const results: Record<string, string> = {
      "ISO 8601": d.toISOString(),
      "UTC": d.toUTCString(),
      "Local": d.toLocaleString(),
      "Date Only": d.toLocaleDateString(),
      "Time Only": d.toLocaleTimeString(),
      "Timestamp": Math.floor(d.getTime() / 1000).toString(),
      "Short": d.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
      "Full": d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    }
    setFormats(results)
  }

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(""), 2000)
  }

  const setToNow = () => {
    const now = new Date()
    setDate(now.toISOString().split("T")[0])
    setTime(now.toTimeString().split(" ")[0].slice(0, 5))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="mb-2 block text-sm font-medium text-slate-700">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <Button onClick={setToNow} variant="outline">
          Now
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(formats).map(([key, value]) => (
          <div key={key} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">{key}</label>
            <div className="min-h-[2.5rem] break-all rounded-md border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800">
              {value}
            </div>
            <Button
              onClick={() => copy(key, value)}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 size-8 text-slate-400 hover:text-primary transition-colors"
            >
              {copied === key ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
