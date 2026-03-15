import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { validateUrl } from '@/lib/validate'
import { takeScreenshot } from '@/lib/screenshot'
import { DEVICE_PRESETS } from '@/lib/presets'

const presetKeys = Object.keys(DEVICE_PRESETS) as [string, ...string[]]

const screenshotSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  preset: z.enum(presetKeys as [string, ...string[]]).default('desktop'),
  fullPage: z.boolean().default(true),
  format: z.enum(['png', 'jpeg']).default('png'),
  delay: z.number().int().min(0).max(10_000).default(0),
  customViewport: z
    .object({
      width: z.number().int().min(320).max(3840).optional(),
      height: z.number().int().min(240).max(2160).optional(),
      deviceScaleFactor: z.number().min(1).max(3).optional(),
      isMobile: z.boolean().optional(),
      hasTouch: z.boolean().optional(),
      userAgent: z.string().min(1).max(500).optional(),
    })
    .optional(),
})

export type ScreenshotPayload = z.infer<typeof screenshotSchema>

export const screenshotRouter = new Hono()

screenshotRouter.post('/', zValidator('json', screenshotSchema), async (c) => {
  const body = c.req.valid('json')

  const safety = await validateUrl(body.url)
  if (!safety.safe) {
    return c.json({ error: safety.reason }, 400)
  }

  const result = await takeScreenshot({
    url: body.url,
    preset: body.preset as keyof typeof DEVICE_PRESETS,
    fullPage: body.fullPage,
    format: body.format,
    delay: body.delay,
    customViewport: body.customViewport,
  })

  if (result.error) {
    const status = result.error.code === 'TIMEOUT' ? 408 : 422
    return c.json({ error: result.error.message }, status)
  }

  const contentType = body.format === 'jpeg' ? 'image/jpeg' : 'image/png'

  return new Response(result.buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(result.buffer.length),
      'Cache-Control': 'no-store',
      'X-Preset': body.preset,
    },
  })
})

screenshotRouter.get('/presets', (c) => {
  const presets = Object.entries(DEVICE_PRESETS).map(([key, val]) => ({
    key,
    width: val.width,
    height: val.height,
    isMobile: val.isMobile,
  }))
  return c.json({ presets })
})
