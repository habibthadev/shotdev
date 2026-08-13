import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { chromium as playwright, type Browser, type BrowserContext } from 'playwright-core'
import sparticuz from '@sparticuz/chromium'
import { z } from 'zod'
import { buildSceneHtml, sceneDimensions, WALLPAPER_FILES, WALLPAPER_EXT, type BrowserChrome, type WallpaperId } from './scene'

export const ScreenshotInputSchema = z.object({
  url: z.string().url(),
  width: z.number().min(320).max(3840).default(1280),
  height: z.number().min(240).max(2160).default(800),
  format: z.enum(['png', 'jpeg', 'webp']).default('png'),
  fullPage: z.boolean().default(false),
  scale: z.number().int().min(1).max(3).default(1),
  darkMode: z.boolean().default(false),
  delay: z.number().min(0).max(10000).default(0),
  browserId: z.enum(['safari', 'chrome', 'firefox', 'arc', 'minimal']).default('chrome'),
  wallpaperId: z.enum(['sonoma', 'ventura', 'tahoe', 'sequoia', 'whitesur']).default('sonoma'),
})

export type ScreenshotInput = z.infer<typeof ScreenshotInputSchema>

const LOCAL_CHROME_CANDIDATES = [
  '/data/data/com.termux/files/usr/bin/chromium-browser',
  '/data/data/com.termux/files/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
]

const CHROME_ARGS = [
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
]

async function resolveChrome(): Promise<string> {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH
  for (const candidate of LOCAL_CHROME_CANDIDATES) {
    if (existsSync(candidate)) return candidate
  }
  return sparticuz.executablePath()
}

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (browser && browser.isConnected()) return browser
  const onVercel = process.env.VERCEL === '1'
  browser = await playwright.launch({
    executablePath: await resolveChrome(),
    headless: true,
    args: onVercel ? sparticuz.args : CHROME_ARGS,
  })
  return browser
}

async function closeContextSafely(context: BrowserContext | null): Promise<void> {
  if (!context) return
  try {
    await context.close()
  } catch {}
}

export async function captureScene(data: ScreenshotInput) {
  let context: BrowserContext | null = null
  let sceneContext: BrowserContext | null = null

  try {
    const b = await getBrowser()

    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

    context = await b.newContext({
      viewport: { width: data.width, height: data.height },
      deviceScaleFactor: data.scale,
      userAgent,
      colorScheme: data.darkMode ? 'dark' : 'light',
    })
    const page = await context.newPage()

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

    const contentH = data.fullPage
      ? Math.min(
          Math.max(
            data.height,
            await page.evaluate(() => document.documentElement.scrollHeight),
          ),
          12000,
        )
      : data.height
    const sceneHeight = data.fullPage ? contentH : data.height

    const dims = sceneDimensions({ width: data.width, height: sceneHeight, browserId: data.browserId as BrowserChrome })
    const sceneHtml = buildSceneHtml({
      url: data.url,
      width: data.width,
      height: sceneHeight,
      browserId: data.browserId as BrowserChrome,
      wallpaperId: data.wallpaperId as WallpaperId,
      dark: data.darkMode,
      format: data.format,
      screenshotDataUri: `data:image/${data.format};base64,${Buffer.from(siteShot).toString('base64')}`,
      wallpaperDataUri: wallpaperDataUri(data.wallpaperId as WallpaperId, data.darkMode),
    })

    sceneContext = await b.newContext({
      viewport: { width: dims.width, height: dims.height },
      deviceScaleFactor: data.scale,
    })
    const scenePage = await sceneContext.newPage()
    await scenePage.setContent(sceneHtml, { waitUntil: 'load' })
    try {
      await scenePage.evaluate(() => (document as Document & { fonts: FontFaceSet }).fonts.ready)
    } catch {}
    try {
      await scenePage.evaluate(() =>
        Promise.all(
          Array.from(document.images).map((img) =>
            img.complete ? Promise.resolve() : img.decode().catch(() => {}),
          ),
        ),
      )
    } catch {}
    await new Promise((r) => setTimeout(r, 350))

    const buffer = await scenePage.screenshot({
      type: data.format,
      ...(data.format === 'jpeg' ? { quality: 92 } : {}),
    })

    await closeContextSafely(context)
    await closeContextSafely(sceneContext)

    return {
      image: Buffer.from(buffer).toString('base64'),
      format: data.format,
      width: dims.width,
      height: dims.height,
      url: data.url,
      capturedAt: new Date().toISOString(),
    }
  } catch (error) {
    await closeContextSafely(context)
    await closeContextSafely(sceneContext)

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

function wallpaperDataUri(wallpaperId: WallpaperId, dark: boolean): string {
  const file = WALLPAPER_FILES[wallpaperId]
  const ext = WALLPAPER_EXT[wallpaperId]
  const path = join(process.cwd(), 'public', 'wallpaper', `${file}-${dark ? 'dark' : 'light'}.${ext}`)
  const buffer = readFileSync(path)
  return `data:image/${ext};base64,${buffer.toString('base64')}`
}