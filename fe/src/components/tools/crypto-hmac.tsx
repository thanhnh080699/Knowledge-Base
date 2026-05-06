"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function CryptoHmac() {
  const [plainText, setPlainText] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [algorithm, setAlgorithm] = useState<"SHA-1" | "SHA-256" | "SHA-384" | "SHA-512">("SHA-256")
  const [encoding, setEncoding] = useState<"hex" | "base64">("hex")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    try {
      const encoder = new TextEncoder()
      const keyData = encoder.encode(secretKey)
      const messageData = encoder.encode(plainText)

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: algorithm },
        false,
        ["sign"]
      )

      const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData)
      const hashArray = Array.from(new Uint8Array(signature))

      if (encoding === "hex") {
        setOutput(hashArray.map(b => b.toString(16).padStart(2, "0")).join(""))
      } else {
        setOutput(btoa(String.fromCharCode(...hashArray)))
      }
      setCopied(false)
    } catch {
      setOutput("Error generating HMAC")
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Plain Text</label>
        <textarea
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
          placeholder="Enter plain text"
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Secret Key</label>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Enter secret key"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Hashing Function</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as any)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Output Encoding</label>
        <div className="flex gap-2">
          <Button
            onClick={() => setEncoding("hex")}
            variant={encoding === "hex" ? "primary" : "outline"}
            size="sm"
          >
            Hex
          </Button>
          <Button
            onClick={() => setEncoding("base64")}
            variant={encoding === "base64" ? "primary" : "outline"}
            size="sm"
          >
            Base64
          </Button>
        </div>
      </div>
      <Button onClick={generate} variant="primary" disabled={!plainText || !secretKey}>
        Generate HMAC
      </Button>
      <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-700">Output</label>
        <code className="block min-h-[2.5rem] break-all rounded bg-white p-3 text-xs text-slate-800">
          {output || ""}
        </code>
        {output && (
          <Button onClick={copy} variant="ghost" size="sm" className="absolute right-3 top-3">
            <Copy size={14} />
            {copied ? "Copied!" : "Copy"}
          </Button>
        )}
      </div>
    </div>
  )
}
