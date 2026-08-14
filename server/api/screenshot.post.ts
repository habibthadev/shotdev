import { createHash } from 'node:crypto'
import { get, put } from '@vercel/blob'
import { captureScene, ScreenshotInputSchema } from '../utils/capture'
import { assertPublicUrl } from '../utils/ssrf'

type CaptureResult = Awaited<ReturnType<typeof captureScene>>

const CACHE_TTL = 10 * 60 * 1000
const CACHE_MAX = 200
const captureCache = new Map<string, { ts: number; value: CaptureResult }>()

const RATE_LIMIT = 20
const RATE_WINDOW = 60 * 1000
const rateBuckets = new Map<string, { count: number; reset: number }>()

function cacheKey(input: object): string {
  return createHash('sha256').update(JSON.stringify(input)).digest('hex')
}

function blobKey(key: string): string {
  return `captures/${key}.json`
}

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

async function getCachedBlob(key: string): Promise<CaptureResult | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null
  try {
    const res = await get(blobKey(key), { access: 'private' })
    if (!res || res.statusCode !== 200) return null
    const text = await new Response(res.stream).text()
    const data = JSON.parse(text) as { ts: number; value: CaptureResult }
    if (Date.now() - data.ts > CACHE_TTL) return null
    return data.value
  } catch {
    return null
  }
}

async function setCachedBlob(key: string, value: CaptureResult): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return
  try {
    await put(blobKey(key), JSON.stringify({ ts: Date.now(), value }), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: CACHE_TTL / 1000,
      contentType: 'application/json',
    })
  } catch {}
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)
  if (!bucket || now > bucket.reset) {
    rateBuckets.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return false
  }
  bucket.count++
  if (rateBuckets.size > 2000) {
    for (const [k, v] of rateBuckets) {
      if (now > v.reset) rateBuckets.delete(k)
    }
  }
  return bucket.count > RATE_LIMIT
}

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests. Try again in a minute.' })
  }

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

  const key = cacheKey(parsed.data)
  let result = getCached(key) ?? (await getCachedBlob(key))

  if (!result) {
    try {
      result = await captureScene(parsed.data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to capture screenshot'
      throw createError({ statusCode: 500, statusMessage: message })
    }
    setCached(key, result)
    await setCachedBlob(key, result)
  }

  const accept = getRequestHeader(event, 'accept') ?? ''
  if (/image\//i.test(accept) && !/json/i.test(accept)) {
    return new Response(Buffer.from(result.image, 'base64'), {
      headers: {
        'content-type': `image/${result.format}`,
        'cache-control': 'public, max-age=600',
        'x-shot-width': String(result.width),
        'x-shot-height': String(result.height),
        'x-shot-url': result.url,
        'x-shot-format': result.format,
        'x-shot-captured-at': result.capturedAt,
      },
    })
  }
  return result
})
