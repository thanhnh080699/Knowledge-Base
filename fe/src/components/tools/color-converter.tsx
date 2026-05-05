"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const updateFromHex = (value: string) => {
    setHex(value)
    const rgbVal = hexToRgb(value)
    if (rgbVal) {
      setRgb(rgbVal)
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b))
    }
  }

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
  }

  return (
    <div className="space-y-4">
      <div className="h-32 rounded-lg border border-slate-200" style={{ backgroundColor: hex }} />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">HEX</label>
        <input
          type="text"
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">RGB</label>
        <div className="grid grid-cols-3 gap-2">
          <input type="number" value={rgb.r} onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)} min={0} max={255} className="rounded-md border border-slate-300 px-3 py-2" />
          <input type="number" value={rgb.g} onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)} min={0} max={255} className="rounded-md border border-slate-300 px-3 py-2" />
          <input type="number" value={rgb.b} onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))} min={0} max={255} className="rounded-md border border-slate-300 px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">HSL</label>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm">
          hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
        </div>
      </div>
    </div>
  )
}
