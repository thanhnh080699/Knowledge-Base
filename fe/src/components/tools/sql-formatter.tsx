"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function SqlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const format = () => {
    let sql = input
      .replace(/\s+/g, " ")
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s*\(\s*/g, " (")
      .replace(/\s*\)\s*/g, ") ")
      .trim()

    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY", "LIMIT",
      "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "JOIN", "LEFT JOIN",
      "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "ON", "HAVING", "UNION"
    ]

    keywords.forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, "gi")
      sql = sql.replace(regex, `\n${key.toUpperCase()}`)
    })

    setOutput(sql.trim())
    setCopied(false)
  }

  const minify = () => {
    const minified = input.replace(/\s+/g, " ").trim()
    setOutput(minified)
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Input SQL</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="SELECT * FROM users WHERE id = 1"
          rows={6}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={format} variant="primary">
          Format
        </Button>
        <Button onClick={minify} variant="outline">
          Minify
        </Button>
      </div>
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Result</label>
        <textarea
          value={output}
          readOnly
          rows={10}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800"
          placeholder="Formatted SQL will appear here"
        />
        {output && (
          <Button
            onClick={copy}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 size-8 text-slate-400 hover:text-primary transition-colors"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </Button>
        )}
      </div>
    </div>
  )
}
