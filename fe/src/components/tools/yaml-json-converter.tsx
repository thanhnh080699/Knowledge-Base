"use client"

import { useState } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { load as yamlLoad, dump as yamlDump } from "js-yaml"
import { ArrowRightLeft, Sparkles, RotateCcw } from "lucide-react"

interface Props {
  initialMode?: "yaml-to-json" | "json-to-yaml"
}

export function YamlJsonConverter({ initialMode = "yaml-to-json" }: Props) {
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">(initialMode)
  const [inputVal, setInputVal] = useState(
    initialMode === "yaml-to-json"
      ? `server:\n  host: 127.0.0.1\n  port: 8080\n  ssl:\n    enabled: true\n    cert: /etc/ssl/cert.pem\nservices:\n  - name: auth\n    active: true\n  - name: api\n    active: false`
      : `{\n  "server": {\n    "host": "127.0.0.1",\n    "port": 8080,\n    "ssl": {\n      "enabled": true,\n      "cert": "/etc/ssl/cert.pem"\n    }\n  },\n  "services": [\n    {\n      "name": "auth",\n      "active": true\n    },\n    {\n      "name": "api",\n      "active": false\n    }\n  ]\n}`
  )
  const [outputVal, setOutputVal] = useState("")
  const [error, setError] = useState("")

  const convert = (source: string, currentMode = mode) => {
    if (!source.trim()) {
      setOutputVal("")
      setError("")
      return
    }

    try {
      if (currentMode === "yaml-to-json") {
        const parsed = yamlLoad(source)
        setOutputVal(JSON.stringify(parsed, null, 2))
        setError("")
      } else {
        const parsed = JSON.parse(source)
        const dump = yamlDump(parsed, { indent: 2, lineWidth: -1 })
        setOutputVal(dump)
        setError("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion error")
    }
  }

  const handleToggleMode = () => {
    const nextMode = mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json"
    setMode(nextMode)
    if (outputVal && !error) {
      setInputVal(outputVal)
      convert(outputVal, nextMode)
    } else {
      convert(inputVal, nextMode)
    }
  }

  const handleClear = () => {
    setInputVal("")
    setOutputVal("")
    setError("")
  }

  const handleSample = () => {
    if (mode === "yaml-to-json") {
      const sample = `app:\n  name: thanhnh-kb\n  env: production\ndatabase:\n  host: localhost\n  port: 3306\n  credentials:\n    username: root\n    password: secret\nfeatures:\n  - caching\n  - analytics\n  - dark-mode`
      setInputVal(sample)
      convert(sample, "yaml-to-json")
    } else {
      const sample = `{\n  "app": "thanhnh-kb",\n  "env": "production",\n  "database": {\n    "host": "localhost",\n    "port": 3306\n  },\n  "features": ["caching", "analytics"]\n}`
      setInputVal(sample)
      convert(sample, "json-to-yaml")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">
            {mode === "yaml-to-json" ? "YAML to JSON Converter" : "JSON to YAML Converter"}
          </h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Convert back and forth between YAML data and JSON format with full syntax validation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleToggleMode} variant="outline" size="sm">
            <ArrowRightLeft size={14} />
            Switch to {mode === "yaml-to-json" ? "JSON to YAML" : "YAML to JSON"}
          </Button>
          <Button onClick={handleSample} variant="outline" size="sm">
            <Sparkles size={14} />
            Sample
          </Button>
          <Button onClick={handleClear} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            {mode === "yaml-to-json" ? "Input YAML" : "Input JSON"}
          </label>
          <textarea
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value)
              convert(e.target.value)
            }}
            rows={14}
            placeholder={mode === "yaml-to-json" ? "key: value" : '{"key": "value"}'}
            className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 font-mono text-xs text-[var(--color-ink)] focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            {mode === "yaml-to-json" ? "Output JSON" : "Output YAML"}
          </label>
          <div className="relative group">
            <textarea
              readOnly
              value={outputVal}
              rows={14}
              placeholder="Converted result will appear here..."
              className="w-full rounded-xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-3 pr-10 font-mono text-xs text-[var(--color-ink)] focus:outline-none leading-relaxed"
            />
            {outputVal && <CopyButton text={outputVal} />}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-mono text-red-700">
          <strong>Syntax Error:</strong> {error}
        </div>
      )}
    </div>
  )
}
