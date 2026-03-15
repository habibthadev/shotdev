import dns from 'node:dns/promises'
import { isIP } from 'node:net'

// RFC-1918 + loopback + link-local + IPv6 private ranges
const PRIVATE_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^0\./,
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fe80:/i,
  /^fd[0-9a-f]{2}:/i,
]

const isPrivateIp = (ip: string) => PRIVATE_PATTERNS.some((r) => r.test(ip))

type SafetyResult = { safe: true } | { safe: false; reason: string }

export const validateUrl = async (raw: string): Promise<SafetyResult> => {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return { safe: false, reason: 'Invalid URL format' }
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { safe: false, reason: 'Only HTTP and HTTPS URLs are allowed' }
  }

  const { hostname } = parsed

  // Block localhost variants
  if (['localhost', '0.0.0.0', '::1'].includes(hostname)) {
    return { safe: false, reason: 'Localhost is not allowed' }
  }

  // Direct IP supplied — check immediately
  if (isIP(hostname) !== 0) {
    return isPrivateIp(hostname)
      ? { safe: false, reason: 'Private IP ranges are not allowed' }
      : { safe: true }
  }

  // Resolve hostname and check every returned address (DNS rebinding protection)
  try {
    const records = await dns.lookup(hostname, { all: true })
    for (const { address } of records) {
      if (isPrivateIp(address)) {
        return { safe: false, reason: 'Hostname resolves to a private IP address' }
      }
    }
  } catch {
    return { safe: false, reason: 'Could not resolve hostname' }
  }

  return { safe: true }
}
