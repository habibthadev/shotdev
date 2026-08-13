import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ICONS_DIR = join(process.cwd(), 'public', 'icons')

export const APP_ICON_FILES: Record<string, string> = {
  finder: 'Finder_macOS_Golden_Gate_0AimK8SW1O-a348f851a9.icns',
  launchpad: 'Launchpad_nmS031CMGF_icns-e41f021a93.icns',
  safari: 'Safari_macOS_Golden_Gate_pEXtmNbgY4-400c848b3f.icns',
  messages: 'Messages_macOS_Golden_Gate_ow94O6GAvP-3d83bcc95d.icns',
  mail: 'Mail_macOS_Golden_Gate_3BIjmD3GZM-15bbaa9b3a.icns',
  maps: 'Maps__MacOS_Tahoe__5aA6m3BXxr_icns-2328aa210f.icns',
  photos: 'Photos__MacOS_Tahoe__GnoLTHQNAZ_icns-2491521ee7.icns',
  facetime: 'Facetime_macOS_Golden_Gate_Qxnt8DtlwP-ee45580703.icns',
  calendar: 'Calendar_aB61H9yTMc_icns-178f1438fd.icns',
  contacts: 'Contacts_G7a6oiUq4e_icns-084f0c375c.icns',
  notes: 'Notes__MacOS_Tahoe__Tn8SuaHtAM_icns-c3cbd57f9f.icns',
  reminders: 'Reminders_wlCuq8CQy0_icns-e1f2622d6b.icns',
  news: 'Apple_News_jIAuSazOEO_iOS-56cf1697c9.png',
  tv: 'Apple_TV_Ack0y3WKkY_icns-cfc4ab38c7.icns',
  appstore: 'App_Store__MacOS_Tahoe__ZTpqalXxE3_icns-609bed07b8.icns',
  music: 'Apple_Music_TpGLloa1oC_icns-b72d2a277d.icns',
  chrome: 'Chrome_8wuvanubeH_icns-5d49270287.icns',
  downloads: 'Downloads_Folder_jPcCCWzM4E_icns-a8179a2076.icns',
  bin: 'macOS_Bin_full_n13LwuIChY_icns-fc78a675f9.icns',
  settings: 'Settings_mTHdx8YStT_icns-4b6c51221b.icns',
}

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47]

const PNG_CHUNKS = new Set([
  'ic07', 'ic08', 'ic09', 'ic10', 'ic11', 'ic12', 'ic13', 'ic14', 'icp4', 'icp5', 'icp6',
])

const PREFER_SMALL = ['ic07', 'ic08', 'ic13', 'icp4', 'ic09', 'ic14', 'icp5', 'ic10', 'icp6', 'ic12', 'ic11']
const PREFER_LARGE = ['ic08', 'ic13', 'icp4', 'ic09', 'ic14', 'icp5', 'ic10', 'icp6', 'ic07', 'ic12', 'ic11']

function isPng(buf: Buffer): boolean {
  return buf.length >= 8 && buf.subarray(0, 4).every((b, i) => b === PNG_SIG[i])
}

export function extractIcnsPng(buf: Buffer, large = false): Buffer | null {
  if (buf.length < 8 || buf.toString('ascii', 0, 4) !== 'icns') return null
  const byType: Record<string, Buffer> = {}
  let pos = 8
  while (pos + 8 <= buf.length) {
    const type = buf.toString('ascii', pos, pos + 4)
    const len = buf.readUInt32BE(pos + 4)
    if (len < 8 || pos + len > buf.length) break
    if (PNG_CHUNKS.has(type)) byType[type] = buf.subarray(pos + 8, pos + len)
    pos += len
  }
  for (const t of large ? PREFER_LARGE : PREFER_SMALL) {
    if (byType[t] && isPng(byType[t])) return byType[t]
  }
  return null
}

const cache = new Map<string, Buffer | null>()

export function appIconPng(id: string, large = false): Buffer | null {
  if (cache.has(id)) return cache.get(id) ?? null
  const file = APP_ICON_FILES[id]
  let png: Buffer | null = null
  if (file) {
    const path = join(ICONS_DIR, file)
    if (existsSync(path)) {
      const buf = readFileSync(path)
      png = file.endsWith('.png') && isPng(buf) ? buf : extractIcnsPng(buf, large)
    }
  }
  cache.set(id, png)
  return png
}

export function appIconDataUri(id: string, large = false): string | null {
  const png = appIconPng(id, large)
  return png ? `data:image/png;base64,${png.toString('base64')}` : null
}
