import { captureScene, ScreenshotInputSchema } from '../utils/capture'
import { assertPublicUrl } from '../utils/ssrf'

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
  try {
    return await captureScene(parsed.data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to capture screenshot'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
