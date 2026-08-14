import type { BrowserChrome, ScreenshotFormat, ScreenshotResult, WallpaperId } from '@/store/screenshot.store'

export type ScreenshotInput = {
  url: string
  width: number
  height: number
  format: ScreenshotFormat
  fullPage: boolean
  scale: number
  darkMode: boolean
  delay: number
  browserId: BrowserChrome
  wallpaperId: WallpaperId
}

export async function takeScreenshot(input: ScreenshotInput): Promise<ScreenshotResult> {
  const res = await fetch('/api/screenshot', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'image/*' },
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

  const blob = await res.blob()
  const image = await blobToBase64(blob)
  const num = (name: string, fallback: number) => {
    const value = Number(res.headers.get(name))
    return Number.isFinite(value) && value > 0 ? value : fallback
  }
  return {
    image,
    format: input.format,
    width: num('x-shot-width', input.width),
    height: num('x-shot-height', input.height),
    url: input.url,
    capturedAt: new Date().toISOString(),
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}
