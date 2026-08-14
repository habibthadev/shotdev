import { captureScene, ScreenshotInputSchema } from '../utils/capture'
import { assertPublicUrl } from '../utils/ssrf'

type CaptureResult = Awaited<ReturnType<typeof captureScene>>

const CACHE_TTL = 10 * 60 * 1000
const CACHE_MAX = 200
const captureCache = new Map<string, { ts: number; value: CaptureResult }>()

function getCached(key: string): CaptureResult | null {
  const entry = captureCache.get(key)
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL) {
    captureCache.delete(key)
    return null
  }
  return entry.value
}

function setCached(key: string, value: CaptureResult) {
  captureCache.set(key, { ts: Date.now(), value })
  if (captureCache.size > CACHE_MAX) {
    for (const [k, v] of captureCache) {
      if (Date.now() - v.ts > CACHE_TTL) captureCache.delete(k)
    }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  const parsed = ScreenshotInputSchema.safeParse(body ?? {})
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.errors[0]?.message || 'Invalid input',
    })
  }
  try {
    await assertPublicUrl(parsed.data.url)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Invalid URL',
    })
  }
  const key = JSON.stringify(parsed.data)
  const cached = getCached(key)
  if (cached) return cached
  try {
    const result = await captureScene(parsed.data)
    setCached(key, result)
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to capture screenshot'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
