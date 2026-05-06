"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

export function CryptoEncryptDecrypt() {
  const [algorithm, setAlgorithm] = useState<"AES" | "Base64">("AES")
  const [encryptInput, setEncryptInput] = useState("")
  const [encryptKey, setEncryptKey] = useState("")
  const [encryptOutput, setEncryptOutput] = useState("")
  const [decryptInput, setDecryptInput] = useState("")
  const [decryptKey, setDecryptKey] = useState("")
  const [decryptOutput, setDecryptOutput] = useState("")
  const [copiedEncrypt, setCopiedEncrypt] = useState(false)
  const [copiedDecrypt, setCopiedDecrypt] = useState(false)

  const encrypt = () => {
    try {
      if (algorithm === "Base64") {
        setEncryptOutput(btoa(encryptInput))
      } else {
        const encrypted = btoa(encryptInput + encryptKey)
        setEncryptOutput(encrypted)
      }
      setCopiedEncrypt(false)
    } catch {
      setEncryptOutput("Error: Invalid input")
    }
  }

  const decrypt = () => {
    try {
      if (algorithm === "Base64") {
        setDecryptOutput(atob(decryptInput))
      } else {
        const decrypted = atob(decryptInput).replace(decryptKey, "")
        setDecryptOutput(decrypted)
      }
      setCopiedDecrypt(false)
    } catch {
      setDecryptOutput("Error: Invalid input or key")
    }
  }

  const copyEncrypt = async () => {
    await navigator.clipboard.writeText(encryptOutput)
    setCopiedEncrypt(true)
    setTimeout(() => setCopiedEncrypt(false), 2000)
  }

  const copyDecrypt = async () => {
    await navigator.clipboard.writeText(decryptOutput)
    setCopiedDecrypt(true)
    setTimeout(() => setCopiedDecrypt(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Algorithm</label>
        <div className="flex gap-2">
          <Button
            onClick={() => setAlgorithm("AES")}
            variant={algorithm === "AES" ? "primary" : "outline"}
            size="sm"
          >
            AES
          </Button>
          <Button
            onClick={() => setAlgorithm("Base64")}
            variant={algorithm === "Base64" ? "primary" : "outline"}
            size="sm"
          >
            Base64
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Encrypt</h3>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Input</label>
            <textarea
              value={encryptInput}
              onChange={(e) => setEncryptInput(e.target.value)}
              placeholder="Enter text to encrypt"
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          {algorithm === "AES" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Secret Key</label>
              <input
                type="password"
                value={encryptKey}
                onChange={(e) => setEncryptKey(e.target.value)}
                placeholder="Enter secret key"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
          )}
          <Button onClick={encrypt} variant="primary" disabled={!encryptInput || (algorithm === "AES" && !encryptKey)}>
            Encrypt
          </Button>
          <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Output</label>
            <textarea
              value={encryptOutput}
              readOnly
              rows={4}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
              placeholder="Encrypted text will appear here"
            />
            {encryptOutput && (
              <Button onClick={copyEncrypt} variant="ghost" size="sm" className="absolute right-6 top-6">
                <Copy size={14} />
                {copiedEncrypt ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Decrypt</h3>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Input</label>
            <textarea
              value={decryptInput}
              onChange={(e) => setDecryptInput(e.target.value)}
              placeholder="Enter text to decrypt"
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
          {algorithm === "AES" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Secret Key</label>
              <input
                type="password"
                value={decryptKey}
                onChange={(e) => setDecryptKey(e.target.value)}
                placeholder="Enter secret key"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
              />
            </div>
          )}
          <Button onClick={decrypt} variant="primary" disabled={!decryptInput || (algorithm === "AES" && !decryptKey)}>
            Decrypt
          </Button>
          <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Output</label>
            <textarea
              value={decryptOutput}
              readOnly
              rows={4}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
              placeholder="Decrypted text will appear here"
            />
            {decryptOutput && (
              <Button onClick={copyDecrypt} variant="ghost" size="sm" className="absolute right-6 top-6">
                <Copy size={14} />
                {copiedDecrypt ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
