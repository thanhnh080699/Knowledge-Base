"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("")
  const [datetime, setDatetime] = useState("")

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

  return (
    <div className="space-y-4">
      <Button onClick={now} variant="primary">
        <RefreshCw size={16} />
        Current Timestamp
      </Button>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Unix Timestamp</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="1234567890"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 font-mono"
          />
          <Button onClick={toDatetime} variant="outline">
            To Date
          </Button>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Datetime</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2"
          />
          <Button onClick={toTimestamp} variant="outline">
            To Timestamp
          </Button>
        </div>
      </div>
    </div>
  )
}
