"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2, ArrowDown, AlertCircle } from "lucide-react"
import { CopyButton } from "@/components/shared/copy-button"
import { genSalt, hash as bcryptHash, compare as bcryptCompare } from "bcrypt-ts/browser"

export function CryptoBcrypt() {
  const [input, setInput] = useState("")
  const [saltRounds, setSaltRounds] = useState(10)
  const [hash, setHash] = useState("")
  const [isHashing, setIsHashing] = useState(false)
  const [hashError, setHashError] = useState("")

  const [compareInput, setCompareInput] = useState("")
  const [compareHash, setCompareHash] = useState("")
  const [isComparing, setIsComparing] = useState(false)
  const [compareResult, setCompareResult] = useState<boolean | null>(null)
  const [compareError, setCompareError] = useState("")

  const generateHash = async () => {
    if (!input) return
    setIsHashing(true)
    setHashError("")
    try {
      const salt = await genSalt(saltRounds)
      const result = await bcryptHash(input, salt)
      setHash(result)
    } catch (err) {
      setHashError(err instanceof Error ? err.message : "Failed to generate hash")
    } finally {
      setIsHashing(false)
    }
  }

  const handleCompare = async () => {
    if (!compareInput || !compareHash) return
    setIsComparing(true)
    setCompareResult(null)
    setCompareError("")
    try {
      const isMatch = await bcryptCompare(compareInput, compareHash.trim())
      setCompareResult(isMatch)
    } catch (err) {
      setCompareError(
        err instanceof Error
          ? err.message
          : "Invalid bcrypt hash format. Must be a valid bcrypt string."
      )
    } finally {
      setIsComparing(false)
    }
  }

  const copyToCompare = () => {
    if (!hash) return
    setCompareHash(hash)
    if (input && !compareInput) {
      setCompareInput(input)
    }
  }

  return (
    <div className="space-y-6">
      {/* Generate Hash Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Generate Hash</h3>
          <span className="text-xs text-slate-500">100% Client-Side via Web Crypto</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Plaintext String</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter string to hash"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Salt Rounds (Cost): <span className="font-mono text-primary font-bold">{saltRounds}</span>
            </label>
            <input
              type="range"
              value={saltRounds}
              onChange={(e) => setSaltRounds(Number(e.target.value))}
              min={4}
              max={14}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>Fast (4)</span>
              <span>Default (10)</span>
              <span>Strong (14)</span>
            </div>
          </div>
        </div>

        <Button
          onClick={generateHash}
          variant="primary"
          disabled={!input || isHashing}
        >
          {isHashing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating Hash...
            </>
          ) : (
            "Generate Hash"
          )}
        </Button>

        {hashError && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{hashError}</span>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Hash Result
            </label>
            {hash && (
              <button
                type="button"
                onClick={copyToCompare}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                <ArrowDown size={14} />
                Use in Compare section
              </button>
            )}
          </div>
          <div className="relative group">
            <code className="block min-h-[2.5rem] break-all rounded-md border border-slate-300 bg-white p-3 pr-10 text-xs text-slate-800 font-mono">
              {hash || <span className="text-slate-400 italic">Click Generate to see hash</span>}
            </code>
            {hash && <CopyButton text={hash} />}
          </div>
        </div>
      </div>

      {/* Compare Section */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h3 className="font-semibold text-slate-900">Compare String with Hash</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Plaintext String</label>
            <input
              type="text"
              value={compareInput}
              onChange={(e) => {
                setCompareInput(e.target.value)
                setCompareResult(null)
                setCompareError("")
              }}
              placeholder="Enter string"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Bcrypt Hash</label>
            <input
              type="text"
              value={compareHash}
              onChange={(e) => {
                setCompareHash(e.target.value)
                setCompareResult(null)
                setCompareError("")
              }}
              placeholder="e.g. $2a$10$..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <Button
          onClick={handleCompare}
          variant="primary"
          disabled={!compareInput || !compareHash || isComparing}
        >
          {isComparing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Comparing...
            </>
          ) : (
            "Compare"
          )}
        </Button>

        {compareError && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
            <AlertCircle size={18} className="shrink-0 text-amber-600" />
            <span>{compareError}</span>
          </div>
        )}

        {compareResult !== null && (
          <div
            className={`flex items-center gap-2 rounded-lg border p-4 text-sm font-semibold shadow-inner ${
              compareResult
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {compareResult ? (
              <>
                <Check size={18} className="text-green-600" />
                <span>Matches (Plaintext matches the Bcrypt hash)</span>
              </>
            ) : (
              <>
                <X size={18} className="text-red-600" />
                <span>No Match (Plaintext does not match the Bcrypt hash)</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
