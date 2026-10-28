import { createHash } from 'node:crypto'
import { isIP } from 'node:net'
import geoip from 'geoip-lite'

// The verified nginx ingress appends the socket client to X-Forwarded-For.
// Use the rightmost hop so a client-supplied prefix cannot spoof its address.
export function viewerIp(
  peer: string,
  fallback: string,
  forwardedFor: string | undefined,
  trustedPeers: string
) {
  const normalizedPeer = peer.replace(/^::ffff:/, '')
  const trusted = trustedPeers
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  const forwardedIp = forwardedFor?.split(',').at(-1)?.trim()
  return trusted.includes(normalizedPeer) && forwardedIp && isIP(forwardedIp)
    ? forwardedIp
    : fallback
}

export function viewDetails(rawIp: string, userAgent: string, referrer: unknown, now = Date.now()) {
  const normalized = rawIp.replace(/^::ffff:/, '')
  const ip = isIP(normalized) ? normalized : null
  const agent = userAgent.slice(0, 1000)
  const browser = /Edg\//i.test(agent)
    ? 'Edge'
    : /OPR\//i.test(agent)
      ? 'Opera'
      : /Firefox\//i.test(agent)
        ? 'Firefox'
        : /Chrome\//i.test(agent)
          ? 'Chrome'
          : /Safari\//i.test(agent)
            ? 'Safari'
            : 'Unknown'
  const os = /Android/i.test(agent)
    ? 'Android'
    : /iPhone|iPad/i.test(agent)
      ? 'iOS'
      : /Windows/i.test(agent)
        ? 'Windows'
        : /Mac OS/i.test(agent)
          ? 'macOS'
          : /Linux/i.test(agent)
            ? 'Linux'
            : 'Unknown'
  const device = /iPad|Tablet/i.test(agent)
    ? 'Tablet'
    : /Mobile|iPhone|Android/i.test(agent)
      ? 'Mobile'
      : 'Desktop'
  let source: string | null = null
  try {
    const url = new URL(typeof referrer === 'string' ? referrer.slice(0, 2048) : '')
    if (['http:', 'https:'].includes(url.protocol)) source = url.hostname.slice(0, 255)
  } catch {
    /* Direct visit or invalid referrer. */
  }
  const location = ip ? geoip.lookup(ip) : null
  return {
    visitor_key: createHash('sha256')
      .update(`${ip ?? 'unknown'}|${agent}|${Math.floor(now / 1_800_000)}`)
      .digest('hex'),
    ip,
    country: location?.country || null,
    region: location?.region || null,
    city: location?.city || null,
    browser,
    os,
    device,
    referrer: source,
  }
}

export function isAutomatedView(userAgent: string) {
  return (
    !userAgent || /bot|crawler|spider|headless|preview|facebookexternalhit|slurp/i.test(userAgent)
  )
}
