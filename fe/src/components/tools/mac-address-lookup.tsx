"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "@/components/shared/copy-button"
import { Button } from "@/components/ui/button"
import { Sparkles, RotateCcw } from "lucide-react"

// Popular OUI database embedded client-side for offline speed
const OUI_DATABASE: Record<string, string> = {
  "00:00:0C": "Cisco Systems, Inc.",
  "00:01:42": "Cisco Systems, Inc.",
  "00:01:C7": "Cisco Systems, Inc.",
  "00:01:C9": "Cisco Systems, Inc.",
  "00:03:93": "Apple Inc.",
  "00:05:02": "Apple Inc.",
  "00:0A:95": "Apple Inc.",
  "00:10:FA": "Apple Inc.",
  "00:11:24": "Apple Inc.",
  "00:14:51": "Apple Inc.",
  "00:17:F2": "Apple Inc.",
  "00:1B:63": "Apple Inc.",
  "00:1C:B3": "Apple Inc.",
  "00:1E:52": "Apple Inc.",
  "00:1F:5B": "Apple Inc.",
  "00:1F:F3": "Apple Inc.",
  "00:21:E9": "Apple Inc.",
  "00:23:12": "Apple Inc.",
  "00:25:00": "Apple Inc.",
  "00:25:4B": "Apple Inc.",
  "00:26:08": "Apple Inc.",
  "00:26:BB": "Apple Inc.",
  "00:04:4B": "NVIDIA Corporation",
  "00:04:75": "3Com Corporation",
  "00:05:5D": "D-Link Corporation",
  "00:0D:88": "D-Link Corporation",
  "00:11:95": "D-Link Corporation",
  "00:13:46": "D-Link Corporation",
  "00:15:E9": "D-Link Corporation",
  "00:17:9A": "D-Link Corporation",
  "00:0C:29": "VMware, Inc.",
  "00:50:56": "VMware, Inc.",
  "00:15:5D": "Microsoft Corporation",
  "00:03:FF": "Microsoft Corporation",
  "00:1D:D8": "Microsoft Corporation",
  "00:12:3F": "Dell Inc.",
  "00:14:22": "Dell Inc.",
  "00:18:8B": "Dell Inc.",
  "00:1A:A0": "Dell Inc.",
  "00:1E:C9": "Dell Inc.",
  "00:21:70": "Dell Inc.",
  "00:24:E8": "Dell Inc.",
  "00:0B:CD": "Hewlett-Packard",
  "00:0E:7F": "Hewlett-Packard",
  "00:11:0A": "Hewlett-Packard",
  "00:14:38": "Hewlett-Packard",
  "00:16:35": "Hewlett-Packard",
  "00:19:BB": "Hewlett-Packard",
  "00:04:23": "Intel Corporation",
  "00:0E:0C": "Intel Corporation",
  "00:13:02": "Intel Corporation",
  "00:13:E8": "Intel Corporation",
  "00:15:00": "Intel Corporation",
  "00:16:76": "Intel Corporation",
  "00:19:D1": "Intel Corporation",
  "00:1B:77": "Intel Corporation",
  "00:21:6A": "Intel Corporation",
  "00:23:14": "Intel Corporation",
  "00:00:F0": "Samsung Electronics Co., Ltd",
  "00:07:AB": "Samsung Electronics Co., Ltd",
  "00:12:47": "Samsung Electronics Co., Ltd",
  "00:15:99": "Samsung Electronics Co., Ltd",
  "00:1A:80": "Samsung Electronics Co., Ltd",
  "00:21:19": "Samsung Electronics Co., Ltd",
  "00:26:37": "Samsung Electronics Co., Ltd",
  "00:04:00": "Lexmark International, Inc.",
  "00:0A:F7": "Broadcom Corporation",
  "00:10:18": "Broadcom Corporation",
  "00:0B:86": "Aruba Networks",
  "00:1A:1E": "Aruba Networks",
  "00:11:50": "Belkin International, Inc.",
  "00:17:3F": "Belkin International, Inc.",
  "00:1C:DF": "Belkin International, Inc.",
  "00:14:D1": "TP-Link Technologies Co., Ltd.",
  "00:1D:0F": "TP-Link Technologies Co., Ltd.",
  "00:21:27": "TP-Link Technologies Co., Ltd.",
  "00:23:CD": "TP-Link Technologies Co., Ltd.",
  "00:25:86": "TP-Link Technologies Co., Ltd.",
  "00:27:19": "TP-Link Technologies Co., Ltd.",
  "50:C7:BF": "TP-Link Technologies Co., Ltd.",
  "B8:D9:4D": "Raspberry Pi Trading Ltd",
  "DC:A6:32": "Raspberry Pi Trading Ltd",
  "E4:5F:01": "Raspberry Pi Trading Ltd",
  "28:CD:C1": "Raspberry Pi Trading Ltd",
  "D8:3A:DD": "Raspberry Pi Trading Ltd",
  "00:15:6D": "Ubiquiti Networks Inc.",
  "04:18:D6": "Ubiquiti Networks Inc.",
  "24:A4:3C": "Ubiquiti Networks Inc.",
  "44:D9:E7": "Ubiquiti Networks Inc.",
  "68:D7:9A": "Ubiquiti Networks Inc.",
  "74:83:C2": "Ubiquiti Networks Inc.",
  "80:2A:A8": "Ubiquiti Networks Inc.",
  "B4:FB:E4": "Ubiquiti Networks Inc.",
  "F0:9F:C2": "Ubiquiti Networks Inc.",
  "00:18:FE": "Hewlett-Packard",
  "00:19:E0": "Nortel Networks",
  "00:22:6B": "Cisco Systems, Inc.",
  "00:1E:13": "Cisco Systems, Inc.",
  "00:24:14": "Cisco Systems, Inc.",
  "00:1B:21": "Intel Corporation",
  "00:1C:C0": "Intel Corporation",
  "00:1E:67": "Intel Corporation",
  "00:22:FB": "Intel Corporation",
  "00:23:4D": "Hon Hai Precision Ind. Co.,Ltd.",
  "00:24:23": "ASUSTeK COMPUTER INC.",
  "00:1B:FC": "ASUSTeK COMPUTER INC.",
  "00:1D:60": "ASUSTeK COMPUTER INC.",
  "00:1F:C6": "ASUSTeK COMPUTER INC.",
  "00:22:15": "ASUSTeK COMPUTER INC.",
  "00:26:18": "ASUSTeK COMPUTER INC.",
  "00:1E:2A": "NETGEAR, Inc.",
  "00:1F:33": "NETGEAR, Inc.",
  "00:22:3F": "NETGEAR, Inc.",
  "00:24:B2": "NETGEAR, Inc.",
  "00:26:F2": "NETGEAR, Inc.",
  "00:1B:2F": "NETGEAR, Inc.",
  "00:1E:8C": "Sony Corporation",
  "00:1D:BA": "Sony Corporation",
  "00:13:A9": "Sony Corporation",
  "00:15:C1": "Sony Corporation",
  "00:19:C5": "Sony Corporation",
  "00:24:8D": "Sony Corporation",
  "00:09:2D": "HTC Corporation",
  "00:23:76": "HTC Corporation",
  "00:0E:8E": "SparkLAN Communications, Inc.",
  "00:16:D3": "Wistron NeWeb Corp.",
  "00:1E:58": "D-Link Corporation",
  "00:22:B0": "D-Link Corporation",
  "00:24:01": "D-Link Corporation",
  "00:26:5A": "D-Link Corporation",
  "00:18:02": "Alcatel-Lucent",
  "00:1F:B5": "Alcatel-Lucent",
  "00:21:55": "Alcatel-Lucent",
  "00:18:82": "Huawei Technologies Co., Ltd",
  "00:1E:10": "Huawei Technologies Co., Ltd",
  "00:25:9E": "Huawei Technologies Co., Ltd",
  "00:25:68": "Huawei Technologies Co., Ltd",
  "00:19:E2": "EMC Corporation",
  "00:22:19": "Dell Inc.",
  "00:23:AE": "Dell Inc.",
  "00:25:64": "Dell Inc.",
  "00:26:B9": "Dell Inc.",
  "00:50:79": "Private / Virtual",
  "52:54:00": "QEMU / KVM Virtual NIC",
  "08:00:27": "Oracle VirtualBox",
}

