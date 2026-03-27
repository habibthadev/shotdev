# Shots - macOS Screenshot Studio

A beautiful web app for creating macOS-style screenshots with browser chrome mockups.

## Features

- 🎨 **Browser Chrome Mockups**: Safari, Chrome, Firefox, Arc, and Minimal styles
- 🖼️ **macOS Wallpapers**: 18 authentic wallpapers organized by era (Sonoma, Ventura, Monterey, Big Sur, Catalina, Mojave)
- ⚙️ **Customizable Settings**: Viewport size, format (PNG/JPEG/WebP), full page, dark mode, delay
- 📸 **Real Screenshots**: Uses Playwright to capture actual website screenshots
- 🎯 **Apple Design**: Built with Apple Human Interface Guidelines

## Tech Stack

- **Framework**: TanStack Start (React 19 + SSR)
- **Styling**: Tailwind CSS v4
- **Screenshots**: Playwright
- **State**: Zustand
- **Validation**: Zod
- **Icons**: Phosphor Icons

## Getting Started

### Prerequisites

- Node.js 18+ or pnpm
- Playwright dependencies (see below)

### Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
npx playwright install chromium

# For proot-distro/Termux, also install system dependencies:
apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

```bash
pnpm build
pnpm start
```

## Usage

### Basic Usage

1. Enter a URL (e.g., `https://github.com`)
2. Select a browser chrome style
3. Choose a macOS wallpaper
4. Adjust settings (viewport, format, etc.)
5. Click "Capture Screenshot"
6. Download or copy to clipboard

### URL Parameters

You can pre-fill settings via URL:

```
/github.com?browser=safari&wallpaper=sonoma-1&width=1440&height=900&format=png
```

**Parameters:**
- `browser`: `safari` | `chrome` | `firefox` | `arc` | `minimal`
- `wallpaper`: `sonoma-1`, `ventura-1`, etc.
- `width`: viewport width (320-3840)
- `height`: viewport height (240-2160)
- `format`: `png` | `jpeg` | `webp`
- `fullPage`: `true` | `false`
- `darkMode`: `true` | `false`
- `delay`: delay in ms (0-10000)

## Deployment

### Vercel (Recommended for UI only)

Note: Playwright doesn't work in Vercel's serverless environment. For full functionality, use Railway, Render, or Docker.

```bash
vercel deploy
```

### Railway / Render

### Render.com (Recommended)

Render has great Playwright support. Use the included `render.yaml`:

1. Connect your GitHub repository to Render
2. Render will automatically detect `render.yaml`
3. Deploy!

The `render.yaml` includes:
- Automatic Playwright + Chromium installation
- Proper system dependencies
- Production build configuration

### Vercel / Netlify (UI Only)

**Important**: Serverless platforms don't support Playwright. Screenshots won't work.

These platforms are fine for the UI, but you'll need an external screenshot API:
1. Use a dedicated screenshot service (like Puppeteer API, Screenshot.rocks, etc.)
2. Or deploy to a platform with server support (Render, Railway, Fly.io)

### Docker

```dockerfile
FROM node:20-slim

# Install Playwright dependencies
RUN apt-get update && apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
  libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 \
  libxfixes3 libxrandr2 libgbm1 libasound2 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
RUN npx playwright install chromium

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

## Troubleshooting

### Playwright Issues

If screenshots fail:

1. **Check browser installation**: `npx playwright install chromium`
2. **Check system dependencies**: Install the packages listed above
3. **Check URL**: Ensure it's accessible and starts with `http://` or `https://`
4. **Increase delay**: Some sites need more time to render
5. **Check console**: Look for detailed error messages

#### Known Limitations (proot-distro only)

When running in **proot-distro** (Termux on Android):

- ⚠️ **Complex sites may crash**: GitHub, Twitter, and other heavy JavaScript sites often crash Chromium
- ✅ **Simple sites work fine**: Static sites, blogs, documentation sites work well
- 🔧 **Workaround**: For production, deploy to a real Linux server (Render, Railway, etc.)

**Why?** proot emulates root but doesn't provide real kernel isolation. Chromium's multi-process architecture struggles without proper namespace support.

### Performance

For large wallpapers (>1MB):

1. Images are lazy loaded by default
2. Only the selected wallpaper loads at full resolution
3. Thumbnails are loaded on-demand

### proot-distro Specific

If running in Termux/proot-distro:

- Chromium runs with `--no-sandbox --single-process` flags
- Some heavy sites may timeout - increase the delay setting
- Consider using Firefox screenshots as an alternative

## License

MIT

## Credits

- Wallpapers: Apple Inc.
- Icons: Phosphor Icons
- Design: Apple Human Interface Guidelines
