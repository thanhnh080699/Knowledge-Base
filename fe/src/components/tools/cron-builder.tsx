"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function CronBuilder() {
  const [minute, setMinute] = useState("*")
  const [hour, setHour] = useState("*")
  const [day, setDay] = useState("*")
  const [month, setMonth] = useState("*")
  const [weekday, setWeekday] = useState("*")
  const [expression, setExpression] = useState("* * * * *")
  const [copied, setCopied] = useState(false)

  const build = () => {
    setExpression(`${minute} ${hour} ${day} ${month} ${weekday}`)
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(expression)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const presets = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every Monday at 9am", value: "0 9 * * 1" },
    { label: "Every 1st of month", value: "0 0 1 * *" },
  ]

  const loadPreset = (value: string) => {
    const parts = value.split(" ")
    setMinute(parts[0])
    setHour(parts[1])
    setDay(parts[2])
    setMonth(parts[3])
    setWeekday(parts[4])
    setExpression(value)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button key={preset.value} onClick={() => loadPreset(preset.value)} variant="outline" size="sm">
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Minute</label>
          <input value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="*" className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Hour</label>
          <input value={hour} onChange={(e) => setHour(e.target.value)} placeholder="*" className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Day</label>
          <input value={day} onChange={(e) => setDay(e.target.value)} placeholder="*" className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Month</label>
          <input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="*" className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-700">Weekday</label>
          <input value={weekday} onChange={(e) => setWeekday(e.target.value)} placeholder="*" className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </div>
      </div>
      <Button onClick={build} variant="primary">
        Build Expression
      </Button>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Cron Expression</label>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <code className="block font-mono text-lg font-semibold">{expression}</code>
        </div>
        <Button onClick={copy} variant="outline" className="mt-2">
          <Copy size={16} />
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
    </div>
  )
}
