import { createServerFn } from '@tanstack/react-start'
import { chromium, type Browser, type Page } from 'playwright'
import { z } from 'zod'

const ScreenshotInputSchema = z.object({
  url: z.string().url(),
  width: z.number().min(320).max(3840).default(1280),
  height: z.number().min(240).max(2160).default(800),
  format: z.enum(['png', 'jpeg', 'webp']).default('png'),
  fullPage: z.boolean().default(false),
  darkMode: z.boolean().default(false),
  delay: z.number().min(0).max(10000).default(0),
})

export type ScreenshotInput = z.infer<typeof ScreenshotInputSchema>

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: true,
      timeout: 60000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-site-isolation-trials',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-blink-features=AutomationControlled',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-extensions',
      ],
    })
  }
  return browser
}

async function closePageSafely(page: Page): Promise<void> {
  try {
    await page.close({ runBeforeUnload: false })
  } catch {}
}

export const takeScreenshot = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    const result = ScreenshotInputSchema.safeParse(data)
    if (!result.success) {
      throw new Error(result.error.errors[0]?.message || 'Invalid input')
    }
    return result.data
  })
  .handler(async ({ data }) => {
    let page: Page | null = null
    let context = null
    
    try {
      const b = await getBrowser()
      
      context = await b.newContext({
        viewport: { width: data.width, height: data.height },
        colorScheme: data.darkMode ? 'dark' : 'light',
        deviceScaleFactor: 1,
        hasTouch: false,
        isMobile: false,
        javaScriptEnabled: true,
        bypassCSP: true,
        ignoreHTTPSErrors: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      })
      
      page = await context.newPage()

      await page.goto(data.url, {
        waitUntil: 'load',
        timeout: 30_000,
      })
      
      await page.waitForTimeout(1000 + data.delay)

      const buffer = await page.screenshot({
        type: data.format,
        fullPage: data.fullPage,
        animations: 'disabled',
        ...(data.format === 'jpeg' ? { quality: 92 } : {}),
      })

      await closePageSafely(page)
      await context.close()

      return {
        image: buffer.toString('base64'),
        format: data.format,
        width: data.width,
        height: data.height,
        url: data.url,
        capturedAt: new Date().toISOString(),
      }
    } catch (error) {
      if (page) await closePageSafely(page)
      if (context) await context.close().catch(() => {})
      
      if (error instanceof Error) {
        const msg = error.message.toLowerCase()
        
        if (msg.includes('timeout')) {
          throw new Error('Page took too long to load. Try increasing the delay.')
        }
        if (msg.includes('net::') || msg.includes('network')) {
          throw new Error('Failed to load URL. Check the URL and try again.')
        }
        if (msg.includes('crashed') || msg.includes('closed')) {
          throw new Error('Browser crashed. This site may not be compatible.')
        }
        
        throw new Error(error.message)
      }
      
      throw new Error('Failed to capture screenshot.')
    }
  })
