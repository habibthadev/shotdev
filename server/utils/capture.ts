import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { chromium as playwright, type Browser, type BrowserContext } from 'playwright-core'
import sparticuz from '@sparticuz/chromium'
import { z } from 'zod'
import { buildSceneHtml, sceneDimensions, WALLPAPER_FILES, WALLPAPER_EXT, type BrowserChrome, type WallpaperId } from './scene'
import { assertPublicUrl } from './ssrf'

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
  let lastError: Error | null = null
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await captureOnce(data)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to capture screenshot.')
      const msg = lastError.message.toLowerCase()
      const transient =
        msg.includes('crashed') ||
        msg.includes('closed') ||
        msg.includes('context destroyed') ||
        msg.includes('too long')
      if (!transient || attempt === 1) throw lastError
    }
  }
  throw lastError
}

async function captureOnce(data: ScreenshotInput) {
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

    await page.goto(data.url, { waitUntil: 'domcontentloaded', timeout: 10_000 })
    await new Promise((r) => setTimeout(r, 350 + data.delay))

    const isSpa = await page
      .evaluate(() => {
        const w = window as unknown as Record<string, unknown> & {
          __NUXT__?: unknown
          __NEXT_DATA__?: unknown
          __remixContext?: unknown
          __vue_app__?: unknown
        }
        return Boolean(
          w.__NUXT__ ||
            w.__NEXT_DATA__ ||
            w.__remixContext ||
            w.__vue_app__ ||
            document.querySelector('#root, #__next, #app, #mount'),
        )
      })
      .catch(() => false)
    if (isSpa) {
      await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {})
      await new Promise((r) => setTimeout(r, 250))
    }

    const pageMeta = await page
      .evaluate(() => {
        const hrefs = Array.from(
          document.querySelectorAll<HTMLLinkElement>('link[rel~="icon" i], link[rel~="apple-touch-icon" i]'),
        )
          .map((l) => l.href || l.getAttribute('href'))
          .filter((h): h is string => !!h)
          .map((h) => new URL(h, document.baseURI).href)
        return { title: (document.title || '').trim(), hrefs }
      })
      .catch(() => ({ title: '', hrefs: [] }))
    const faviconDataUri = await fetchFaviconDataUri([
      ...pageMeta.hrefs,
      new URL('/favicon.ico', data.url).href,
    ])

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
      faviconDataUri,
      tabTitle: pageMeta.title,
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

function sniffImageType(buf: Buffer, contentType: string): string | null {
  const ct = contentType.toLowerCase()
  if (ct.startsWith('image/')) return ct.split(';')[0]
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png'
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp'
  if (buf.length >= 4 && buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) return 'image/x-icon'
  if (buf.length >= 6 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return 'image/gif'
  const head = buf.subarray(0, Math.min(buf.length, 512)).toString('latin1')
  if (/^\s*(<svg|<\?xml)/i.test(head)) return 'image/svg+xml'
  return null
}

async function fetchFaviconDataUri(hrefs: string[]): Promise<string | null> {
  for (const href of [...new Set(hrefs)]) {
    if (!href) continue
    if (href.startsWith('data:image/')) return href
    if (!/^https?:/i.test(href)) continue
    try {
      await assertPublicUrl(href)
      const res = await fetch(href, { redirect: 'follow', signal: AbortSignal.timeout(6000) })
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())
      if (!buf.length || buf.length > 256 * 1024) continue
      const type = sniffImageType(buf, res.headers.get('content-type') || '')
      if (!type) continue
      return `data:${type};base64,${buf.toString('base64')}`
    } catch {
      continue
    }
  }
  return null
}

function wallpaperDataUri(wallpaperId: WallpaperId, dark: boolean): string {
  const file = WALLPAPER_FILES[wallpaperId]
  const ext = WALLPAPER_EXT[wallpaperId]
  const path = join(process.cwd(), 'public', 'wallpaper', `${file}-${dark ? 'dark' : 'light'}.${ext}`)
  const buffer = readFileSync(path)
  return `data:image/${ext};base64,${buffer.toString('base64')}`
}