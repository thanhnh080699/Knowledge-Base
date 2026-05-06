"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw } from "lucide-react"

export function CryptoRsaKeyGenerator() {
  const [keySize, setKeySize] = useState(2048)
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [copiedPublic, setCopiedPublic] = useState(false)
  const [copiedPrivate, setCopiedPrivate] = useState(false)

  const generateKeys = async () => {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      )

      const publicKeyData = await crypto.subtle.exportKey("spki", keyPair.publicKey)
      const privateKeyData = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)

      const publicKeyPem = formatPem(publicKeyData, "PUBLIC KEY")
      const privateKeyPem = formatPem(privateKeyData, "PRIVATE KEY")

      setPublicKey(publicKeyPem)
      setPrivateKey(privateKeyPem)
      setCopiedPublic(false)
      setCopiedPrivate(false)
    } catch {
      setPublicKey("Error generating keys")
      setPrivateKey("Error generating keys")
    }
  }

  const formatPem = (keyData: ArrayBuffer, type: string) => {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(keyData)))
    const formatted = base64.match(/.{1,64}/g)?.join("\n") || base64
    return `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`
  }

  useEffect(() => {
    generateKeys()
  }, [])

  const copyPublic = async () => {
    await navigator.clipboard.writeText(publicKey)
    setCopiedPublic(true)
    setTimeout(() => setCopiedPublic(false), 2000)
  }

  const copyPrivate = async () => {
    await navigator.clipboard.writeText(privateKey)
    setCopiedPrivate(true)
    setTimeout(() => setCopiedPrivate(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Key Size (bits)</label>
        <select
          value={keySize}
          onChange={(e) => setKeySize(Number(e.target.value))}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value={1024}>1024</option>
          <option value={2048}>2048</option>
          <option value={4096}>4096</option>
        </select>
      </div>
      <Button onClick={generateKeys} variant="primary">
        <RefreshCw size={16} />
        Refresh Keys
      </Button>
      {publicKey && (
        <div className="space-y-4">
          <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Public Key</label>
            <textarea
              value={publicKey}
              readOnly
              rows={8}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            />
            <Button onClick={copyPublic} variant="ghost" size="sm" className="absolute right-3 top-3">
              <Copy size={14} />
              {copiedPublic ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Private Key</label>
            <textarea
              value={privateKey}
              readOnly
              rows={12}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            />
            <Button onClick={copyPrivate} variant="ghost" size="sm" className="absolute right-3 top-3">
              <Copy size={14} />
              {copiedPrivate ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
