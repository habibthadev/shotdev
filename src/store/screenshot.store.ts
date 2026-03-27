import { create } from 'zustand'

export type BrowserChrome = 'safari' | 'chrome' | 'firefox' | 'arc' | 'minimal'

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
  settings: ScreenshotSettings
  result: ScreenshotResult | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null

  setUrl: (url: string) => void
  setBrowser: (id: BrowserChrome) => void
  updateSettings: (partial: Partial<ScreenshotSettings>) => void
  setResult: (result: ScreenshotResult) => void
  setStatus: (status: ScreenshotStore['status']) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useScreenshotStore = create<ScreenshotStore>((set) => ({
  url: 'https://github.com',
  browserId: 'safari',
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
}))
