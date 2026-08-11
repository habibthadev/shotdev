import { create } from 'zustand'
import { takeScreenshot } from '@/lib/screenshot'

export type BrowserChrome = 'safari' | 'chrome' | 'firefox' | 'arc' | 'minimal'

export type WallpaperId = 'sonoma' | 'ventura' | 'tahoe' | 'sequoia' | 'whitesur'

export const WALLPAPERS: { id: WallpaperId; name: string }[] = [
  { id: 'sonoma', name: 'Sonoma' },
  { id: 'ventura', name: 'Ventura' },
  { id: 'tahoe', name: 'Tahoe' },
  { id: 'sequoia', name: 'Sequoia' },
  { id: 'whitesur', name: 'WhiteSur' },
]

export function wallpaperSrc(id: WallpaperId, dark: boolean) {
  const file = id === 'sequoia' ? 'sequoai' : id
  const ext = id === 'whitesur' ? 'png' : 'jpg'
  return `/wallpaper/${file}-${dark ? 'dark' : 'light'}.${ext}`
}

export type ScreenshotFormat = 'png' | 'jpeg' | 'webp'

export type ViewportPreset = '1280x800' | '1440x900' | '1920x1080' | '375x812' | 'custom'

export type ScreenshotResult = {
  image: string
  format: string
  width: number
  height: number
  url: string
  capturedAt: string
}

export type ScreenshotSettings = {
  width: number
  height: number
  preset: ViewportPreset
  format: ScreenshotFormat
  fullPage: boolean
  darkMode: boolean
  delay: number
}

export type ScreenshotStore = {
  url: string
  browserId: BrowserChrome
  wallpaperId: WallpaperId
  settings: ScreenshotSettings
  result: ScreenshotResult | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null

  setUrl: (url: string) => void
  setBrowser: (id: BrowserChrome) => void
  setWallpaper: (id: WallpaperId) => void
  updateSettings: (partial: Partial<ScreenshotSettings>) => void
  setResult: (result: ScreenshotResult) => void
  setStatus: (status: ScreenshotStore['status']) => void
  setError: (error: string | null) => void
  reset: () => void
  capture: () => Promise<void>
}

export const useScreenshotStore = create<ScreenshotStore>((set, get) => ({
  url: 'https://github.com',
  browserId: 'safari',
  wallpaperId: 'sonoma',
  settings: {
    width: 1280,
    height: 800,
    preset: '1280x800',
    format: 'png',
    fullPage: false,
    darkMode: false,
    delay: 0,
  },
  result: null,
  status: 'idle',
  error: null,

  setUrl: (url) => set({ url }),
  setBrowser: (browserId) => set({ browserId }),
  setWallpaper: (wallpaperId) => set({ wallpaperId }),
  updateSettings: (partial) => set((state) => ({
    settings: { ...state.settings, ...partial },
  })),
  setResult: (result) => set({ result, status: 'success', error: null }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error, status: 'error' }),
  reset: () => set({
    result: null,
    status: 'idle',
    error: null,
  }),

  capture: async () => {
    const state = get()
    set({ status: 'loading', error: null, result: null })
    try {
      const screenshot = await takeScreenshot({
        url: state.url,
        width: state.settings.width,
        height: state.settings.height,
        format: state.settings.format,
        fullPage: state.settings.fullPage,
        darkMode: state.settings.darkMode,
        delay: state.settings.delay,
        browserId: state.browserId,
        wallpaperId: state.wallpaperId,
      })
      set({ result: screenshot, status: 'success', error: null })
    } catch (err) {
      set({
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed to capture screenshot',
      })
    }
  },
}))
