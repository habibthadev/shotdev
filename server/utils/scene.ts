import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export type BrowserChrome = 'safari' | 'chrome' | 'firefox' | 'arc' | 'minimal'

export type WallpaperId = 'sonoma' | 'ventura' | 'tahoe' | 'sequoia' | 'whitesur'

export const WALLPAPER_FILES: Record<WallpaperId, string> = {
  sonoma: 'sonoma',
  ventura: 'ventura',
  tahoe: 'tahoe',
  sequoia: 'sequoai',
  whitesur: 'whitesur',
}

export const WALLPAPER_EXT: Record<WallpaperId, string> = {
  sonoma: 'jpg',
  ventura: 'jpg',
  tahoe: 'jpg',
  sequoia: 'jpg',
  whitesur: 'png',
}

export type SceneInput = {
  url: string
  width: number
  height: number
  browserId: BrowserChrome
  wallpaperId: WallpaperId
  dark: boolean
  format: 'png' | 'jpeg' | 'webp'
  screenshotDataUri: string
  wallpaperDataUri: string
}

export const CHROME_UI: Record<BrowserChrome, number> = {
  chrome: 116,
  safari: 38,
  firefox: 76,
  arc: 38,
  minimal: 36,
}

export function sceneDimensions(input: Pick<SceneInput, 'width' | 'height' | 'browserId'>) {
  const chromeH = CHROME_UI[input.browserId]
  return {
    width: input.width + 96,
    height: input.height + chromeH + 180,
    chromeH,
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const APP_NAMES: Record<BrowserChrome, string> = {
  safari: 'Safari',
  chrome: 'Chrome',
  firefox: 'Firefox',
  arc: 'Arc',
  minimal: 'Finder',
}

const MENUS = ['File', 'Edit', 'View', 'History', 'Bookmarks', 'Profiles', 'Tab', 'Window', 'Help']

const FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif"

const FONT_FILES: Array<{ file: string; weight: number }> = [
  { file: 'SFPRODISPLAYREGULAR.OTF', weight: 400 },
  { file: 'SFPRODISPLAYMEDIUM.OTF', weight: 500 },
  { file: 'SFPRODISPLAYBOLD.OTF', weight: 700 },
]

function loadEmbeddedFontCss(): string {
  const dir = join(process.cwd(), 'public', 'fonts')
  return FONT_FILES.map(({ file, weight }) => {
    const path = join(dir, file)
    if (!existsSync(path)) return ''
    const b64 = readFileSync(path).toString('base64')
    return `@font-face { font-family: 'SF Pro Display'; src: url(data:font/otf;base64,${b64}) format('opentype'); font-weight: ${weight}; font-style: normal; font-display: swap; }`
  }).join('\n')
}

const EMBEDDED_FONT_CSS = loadEmbeddedFontCss()

const MENUBAR_ICONS = {
  apple: `<svg width="14" height="14" viewBox="0 0 24 24" style="fill:currentColor"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.702"/></svg>`,
  wifi: `<svg width="15" height="11" viewBox="0 0 15 12" fill="none" style="stroke:currentColor;stroke-width:1.3;stroke-linecap:round"><path d="M1 4.6a7.4 7.4 0 0 1 13 0"/><path d="M3.7 7a4.6 4.6 0 0 1 7.6 0"/><circle cx="7.5" cy="9.7" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  battery: `<svg width="18" height="11" viewBox="0 0 18 11" fill="none" style="stroke:currentColor;stroke-width:1.1"><rect x="0.6" y="0.6" width="13.6" height="9.8" rx="2.8"/><rect x="2.4" y="2.4" width="9" height="6.2" rx="1.6" fill="currentColor" stroke="none"/><path d="M16 3.8v3.4" style="stroke-linecap:round"/></svg>`,
  spotlight: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" style="stroke:currentColor;stroke-width:1.2"><circle cx="5.4" cy="5.4" r="4"/><path d="M8.4 8.4l3.3 3.3" style="stroke-width:1.5;stroke-linecap:round"/></svg>`,
  controlCenter: `<svg width="15" height="12" viewBox="0 0 16 13" fill="none" style="stroke:currentColor;stroke-width:1.2"><rect x="0.9" y="0.9" width="14.2" height="11.2" rx="3.2"/><path d="M3 4.2h10" style="stroke-width:1.4;stroke-linecap:round"/><path d="M4.2 8.5h7.6" style="stroke-width:1.4;stroke-linecap:round"/></svg>`,
}

const CHROME_ICONS = {
  back: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><path d="M10.2 3 5.4 8l4.8 5"/></svg>`,
  forward: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"><path d="M5.8 3l4.8 5-4.8 5"/></svg>`,
  reload: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.6;stroke-linecap:round"><path d="M13.4 8a5.4 5.4 0 1 1-1.7-4"/><path d="M13.7 2.3v3.2h-3.2" style="stroke-linejoin:round"/></svg>`,
  lock: `<svg width="11" height="12" viewBox="0 0 11 12" fill="none"><rect x="1" y="5" width="9" height="6.4" rx="1.5" fill="#5F6368"/><path d="M2.6 5V3.1a2.9 2.9 0 0 1 5.8 0V5" style="stroke:#5F6368;stroke-width:1.5"/></svg>`,
  star: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.2;stroke-linejoin:round"><path d="m8 2.3 1.7 3.4 3.8.6-2.7 2.7.6 3.8-3.4-1.8-3.4 1.8.6-3.8L2.5 6.3l3.8-.6Z"/></svg>`,
  extensions: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.3"><rect x="4.6" y="4.6" width="6.8" height="6.8" rx="1.6"/><path d="M8 1.5v3.1M8 11.4v3.1M1.5 8h3.1M11.4 8h3.1" style="stroke-linecap:round"/></svg>`,
  menu: `<svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3.2" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="8" cy="12.8" r="1.3"/></svg>`,
  close: `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" style="stroke:currentColor;stroke-width:1.3;stroke-linecap:round"><path d="M2 2l5 5M7 2l-5 5"/></svg>`,
  newTab: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="stroke:currentColor;stroke-width:1.4;stroke-linecap:round"><path d="M7 2.5v9M2.5 7h9"/></svg>`,
  tabSearch: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.5;stroke-linecap:round"><path d="M8 3.8a3.2 3.2 0 0 1 3.2 3.2M8 1.8a5.2 5.2 0 0 1 5.2 5.2"/><circle cx="8" cy="10.5" r="3.3"/><path d="M10.5 12.6l2.4 2.4"/></svg>`,
  windowControls: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.3;stroke-linejoin:round"><path d="M4 4.5h8v7H4z"/><path d="M4 7h8"/></svg>`,
  goArrow: `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" style="stroke:#5F6368;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"><path d="M5.5 13.5 11 8 5.5 2.5"/></svg>`,
  apps: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" style="stroke:currentColor;stroke-width:1.1"><rect x="2" y="2" width="10" height="10" rx="2.5"/><circle cx="7" cy="7" r="2" fill="currentColor" stroke="none"/></svg>`,
  add: `<svg width="13" height="13" viewBox="0 0 14 14" fill="none" style="stroke:currentColor;stroke-width:1.1;stroke-linecap:round"><path d="M7 1.5v11M1.5 7h11"/></svg>`,
}

const FAVICONS = {
  gmail: `<svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="2.5" width="14" height="11" rx="2.5" fill="#EA4335"/><path d="M2.8 5.4h10.4a1 1 0 0 1 1 1v5.2a1 1 0 0 1-1 1H2.8a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1Z" fill="none" style="stroke:#fff;stroke-width:1.15"/><path d="M3 5.7l5 3.4 5-3.4" style="stroke:#fff;stroke-width:1.15;stroke-linejoin:round" fill="none"/><path d="M4.6 12.2l1.5-2M6.4 9.6l1.6 2.2M8 11.8l1.7-2.2M9.9 9.6l1.5 2" style="stroke:#fff;stroke-width:1.15;stroke-linecap:round"/></svg>`,
  shotdev: `<svg width="16" height="16" viewBox="0 0 16 16"><rect x="1" y="1" width="14" height="14" rx="3.5" fill="#007AFF"/><path d="M5.4 4.4h5.2L11.6 6H14v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6h2.4Z" fill="#fff"/><circle cx="8" cy="9" r="2.2" fill="#007AFF"/></svg>`,
  github: `<svg width="14" height="14" viewBox="0 0 16 16"><path fill="#24292F" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
  figma: `<svg width="14" height="14" viewBox="0 0 20 20"><circle cx="5" cy="4" r="4" fill="#F24E1E"/><circle cx="5" cy="10" r="4" fill="#0ACF83"/><circle cx="5" cy="16" r="4" fill="#A259FF"/><circle cx="11" cy="4" r="4" fill="#FF7262"/><circle cx="11" cy="10" r="4" fill="#1ABCFE"/></svg>`,
  vercel: `<svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 3.5 22.5 20.5h-21Z" fill="#000"/></svg>`,
  youtube: `<svg width="14" height="14" viewBox="0 0 14 14"><rect width="14" height="14" rx="3.5" fill="#FF0000"/><path d="M5.7 4.6 10 7l-4.3 2.4Z" fill="#fff"/></svg>`,
}

const DOCK_ICONS = {
  finder: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="3" y="3" width="42" height="42" rx="9.5" fill="#4DA6FF"/><path d="M24 3h-11.5A9.5 9.5 0 0 0 3 12.5V33a9.5 9.5 0 0 0 9.5 9.5H24Z" fill="#007AFF"/><path d="M10.5 26.5c3.8 4.6 9.6 4.6 13.5 0" style="stroke:#fff;stroke-width:2.4;stroke-linecap:round" fill="none"/></svg>`,
  chrome: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><path d="M24 24 9.86 10.14A20 20 0 0 1 24 4Z" fill="#4285F4"/><path d="M24 24 24 4a20 20 0 0 1 14.14 6.14Z" fill="#EA4335"/><path d="M24 24l14.14 6.14A20 20 0 0 1 24 44Z" fill="#FBBC05"/><path d="M24 24 24 44a20 20 0 0 1-14.14-6.14Z" fill="#34A853"/><circle cx="24" cy="24" r="8.5" fill="#fff"/><circle cx="24" cy="24" r="4" fill="#4285F4"/></svg>`,
  safari: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><defs><linearGradient id="sg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8ED8FF"/><stop offset="1" stopColor="#0A7DFF"/></linearGradient></defs><circle cx="24" cy="24" r="20" fill="url(#sg1)"/><path d="M24 12.5 27 27l-3 1-3-1Z" fill="#fff"/><path d="M24 35.5 27 27l-3 1-3-1Z" fill="#FF3B30"/></svg>`,
  mail: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="4" y="4" width="40" height="40" rx="9.5" fill="#3F9BFF"/><rect x="10" y="16" width="28" height="17" rx="3.5" fill="#fff"/><path d="M10.5 17.5 24 26.5 37.5 17.5" style="stroke:#3F9BFF;stroke-width:2.6;stroke-linejoin:round" fill="none"/></svg>`,
  messages: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="4" y="4" width="40" height="40" rx="10" fill="#3FE58C"/><path d="M12 15h24a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H21.5L14.5 37v-5H12a3 3 0 0 1-3-3V18a3 3 0 0 1 3-3Z" fill="#fff"/></svg>`,
  notes: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="4" y="4" width="40" height="40" rx="10" fill="#FFD60A"/><path d="M11 13h26v3.5H11Z" fill="#E5B800"/><path d="M12.5 22h23M12.5 27.5h18M12.5 33h21" style="stroke:#B8860B;stroke-width:2.6;stroke-linecap:round;opacity:.55"/></svg>`,
  calendar: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="4" y="4" width="40" height="40" rx="9" fill="#fff" style="stroke:#E3E3E8;stroke-width:1.5"/><path d="M4 13a9 9 0 0 1 9-9h22a9 9 0 0 1 9 9v4.5H4Z" fill="#FF453A"/><rect x="13" y="2" width="3.6" height="6" rx="1.8" fill="#FF453A"/><rect x="31.4" y="2" width="3.6" height="6" rx="1.8" fill="#FF453A"/><text x="24" y="34" text-anchor="middle" style="font:700 15px system-ui;fill:#1C1C1E">17</text></svg>`,
  photos: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="4" y="4" width="40" height="40" rx="9.5" fill="#fff" style="stroke:#E3E3E8;stroke-width:1.5"/><circle cx="24" cy="15.5" r="6.5" fill="#FFD60A"/><circle cx="33" cy="24" r="6.5" fill="#34C759"/><circle cx="24" cy="32.5" r="6.5" fill="#FF9F0A"/><circle cx="15" cy="24" r="6.5" fill="#FF375F"/><circle cx="24" cy="24" r="4.5" fill="#fff"/></svg>`,
  music: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><defs><linearGradient id="mg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FD8BA0"/><stop offset="1" stopColor="#FC5C7D"/></linearGradient></defs><rect x="4" y="4" width="40" height="40" rx="10" fill="url(#mg1)"/><path d="M18.5 34.5V16.5l13.5-3.2v20.4" style="stroke:#fff;stroke-width:3.4;stroke-linecap:round" fill="none"/><circle cx="15.2" cy="34.8" r="4.4" fill="#fff"/><circle cx="28.7" cy="33.7" r="4.4" fill="#fff"/></svg>`,
  terminal: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="4" y="4" width="40" height="40" rx="10" fill="#2B2B2E"/><path d="M13.5 16.5 20.5 23l-7 6.5" style="stroke:#fff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round" fill="none"/><path d="M22.5 29.5h12" style="stroke:#fff;stroke-width:3.2;stroke-linecap:round"/></svg>`,
  trash: `<svg viewBox="0 0 48 48" style="width:44px;height:44px"><rect x="4" y="4" width="40" height="40" rx="10" fill="#fff" opacity=".75"/><path d="M16.5 18.5h15l-1.4 18.2a3 3 0 0 1-3 2.6h-6.2a3 3 0 0 1-3-2.6Z" fill="#B8BDC4"/><rect x="13.5" y="13.5" width="21" height="5" rx="2.4" fill="#B8BDC4"/><path d="M20 13.5v-1.2a4 4 0 0 1 8 0v1.2" style="stroke:#B8BDC4;stroke-width:2.6" fill="none"/><path d="M20 19v17M24 19v17.3M28 19v17" style="stroke:#fff;stroke-width:2;opacity:.6"/></svg>`,
}

const DOCK_ORDER: { label: string; icon: keyof typeof DOCK_ICONS; running?: boolean }[] = [
  { label: 'Finder', icon: 'finder', running: true },
  { label: 'Chrome', icon: 'chrome', running: true },
  { label: 'Safari', icon: 'safari', running: true },
  { label: 'Mail', icon: 'mail' },
  { label: 'Messages', icon: 'messages' },
  { label: 'Notes', icon: 'notes' },
  { label: 'Calendar', icon: 'calendar' },
  { label: 'Photos', icon: 'photos' },
  { label: 'Music', icon: 'music' },
  { label: 'Terminal', icon: 'terminal' },
]

function trafficLights(size = 12) {
  return `<span style="display:inline-flex;gap:6px;margin-right:8px;flex-shrink:0"><span style="width:${size}px;height:${size}px;border-radius:50%;background:#FF5F57;border:1px solid rgba(0,0,0,.1)"></span><span style="width:${size}px;height:${size}px;border-radius:50%;background:#FFBD2E;border:1px solid rgba(0,0,0,.1)"></span><span style="width:${size}px;height:${size}px;border-radius:50%;background:#28CA42;border:1px solid rgba(0,0,0,.1)"></span></span>`
}

function bookmarksRow(dark: boolean) {
  const color = dark ? 'rgba(255,255,255,0.75)' : '#3C4043'
  const items = [
    { icon: FAVICONS.shotdev, label: 'Shotdev' },
    { icon: FAVICONS.github, label: 'GitHub' },
    { icon: FAVICONS.figma, label: 'Figma' },
    { icon: FAVICONS.vercel, label: 'Vercel' },
    { icon: FAVICONS.youtube, label: 'YouTube' },
  ]
  const item = (i: string, l: string) =>
    `<span style="display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 8px;border-radius:6px;font-size:12px;color:${color};cursor:default">${i}<span style="white-space:nowrap">${l}</span></span>`
  return (
    `<div style="height:32px;display:flex;align-items:center;gap:4px;padding:0 12px;background:${dark ? '#2d2d2d' : '#f1f3f4'};border-top:1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}">` +
    items.map((x) => item(x.icon, x.label)).join('') +
    `<span style="margin-left:auto;display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 8px;border-radius:6px;font-size:12px;color:${color}">${CHROME_ICONS.apps}<span>Apps</span></span>` +
    `<span style="display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 8px;border-radius:6px;font-size:12px;color:${color}">${CHROME_ICONS.add}<span>Add</span></span>` +
    `</div>`
  )
}

function chromeWindowMarkup(url: string, shot: string, vh: number, dark: boolean) {
  const fg = dark ? 'rgba(255,255,255,0.85)' : '#202124'
  const fgMuted = dark ? 'rgba(255,255,255,0.5)' : '#5F6368'
  const stripBg = dark ? 'linear-gradient(#383838,#313131)' : 'linear-gradient(#e3e6e8,#dadddf)'
  const toolbarBg = dark ? '#2d2d2d' : '#dee1e6'
  const pillBg = dark ? '#1e1e1e' : '#ffffff'

  const toolBtn = (icon: string, label: string) =>
    `<span style="width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:${fgMuted};flex-shrink:0" title="${label}">${icon}</span>`

  return (
    `<div style="height:40px;display:flex;align-items:center;gap:4px;padding:0 8px 0 12px;background:${stripBg}">` +
    trafficLights() +
    `<span style="display:inline-flex;align-items:center;gap:8px;height:100%;padding:0 12px;border-radius:9px 9px 0 0;color:${fgMuted};font-size:12px;max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${FAVICONS.gmail}Inbox (3) — Gmail</span>` +
    `<span style="display:inline-flex;align-items:center;gap:8px;height:100%;padding:0 12px;border-radius:9px 9px 0 0;background:${dark ? '#2d2d2d' : '#ffffff'};box-shadow:0 1px 0 rgba(0,0,0,.05);color:${fg};font-size:12px;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${FAVICONS.shotdev}shotdev — Screenshot any website</span>` +
    `<span style="width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:${fgMuted};flex-shrink:0">${CHROME_ICONS.newTab}</span>` +
    `<span style="margin-left:auto;display:inline-flex;align-items:center;gap:2px">` +
    toolBtn(CHROME_ICONS.tabSearch, 'Tab search') +
    toolBtn(CHROME_ICONS.windowControls, 'Window controls') +
    `</span></div>` +
    `<div style="height:44px;display:flex;align-items:center;gap:2px;padding:0 12px;background:${toolbarBg}">` +
    toolBtn(CHROME_ICONS.back, 'Back') +
    toolBtn(CHROME_ICONS.forward, 'Forward') +
    toolBtn(CHROME_ICONS.reload, 'Reload') +
    `<span style="flex:1;display:flex;justify-content:center;padding:0 12px"><span style="height:28px;max-width:560px;width:100%;border-radius:14px;background:${pillBg};box-shadow:0 1px 2.5px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px;padding:0 14px">${CHROME_ICONS.lock}<span style="font-size:12.5px;color:${fg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(url)}</span><span style="margin-left:auto">${CHROME_ICONS.goArrow}</span></span></span>` +
    toolBtn(CHROME_ICONS.extensions, 'Extensions') +
    toolBtn(CHROME_ICONS.star, 'Bookmark') +
    toolBtn(CHROME_ICONS.menu, 'Menu') +
    `<span style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#4285F4,#9B72CB);color:#fff;font-size:11px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;margin-left:2px;flex-shrink:0">S</span>` +
    `</div>` +
    bookmarksRow(dark) +
    `<img src="${shot}" style="display:block;width:100%;height:${vh}px;object-fit:cover;object-position:top;background:${dark ? '#1e1e1e' : '#ffffff'}" />`
  )
}

function singleRowWindow(
  url: string,
  shot: string,
  vh: number,
  dark: boolean,
  palette: { toolbar: string; pill: string; border: string },
) {
  const fg = dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
  return (
    `<div style="display:flex;align-items:center;gap:8px;padding:0 14px;height:38px;background:${palette.toolbar};border-bottom:1px solid ${palette.border}">` +
    trafficLights() +
    `<span style="flex:1;display:flex;justify-content:center;padding:0 20px"><span style="height:28px;max-width:520px;width:100%;border-radius:6px;background:${palette.pill};display:flex;align-items:center;gap:8px;padding:0 14px"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" style="stroke:${dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'};stroke-width:1;flex-shrink:0"><circle cx="6" cy="6" r="5"/></svg><span style="font-size:12px;color:${fg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(url)}</span></span></span>` +
    `</div>` +
    `<img src="${shot}" style="display:block;width:100%;height:${vh}px;object-fit:cover;object-position:top;background:${dark ? '#1e1e1e' : '#ffffff'}" />`
  )
}

function firefoxWindow(url: string, shot: string, vh: number, dark: boolean) {
  const toolbar = dark ? '#2b2a33' : '#f9f9fb'
  const pill = dark ? '#1c1b22' : '#ffffff'
  const fg = dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
  return (
    `<div style="display:flex;align-items:center;gap:8px;padding:0 14px;height:36px;background:${toolbar}">` +
    trafficLights() +
    `<span style="display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 10px;border-radius:5px;background:${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};font-size:11.5px;color:${fg};flex-shrink:0">New Tab</span>` +
    `<span style="margin-left:auto;width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:${fg}">+</span>` +
    `</div>` +
    `<div style="display:flex;align-items:center;gap:8px;padding:0 14px;height:40px;background:${toolbar};border-bottom:1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}">` +
    `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="stroke:${dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)'};stroke-width:1;flex-shrink:0"><circle cx="7" cy="7" r="6"/></svg>` +
    `<span style="flex:1;display:flex;align-items:center;gap:8px;height:28px;border-radius:4px;background:${pill};padding:0 12px"><span style="font-size:12px;color:${fg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(url)}</span></span>` +
    `</div>` +
    `<img src="${shot}" style="display:block;width:100%;height:${vh}px;object-fit:cover;object-position:top;background:${dark ? '#1c1b22' : '#ffffff'}" />`
  )
}

function arcWindow(url: string, shot: string, vh: number, dark: boolean) {
  const sidebar = dark ? '#1e1e1e' : '#f5f5f5'
  const fg = dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)'
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  return (
    `<div style="display:flex;height:100%">` +
    `<div style="width:64px;flex-shrink:0;background:${sidebar};border-right:1px solid ${border};display:flex;flex-direction:column;align-items:center;padding:14px 0 10px;gap:14px"><span style="transform:scale(0.8)">${trafficLights(10)}</span><span style="width:28px;height:28px;border-radius:8px;background:${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}"></span></div>` +
    `<div style="flex:1;display:flex;flex-direction:column;min-width:0">` +
    `<div style="height:38px;display:flex;align-items:center;padding:0 16px;background:${dark ? '#1e1e1e' : '#ffffff'};border-bottom:1px solid ${border}"><span style="font-size:12px;color:${fg};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(url)}</span></div>` +
    `<img src="${shot}" style="display:block;width:100%;height:${vh}px;object-fit:cover;object-position:top;background:${dark ? '#1e1e1e' : '#ffffff'}" />` +
    `</div></div>`
  )
}

function windowMarkup(browserId: BrowserChrome, url: string, shot: string, vh: number, dark: boolean) {
  switch (browserId) {
    case 'chrome':
      return chromeWindowMarkup(url, shot, vh, dark)
    case 'safari':
      return singleRowWindow(url, shot, vh, dark, {
        toolbar: dark ? '#2d2d2d' : '#f6f6f6',
        pill: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
        border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
      })
    case 'firefox':
      return firefoxWindow(url, shot, vh, dark)
    case 'arc':
      return arcWindow(url, shot, vh, dark)
    case 'minimal':
      return singleRowWindow(url, shot, vh, dark, {
        toolbar: dark ? '#2d2d2d' : '#f6f6f6',
        pill: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
        border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
      })
  }
}

function menubarMarkup(appName: string, dark: boolean) {
  const fg = dark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)'
  const muted = dark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'
  const bg = dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.55)'
  const border = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'
  const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return (
    `<div style="position:absolute;top:0;left:0;right:0;height:28px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;background:${bg};backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid ${border};color:${fg};font-size:13px;font-family:${FONT}">` +
    `<div style="display:flex;align-items:center;gap:8px;min-width:0">` +
    MENUBAR_ICONS.apple +
    `<span style="font-weight:600;margin-right:4px">${appName}</span>` +
    MENUS.map((m) => `<span style="padding:2px 10px;border-radius:5px;color:${muted};font-size:13px">${m}</span>`).join('') +
    `</div>` +
    `<div style="display:flex;align-items:center;gap:14px;color:${muted}">` +
    MENUBAR_ICONS.wifi +
    MENUBAR_ICONS.battery +
    MENUBAR_ICONS.spotlight +
    MENUBAR_ICONS.controlCenter +
    `<span style="color:${dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'}">${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>` +
    `<span style="font-weight:500;font-variant-numeric:tabular-nums;color:${fg}">${time}</span>` +
    `</div></div>`
  )
}

