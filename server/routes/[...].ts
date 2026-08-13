import { readFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const PUBLIC_DIR = join(process.cwd(), 'dist', 'client')

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<meta name="robots" content="noindex, nofollow"/>
<title>Page Not Found — shotdev</title>
<style>
  :root { color-scheme: light; }
  * { margin: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
    min-height: 100dvh; display: flex; align-items: center; justify-content: center;
    background: #f2f2f7; color: #1d1d1f; text-align: center; padding: 24px;
  }
  .wrap { max-width: 480px; }
  .code { font-size: 120px; font-weight: 700; color: rgba(29,29,31,0.22); line-height: 1; margin-bottom: 22px; }
  h1 { font-size: 26px; font-weight: 700; margin-bottom: 12px; }
  p { font-size: 15px; color: #6e6e73; margin-bottom: 32px; line-height: 1.5; }
  a {
    display: inline-block; padding: 11px 24px; border-radius: 10px;
    background: #007aff; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600;
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="code">404</div>
    <h1>Page Not Found</h1>
    <p>The page you're looking for doesn't exist or has moved.</p>
    <a href="/">Go Home</a>
  </div>
</body>
</html>`

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

  if (!urlPath.includes('.') && !urlPath.startsWith('/api/')) {
    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }

  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
})
