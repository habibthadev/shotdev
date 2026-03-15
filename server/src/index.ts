import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './app.js'
import { getBrowser, closeBrowser } from './lib/browser.js'

const PORT = Number(process.env.PORT ?? 3000)

getBrowser()
  .then(() => console.log('[browser] Chromium ready'))
  .catch(() => {
    // Browser initialization will fail if Chromium unavailable; will handle on first request
  })

const server = serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`)
})

const shutdown = async (signal: string) => {
  console.log(`[server] ${signal} — shutting down`)
  server.close()
  await closeBrowser()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
