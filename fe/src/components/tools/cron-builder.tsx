"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Info, Clock, Calendar } from "lucide-react"

export function CronBuilder() {
  const [expression, setExpression] = useState("* * * * *")
  const [parts, setParts] = useState(["*", "*", "*", "*", "*"])
  const [description, setDescription] = useState("Every minute")
  const [copied, setCopied] = useState(false)

  const updateParts = (newExpression: string) => {
    const p = newExpression.trim().split(/\s+/)
    if (p.length === 5) {
      setParts(p)
      translate(p)
    }
  }

  const handlePartChange = (index: number, value: string) => {
    const newParts = [...parts]
    newParts[index] = value || "*"
    setParts(newParts)
    const newExp = newParts.join(" ")
    setExpression(newExp)
    translate(newParts)
  }

  const translate = (p: string[]) => {
    try {
      const [m, h, d, mo, w] = p
      
      const formatPart = (val: string, unit: string, plural: string, labels?: string[]) => {
        if (val === "*") return `every ${unit}`
        if (val.includes("/")) {
          const step = val.split("/")[1]
          return step === "1" ? `every ${unit}` : `every ${step} ${plural}`
        }
        if (val.includes("-")) {
          const [start, end] = val.split("-")
          const s = labels ? labels[parseInt(start)] || start : start
          const e = labels ? labels[parseInt(end)] || end : end
          return `between ${s} and ${e}`
        }
        if (val.includes(",")) {
          const parts = val.split(",").map(v => labels ? labels[parseInt(v)] || v : v)
          return `at ${parts.slice(0, -1).join(", ")} and ${parts.slice(-1)}`
        }
        return labels ? labels[parseInt(val)] || val : `at ${unit} ${val}`
      }

      const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

      let desc = ""

      // Special cases
      if (m === "*" && h === "*" && d === "*" && mo === "*" && w === "*") {
        setDescription("Every minute")
        return
      }
      if (m === "0" && h === "0" && d === "*" && mo === "*" && w === "*") {
        setDescription("At midnight every day")
        return
      }

      // Build description
      const mDesc = formatPart(m, "minute", "minutes")
      const hDesc = formatPart(h, "hour", "hours")
      const dDesc = formatPart(d, "day", "days")
      const moDesc = formatPart(mo, "month", "months", months)
      const wDesc = formatPart(w, "weekday", "weekdays", weekdays)

      if (h === "*" && m === "*") desc = "At every minute"
      else if (h === "*" && m.includes("/")) desc = `${mDesc.charAt(0).toUpperCase() + mDesc.slice(1)}`
      else if (h === "*") desc = `${mDesc.charAt(0).toUpperCase() + mDesc.slice(1)} past every hour`
      else {
        const timeH = !isNaN(parseInt(h)) ? h.padStart(2, "0") : hDesc
        const timeM = !isNaN(parseInt(m)) ? m.padStart(2, "0") : mDesc
        
        if (!isNaN(parseInt(h)) && !isNaN(parseInt(m))) {
          desc = `At ${timeH}:${timeM}`
        } else {
          desc = `${mDesc.charAt(0).toUpperCase() + mDesc.slice(1)} of ${hDesc}`
        }
      }

      if (d !== "*") desc += ` on ${dDesc}`
      if (mo !== "*") desc += ` in ${moDesc}`
      if (w !== "*") desc += ` on ${wDesc}`

      setDescription(desc.replace("at minute ", "at ").replace("at hour ", "at hour ").replace("on every day", "").trim())
    } catch {
      setDescription("Invalid expression")
    }
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

  return (
    <div className="space-y-6">
      {/* Human Readable Result */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-8 text-center shadow-inner">
        <p className="text-sm font-medium uppercase tracking-wider text-blue-600 mb-2">Human Readable</p>
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">“{description}”</h2>
      </div>

      {/* Editor Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 grid grid-cols-5 gap-2 sm:gap-4">
          {[
            { label: "minute", hint: "0-59" },
            { label: "hour", hint: "0-23" },
            { label: "day (month)", hint: "1-31" },
            { label: "month", hint: "1-12" },
            { label: "day (week)", hint: "0-6" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <input
                value={parts[i]}
                onChange={(e) => handlePartChange(i, e.target.value)}
                className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-1 py-3 sm:py-4 text-center text-lg sm:text-xl font-bold text-slate-800 transition-all focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              <p className="mt-2 text-[10px] sm:text-xs font-semibold uppercase text-slate-500">{item.label}</p>
              <p className="hidden sm:block text-[10px] text-slate-400">{item.hint}</p>
            </div>
          ))}
        </div>

        <div className="relative">
          <input
            value={expression}
            onChange={(e) => {
              setExpression(e.target.value)
              updateParts(e.target.value)
            }}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 p-4 font-mono text-xl sm:text-2xl font-bold tracking-widest text-center focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={copy}
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-4"
          >
            <Copy size={20} className="sm:mr-2" />
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
      </div>

      {/* Presets & Info */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Calendar size={16} /> Presets
          </h3>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => {
                  setExpression(preset.value)
                  updateParts(preset.value)
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Info size={16} /> Tips
          </h3>
          <ul className="space-y-1 text-xs text-slate-600">
            <li>• Use <code className="font-bold text-blue-600">*</code> for any value</li>
            <li>• Use <code className="font-bold text-blue-600">,</code> for lists: <code className="bg-slate-200 px-1 rounded">1,2,5</code></li>
            <li>• Use <code className="font-bold text-blue-600">-</code> for ranges: <code className="bg-slate-200 px-1 rounded">1-5</code></li>
            <li>• Use <code className="font-bold text-blue-600">/</code> for steps: <code className="bg-slate-200 px-1 rounded">*/15</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
