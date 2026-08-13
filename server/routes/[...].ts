import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const PUBLIC_DIR = join(process.cwd(), 'dist', 'client')

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.otf': 'font/otf',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
}

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV !== 'production') return
  if (event.path.startsWith('/api/')) return

  const urlPath = decodeURIComponent(event.path.split('?')[0])
  const candidate = join(PUBLIC_DIR, urlPath === '/' ? 'index.html' : urlPath)

  if (candidate.startsWith(PUBLIC_DIR)) {
    const filePath = urlPath.includes('.') ? candidate : `${candidate}.html`
    try {
      const data = await readFile(filePath)
      return new Response(data, {
        headers: { 'content-type': MIME[extname(filePath)] || 'application/octet-stream' },
      })
    } catch {}
    if (!urlPath.includes('.')) {
      try {
        const data = await readFile(join(PUBLIC_DIR, '404.html'))
        return new Response(data, {
          status: 404,
          headers: { 'content-type': 'text/html; charset=utf-8' },
        })
      } catch {}
    }
  }

  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
})
