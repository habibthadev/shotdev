import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { rateLimiter } from 'hono-rate-limiter'
import { screenshotRouter } from '@/routes/screenshot'

const app = new Hono()

app.use('*', logger())

app.use(
  '*',
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
)

app.use(
  '/api/screenshot',
  rateLimiter({
    windowMs: 60_000,
    limit: 10,
    standardHeaders: 'draft-6',
    keyGenerator: (c) =>
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for') ??
      'anon',
  })
)

app.route('/api/screenshot', screenshotRouter)

app.get('/health', (c) => c.json({ ok: true, ts: Date.now() }))

app.notFound((c) => c.json({ error: 'Not found' }, 404))

app.onError((_err, c) => {
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