export function MacAddressLookup() {
  const [inputVal, setInputVal] = useState("DC:A6:32:44:55:66")

  const details = useMemo(() => {
    const clean = inputVal.replace(/[^a-fA-F0-9]/g, "").toUpperCase()
    if (clean.length < 6) return null

    const oui = `${clean.slice(0, 2)}:${clean.slice(2, 4)}:${clean.slice(4, 6)}`
    const vendor = OUI_DATABASE[oui] || "Unknown / Vendor not in local database"

    // If clean has 12 chars (full MAC)
    let fullMacColon = ""
    let fullMacHyphen = ""
    let fullMacCisco = ""
    let transmission = ""
    let administration = ""

    if (clean.length >= 6) {
      const firstByte = parseInt(clean.slice(0, 2), 16)
      transmission = (firstByte & 1) === 0 ? "Unicast (Individual Address)" : "Multicast (Group Address)"
      administration = (firstByte & 2) === 0 ? "Universally Administered (OUI Enforced)" : "Locally Administered (LAA / Custom)"
    }

    if (clean.length >= 12) {
      const parts = clean.slice(0, 12).match(/.{1,2}/g) || []
      fullMacColon = parts.join(":")
      fullMacHyphen = parts.join("-")
      fullMacCisco = `${clean.slice(0, 4)}.${clean.slice(4, 8)}.${clean.slice(8, 12)}`.toLowerCase()
    }

    return {
      oui,
      vendor,
      transmission,
      administration,
      fullMacColon: fullMacColon || `${oui}:XX:XX:XX`,
      fullMacHyphen: fullMacHyphen || `${oui.replace(/:/g, "-")}-XX-XX-XX`,
      fullMacCisco: fullMacCisco || `${clean.slice(0, 4)}.${clean.slice(4, 6)}xx.xxxx`.toLowerCase(),
      isKnown: Boolean(OUI_DATABASE[oui]),
    }
  }, [inputVal])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">MAC Address Vendor Lookup</h2>
          <p className="text-xs text-[var(--color-muted)] mt-0.5">
            Identify the manufacturer / OUI vendor, transmission mode, and standard format representations from any MAC address.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setInputVal("B8:D9:4D:12:34:56")} variant="outline" size="sm">
            <Sparkles size={14} />
            Raspberry Pi
          </Button>
          <Button onClick={() => setInputVal("00:0C:29:AA:BB:CC")} variant="outline" size="sm">
            VMware
          </Button>
          <Button onClick={() => setInputVal("")} variant="ghost" size="sm">
            <RotateCcw size={14} />
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface-soft)] p-4">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
          MAC Address or OUI Prefix
        </label>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="00:1A:2B:3C:4D:5E or 001A.2B3C.4D5E"
          className="w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3.5 py-2.5 font-mono text-sm text-[var(--color-ink)] focus:border-[var(--color-brand)] focus:outline-none"
        />
      </div>

      {details ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3 relative rounded-xl border border-[var(--color-brand)]/40 bg-[var(--color-surface-soft)] p-4 shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] block mb-1">
              Manufacturer / Vendor
            </span>
            <span className="text-lg font-bold text-[var(--color-ink)] block pr-8">
              {details.vendor}
            </span>
            <CopyButton text={details.vendor} />
          </div>

          {[
            { label: "OUI Prefix", value: details.oui },
            { label: "Colon Form (Standard)", value: details.fullMacColon },
            { label: "Hyphen Form (Windows)", value: details.fullMacHyphen },
            { label: "Cisco Notation", value: details.fullMacCisco },
            { label: "Transmission Type", value: details.transmission },
            { label: "Administration Type", value: details.administration },
          ].map((item) => (
            <div
              key={item.label}
              className="relative rounded-xl border border-[var(--color-hairline)] bg-white p-3.5 shadow-xs"
            >
              <span className="text-[11px] font-medium text-[var(--color-muted)] block mb-1">
                {item.label}
              </span>
              <span className="font-mono text-sm font-semibold text-[var(--color-ink)] break-all pr-7 block">
                {item.value}
              </span>
              <CopyButton text={item.value} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800">
          Enter at least 6 hexadecimal characters to identify the MAC OUI prefix (e.g. 00:1A:2B).
        </div>
      )}
    </div>
  )
}
