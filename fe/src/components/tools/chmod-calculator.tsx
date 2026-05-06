"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function ChmodCalculator() {
  const [permissions, setPermissions] = useState({
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    public: { read: true, write: false, execute: false },
  })
  const [octal, setOctal] = useState("644")
  const [symbolic, setSymbolic] = useState("-rw-r--r--")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    calculate()
  }, [permissions])

  const calculate = () => {
    const calcValue = (p: { read: boolean; write: boolean; execute: boolean }) => {
      let val = 0
      if (p.read) val += 4
      if (p.write) val += 2
      if (p.execute) val += 1
      return val
    }

    const calcSym = (p: { read: boolean; write: boolean; execute: boolean }) => {
      return (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-")
    }

    const o = calcValue(permissions.owner)
    const g = calcValue(permissions.group)
    const p = calcValue(permissions.public)

    setOctal(`${o}${g}${p}`)
    setSymbolic(`-${calcSym(permissions.owner)}${calcSym(permissions.group)}${calcSym(permissions.public)}`)
  }

  const toggle = (target: "owner" | "group" | "public", type: "read" | "write" | "execute") => {
    setPermissions({
      ...permissions,
      [target]: {
        ...permissions[target],
        [type]: !permissions[target][type],
      },
    })
  }

  const copy = async () => {
    await navigator.clipboard.writeText(octal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {(["owner", "group", "public"] as const).map((target) => (
          <div key={target} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">{target}</h3>
            <div className="space-y-3">
              {(["read", "write", "execute"] as const).map((type) => (
                <label key={type} className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-medium capitalize text-slate-700">{type}</span>
                  <input
                    type="checkbox"
                    checked={permissions[target][type]}
                    onChange={() => toggle(target, type)}
                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative rounded-xl border-2 border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Octal Notation</p>
          <div className="text-5xl font-black text-primary">{octal}</div>
          <Button
            onClick={copy}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 size-8 text-primary/60 hover:text-primary transition-colors"
          >
            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
          </Button>
        </div>
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Symbolic Notation</p>
          <div className="text-3xl font-mono font-bold text-slate-800">{symbolic}</div>
        </div>
      </div>
    </div>
  )
}
