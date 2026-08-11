import type { BrowserChrome, ScreenshotFormat, ScreenshotResult, WallpaperId } from '@/store/screenshot.store'

export type ScreenshotInput = {
  url: string
  width: number
  height: number
  format: ScreenshotFormat
  fullPage: boolean
  darkMode: boolean
  delay: number
  browserId: BrowserChrome
  wallpaperId: WallpaperId
}

export async function takeScreenshot(input: ScreenshotInput): Promise<ScreenshotResult> {
  const res = await fetch('/api/screenshot', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    let message = `Failed to capture screenshot (${res.status})`
    try {
      const body = await res.json()
      if (typeof body?.message === 'string' && body.message) message = body.message
    } catch {}
    throw new Error(message)
  }

  return res.json()
}
