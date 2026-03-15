import { DEVICE_PRESETS, type DevicePreset, type PresetKey } from '@/lib/presets'

export type ScreenshotOptions = {
  url: string
  preset: PresetKey
  fullPage: boolean
  format: 'png' | 'jpeg'
  delay: number
  customViewport?: Partial<Pick<DevicePreset, 'width' | 'height' | 'deviceScaleFactor' | 'isMobile' | 'hasTouch' | 'userAgent'>>
}

export type ScreenshotError =
  | { code: 'TIMEOUT'; message: string }
  | { code: 'NAVIGATION'; message: string }
  | { code: 'UNKNOWN'; message: string }

const classifyError = (err: unknown): ScreenshotError => {
  const msg = err instanceof Error ? err.message : String(err)

  if (msg.includes('Timeout') || msg.includes('timeout')) {
    return { code: 'TIMEOUT', message: 'Page took too long to load (30s limit)' }
  }
  if (
    msg.includes('ERR_NAME_NOT_RESOLVED') ||
    msg.includes('ERR_CONNECTION_REFUSED') ||
    msg.includes('ERR_CONNECTION_TIMED_OUT') ||
    msg.includes('net::ERR')
  ) {
    return { code: 'NAVIGATION', message: 'Could not reach the URL' }
  }
  return { code: 'UNKNOWN', message: 'Screenshot failed — check the URL and try again' }
}

const STEALTH_SCRIPT = `
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
  Object.defineProperty(navigator, 'plugins', { get: () => Object.assign([1, 2, 3], { item: () => null, namedItem: () => null, refresh: () => {} }) })
  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] })
  window.chrome = { runtime: {} }
`

export const takeScreenshot = async (
  opts: ScreenshotOptions
): Promise<{ buffer: Buffer; error?: never } | { buffer?: never; error: ScreenshotError }> => {
  const base = DEVICE_PRESETS[opts.preset] ?? DEVICE_PRESETS.desktop
  const preset: DevicePreset = { ...base, ...opts.customViewport }

  try {
    const { newContext } = await import('./browser.js')
    const ctx = await newContext(preset.userAgent)
    const page = await ctx.newPage()

    await page.setViewportSize({ width: preset.width, height: preset.height })
    await page.addInitScript(STEALTH_SCRIPT)

    await page.route('**/*.{mp4,webm,ogg,mp3,wav,flac,aac}', (r) => r.abort())

    await page.goto(opts.url, { waitUntil: 'networkidle', timeout: 30_000 })

    if (opts.delay > 0) {
      await page.waitForTimeout(opts.delay)
    }

    const raw = await page.screenshot({
      fullPage: opts.fullPage,
      type: opts.format,
      ...(opts.format === 'jpeg' ? { quality: 92 } : {}),
    })

    await ctx.close()
    return { buffer: Buffer.from(raw) }
  } catch (err) {
    return { error: classifyError(err) }
  }
}
