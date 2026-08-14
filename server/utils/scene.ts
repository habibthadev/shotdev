import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { appIconDataUri } from './icons'

export type BrowserChrome = 'safari' | 'chrome' | 'firefox' | 'arc' | 'minimal'

export type WallpaperId = 'sonoma' | 'ventura' | 'tahoe' | 'sequoia' | 'whitesur'

export const WALLPAPER_FILES: Record<WallpaperId, string> = {
  sonoma: 'sonoma',
  ventura: 'ventura',
  tahoe: 'tahoe',
  sequoia: 'sequoia',
  whitesur: 'whitesur',
}

export const WALLPAPER_EXT: Record<WallpaperId, string> = {
  sonoma: 'webp',
  ventura: 'webp',
  tahoe: 'webp',
  sequoia: 'webp',
  whitesur: 'webp',
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
  faviconDataUri?: string | null
  tabTitle?: string
}

export const WINDOW_TOP = 82

export const CHROME_UI: Record<BrowserChrome, number> = {
  chrome: 80,
  safari: 38,
  firefox: 76,
  arc: 38,
  minimal: 36,
}

const marginX = (w: number) => Math.max(24, Math.round(w * 0.0573))
const DOCK_GAP = 23
const DOCK_H = 76
const DOCK_BOTTOM = 8

