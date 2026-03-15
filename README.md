# shot.dev

Capture screenshots of any URL at any viewport — directly from your phone.

## Stack

- **Backend** — Hono + Playwright (Chromium)
- **Frontend** — Vue 3 + Tailwind CSS + shadcn-vue components

## Project structure

```
screenshotter/
├── server/          # Hono API
│   └── src/
│       ├── lib/
│       │   ├── browser.ts    # Singleton Chromium manager
│       │   ├── presets.ts    # Device viewport presets
│       │   ├── screenshot.ts # Core capture logic + stealth
│       │   └── validate.ts   # SSRF protection
│       ├── routes/
│       │   └── screenshot.ts # POST /api/screenshot
│       ├── app.ts            # Hono wiring
│       └── index.ts          # Entry + graceful shutdown
└── client/          # Vue 3 app
    └── src/
        ├── composables/useScreenshot.ts
        ├── components/
        │   ├── DeviceSelector.vue
        │   ├── CustomViewport.vue
        │   ├── ScreenshotForm.vue
        │   └── ScreenshotResult.vue
        ├── lib/
        │   ├── api.ts         # Typed fetch client
        │   └── utils.ts       # cn helper
        └── App.vue
```

## Getting started

```bash
# Install all deps (includes playwright chromium download)
npm run install:all

# Dev — starts both server (:3000) and client (:5173)
npm run dev
```

## API

### POST /api/screenshot

```json
{
  "url": "https://example.com",
  "preset": "desktop",         // desktop | laptop | tablet | mobile-portrait | mobile-landscape | custom
  "fullPage": true,
  "format": "png",             // png | jpeg
  "delay": 0,                  // ms to wait after networkidle (0–10000)
  "customViewport": {          // only used when preset = "custom"
    "width": 1280,
    "height": 800,
    "deviceScaleFactor": 1,
    "isMobile": false,
    "hasTouch": false,
    "userAgent": "Mozilla/5.0 ..."
  }
}
```

Returns the image binary (`image/png` or `image/jpeg`).

### GET /api/screenshot/presets

Returns available preset keys with their dimensions.

## Deployment

### Railway / Render

1. Push to GitHub
2. Connect repo, set root to `server/`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Set `CLIENT_URL` env var to your frontend origin

No Docker needed — Playwright installs Chromium during `postinstall`.

## Security notes

- SSRF protection blocks all private IP ranges (RFC-1918), loopback, link-local
- DNS rebinding protection: all resolved addresses are checked, not just the first
- Rate limited to 10 captures/minute/IP
- Per-request isolated browser contexts prevent session bleed
- Media files (video/audio) are aborted to reduce load time
