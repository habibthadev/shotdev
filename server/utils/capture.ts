import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer, { type Browser, type Page } from 'puppeteer-core'
import { z } from 'zod'
import { buildSceneHtml, sceneDimensions, WALLPAPER_FILES, WALLPAPER_EXT, type BrowserChrome, type WallpaperId } from './scene'

export const ScreenshotInputSchema = z.object({
  url: z.string().url(),
  width: z.number().min(320).max(3840).default(1280),
  height: z.number().min(240).max(2160).default(800),
  format: z.enum(['png', 'jpeg', 'webp']).default('png'),
  fullPage: z.boolean().default(false),
  darkMode: z.boolean().default(false),
  delay: z.number().min(0).max(10000).default(0),
  browserId: z.enum(['safari', 'chrome', 'firefox', 'arc', 'minimal']).default('chrome'),
  wallpaperId: z.enum(['sonoma', 'ventura', 'tahoe', 'sequoia', 'whitesur']).default('sonoma'),
})

export type ScreenshotInput = z.infer<typeof ScreenshotInputSchema>

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/data/data/com.termux/files/usr/bin/chromium-browser',
  '/data/data/com.termux/files/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].filter(Boolean) as string[]

function resolveChrome(): string {
  for (const candidate of CHROME_CANDIDATES) {
    if (candidate.startsWith('/') && existsSync(candidate)) return candidate
  }
  return 'chromium'
}

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (browser && browser.connected) return browser
  browser = await puppeteer.launch({
    executablePath: resolveChrome(),
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
    ],
  })
  return browser
}

async function closePageSafely(page: Page): Promise<void> {
  try {
    await page.close()
  } catch {}
}

function wallpaperDataUri(wallpaperId: WallpaperId, dark: boolean): string {
  const file = WALLPAPER_FILES[wallpaperId]
  const ext = WALLPAPER_EXT[wallpaperId]
  const path = join(process.cwd(), 'public', 'wallpaper', `${file}-${dark ? 'dark' : 'light'}.${ext}`)
  const buffer = readFileSync(path)
  return `data:image/${ext};base64,${buffer.toString('base64')}`
}

export async function captureScene(data: ScreenshotInput) {
  let page: Page | null = null
  let scenePage: Page | null = null

  try {
    const b = await getBrowser()

    page = await b.newPage()
    await page.setViewport({ width: data.width, height: data.height })
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: data.darkMode ? 'dark' : 'light' },
    ])
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    )

    await page.goto(data.url, { waitUntil: 'load', timeout: 30_000 })
    await new Promise((r) => setTimeout(r, 1000 + data.delay))
    try {
      await page.evaluate(() => (document as Document & { fonts: FontFaceSet }).fonts.ready)
    } catch {}

    const siteShot = await page.screenshot({
      type: data.format,
      fullPage: data.fullPage,
      ...(data.format === 'jpeg' ? { quality: 92 } : {}),
    })

    const dims = sceneDimensions(data)
    const sceneHtml = buildSceneHtml({
      url: data.url,
      width: data.width,
      height: data.height,
      browserId: data.browserId as BrowserChrome,
      wallpaperId: data.wallpaperId as WallpaperId,
      dark: data.darkMode,
      format: data.format,
      screenshotDataUri: `data:image/${data.format};base64,${Buffer.from(siteShot).toString('base64')}`,
      wallpaperDataUri: wallpaperDataUri(data.wallpaperId as WallpaperId, data.darkMode),
    })

    scenePage = await b.newPage()
    await scenePage.setViewport({ width: dims.width, height: dims.height })
    await scenePage.setContent(sceneHtml, { waitUntil: 'load' })
    try {
      await scenePage.evaluate(() => (document as Document & { fonts: FontFaceSet }).fonts.ready)
    } catch {}
    await new Promise((r) => setTimeout(r, 350))

    const buffer = await scenePage.screenshot({
      type: data.format,
      ...(data.format === 'jpeg' ? { quality: 92 } : {}),
    })

    await closePageSafely(page)
    await closePageSafely(scenePage)

    return {
      image: Buffer.from(buffer).toString('base64'),
      format: data.format,
      width: dims.width,
      height: dims.height,
      url: data.url,
      capturedAt: new Date().toISOString(),
    }
  } catch (error) {
    if (page) await closePageSafely(page)
    if (scenePage) await closePageSafely(scenePage)

    if (error instanceof Error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('timeout')) {
        throw new Error('Page took too long to load. Try increasing the delay.')
      }
      if (msg.includes('net::') || msg.includes('network') || msg.includes('dns')) {
        throw new Error('Failed to load URL. Check the URL and try again.')
      }
      if (msg.includes('crashed') || msg.includes('closed')) {
        throw new Error('Browser crashed. This site may not be compatible.')
      }
      throw new Error(error.message)
    }
    throw new Error('Failed to capture screenshot.')
  }
}