export function sceneDimensions(input: Pick<SceneInput, 'width' | 'height' | 'browserId'>) {
  const chromeH = CHROME_UI[input.browserId]
  return {
    width: input.width + marginX(input.width) * 2,
    height: WINDOW_TOP + input.height + chromeH + DOCK_GAP + DOCK_H + DOCK_BOTTOM,
    chromeH,
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const hostOf = (s: string) => {
  try {
    return new URL(s).hostname
  } catch {
    return ''
  }
}

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
  swap: `<svg width="11" height="11" viewBox="0 0 12 12" fill="none" style="stroke:#5F6368;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round"><path d="M2.2 4h7M2.2 4 4.4 1.8M2.2 4l2.2 2.2"/><path d="M9.8 8h-7M9.8 8 7.6 5.8M9.8 8 7.6 10.2"/></svg>`,
  star: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.2;stroke-linejoin:round"><path d="m8 2.3 1.7 3.4 3.8.6-2.7 2.7.6 3.8-3.4-1.8-3.4 1.8.6-3.8L2.5 6.3l3.8-.6Z"/></svg>`,
  extensions: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.3"><rect x="4.6" y="4.6" width="6.8" height="6.8" rx="1.6"/><path d="M8 1.5v3.1M8 11.4v3.1M1.5 8h3.1M11.4 8h3.1" style="stroke-linecap:round"/></svg>`,
  menu: `<svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3.2" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="8" cy="12.8" r="1.3"/></svg>`,
  close: `<svg width="9" height="9" viewBox="0 0 9 9" fill="none" style="stroke:currentColor;stroke-width:1.3;stroke-linecap:round"><path d="M2 2l5 5M7 2l-5 5"/></svg>`,
  newTab: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style="stroke:currentColor;stroke-width:1.4;stroke-linecap:round"><path d="M7 2.5v9M2.5 7h9"/></svg>`,
  tabSearch: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.5;stroke-linecap:round"><path d="M8 3.8a3.2 3.2 0 0 1 3.2 3.2M8 1.8a5.2 5.2 0 0 1 5.2 5.2"/><circle cx="8" cy="10.5" r="3.3"/><path d="M10.5 12.6l2.4 2.4"/></svg>`,
  windowControls: `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" style="stroke:currentColor;stroke-width:1.3;stroke-linejoin:round"><path d="M4 4.5h8v7H4z"/><path d="M4 7h8"/></svg>`,
}

const FAVICONS = {
  globe: (dark: boolean) =>
    `<svg width="16" height="16" viewBox="0 0 24 24" style="fill:none;stroke:${dark ? 'rgba(255,255,255,0.9)' : '#111'};stroke-width:1.6;flex-shrink:0"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9S14.6 18.3 12 21c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/></svg>`,
}

const DOCK_APPS = [
  'finder', 'launchpad', 'safari', 'messages', 'mail', 'maps', 'photos', 'facetime',
  'calendar', 'contacts', 'reminders', 'notes', 'tv', 'music', 'news', 'appstore', 'settings', 'chrome',
] as const

const DOCK_RUNNING = new Set(['finder', 'chrome'])

function trafficLights(size = 12, mr = 8) {
  return `<span style="display:inline-flex;gap:8px;margin-right:${mr}px;flex-shrink:0"><span style="width:${size}px;height:${size}px;border-radius:50%;background:#FF5F57;border:1px solid rgba(0,0,0,.1)"></span><span style="width:${size}px;height:${size}px;border-radius:50%;background:#FFBD2E;border:1px solid rgba(0,0,0,.1)"></span><span style="width:${size}px;height:${size}px;border-radius:50%;background:#28CA42;border:1px solid rgba(0,0,0,.1)"></span></span>`
}

function chromeWindowMarkup(
  url: string,
  shot: string,
  vh: number,
  dark: boolean,
  faviconDataUri: string | null,
  tabTitle: string,
) {
  const fg = dark ? 'rgba(255,255,255,0.85)' : '#202124'
  const fgMuted = dark ? 'rgba(255,255,255,0.55)' : '#5F6368'
  const chromeBg = dark ? '#3a3a3a' : '#dee1e6'
  const tabBg = dark ? '#2d2d2d' : '#ffffff'
  const pillBg = dark ? '#1e1e1e' : '#f1f3f4'
  const pillText = dark ? 'rgba(255,255,255,0.8)' : '#3c4043'
  const seam = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
  const avatar = dark ? 'rgba(255,255,255,0.35)' : '#c6c9cf'
  const favicon = faviconDataUri
    ? `<img src="${faviconDataUri}" style="width:16px;height:16px;border-radius:3px;flex-shrink:0" />`
    : FAVICONS.globe(dark)
  const title = esc(tabTitle || hostOf(url))

  const toolBtn = (icon: string, label: string, dim = false) =>
    `<span style="width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;color:${fgMuted};opacity:${dim ? 0.5 : 1};flex-shrink:0" title="${label}">${icon}</span>`

  return (
    `<div style="height:40px;display:flex;align-items:center;gap:2px;padding-left:20px;background:${chromeBg}">` +
    trafficLights(12, 0) +
    `<span style="display:inline-flex;align-items:center;gap:6px;height:32px;padding:8px 12px;margin-left:12px;border-radius:8px 8px 0 0;background:${tabBg};color:${dark ? 'rgba(255,255,255,0.9)' : '#3c4043'};font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${favicon}<span>${title}</span><span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;color:${fgMuted};opacity:.8;margin-left:4px;flex-shrink:0">${CHROME_ICONS.close}</span></span>` +
    `<span style="width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;color:${fgMuted};margin-left:6px;flex-shrink:0">${CHROME_ICONS.newTab}</span>` +
    `</div>` +
    `<div style="height:40px;display:flex;align-items:center;gap:14px;padding:0 16px;background:${chromeBg};border-top:1px solid ${seam}">` +
    toolBtn(CHROME_ICONS.back, 'Back', true) +
    toolBtn(CHROME_ICONS.forward, 'Forward', true) +
    toolBtn(CHROME_ICONS.reload, 'Reload') +
    `<span style="flex:1;display:flex;align-items:center;gap:8px;height:28px;border-radius:14px;background:${pillBg};padding:0 12px;min-width:0">` +
    CHROME_ICONS.swap +
    `<span style="font-size:12.5px;color:${pillText};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(url)}</span>` +
    `</span>` +
    toolBtn(CHROME_ICONS.star, 'Bookmark') +
    `<span style="width:20px;height:20px;border-radius:50%;background:${avatar};flex-shrink:0"></span>` +
    toolBtn(CHROME_ICONS.menu, 'Menu') +
    `</div>` +
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

function windowMarkup(
  browserId: BrowserChrome,
  url: string,
  shot: string,
  vh: number,
  dark: boolean,
  faviconDataUri: string | null,
  tabTitle: string,
) {
  switch (browserId) {
    case 'chrome':
      return chromeWindowMarkup(url, shot, vh, dark, faviconDataUri, tabTitle)
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
  const now = new Date()
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return (
    `<div style="position:absolute;top:0;left:0;right:0;height:37px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:${bg};backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid ${border};color:${fg};font-size:13.5px;font-family:${FONT}">` +
    `<div style="display:flex;align-items:center;gap:6px;min-width:0">` +
    MENUBAR_ICONS.apple +
    `<span style="font-weight:700;padding:2px 8px;border-radius:6px">${appName}</span>` +
    MENUS.map((m) => `<span style="padding:2px 8px;border-radius:6px;color:${muted};font-size:13.5px">${m}</span>`).join('') +
    `</div>` +
    `<div style="display:flex;align-items:center;gap:14px;color:${muted}">` +
    MENUBAR_ICONS.wifi +
    `<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;color:${fg}">100%${MENUBAR_ICONS.battery}</span>` +
    `<span style="font-weight:500;font-variant-numeric:tabular-nums;color:${fg}">${date}&nbsp;&nbsp;${time}</span>` +
    `</div></div>`
  )
}

function dockMarkup(dark: boolean, sceneW: number) {
  const dot = dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.55)'
  const size = Math.min(54, Math.max(38, Math.round(sceneW * 0.0375)))
  const radius = Math.round(size * 0.22)
  const gap = Math.max(8, Math.round(size * 0.19))

  const item = (id: string, running = false) => {
    const uri = appIconDataUri(id) ?? appIconDataUri('finder')
    return (
      `<span style="position:relative;display:flex;align-items:flex-end;height:${size}px">` +
      `<img src="${uri}" style="width:${size}px;height:${size}px;border-radius:${radius}px;box-shadow:0 3px 8px rgba(0,0,0,0.32), 0 1px 2px rgba(0,0,0,0.18)" />` +
      (running
        ? `<span style="position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);width:4.5px;height:4.5px;border-radius:50%;background:${dot}"></span>`
        : '') +
      `</span>`
    )
  }

  return (
    `<div style="position:absolute;bottom:${DOCK_BOTTOM}px;left:50%;transform:translateX(-50%);display:flex;align-items:flex-end;gap:${gap}px">` +
    DOCK_APPS.map((id) => item(id, DOCK_RUNNING.has(id))).join('') +
    `<span style="width:1px;height:${Math.round(size * 0.85)}px;background:${dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.16)'};margin:0 7px"></span>` +
    item('downloads') +
    item('bin') +
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

    <div style="position:absolute;top:${WINDOW_TOP}px;left:50%;transform:translateX(-50%);width:${windowW}px;height:${windowH}px;border-radius:10px;overflow:hidden;background:#fff;box-shadow:0 0 0 .5px rgba(0,0,0,.14), 0 1px 2px rgba(0,0,0,.07), 0 4px 12px rgba(0,0,0,.10), 0 14px 32px rgba(0,0,0,.18), 0 36px 72px rgba(0,0,0,.26)">
      ${windowMarkup(browserId, url, screenshotDataUri, height, dark, input.faviconDataUri ?? null, input.tabTitle ?? '')}
    </div>

    ${dockMarkup(dark, sceneW)}
  </div>
</body>
</html>`
}
