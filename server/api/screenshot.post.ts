import { captureScene, ScreenshotInputSchema } from '../utils/capture'

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
    return await captureScene(parsed.data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to capture screenshot'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
