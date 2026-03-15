const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export type Preset = 'desktop' | 'laptop' | 'tablet' | 'mobile-portrait' | 'mobile-landscape' | 'custom'
export type Format = 'png' | 'jpeg'

export type ScreenshotRequest = {
  url: string
  preset: Preset
  fullPage: boolean
  format: Format
  delay: number
  customViewport?: {
    width?: number
    height?: number
    deviceScaleFactor?: number
    isMobile?: boolean
    hasTouch?: boolean
    userAgent?: string
  }
}

export type ScreenshotSuccess = {
  ok: true
  blob: Blob
  objectUrl: string
  preset: string
}

export type ScreenshotFailure = {
  ok: false
  message: string
  status: number
}

export type ScreenshotResult = ScreenshotSuccess | ScreenshotFailure

export type PresetMeta = {
  key: string
  width: number
  height: number
  isMobile: boolean
}

export const fetchPresets = async (): Promise<PresetMeta[]> => {
  const res = await fetch(`${BASE}/api/screenshot/presets`)
  const data = await res.json()
  return data.presets as PresetMeta[]
}

export const captureScreenshot = async (
  req: ScreenshotRequest
): Promise<ScreenshotResult> => {
  let res: Response

  try {
    res = await fetch(`${BASE}/api/screenshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
  } catch {
    return { ok: false, message: 'Could not reach the server', status: 0 }
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const body = await res.json()
      if (typeof body?.error === 'string') message = body.error
    } catch { /* empty */ }
    return { ok: false, message, status: res.status }
  }

  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const preset = res.headers.get('X-Preset') ?? req.preset

  return { ok: true, blob, objectUrl, preset }
}