function dockMarkup(dark: boolean) {
  const bg = dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.4)'
  const border = dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.6)'
  const dot = dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.45)'
  const icons = DOCK_ORDER.map(
    (app) =>
      `<span style="position:relative;display:flex;align-items:flex-end;height:52px">${DOCK_ICONS[app.icon]}${
        app.running
          ? `<span style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:${dot}"></span>`
          : ''
      }</span>`,
  ).join('')
  return (
    `<div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;align-items:flex-end;gap:6px;padding:8px 10px;border-radius:22px;background:${bg};backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border:1px solid ${border};box-shadow:0 10px 36px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.5);font-family:${FONT}">` +
    icons +
    `<span style="width:1px;height:40px;background:rgba(0,0,0,.1);margin:0 4px"></span>` +
    `<span style="display:flex;align-items:flex-end;height:52px">${DOCK_ICONS.trash}</span>` +
    `</div>`
  )
}

export function buildSceneHtml(input: SceneInput) {
  const { width, height, browserId, dark, url, screenshotDataUri, wallpaperDataUri } = input
  const { width: sceneW, height: sceneH, chromeH } = sceneDimensions(input)
  const windowW = width
  const windowH = height + chromeH

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  ${EMBEDDED_FONT_CSS}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${sceneW}px; height: ${sceneH}px; overflow: hidden; background: #111; font-family: ${FONT}; -webkit-font-smoothing: antialiased; }
  img { -webkit-user-select: none; user-select: none; }
</style>
</head>
<body>
  <div style="position:relative;width:${sceneW}px;height:${sceneH}px;overflow:hidden;background:#111">
    <img src="${wallpaperDataUri}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />
    <div style="position:absolute;inset:0;background:radial-gradient(120% 100% at 50% 38%, transparent 58%, rgba(0,0,0,0.26) 100%)"></div>
    <div style="position:absolute;inset:0 0 auto 0;height:112px;background:linear-gradient(180deg, rgba(0,0,0,0.14), rgba(0,0,0,0.04), transparent)"></div>
    <div style="position:absolute;inset:auto 0 0 0;height:128px;background:linear-gradient(0deg, rgba(0,0,0,0.18), rgba(0,0,0,0.04), transparent)"></div>

    ${menubarMarkup(APP_NAMES[browserId], dark)}

    <div style="position:absolute;top:64px;left:50%;transform:translateX(-50%);width:${windowW}px;height:${windowH}px;border-radius:11px;overflow:hidden;background:#fff;box-shadow:0 0 0 .5px rgba(0,0,0,.14), 0 2px 6px rgba(0,0,0,.1), 0 16px 40px rgba(0,0,0,.18), 0 40px 90px rgba(0,0,0,.24)">
      ${windowMarkup(browserId, url, screenshotDataUri, height, dark)}
    </div>

    ${dockMarkup(dark)}
  </div>
</body>
</html>`
}
